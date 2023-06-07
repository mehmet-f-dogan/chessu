"use client";

import { getCourseCompletionStatus, getStudyLocator } from "@/lib/serverActionsSupabaseRequests";
import Link from "next/link";
import { Suspense } from "react";

type StudyButtonParams = {
  courseId: number;
  userId: string;
};
function StudyButtonWrapper({
  courseId,
  userId,
}: StudyButtonParams) {

  const progressionPromise = getCourseCompletionStatus(
    userId,
    courseId
  );
  const studyLocation = getStudyLocator(userId, courseId)
  return (
    <Suspense>
      {progressionPromise.then(async (completion) => {
        const location = await studyLocation;
        return completion == 0 ? (
          <Link href={location} className="bg-amber-500 p-2 text-black transition duration-300 ease-in-out hover:bg-black hover:text-white">
            Study
          </Link>
        ) : (
          <Link href={location} className="bg-amber-500 p-2 text-black transition duration-300 ease-in-out hover:bg-black hover:text-white">
            Continue Studying
          </Link>
        );
        
      })}
    </Suspense>
  );
}

export const StudyButton = StudyButtonWrapper;
