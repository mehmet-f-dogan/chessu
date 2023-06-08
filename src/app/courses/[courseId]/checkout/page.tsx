"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

type CoursePageProps = {
  courseId: string;
};

export default function CoursePage({
  params,
}: {
  params: CoursePageProps;
}) {
  const courseId = parseInt(params.courseId);
  const userId = useAuth().userId!;
  const router = useRouter();

  async function redirectToCheckout() {
    const checkoutLink =
      await getCourseCheckoutLinkRouteRequestWrapper(
        userId,
        courseId
      );
    router.push(checkoutLink);
  }

  redirectToCheckout();

  return (
    <div className="container mx-auto flex flex-grow flex-col items-center justify-center">
      <h1>
        Please wait while we are redirecting you to payment
        page.
      </h1>
    </div>
  );
}

async function getCourseCheckoutLinkRouteRequestWrapper(
  userId: string,
  courseId: number
) {
  const courseCheckoutLinkResponse = await fetch(
    `${process.env
      .NEXT_PUBLIC_URL!}/api/stripe/get_course_checkout_link`,
    {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, courseId }),
    }
  );
  const courseCheckoutLinkResponseBody =
    await courseCheckoutLinkResponse.json();

  return courseCheckoutLinkResponseBody.checkoutLink as string;
}
