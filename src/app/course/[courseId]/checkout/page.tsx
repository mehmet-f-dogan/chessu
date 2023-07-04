"use client";

import { getCoursePurchaseUrl } from "@/lib/actions";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PulseLoader } from "react-spinners";

type CourseCheckoutPageProps = {
  courseId: string;
};

export default function CourseCheckoutPage({
  params,
}: {
  params: CourseCheckoutPageProps;
}) {
  const router = useRouter();
  let userId = useAuth().userId!;

  async function redirectToCheckout() {
    const checkoutLink =
      await getCoursePaymentLinkRouteRequestHelper(
        userId,
        params.courseId
      );
    router.replace(checkoutLink);
  }
  
  useEffect(() => {
    redirectToCheckout();
  }, [])

  return (
    <div className="container mx-auto flex flex-grow flex-col items-center justify-center">
      <PulseLoader color="#f59e0b" />
      <h1 className="mt-8">
        Please wait while we are redirecting you to payment
        page.
      </h1>
    </div>
  );
}

async function getCoursePaymentLinkRouteRequestHelper(
  userId: string,
  courseId: string
) {
  const courseCheckoutLinkResponse = await getCoursePurchaseUrl(userId, courseId)
  if (!courseCheckoutLinkResponse) {
    throw new Error("Cannot get checkout link");
  }

  return courseCheckoutLinkResponse
}
