import { getSupabaseClient } from "@/lib/supabaseClient";

export async function coursePurchased(
  userId: string,
  courseId: number
) {
  const userClient = await getSupabaseClient({
    authorize: false,
    cache: false,
  });
  const { data, error } = await userClient
    .from("course_purchase")
    .insert({ course_id: courseId, user_id: userId });
}
