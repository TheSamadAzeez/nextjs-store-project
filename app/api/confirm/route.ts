import Stripe from "stripe";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";
import db from "@/utils/db";

// Initialize stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// Define GET request handler
export const GET = async (req: NextRequest) => {
  // Extract session_id from request URL
  const { searchParams } = new URL(req.url);
  const session_id = searchParams.get("session_id") as string;

  try {
    // Retrieve session details from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);
    // console.log(session);

    // Extract orderId and cartId from session metadata
    const orderId = session.metadata?.orderId;
    const cartId = session.metadata?.cartId;

    // If payment is complete, update order and delete cart
    if (session.status === "complete") {
      await db.order.update({
        where: {
          id: orderId,
        },
        data: {
          isPaid: true,
        },
      });
      await db.cart.delete({
        where: {
          id: cartId,
        },
      });
    }
  } catch (err) {
    // Log error and return 500 response
    console.log(err);
    return Response.json(null, {
      status: 500,
      statusText: "Internal Server Error",
    });
  }

  // Redirect to orders page
  redirect("/orders");
};
