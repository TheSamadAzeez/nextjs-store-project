// Import Stripe library and initialize with secret key
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// Import necessary modules from Next.js and database utility
import { type NextRequest } from 'next/server';
import db from '@/utils/db';

// Define POST request handler
export const POST = async (req: NextRequest) => {
  // Extract request headers and origin
  const requestHeaders = new Headers(req.headers);
  const origin = requestHeaders.get('origin');

  // Parse orderId and cartId from request body
  const { orderId, cartId } = await req.json();

  // Fetch order and cart details from the database
  const order = await db.order.findUnique({
    where: {
      id: orderId,
    },
  });
  
  const cart = await db.cart.findUnique({
    where: {
      id: cartId,
    },
    include: {
      cartItems: {
        include: {
          product: true,
        },
      },
    },
  });

  // If order or cart is not found, return 404 response
  if (!order || !cart) {
    return Response.json(null, {
      status: 404,
      statusText: 'Not Found',
    });
  }

  // Map cart items to Stripe line items format
  const line_items = cart.cartItems.map((cartItem) => {
    return {
      quantity: cartItem.amount,
      price_data: {
        currency: 'usd',
        product_data: {
          name: cartItem.product.name,
          images: [cartItem.product.image],
        },
        unit_amount: cartItem.product.price * 100, // price in cents
      },
    };
  });

  try {
    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      metadata: { orderId, cartId },
      line_items: line_items,
      mode: 'payment',
      return_url: `${origin}/api/confirm?session_id={CHECKOUT_SESSION_ID}`,
    });

    // Return the client secret of the session
    return Response.json({ clientSecret: session.client_secret });
  } catch (error) {
    // Log error and return 500 response
    console.log(error);

    return Response.json(null, {
      status: 500,
      statusText: 'Internal Server Error',
    });
  }
};
