import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import prisma from './db';
import { Cart } from '@prisma/client';

// Retrieves the current user
/**
 * Retrieves the current authenticated user.
 *
 * This function uses the Clerk library to get the current user. If no user is authenticated,
 * it redirects to the home page.
 *
 */
export const getAuthUser = async () => {
  const user = await currentUser();
  if (!user) {
    redirect('/');
  }
  return user;
};

// Retrieves the current user and checks if they are an admin
/**
 * Retrieves the current authenticated user and checks if they are an admin.
 *
 * This function first retrieves the current user using `getAuthUser`. It then checks if the user's
 * ID matches the admin user ID specified in the environment variables. If the user is not an admin,
 * it redirects to the home page.
 *
 */
export const getAdminUser = async () => {
  const user = await getAuthUser();
  if (user.id !== process.env.ADMIN_USER_ID) {
    return redirect('/');
  }
  return user;
};

// Renders error messages
/**
 * Renders error messages.
 *
 * This function takes an error object and returns a standardized error message.
 * If the error is null, it logs 'Error is null' and returns a generic error message.
 * If the error is an instance of Error, it returns the error's message. Otherwise,
 * it returns a generic error message.
 *
 * @param {unknown} error - The error object to render.
 */
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

/**
 * Fetches a product by its ID from the database.
 *
 * This function queries the database for a product with the specified ID.
 * If the product is found, it is returned. If the product is not found,
 * an error is thrown.
 *
 * @param {string} productId - The ID of the product to fetch.
 * @throws {Error} - If the product is not found, an error is thrown with the message 'Product not found'.
 */
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

// Include clause to fetch products in the cart
const includeProductClause = {
  cartItems: {
    include: {
      product: true,
    },
  },
};

/**
 * Fetches the cart for the given user. If the cart does not exist, it creates a new one.
 *
 * @param {Object} params - The parameters for fetching or creating the cart.
 * @param {string} params.userId - The ID of the user.
 * @param {boolean} [params.errorOnFailure=false] - Whether to throw an error if the cart is not found.
 * @throws {Error} - If the cart is not found and errorOnFailure is true.
 */
export const fetchOrCreateCart = async ({
  userId,
  errorOnFailure = false,
}: {
  userId: string;
  errorOnFailure?: boolean;
}) => {
  // Fetch the cart, including the products in the cart if it exists for the user
  let cart = await prisma.cart.findFirst({
    where: {
      clerkId: userId,
    },
    include: includeProductClause,
  });
  // Throw an error if cart is not found and errorOnFailure is true
  if (!cart && errorOnFailure) {
    throw new Error('Cart not found');
  }
  // Create a new cart if one does not exist
  if (!cart) {
    cart = await prisma.cart.create({
      data: { clerkId: userId }, // Set default shipping value
      include: includeProductClause,
    });
  }
  return cart;
};

/**
 * Updates an existing cart item with the given amount or creates a new cart item if it does not exist.
 *
 * @param {Object} params - The parameters for updating or creating the cart item.
 * @param {string} params.productId - The ID of the product.
 * @param {string} params.cartId - The ID of the cart.
 * @param {number} params.amount - The amount to update or create the cart item with.
 */
export const updateOrCreateCartItem = async ({
  productId,
  cartId,
  amount,
}: {
  productId: string;
  cartId: string;
  amount: number;
}) => {
  let cartItem = await prisma.cartItem.findFirst({
    where: {
      productId,
      cartId,
    },
  });
  // update cart item (amount) if it exists
  if (cartItem) {
    cartItem = await prisma.cartItem.update({
      where: {
        id: cartItem.id,
      },
      data: {
        amount: cartItem.amount + amount,
      },
    });
  } else {
    // create cart item if it does not exist
    cartItem = await prisma.cartItem.create({
      data: {
        productId,
        cartId,
        amount,
      },
    });
  }
};

/**
 * Updates the cart with the latest information including the number of items,
 * total cost, tax, shipping, and order total.
 *
 * @param {Cart} cart - The cart object to be updated.
 */
export const updateCart = async (cart: Cart) => {
  // Fetch the cart items for the cart
  const cartItems = await prisma.cartItem.findMany({
    where: {
      cartId: cart.id,
    },
    include: {
      product: true, // Include the related product
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  let numItemsInCart = 0;
  let cartTotal = 0;

  // Calculate the total number of items in the cart and the total cost of the items
  for (const item of cartItems) {
    numItemsInCart += item.amount;
    cartTotal += item.amount * item.product.price;
  }
  const tax = cart.taxRate * cartTotal;
  const shipping = cartTotal ? cart.shipping : 0;
  const orderTotal = cartTotal + tax + shipping; // Calculate the total cost of the order

  // console.log(
  //   `Cart Total: ${cartTotal}, Tax: ${tax}, Shipping: ${shipping}, Order Total: ${orderTotal}`
  // );

  // Update the cart with the latest information
  const currentCart = await prisma.cart.update({
    where: {
      id: cart.id,
    },

    data: {
      numItemsInCart,
      cartTotal,
      tax,
      shipping, // Include the shipping field
      orderTotal,
    },
    include: includeProductClause,
  });
  return { currentCart, cartItems };
};
