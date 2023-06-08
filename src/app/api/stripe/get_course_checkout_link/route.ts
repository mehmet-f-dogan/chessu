import { getCourseCheckoutLink } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const requestBody = await request.json();
  const userId = requestBody.userId;
  const courseId = requestBody.courseId;
  const checkoutLink = await getCourseCheckoutLink(
    userId,
    courseId
  );
  return NextResponse.json({ checkoutLink });
}
