'use server';

import prisma from '@/utils/db';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { imageSchema, productSchema, validateWithZodSchema } from './schemas';
import { uploadImage } from './supabase';

// helper functions
const getAuthUser = async () => {
  const users = await currentUser();
  if (!users) {
    redirect('/');
  }
  return users;
};

const renderError = (error: unknown): { message: string } => {
  if (error === null) {
    console.log('Error is null');
    return { message: 'An error occurred' };
  }
  console.log(error);
  return {
    message: error instanceof Error ? error.message : 'An error occurred',
  };
};

// Retrieves products marked as featured from the database
export const fetchFeaturedProducts = async () => {
  const products = await prisma.product.findMany({
    where: {
      featured: true,
    },
  });
  return products;
};

// Searches and retrieves products based on name or company
// Accepts a search parameter and performs case-insensitive matching
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

// Retrieves a single product based on its unique ID
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

// createProductAction function
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
