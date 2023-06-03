import { getSupabaseClient } from "@/lib/supabaseClient";

export async function getCourseCompletionStatus(
  userId: string,
  courseId: number
) {
  const client = await getSupabaseClient();

  const { data: userCompletionsData } = await client
    .from("completions")
    .select("mapping_ids")
    .eq("user_id", userId)
    .limit(1)
    .single();

  if (!userCompletionsData) return false;

  const { data: contentMappingIdData } = await client
    .from("course_chapter_content_mapping")
    .select("id")
    .eq("course_id", courseId);

  if (!contentMappingIdData) return false;

  const contentMappingIdDataFlat = contentMappingIdData.map(
    (value) => value.id
  );

  return (
    userCompletionsData.mapping_ids.filter((mapping_id) =>
      contentMappingIdDataFlat.includes(mapping_id)
    ).length == contentMappingIdDataFlat.length &&
    contentMappingIdDataFlat.length != 0
  );
}

export async function getChapterCompletionStatus(
  userId: string,
  chapterId: number
) {
  const client = await getSupabaseClient();

  const { data: userCompletionsData } = await client
    .from("completions")
    .select("mapping_ids")
    .eq("user_id", userId)
    .limit(1)
    .single();

  if (!userCompletionsData) return false;

  const { data: contentMappingIdData } = await client
    .from("course_chapter_content_mapping")
    .select("id")
    .eq("chapter_id", chapterId);

  if (!contentMappingIdData) return false;

  const contentMappingIdDataFlat = contentMappingIdData.map(
    (value) => value.id
  );

  return (
    userCompletionsData.mapping_ids.filter((mapping_id) =>
      contentMappingIdDataFlat.includes(mapping_id)
    ).length == contentMappingIdDataFlat.length &&
    contentMappingIdDataFlat.length != 0
  );
}

export async function getContentCompletionStatus(
  userId: string,
  contentId: number
) {
  const client = await getSupabaseClient();

  const { data: userCompletionsData } = await client
    .from("completions")
    .select("mapping_ids")
    .eq("user_id", userId)
    .limit(1)
    .single();

  if (!userCompletionsData) return false;

  const { data: contentMappingIdData } = await client
    .from("course_chapter_content_mapping")
    .select("id")
    .eq("content_id", contentId)
    .limit(1)
    .single();

  if (!contentMappingIdData) return false;

  return userCompletionsData.mapping_ids.includes(contentMappingIdData.id);
}

export async function setContentCompletionStatus(
  userId: string,
  contentId: number,
  completionStatus: boolean
) {
  const client = await getSupabaseClient();

  let { data: userCompletionsData } = await client
    .from("completions")
    .select("*")
    .eq("user_id", userId)
    .limit(1)
    .single();

  userCompletionsData ??= { mapping_ids: [], user_id: userId };

  const { data: contentMappingIdData } = await client
    .from("course_chapter_content_mapping")
    .select("id")
    .eq("content_id", contentId)
    .limit(1)
    .single();

  if (!contentMappingIdData) return;

  userCompletionsData.mapping_ids = completionStatus
    ? [...userCompletionsData.mapping_ids, contentMappingIdData.id]
    : userCompletionsData.mapping_ids.filter(
        (id) => id != contentMappingIdData.id
      );

  await client.from("completions").insert(userCompletionsData);
}

export async function getStudyLocator(userId: string, courseId: number) {
  const client = await getSupabaseClient();

  let { data: userCompletionsData } = await client
    .from("completions")
    .select("mapping_ids")
    .eq("user_id", userId)
    .limit(1)
    .single();

  if (!userCompletionsData) userCompletionsData = { mapping_ids: [] };

  const { data: contentMappingIdData } = await client
    .from("course_chapter_content_mapping")
    .select("*")
    .not("id", "in", `(${userCompletionsData.mapping_ids.join(",")})`)
    .order("content_id", { ascending: true })
    .eq("course_id", courseId)
    .limit(1)
    .single();

  if (!contentMappingIdData) return `/courses/${courseId}`;

  return `/courses/${courseId}/chapters/${contentMappingIdData.chapter_id}/contents/${contentMappingIdData.content_id}`;
}
