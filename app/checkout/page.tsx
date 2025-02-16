'use client'; // Indicates that this file is a client-side component
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import React, { useCallback } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from '@stripe/react-stripe-js';

// Load Stripe with the publishable key from environment variables
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

function CheckoutPage() {
  // Get search parameters from the URL
  const searchParams = useSearchParams();

  // Extract orderId and cartId from search parameters
  const orderId = searchParams.get('orderId');
  const cartId = searchParams.get('cartId');

  // Function to fetch the client secret from the backend
  const fetchClientSecret = useCallback(async () => {
    const response = await axios.post('/api/checkout', { orderId, cartId });
    return response.data.clientSecret;
  }, []);

  // Options for the EmbeddedCheckoutProvider
  const options = { fetchClientSecret };

  return (
    <div id='checkout'>
      {/* Provide the EmbeddedCheckout component with Stripe and options */}
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}

export default CheckoutPage;
