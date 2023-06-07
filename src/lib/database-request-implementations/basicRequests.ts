import { getSupabaseClient as getSupabaseClientConstructor } from "@/lib/supabaseClient";

function getSupabaseClient() {
  return getSupabaseClientConstructor({
    cache: true,
    authorize: false,
  });
}

export async function getCourse(courseId: number) {
  const client = await getSupabaseClient();

  let { data } = await client
    .from("course")
    .select("*")
    .eq("id", courseId)
    .limit(1)
    .single();

  return data;
}

export async function getChapter(chapterId: number) {
  const client = await getSupabaseClient();

  let { data } = await client
    .from("chapter")
    .select("*")
    .eq("id", chapterId)
    .limit(1)
    .single();

  return data;
}

export async function getContent(contentId: number) {
  const client = await getSupabaseClient();

  let { data } = await client
    .from("content")
    .select("*")
    .eq("id", contentId)
    .limit(1)
    .single();

  return data;
}

export async function getAllCourses() {
  const client = await getSupabaseClient();
  const { data } = await client.from("course").select("*");
  return data ?? [];
}
