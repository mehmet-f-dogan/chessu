import { getSupabaseClient } from "@/lib/supabaseClient";

export async function getCourse(courseId: number) {
    const client = await getSupabaseClient();

    let { data, error } = await client
        .from("course")
        .select("*")
        .eq("id", courseId)
        .limit(1)

        .single();

    if (!data || error)
        throw new Error(`Course with ID:${courseId} cannot be found.`);

    return data;
}

export async function getChapter(chapterId: number) {
    const client = await getSupabaseClient();

    let { data, error } = await client
        .from("chapter")
        .select("*")
        .eq("id", chapterId)
        .limit(1)

        .single();

    if (!data || error)
        throw new Error(`Chapter with ID: ${chapterId} cannot be found.`);

    return data;
}

export async function getContent(contentId: number) {
    const client = await getSupabaseClient();

    let { data, error } = await client
        .from("content")
        .select("*")
        .eq("id", contentId)
        .limit(1)

        .single();

    if (!data || error)
        throw new Error(`Content with ID: ${contentId} cannot be found.`);

    return data;
}

export async function getAllCourses() {
  const client = await getSupabaseClient();
  const { data } = await client.from("course").select("*");
  return data ?? [];
}
