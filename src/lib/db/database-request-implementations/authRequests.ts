import { getSupabaseClient } from "@/lib/db/supabaseClient";

export async function isUserCourseOwner(
  userId: string,
  courseId: number
) {
  const client = await getSupabaseClient({
    cache: false,
  });

  const { data } = await client
    .from("course_purchase")
    .select("*")
    .eq("course_id", courseId)
    .eq("user_id", userId)
    .limit(1)
    .single();

  return !!data;
}
