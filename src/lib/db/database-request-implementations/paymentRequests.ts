import { getSupabaseClient } from "@/lib/db/supabaseClient";

export async function coursePurchased(
  userId: string,
  courseId: number
) {
  const userClient = await getSupabaseClient({
    cache: false,
  });
  const { error } = await userClient
    .from("course_purchase")
    .insert({ course_id: courseId, user_id: userId });

  return !error;
}
