'use server';

import prisma from '@/utils/db';
import { redirect } from 'next/navigation';
import {
  imageSchema,
  productSchema,
  reviewSchema,
  validateWithZodSchema,
} from './schemas';
import { deleteImage, uploadImage } from './supabase';
import {
  getAdminUser,
  renderError,
  getAuthUser,
  fetchProduct,
  fetchOrCreateCart,
} from './helper-functions';
import { revalidatePath } from 'next/cache';
import { auth } from '@clerk/nextjs/server';
import { error } from 'console';

/** FETCH FEATURED PRODUCTS */
export const fetchFeaturedProducts = async () => {
  const products = await prisma.product.findMany({
    where: {
      featured: true,
    },
  });
  return products;
};

/** FETCH ALL PRODUCTS */
// Searches and retrieves products based on name or company and performs a case-insensitive matching
export const fetchAllProducts = async ({ search = '' }: { search: string }) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            company: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

/** GET SINGLE PRODUCT */
export const fetchSingleProduct = async (productId: string) => {
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });
  if (!product) {
    redirect('/products');
  }
  return product;
};

/** CREATE PRODUCT */
export const createProductAction = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string }> => {
  const user = await getAuthUser();

  try {
    // Extract and validate form data
    const rawData = Object.fromEntries(formData);
    const file = formData.get('image') as File; // get the image file from the form data
    const validatedFields = validateWithZodSchema(productSchema, rawData);
    const validatedFile = validateWithZodSchema(imageSchema, { image: file }); // validate the image file

    // Upload image and create product
    const fullPath = await uploadImage(validatedFile.image);
    await prisma.product.create({
      data: {
        ...validatedFields,
        image: fullPath,
        clerkId: user.id,
      },
    });
  } catch (error) {
    return renderError(error);
  }

  // Redirect to products page
  redirect('/admin/products');
};

/** FETCH ADMIN PRODUCTS */
export const fetchAdminProducts = async () => {
  await getAdminUser();
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
  return products;
};

/** DELETE PRODUCT */
export const deleteProductAction = async (prevState: { productId: string }) => {
  const { productId } = prevState;
  await getAdminUser();

  try {
    const product = await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    await deleteImage(product.image);

    revalidatePath('/admin/products');

    return { message: 'Product removed' };
  } catch (error) {
    return renderError(error);
  }
};

/** GET ADMIN PRODUCT DETAILS */
export const fetchAdminProductDetails = async (productId: string) => {
  await getAdminUser();
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });
  // Redirect to products page if product is not found
  if (!product) {
    return redirect('/admin/products');
  }
  return product;
};

/** UPDATE PRODUCT */
export const updateProductAction = async (
  prevState: any,
  formData: FormData
) => {
  await getAdminUser(); // Ensure user is an admin
  try {
    const productId = formData.get('id') as string;
    const rawData = Object.fromEntries(formData);

    const validatedFields = validateWithZodSchema(productSchema, rawData);

    await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        ...validatedFields,
      },
    });
    revalidatePath(`/admin/products/${productId}/edit`);
    return { message: 'Product updated successfully' };
  } catch (error) {
    return renderError(error);
  }
};

/** UPDATE PRODUCT IMAGE*/
export const updateProductImageAction = async (
  prevState: any,
  formData: FormData
) => {
  await getAdminUser();
  try {
    const image = formData.get('image') as File;
    const productId = formData.get('id') as string;
    const oldImageUrl = formData.get('url') as string;

    const validatedFile = validateWithZodSchema(imageSchema, { image });
    const fullPath = await uploadImage(validatedFile.image);
    await deleteImage(oldImageUrl);

    await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        image: fullPath,
      },
    });

    revalidatePath(`/admin/products/${productId}/edit`);
    return { message: 'Image updated successfully' };
  } catch (error) {
    return renderError(error);
  }
};

/** FETCH FAVORITE PRODUCT ID*/
// Fetches the favorite id of a product if it exists
export const fetchFavoriteId = async ({ productId }: { productId: string }) => {
  const user = await getAuthUser();
  const favorite = await prisma.favorite.findFirst({
    where: {
      productId,
      clerkId: user.id,
    },
    select: {
      id: true,
    },
  });

  return favorite?.id || null;
};

