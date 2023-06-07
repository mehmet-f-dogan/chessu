import { isUserCourseOwner } from "@/lib/supabaseRequests";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const requestBody = await request.json();
  const userId = requestBody.userId;
  const courseId = requestBody.courseId;
  const isOwner = await isUserCourseOwner(userId, courseId);
  return NextResponse.json({ isOwner });
}
