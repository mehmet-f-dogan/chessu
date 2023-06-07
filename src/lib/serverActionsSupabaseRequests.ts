"use server";

import { isUserCourseOwner as isUserCourseOwnerImpl } from "./supabaseRequests";
import { getCourseCompletionStatus as getCourseCompletionStatusImpl } from "./supabaseRequests";
import { getStudyLocator as getStudyLocatorImpl } from "./supabaseRequests";


export async function isUserCourseOwner(
  userId: string,
  courseId: number
) {
  return await isUserCourseOwnerImpl(userId, courseId);
}

export async function getCourseCompletionStatus(
  userId: string,
  courseId: number
) {
  return await getCourseCompletionStatusImpl(
    userId,
    courseId
  );
}

export async function getStudyLocator(
  userId: string,
  courseId: number
) {
  return await getStudyLocatorImpl(
    userId,
    courseId
  );
}

