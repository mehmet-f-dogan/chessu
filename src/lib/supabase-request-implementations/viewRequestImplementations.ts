import { getSupabaseClient } from "@/lib/supabaseClient";

export async function getNextChapterIds(chapterId: number, courseId: number) {
  const client = await getSupabaseClient();

  let { data, error } = await client
    .from("course_chapter_content_mapping")
    .select("*")
    .gt("chapter_id", chapterId)
    .eq("course_id", courseId)
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

  let { data, error } = await client
    .from("course_chapter_content_mapping")
    .select("*")
    .lt("chapter_id", chapterId)
    .eq("course_id", courseId)
    .order("chapter_id", {
      ascending: false,
    })
    .limit(1)
    .single();

  return data;
}

export async function getNextContentIds(
  contentId: number,
  chapterId: number,
  courseId: number
) {
  const client = await getSupabaseClient();

  let { data, error } = await client
    .from("course_chapter_content_mapping")
    .select("*")
    .gt("content_id", contentId)
    .eq("course_id", courseId)
    .order("content_id", {
      ascending: true,
    })
    .limit(1)
    .single();

  return data;
}

export async function getPreviousContentIds(
  contentId: number,
  chapterId: number,
  courseId: number
) {
  const client = await getSupabaseClient();

  let { data, error } = await client
    .from("course_chapter_content_mapping")
    .select("*")
    .lt("content_id", contentId)
    .eq("course_id", courseId)
    .order("content_id", {
      ascending: false,
    })
    .limit(1)
    .single();

  return data;
}

export async function getCourseChapterContentOverview(courseId: number) {
  const client = await getSupabaseClient();

  const { data, error } = await client
    .from("course_chapter_content_mapping")
    .select("chapter_id,content_id")
    .eq("course_id", courseId);

  if (error || !data || data.length == 0) return null;

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
  }, <{ chapter_id: number; content_ids: number[] }[]>[]);

  let overviewArray = await Promise.all(
    overviewArrayIds.map(async (contentAndChapterIds) => {
      const { data: chapter_title, error: chapter_title_error } = await client
        .from("chapter")
        .select("title")
        .eq("id", contentAndChapterIds.chapter_id)
        .limit(1)
        .single();

      if (!chapter_title || chapter_title_error) throw new Error();

      const { data: content_ids_and_titles, error: content_titles_error } =
        await client
          .from("content")
          .select("id, title")
          .in("id", contentAndChapterIds.content_ids)
          .order("id", {
            ascending: true,
          });

      if (!content_ids_and_titles || content_titles_error) throw new Error();

      return {
        chapter_id: contentAndChapterIds.chapter_id,
        chapter_title: chapter_title.title,
        contents: content_ids_and_titles,
      };
    })
  );

  return overviewArray
    .filter((item) => item)
    .sort((a, b) => a.chapter_id - b.chapter_id);
}
