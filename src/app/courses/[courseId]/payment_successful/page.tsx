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

  async function checkOwnership() {
    let isOwner = false;

    while (!isOwner) {
      isOwner = await isOwnerRouteRequestWrapper(
        userId,
        courseId
      );
    }
    router.push(`/courses/${courseId}`);
  }

  checkOwnership();

  return (
    <div className="container mx-auto flex flex-grow flex-col items-center justify-center">
      <h1>
        Please wait while we are processing your purchase.
      </h1>
    </div>
  );
}

async function isOwnerRouteRequestWrapper(
  userId: string,
  courseId: number
) {
  const isOwnerResponse = await fetch(
    `${process.env.NEXT_PUBLIC_URL!}/api/user/is_owner`,
    {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, courseId }),
    }
  );
  const isOwnerResponseBody = await isOwnerResponse.json();

  return isOwnerResponseBody.isOwner as boolean;
}
