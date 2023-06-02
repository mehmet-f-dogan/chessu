import {
  getCourse,
  getCourseChapterContentOverview,
  getNextChapterIds,
  getPreviousChapterIds,
} from "@/lib/supabaseRequests";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

type ChapterPage = {
  courseId: string;
  chapterId: string;
};

export default async function ChapterPage({ params }: { params: ChapterPage }) {
  const courseId = parseInt(params.courseId);
  const chapterId = parseInt(params.chapterId);

  const course = await getCourse(courseId);
  if (!course) redirect("/home");
  const overviewArray = await getCourseChapterContentOverview(courseId);
  const currentChapter = overviewArray?.find(
    (item) => item.chapter_id == chapterId
  );
  if (!currentChapter) redirect("/home");

  return (
    <div className="container p-8 max-w-prose my-8 mx-auto space-y-4 flex flex-col bg-zinc-900 justify-center">
      <Link
        href={`/courses/${courseId}`}
        className="text-2xl hover:underline bg-zinc-950 p-2"
      >
        {course.title}
      </Link>
      {
        <>
          <div className="flex flex-col flex-1 sm:flex-row sm:justify-between sm:items-center">
            <h2 className="text-amber-500 text-xl">
              {currentChapter.chapter_title}
            </h2>
            <div className="self-center mt-2 sm:mt-0 sm:items-center">
              <Suspense>
                {getPreviousChapterIds(chapterId, courseId).then((ids) => {
                  if (!ids) return <></>;
                  return (
                    <Link
                      href={`/courses/${courseId}/chapters/${ids.chapter_id}`}
                      className="bg-amber-500 transition duration-300 ease-in-out text-black hover:bg-black hover:text-amber-500 p-2"
                    >
                      Previous Chapter
                    </Link>
                  );
                })}
              </Suspense>
              <Suspense>
                {getNextChapterIds(chapterId, courseId).then((ids) => {
                  if (!ids) return <></>;
                  return (
                    <Link
                      href={`/courses/${courseId}/chapters/${ids.chapter_id}`}
                      className="bg-amber-500 transition duration-300 ease-in-out text-black hover:bg-black hover:text-amber-500 ml-2 p-2"
                    >
                      Next Chapter
                    </Link>
                  );
                })}
              </Suspense>
            </div>
          </div>

          {currentChapter.contents.map((content) => {
            return (
              <Link
                key={content.id}
                href={`/courses/${courseId}/chapters/${currentChapter.chapter_id}/contents/${content.id}`}
                className=" bg-zinc-950 p-2 w-full sm:text-base text-xl hover:underline"
              >
                {content.title}
              </Link>
            );
          })}
        </>
      }
    </div>
  );
}
