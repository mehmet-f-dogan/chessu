import { getSupabaseClient } from "@/lib/supabaseClient";

export async function getUsersCoursesIds(userId: string) {
  if (!userId) return [];

  const client = await getSupabaseClient();

  let { data } = await client
    .from("course_purchase")
    .select("course_id")
    .eq("user_id", userId);

  return data?.flatMap((x) => x.course_id) ?? [];
}

export async function getOwnedCourses(userId: string) {
  const registeredCourseIds = await getUsersCoursesIds(userId);

  const client = await getSupabaseClient();

  let { data } = await client
    .from("course")
    .select("*")
    .in("id", registeredCourseIds);

  return data ?? [];
}
