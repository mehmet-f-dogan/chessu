import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const headersList = headers();

  const stripeSigniture = headersList.get(
    "stripe-signature"
  );
  const requestBody = await request.json();

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      requestBody,
      stripeSigniture!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return new Response(
      `Webhook Error: ${(err as Error).message}`,
      {
        status: 400,
      }
    );
  }

  console.log(event.data);

  switch (event.type) {
    case "checkout.session.completed":
      // Payment is successful and the subscription is created.
      // You should provision the subscription and save the customer ID to your database.
      break;
    case "invoice.paid":
      // Continue to provision the subscription as payments continue to be made.
      // Store the status in your database and check when a user accesses your service.
      // This approach helps you avoid hitting rate limits.
      break;
    case "invoice.payment_failed":
      // The payment failed or the customer does not have a valid payment method.
      // The subscription becomes past_due. Notify your customer and send them to the
      // customer portal to update their payment information.
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return new Response(undefined, {
    status: 200,
  });
}
