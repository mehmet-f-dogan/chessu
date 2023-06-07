import { getSupabaseClient } from "@/lib/supabaseClient";

import { wrapFunctionWithSelectiveCache } from "./util";

function getSupabaseUserClient() {
  return getSupabaseClient({
    authorize: true,
    cache: false,
  });
}

function getSupabaseServiceClient() {
  return getSupabaseClient({
    authorize: false,
    cache: true,
  });
}

async function getUserCompletionsData(userId: string) {
  const userClient = await getSupabaseUserClient();
  const { data: userCompletionsData } = await userClient
    .from("completions")
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
  const serviceClient = await getSupabaseServiceClient();
  const userCompletionsDataPromise =
    getUserCompletionsData(userId);

  let mappingIdDataPromise = null;

  if (courseId)
    mappingIdDataPromise = serviceClient
      .from("course_chapter_content_mapping")
      .select("id")
      .eq("course_id", courseId);
  else
    mappingIdDataPromise = serviceClient
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
    userCompletionsData.mapping_ids.filter((mapping_id) =>
      mappingIdDataFlat.includes(mapping_id)
    ).length;

  if (totalNumberOfResources == 0) return 0;

  return (
    completedNumberOfResources / totalNumberOfResources
  );
}

const getCourseCompletionStatusFunction =
  wrapFunctionWithSelectiveCache(
    1,
    async ({
      userId,
      courseId,
    }: {
      userId: string;
      courseId: number;
    }) =>
      getUserCourseOrChapterCompletionData({
        userId,
        courseId,
      })
  );

export async function getCourseCompletionStatus(
  userId: string,
  courseId: number
) {
  return await getCourseCompletionStatusFunction({
    userId,
    courseId,
  });
}

const getChapterCompletionStatusFunction =
  wrapFunctionWithSelectiveCache(
    1,
    async ({
      userId,
      chapterId,
    }: {
      userId: string;
      chapterId: number;
    }) =>
      getUserCourseOrChapterCompletionData({
        userId,
        chapterId,
      })
  );

export async function getChapterCompletionStatus(
  userId: string,
  chapterId: number
) {
  return await getChapterCompletionStatusFunction({
    userId,
    chapterId,
  });
}

const getContentCompletionStatusFunction =
  wrapFunctionWithSelectiveCache(
    true,
    async ({
      userId,
      contentId,
    }: {
      userId: string;
      contentId: number;
    }) => {
      const client = await getSupabaseServiceClient();

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
  );

export async function getContentCompletionStatus(
  userId: string,
  contentId: number
) {
  return await getContentCompletionStatusFunction({
    userId,
    contentId,
  });
}

export async function setContentCompletionStatus(
  userId: string,
  contentId: number,
  completionStatus: boolean
) {
  const userClient = await getSupabaseUserClient();
  const serviceClient = await getSupabaseServiceClient();

  const userCompletionsDataPromise = userClient
    .from("completions")
    .select("*")
    .eq("user_id", userId)
    .limit(1)
    .single();

  const mappingIdDataPromise = serviceClient
    .from("course_chapter_content_mapping")
    .select("id")
    .eq("content_id", contentId)
    .limit(1)
    .single();

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
        (id) => id != mappingIdData!.id
      );

  await userClient
    .from("completions")
    .insert(userCompletionsData);
}

export async function getStudyLocator(
  userId: string,
  courseId: number
) {
  const userClient = await getSupabaseUserClient();
  const serviceClient = await getSupabaseServiceClient();

  let { data: userCompletionsData } = await userClient
    .from("completions")
    .select("mapping_ids")
    .eq("user_id", userId)
    .limit(1)
    .single();

  if (!userCompletionsData)
    userCompletionsData = {
      mapping_ids: [],
    };

  const { data: notCompletedContentMappingIdData } =
    await serviceClient
      .from("course_chapter_content_mapping")
      .select("*")
      .not(
        "id",
        "in",
        `(${userCompletionsData.mapping_ids.join(",")})`
      )
      .order("content_id", {
        ascending: true,
      })
      .eq("course_id", courseId)
      .limit(1)
      .single();

  if (!notCompletedContentMappingIdData) {
    const { data: firstContentOfCourse } =
      await serviceClient
        .from("course_chapter_content_mapping")
        .select("*")
        .order("content_id", {
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
