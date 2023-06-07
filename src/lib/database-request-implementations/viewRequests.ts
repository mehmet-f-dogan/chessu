import { getSupabaseClient as getSupabaseClientConstructor } from "@/lib/supabaseClient";

type getNavigationIdParams = {
  level: "chapter" | "content";
  direction: "next" | "previous";
  levelId: number;
  courseId: number;
};

function getSupabaseClient() {
  return getSupabaseClientConstructor({
    authorize: false,
    cache: true,
  });
}

async function getNavigationId({
  level,
  direction,
  levelId,
  courseId,
}: getNavigationIdParams) {
  const client = await getSupabaseClient();

  let requestFilterIdName: "chapter_id" | "content_id" =
    level === "chapter" ? "chapter_id" : "content_id";

  let request = null;

  request = client
    .from("course_chapter_content_mapping")
    .select("*")
    .eq("course_id", courseId);

  if (direction === "next")
    request = request.gt(requestFilterIdName, levelId);

  if (direction === "previous")
    request = request.lt(requestFilterIdName, levelId);

  request = request
    .order(requestFilterIdName, {
      ascending: direction === "next",
    })
    .limit(1)
    .single();

  return (await request).data;
}

export async function getNextChapterIds(
  chapterId: number,
  courseId: number
) {
  return await getNavigationId({
    level: "chapter",
    direction: "next",
    courseId,
    levelId: chapterId,
  });
}

export async function getPreviousChapterIds(
  chapterId: number,
  courseId: number
) {
  return getNavigationId({
    level: "chapter",
    direction: "previous",
    courseId,
    levelId: chapterId,
  });
}

export async function getNextContentIds(
  contentId: number,
  courseId: number
) {
  return getNavigationId({
    level: "content",
    direction: "next",
    courseId,
    levelId: contentId,
  });
}

export async function getPreviousContentIds(
  contentId: number,
  courseId: number
) {
  return getNavigationId({
    level: "content",
    direction: "previous",
    courseId,
    levelId: contentId,
  });
}

export async function getCourseStructure(courseId: number) {
  const client = await getSupabaseClient();

  const { data: courseIdsToChapterIdsMappings } =
    await client
      .from("course_chapter_content_mapping")
      .select("chapter_id,content_id")
      .eq("course_id", courseId);

  if (!courseIdsToChapterIdsMappings) return [];

  const courseStructureInIds =
    courseIdsToChapterIdsMappings.reduce(
      (entries, mapping) => {
        const foundEntry = entries.find(
          (entry) => entry.chapter_id === mapping.chapter_id
        );
        if (foundEntry) {
          foundEntry.content_ids.push(mapping.content_id);
        } else {
          entries.push({
            chapter_id: mapping.chapter_id,
            content_ids: [mapping.content_id],
          });
        }
        return entries;
      },
      [] as {
        chapter_id: number;
        content_ids: number[];
      }[]
    );

  const courseStructureInIdsAndTitles = await Promise.all(
    courseStructureInIds.map(
      async (chapterIdAndContentIds) => {
        const chapterTitlePromise =
          getSupabaseClient().then(async (client) => {
            const value = await client
              .from("chapter")
              .select("title")
              .eq("id", chapterIdAndContentIds.chapter_id)
              .limit(1)
              .single();
            return value.data?.title;
          });

        const contentIdsAndTitlesPromise =
          getSupabaseClient().then(async (client) => {
            const value = await client
              .from("content")
              .select("id,title")
              .in("id", chapterIdAndContentIds.content_ids)
              .order("id", {
                ascending: true,
              });
            return value.data;
          });

        const [chapterTitle, contentIdsAndTitles] =
          await Promise.all([
            chapterTitlePromise,
            contentIdsAndTitlesPromise,
          ]);

        if (!chapterTitle || !contentIdsAndTitles)
          return null;

        return {
          chapter_id: chapterIdAndContentIds.chapter_id,
          chapter_title: chapterTitle,
          contents: contentIdsAndTitles,
        };
      }
    )
  );

  return courseStructureInIdsAndTitles.flatMap((f) =>
    f ? [f] : []
  );
}
