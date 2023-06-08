import "server-only";

import { Stripe } from "stripe";
import {
  getStripeUserId,
  setStripeUserId,
} from "./db/supabaseRequests";

function getStripe() {
  return new Stripe(process.env.STRIPE_API_SECRET_KEY!, {
    apiVersion: "2022-11-15",
  });
}

async function getCoursePriceData(courseId: number) {
  const stripe = getStripe();
  const product = await stripe.products.search({
    query: `metadata["course_id"]:"${courseId}"`,
  });
  const courseAsStripeProduct = product.data[0];

  const priceId = courseAsStripeProduct.default_price!;

  return await stripe.prices.retrieve(priceId.toString());
}

export async function getCourseBasePrice(courseId: number) {
  const priceData = await getCoursePriceData(
    courseId
  ).catch((e) => {
    console.log(e);
    throw e;
  });
  //con
  return priceData.unit_amount!;
}

async function getCheckoutLink(
  success_url: string,
  priceId: string,
  userId: string,
  mode: "payment" | "subscription",
  metadata: any
) {
  const stripe = getStripe();
  let stripeUserId = await getStripeUserId(userId);
  if (!stripeUserId) {
    const customer = await stripe.customers.create({
      metadata: {
        user_id: userId,
      },
    });
    await setStripeUserId(userId, customer.id);
    stripeUserId = customer.id;
  }

  const session = await stripe.checkout.sessions.create({
    line_items: [{ price: priceId, quantity: 1 }],
    client_reference_id: userId,
    success_url,
    mode,
    metadata,
    customer: stripeUserId,
  });
  return session.url;
}

export async function getCourseCheckoutLink(
  userId: string,
  courseId: number
) {
  const price = (await getCoursePriceData(courseId)).id;

  //const isOwner = await isUserCourseOwner(userId, courseId)

  //if(isOwner) return null

  return await getCheckoutLink(
    `${process.env
      .NEXT_PUBLIC_URL!}/courses/${courseId}/payment_successful`,
    price,
    userId,
    "payment",
    {
      course_id: courseId,
      type: "course",
    }
  );
}

export async function getMembershipCheckoutLink(
  userId: string,
  courseId: number
) {
  const price = (await getCoursePriceData(courseId)).id;

  //const isOwner = await isUserCourseOwner(userId, courseId)

  //if(isOwner) return null

  return await getCheckoutLink(
    `${process.env
      .NEXT_PUBLIC_URL!}/membership/payment_successful`,
    price,
    userId,
    "subscription",
    {
      type: "membership",
    }
  );
}
