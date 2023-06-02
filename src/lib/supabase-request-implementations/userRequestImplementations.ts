import { getSupabaseClient } from "@/lib/supabaseClient";
import { getCourse } from "../supabaseRequests";

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
  return await Promise.all(
    registeredCourseIds.map(async (id) => await getCourse(id))
  );
}




