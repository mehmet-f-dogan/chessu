"use server";

import { Stripe } from "stripe";

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

export async function getCourseCheckoutLink(
  userId: string,
  courseId: number
) {
  const stripe = getStripe();

  const price = (await getCoursePriceData(courseId)).id;

  //const isOwner = await isUserCourseOwner(userId, courseId)

  //if(isOwner) return null

  const session = await stripe.checkout.sessions.create({
    success_url: `${process.env
      .NEXT_PUBLIC_URL!}/courses/${courseId}/payment_successful`,
    line_items: [{ price, quantity: 1 }],
    mode: "payment",
    client_reference_id: userId,
    metadata: {
      course_id: courseId,
      type: "course",
    },
  });
  return session.url;
}
