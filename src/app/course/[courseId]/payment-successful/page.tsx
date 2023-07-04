"use client";

import { isCoursePurchased } from "@/lib/actions";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PulseLoader } from "react-spinners";

type CoursePaymentSuccessfulPageProps = {
  courseId: string;
};

export default function CoursePaymentSuccessfulPage({
  params,
}: {
  params: CoursePaymentSuccessfulPageProps;
}) {
  const router = useRouter();
  let userId = useAuth().userId!;

  async function checkOwnership() {
    let isOwner = false;

    while (!isOwner) {
      isOwner = await isOwnerRouteRequestWrapper(
        userId,
        params.courseId
      );
    }
    router.push(`/course/${params.courseId}`);
  }

  useEffect(() => {
    checkOwnership();
  }, [])

  return (
    <div className="container mx-auto flex flex-grow flex-col items-center justify-center">
      <PulseLoader color="#f59e0b" />
      <h1 className="mt-8">
        Please wait while we are processing your purchase.
      </h1>
    </div>
  );
}

async function isOwnerRouteRequestWrapper(
  userId: string,
  courseId: string
) {
  return await isCoursePurchased(userId, courseId)
}