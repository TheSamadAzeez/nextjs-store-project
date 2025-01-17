import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

// Retrieves the current user
export const getAuthUser = async () => {
  const users = await currentUser();
  if (!users) {
    redirect('/');
  }
  return users;
};

// Retrieves the current user and checks if they are an admin
export const getAdminUser = async () => {
  const user = await getAuthUser();
  if (user.id !== process.env.ADMIN_ID) {
    redirect('/');
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