/** TOGGLE FAVORITE ACTION */
export const toggleFavoriteAction = async (prevState: {
  productId: string;
  favoriteId: string | null;
  pathname: string;
}) => {
  const user = await getAuthUser();
  const { productId, favoriteId, pathname } = prevState;
  try {
    if (favoriteId) {
      await prisma.favorite.delete({
        where: {
          id: favoriteId,
        },
      });
    } else {
      await prisma.favorite.create({
        data: {
          productId,
          clerkId: user.id,
        },
      });
    }
    revalidatePath(pathname);
    return {
      message: favoriteId ? 'Removed from Favorites' : 'Added to Favorites',
    };
  } catch (error) {
    return renderError(error);
  }
};

/** FETCH USER FAVORITES */
export const fetchUserFavorites = async () => {
  const user = await getAuthUser();

  const favorites = await prisma.favorite.findMany({
    where: {
      clerkId: user.id,
    },
    include: {
      product: true,
    },
  });

  return favorites;
};

/** CREATE PRODUCT REVIEW ACTION */
export const createReviewAction = async (
  prevState: any,
  formData: FormData
) => {
  const user = await getAuthUser();
  try {
    const rawData = Object.fromEntries(formData);

    const validatedFields = validateWithZodSchema(reviewSchema, rawData);

    await prisma.review.create({
      data: {
        ...validatedFields,
        clerkId: user.id,
      },
    });
    revalidatePath(`/products/${validatedFields.productId}`);
    return { message: 'Review submitted successfully' };
  } catch (error) {
    return renderError(error);
  }
};

/** FETCH PRODUCT REVIEWS */
export const fetchProductReviews = async (productId: string) => {
  const reviews = await prisma.review.findMany({
    where: {
      productId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return reviews;
};

/** FETCH PRODUCT RATING */
// Fetches the average rating and count of reviews for a specific product
export const fetchProductRating = async (productId: string) => {
  const result = await prisma.review.groupBy({
    by: ['productId'], // Group by productId
    _avg: {
      rating: true, // Calculate the average rating
    },
    _count: {
      rating: true, // Count the number of ratings
    },
    where: {
      productId, // Filter by the given productId
    },
  });

  return {
    rating: result[0]?._avg.rating?.toFixed(1) ?? 0, // Return the average rating
    count: result[0]?._count.rating ?? 0, // Return the count of ratings
  };
};

/** FETCH PRODUCT REVIEWS BY USER */
export const fetchProductReviewsByUser = async () => {
  const user = await getAuthUser();

  const reviews = await prisma.review.findMany({
    where: {
      clerkId: user.id,
    },
    select: {
      id: true,
      rating: true,
      comment: true,
      product: {
        select: {
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return reviews;
};

/** DELETE REVIEW */
export const deleteReviewAction = async (prevState: { reviewId: string }) => {
  const { reviewId } = prevState;

  const user = await getAuthUser();
  try {
    await prisma.review.delete({
      where: {
        id: reviewId,
        clerkId: user.id,
      },
    });
    revalidatePath('/reviews');
    return { message: 'review deleted successfully' };
  } catch (error) {
    return renderError(error);
  }
};

/** FIND EXISTING REVIEW */
export const findExistingReview = async (userId: string, productId: string) => {
  return prisma.review.findFirst({
    where: {
      clerkId: userId,
      productId,
    },
  });
};

/** FETCH CART ITEMS */
export const fetchCartItems = async () => {
  const { userId } = await auth();

  const cart = await prisma.cart.findFirst({
    where: {
      clerkId: userId ?? '',
    },
    select: {
      numItemsInCart: true,
    },
  });
  return cart?.numItemsInCart || 0;
};

const updateOrCreateCartItem = async () => {};

export const updateCart = async () => {};

/** ADD TO CART ACTION */
export const addToCartAction = async (prevState: any, formData: FormData) => {
  const user = await getAuthUser();
  try {
    const productId = formData.get('productId') as string;
    const amount = Number(formData.get('amount'));
    await fetchProduct(productId);
    const cart = fetchOrCreateCart({ userId: user.id });
  } catch (error) {
    renderError(error);
  }
  redirect('/cart');
};

/** REMOVE CART ITEM ACTION */
export const removeCartItemAction = async () => {};

/** UPDATE CART ITEM ACTION */
export const updateCartItemAction = async () => {};
