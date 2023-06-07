import { headers } from "next/headers";
import { Stripe } from "stripe";
import { Buffer } from "buffer";
import { coursePurchased } from "@/lib/supabaseRequests";

function getStripe() {
  return new Stripe(process.env.STRIPE_API_SECRET_KEY!, {
    apiVersion: "2022-11-15",
  });
}

export async function POST(request: Request) {
  const headersList = headers();
  const stripeSigniture = headersList.get(
    "stripe-signature"
  );
  let event;
  const stripe = getStripe();
  const requestAsArrayBuffer = await request.arrayBuffer();
  try {
    event = stripe.webhooks.constructEvent(
      Buffer.from(requestAsArrayBuffer),
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

  const data = event.data.object as any;
  const metadata = data.metadata as any;
  const userId = data.client_reference_id;

  switch (event.type) {
    case "checkout.session.completed":
      switch (metadata.type) {
        case "course":
          await coursePurchased(
            userId,
            parseInt(metadata.course_id)
          );
          break;

        default:
          break;
      }
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

  return new Response("Process successful", {
    status: 200,
  });
}
