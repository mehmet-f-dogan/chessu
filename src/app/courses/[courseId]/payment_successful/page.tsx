"use client";

import { isUserCourseOwner } from "@/lib/serverActionsSupabaseRequests";
import { auth, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
  const [isOwner, setIsOwner] = useState(false);

  const timeout = setTimeout(checkOwnership, 500);

  async function checkOwnership() {
    let isOwner = false;

    while (!isOwner) {
      const response = await fetch(`/api/user/is_owner`, {
        method: "POST",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, courseId }), // body data type must match "Content-Type" header
      });

      const responseBody = await response.json();
      isOwner = responseBody.isOwner;
    }
    router.push(`/courses/${courseId}`);
  }

  //redirect("/");

  return (
    <div className="container mx-auto flex flex-grow flex-col items-center justify-center">
      <h1>
        Please wait while we are processing your payment.
      </h1>
    </div>
  );
}
