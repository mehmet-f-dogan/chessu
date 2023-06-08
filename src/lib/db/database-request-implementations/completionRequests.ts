import { getSupabaseClient } from "@/lib/db/supabaseClient";


async function getUserCompletionsData(userId: string) {
  const userClient = await getSupabaseClient({
    cache: false,
  });
  const { data: userCompletionsData } = await userClient
    .from("completion")
    .select("mapping_ids")
    .eq("user_id", userId)
    .limit(1)
    .single();

  return userCompletionsData;
}

async function getUserCourseOrChapterCompletionData({
  userId,
  courseId,
  chapterId,
}: {
  userId: string;
  courseId?: number;
  chapterId?: number;
}) {
  if ((courseId == null) == (chapterId == null)) {
    throw new Error(
      "Course ID or Chapter ID must be defined (Only one)"
    );
  }
  const client = await getSupabaseClient({
    cache: true,
  });
  const userCompletionsDataPromise =
    getUserCompletionsData(userId);

  let mappingIdDataPromise = null;

  if (courseId)
    mappingIdDataPromise = client
      .from("course_chapter_content_mapping")
      .select("id")
      .eq("course_id", courseId);
  else
    mappingIdDataPromise = client
      .from("course_chapter_content_mapping")
      .select("id")
      .eq("chapter_id", chapterId);

  const [userCompletionsData, { data: mappingIdData }] =
    await Promise.all([
      userCompletionsDataPromise,
      mappingIdDataPromise,
    ]);

  if (!userCompletionsData || !mappingIdData) return 0;

  const mappingIdDataFlat = mappingIdData.map(
    (value) => value.id
  );

  const totalNumberOfResources = mappingIdDataFlat.length;
  const completedNumberOfResources =
    userCompletionsData.mapping_ids.filter(
      (mapping_id: number) =>
        mappingIdDataFlat.includes(mapping_id)
    ).length;

  if (totalNumberOfResources == 0) return 0;

  return (
    completedNumberOfResources / totalNumberOfResources
  );
}

export async function getCourseCompletionAmount(
  userId: string,
  courseId: number
) {
  return await getUserCourseOrChapterCompletionData({
    userId,
    courseId,
  })
}


export async function getChapterCompletionAmount(
  userId: string,
  chapterId: number
) {
  return await getUserCourseOrChapterCompletionData({
    userId,
    chapterId,
  })
}

export async function getContentCompletionStatus(
  userId: string,
  contentId: number
) {
  const client = await getSupabaseClient({
    cache: true,
  });

  const userCompletionsDataPromise =
    getUserCompletionsData(userId);

  const mappingIdDataPromise = client
    .from("course_chapter_content_mapping")
    .select("id")
    .eq("content_id", contentId)
    .limit(1)
    .single();

  const [userCompletionsData, { data: mappingIdData }] =
    await Promise.all([
      userCompletionsDataPromise,
      mappingIdDataPromise,
    ]);

  if (!userCompletionsData || !mappingIdData)
    return false;

  return userCompletionsData.mapping_ids.includes(
    mappingIdData.id
  );
}

export async function setContentCompletionStatus(
  userId: string,
  contentId: number,
  completionStatus: boolean
) {
  const userCompletionsDataPromise = getSupabaseClient({
    cache: false,
  }).then((client) => {
    return client
      .from("completions")
      .select("*")
      .eq("user_id", userId)
      .limit(1)
      .single();
  });

  const mappingIdDataPromise = getSupabaseClient({
    cache: true,
  }).then((client) => {
    return client
      .from("course_chapter_content_mapping")
      .select("id")
      .eq("content_id", contentId)
      .limit(1)
      .single();
  });

  let [
    { data: userCompletionsData },
    { data: mappingIdData },
  ] = await Promise.all([
    userCompletionsDataPromise,
    mappingIdDataPromise,
  ]);

  if (!mappingIdData) return;
  userCompletionsData ??= {
    mapping_ids: [],
    user_id: userId,
  };

  userCompletionsData.mapping_ids = completionStatus
    ? [...userCompletionsData.mapping_ids, mappingIdData.id]
    : userCompletionsData.mapping_ids.filter(
      (id: any) => id != mappingIdData!.id
    );

  return await getSupabaseClient({
    cache: false,
  }).then(async (client) => {
    const { error } = await client
      .from("completions")
      .insert(userCompletionsData);

    return !error;
  });
}

export async function getStudyLocator(
  userId: string,
  courseId: number
) {
  const client = await getSupabaseClient({
    cache: false,
  });

  let { data: userCompletionsData } = await client
    .from("completion")
    .select("mapping_ids")
    .eq("user_id", userId)
    .limit(1)
    .single();

  if (!userCompletionsData)
    userCompletionsData = {
      mapping_ids: [],
    };

  const { data: notCompletedContentMappingIdData } =
    await client
      .from("course_chapter_content_mapping")
      .select("*")
      .not(
        "id",
        "in",
        `(${userCompletionsData.mapping_ids.join(",")})`
      )
      .order("id", {
        ascending: true,
      })
      .eq("course_id", courseId)
      .limit(1)
      .single();

  if (!notCompletedContentMappingIdData) {
    const { data: firstContentOfCourse } = await client
      .from("course_chapter_content_mapping")
      .select("*")
      .order("id", {
        ascending: true,
      })
      .eq("course_id", courseId)
      .limit(1)
      .single();

    if (!firstContentOfCourse)
      return `/courses/${courseId}`;
    return `/courses/${courseId}/chapters/${firstContentOfCourse.chapter_id}/contents/${firstContentOfCourse.content_id}`;
  }

  return `/courses/${courseId}/chapters/${notCompletedContentMappingIdData.chapter_id}/contents/${notCompletedContentMappingIdData.content_id}`;
}
