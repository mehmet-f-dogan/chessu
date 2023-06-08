import { getCourseBasePrice } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const requestBody = await request.json();
  const courseId = requestBody.courseId;
  const price = await getCourseBasePrice(courseId);
  return NextResponse.json({ price });
}
