import { getSupabaseClient } from "@/lib/supabaseClient";

export async function isUserCourseOwner(userId: string, courseId: number) {
  const client = await getSupabaseClient();

  const { data } = await client
    .from("course_purchase")
    .select("*")
    .eq("course_id", courseId)
    .eq("user_id", userId)
    .limit(1)
    .single();

  return !!data;
}

export async function isUserCourseOwnerMiddleware(
  userId: string,
  courseId: number,
  token: Promise<string | null>
) {
  const tokenResolved = await token;
  if (!token) return false;
  const client = await getSupabaseClient(tokenResolved);

  const { data } = await client
    .from("course_purchase")
    .select("*")
    .eq("course_id", courseId)
    .eq("user_id", userId)
    .limit(1)
    .single();

  return !!data;
}

export async function courseChapterContentMappingExists(
  courseId: string,
  chapterId: string,
  contentId: string
) {
  const client = await getSupabaseClient();

  const { data, error } = await client
    .from("course_chapter_content_mapping")
    .select("*")
    .eq("course_id", courseId)
    .eq("chapter_id", chapterId)
    .eq("content_id", contentId)
    .limit(1)

    .single();

  if (error) return false;

  return !!data;
}