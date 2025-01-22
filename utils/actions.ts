'use server';

import prisma from '@/utils/db';
import { redirect } from 'next/navigation';
import { imageSchema, productSchema, validateWithZodSchema } from './schemas';
import { deleteImage, uploadImage } from './supabase';
import { getAdminUser, renderError, getAuthUser } from './helper-functions';
import { revalidatePath } from 'next/cache';

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
