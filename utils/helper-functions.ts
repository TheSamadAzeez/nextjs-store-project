import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import prisma from './db';

// Retrieves the current user
export const getAuthUser = async () => {
  const user = await currentUser();
  if (!user) {
    redirect('/');
  }
  return user;
};

// Retrieves the current user and checks if they are an admin
export const getAdminUser = async () => {
  const user = await getAuthUser();
  if (user.id !== process.env.ADMIN_USER_ID) {
    return redirect('/');
  }
  return user;
};

// Renders error messages
export const renderError = (error: unknown): { message: string } => {
  if (error === null) {
    console.log('Error is null');
    return { message: 'An error occurred' };
  }
  console.log(error);
  return {
    message: error instanceof Error ? error.message : 'An error occurred',
  };
};

// Fetches a product by ID
export const fetchProduct = async (productId: string) => {
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });
  if (!product) {
    throw new Error('Product not found');
  }
  return product;
};
