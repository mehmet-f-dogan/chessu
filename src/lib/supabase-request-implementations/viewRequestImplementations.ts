import { getSupabaseClient } from "@/lib/supabaseClient";

export async function getNextChapterIds(chapterId: number, courseId: number) {
  const client = await getSupabaseClient();

  let { data } = await client
    .from("course_chapter_content_mapping")
    .select("*")
    .eq("course_id", courseId)
    .gt("chapter_id", chapterId)
    .order("chapter_id", {
      ascending: true,
    })
    .limit(1)
    .single();

  return data;
}

export async function getPreviousChapterIds(
  chapterId: number,
  courseId: number
) {
  const client = await getSupabaseClient();

  let { data } = await client
    .from("course_chapter_content_mapping")
    .select("*")
    .eq("course_id", courseId)
    .lt("chapter_id", chapterId)
    .order("chapter_id", {
      ascending: false,
    })
    .limit(1)
    .single();

  return data;
}

export async function getNextContentIds(contentId: number, courseId: number) {
  const client = await getSupabaseClient();

  let { data } = await client
    .from("course_chapter_content_mapping")
    .select("*")
    .eq("course_id", courseId)
    .gt("content_id", contentId)
    .order("content_id", {
      ascending: true,
    })
    .limit(1)
    .single();

  return data;
}

export async function getPreviousContentIds(
  contentId: number,
  courseId: number
) {
  const client = await getSupabaseClient();

  let { data } = await client
    .from("course_chapter_content_mapping")
    .select("*")
    .eq("course_id", courseId)
    .lt("content_id", contentId)
    .order("content_id", {
      ascending: false,
    })
    .limit(1)
    .single();

  return data;
}

export async function getCourseStructure(courseId: number) {
  const client = await getSupabaseClient();

  const { data } = await client
    .from("course_chapter_content_mapping")
    .select("chapter_id,content_id")
    .eq("course_id", courseId);

  if (!data) return [];

  const overviewArrayIds = data.reduce((entries, e) => {
    const foundIndex = entries.findIndex(
      (entry) => entry.chapter_id === e.chapter_id
    );
    if (foundIndex > -1) {
      entries[foundIndex].content_ids.push(e.content_id);
    } else {
      entries.push({
        chapter_id: e.chapter_id,
        content_ids: [e.content_id],
      });
    }
    return entries;
  }, [] as { chapter_id: number; content_ids: number[] }[]);

  const overviewArray = await Promise.all(
    overviewArrayIds.map(async (contentAndChapterIds) => {
      const { data: chapter_title } = await client
        .from("chapter")
        .select("title")
        .eq("id", contentAndChapterIds.chapter_id)
        .limit(1)
        .single();

      if (!chapter_title) throw new Error("No chapter found.");

      const { data: content_ids_and_titles } = await client
        .from("content")
        .select("id, title")
        .in("id", contentAndChapterIds.content_ids)
        .order("id", { ascending: true });

      if (!content_ids_and_titles) throw new Error("No content found.");

      return {
        chapter_id: contentAndChapterIds.chapter_id,
        chapter_title: chapter_title.title,
        contents: content_ids_and_titles,
      };
    })
  ).catch(() => []);

  return overviewArray
    .filter((item) => !!item)
    .sort((a, b) => a.chapter_id - b.chapter_id);
}
