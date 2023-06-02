import {
  getChapter,
  getContent,
  getCourse,
  getNextContentIds,
  getPreviousContentIds,
} from "@/lib/supabaseRequests";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

type ContentPageProps = {
  courseId: string;
  chapterId: string;
  contentId: string;
};

export default async function ContentPage({
  params,
}: {
  params: ContentPageProps;
}) {
  const courseId = parseInt(params.courseId);
  const chapterId = parseInt(params.chapterId);
  const contentId = parseInt(params.contentId);

  const course = await getCourse(courseId);
  const chapter = await getChapter(chapterId);
  const content = await getContent(contentId);

  if (!course || !chapter || !content) redirect("/");

  return (
    <div className="container p-8 max-w-prose my-8 mx-auto space-y-4 flex flex-col bg-zinc-900 justify-center">
      <Link
        href={`/courses/${courseId}`}
        className="text-2xl hover:underline bg-zinc-950 p-2"
      >
        {course.title}
      </Link>
      <Link
        href={`/courses/${courseId}/chapters/${chapterId}`}
        className="text-xl hover:underline bg-zinc-950 p-2"
      >
        {chapter.title}
      </Link>
      {
        //<h3 className="text-amber-500">{content.title}</h3>
      }

      <div className="flex flex-col flex-1 sm:flex-row sm:justify-between sm:items-center">
        <h2 className="text-amber-500 text-xl">{content.title}</h2>
        <div className="self-center mt-2 sm:mt-0 sm:items-center">
          <Suspense>
            {getPreviousContentIds(contentId, courseId).then((ids) => {
              if (!ids) return <></>;
              return (
                <Link
                  href={`/courses/${courseId}/chapters/${ids.chapter_id}/contents/${ids.content_id}`}
                  className="bg-amber-500 transition duration-300 ease-in-out text-black hover:bg-black hover:text-amber-500 p-2"
                >
                  Previous
                </Link>
              );
            })}
          </Suspense>
          <Suspense>
            {getNextContentIds(contentId, courseId).then((ids) => {
              if (!ids) return <></>;
              return (
                <Link
                  href={`/courses/${courseId}/chapters/${ids.chapter_id}/contents/${ids.content_id}`}
                  className="bg-amber-500 transition duration-300 ease-in-out text-black hover:bg-black hover:text-amber-500 ml-2 p-2"
                >
                  Next
                </Link>
              );
            })}
          </Suspense>
        </div>
      </div>

      <p>{JSON.stringify(content.data)}</p>
    </div>
  );
}
