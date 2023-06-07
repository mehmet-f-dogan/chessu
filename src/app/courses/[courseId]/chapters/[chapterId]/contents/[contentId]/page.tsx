import {
  getChapter,
  getContent,
  getContentCompletionStatus,
  getCourse,
  getNextContentIds,
  getPreviousContentIds,
} from "@/lib/supabaseRequests";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "@clerk/nextjs";
import { CheckableLabel } from "@/app/components/checkableLabel";
import VideoContentContainer from "./components/videoContentContainer";
import {
  ContentData,
  VideoContentData,
} from "@/lib/content.types";
type ContentPageProps = {
  courseId: string;
  chapterId: string;
  contentId: string;
};

function getContentContainer(
  contentType: string,
  contentData: ContentData
) {
  switch (contentType) {
    case "video":
      contentData = contentData as VideoContentData;
      return (
        <VideoContentContainer
          videoUrl={contentData.videoUrl}
        />
      );
    default:
      return <></>;
  }
}

export default async function ContentPage({
  params,
}: {
  params: ContentPageProps;
}) {
  const courseId = parseInt(params.courseId);
  const chapterId = parseInt(params.chapterId);
  const contentId = parseInt(params.contentId);

  const coursePromise = getCourse(courseId);
  const chapterPromise = getChapter(chapterId);
  const contentPromise = getContent(contentId);

  const [course, chapter, content] = await Promise.all([
    coursePromise,
    chapterPromise,
    contentPromise,
  ]);

  const userId = auth().userId!;

  if (!course || !chapter || !content) redirect("/");

  return (
    <div className="container mx-auto mt-0 flex max-w-prose flex-col justify-center space-y-4 bg-zinc-900 p-8">
      <Link
        href={`/courses/${courseId}`}
        className="bg-zinc-950 p-2 text-2xl hover:underline"
      >
        {course.title}
      </Link>
      <Link
        href={`/courses/${courseId}/chapters/${chapterId}`}
        className="bg-zinc-950 p-2 text-xl hover:underline"
      >
        {chapter.title}
      </Link>
      <div className="flex items-start justify-between">
        <CheckableLabel
          labelText={content.title}
          checkedLabelClassNames="text-lime-500"
          resolvingPromise={getContentCompletionStatus(
            userId,
            content.id
          )}
          checkSize="text-xl"
        />
        <div className="">
          <Suspense>
            {getPreviousContentIds(
              contentId,
              courseId
            ).then((ids) => {
              if (!ids) return <></>;
              return (
                <Link
                  href={`/courses/${courseId}/chapters/${ids.chapter_id}/contents/${ids.content_id}`}
                  className="bg-amber-500 p-2 text-black transition duration-300 ease-in-out hover:bg-black hover:text-white"
                >
                  Previous
                </Link>
              );
            })}
          </Suspense>
          <Suspense>
            {getNextContentIds(contentId, courseId).then(
              (ids) => {
                if (!ids) return <></>;
                return (
                  <Link
                    href={`/courses/${courseId}/chapters/${ids.chapter_id}/contents/${ids.content_id}`}
                    className="ml-2 bg-amber-500 p-2 text-black transition duration-300 ease-in-out hover:bg-black hover:text-white"
                  >
                    Next
                  </Link>
                );
              }
            )}
          </Suspense>
        </div>
      </div>

      {getContentContainer(
        content.type,
        content.data as ContentData
      )}
    </div>
  );
}
