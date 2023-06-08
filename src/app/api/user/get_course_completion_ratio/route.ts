import { getCourseCompletionAmount } from "@/lib/db/supabaseRequests";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const requestBody = await request.json();
  const userId = requestBody.userId;
  const courseId = requestBody.courseId;
  const courseCompletionRatio =
    await getCourseCompletionAmount(userId, courseId);
  return NextResponse.json({ courseCompletionRatio });
}
