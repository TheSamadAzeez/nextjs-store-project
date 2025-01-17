'use server';

// Database utility functions for product-related operations
import prisma from '@/utils/db';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { imageSchema, productSchema, validateWithZodSchema } from './schemas';
import { actionFunction } from './types';

// helper functions
const getAuthUser = async () => {
  const users = await currentUser();
  if (!users) {
    redirect('/');
  }
  return users;
};

const renderError = (error: unknown): { message: string } => {
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
export const createProductAction: actionFunction = async (
  prevState,
  formData
): Promise<{ message: string }> => {
  const user = await getAuthUser();

  try {
    const rawData = Object.fromEntries(formData);
    const file = formData.get('image') as File;
    const validatedFields = validateWithZodSchema(productSchema, rawData);
    const validateFile = validateWithZodSchema(imageSchema, { image: file });

    await prisma.product.create({
      data: {
        ...validatedFields,
        image: '/images/hero2.jpg',
        clerkId: user.id,
      },
    });

    return { message: 'Product created successfully' };
  } catch (error) {
    return renderError(error);
  }
};
