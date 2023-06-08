import { getStudyLocator } from "@/lib/db/supabaseRequests";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const requestBody = await request.json();
  const userId = requestBody.userId;
  const courseId = requestBody.courseId;
  const studyLocation = await getStudyLocator(
    userId,
    courseId
  );
  return NextResponse.json({ studyLocation });
}
