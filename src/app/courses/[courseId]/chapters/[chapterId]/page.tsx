import { checkableLabel } from "@/app/components/checkableLabel";
import {
  getChapterCompletionStatus,
  getContentCompletionStatus,
  getCourse,
  getCourseStructure,
  getNextChapterIds,
  getPreviousChapterIds,
} from "@/lib/supabaseRequests";
import { auth } from "@clerk/nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

type ChapterPageParams = {
  courseId: string;
  chapterId: string;
};

export default async function ChapterPage({
  params,
}: {
  params: ChapterPageParams;
}) {
  const courseId = parseInt(params.courseId);
  const chapterId = parseInt(params.chapterId);

  const course = await getCourse(courseId);
  if (!course) redirect("/");
  const overviewArray = await getCourseStructure(courseId);
  const currentChapter = overviewArray?.find(
    (item) => item.chapter_id == chapterId
  );
  if (!currentChapter) redirect("/");

  const userId = auth().userId!;

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
            {await checkableLabel(
              currentChapter.chapter_title,
              "text-xl text-amber-500",
              "text-xl text-lime-500",
              "text-2xl",
              getChapterCompletionStatus(userId, currentChapter.chapter_id)
            )}
            <div className="self-center mt-2 sm:mt-0 sm:items-center">
              <Suspense>
                {getPreviousChapterIds(chapterId, courseId).then((ids) => {
                  if (!ids) return <></>;
                  return (
                    <Link
                      href={`/courses/${courseId}/chapters/${ids.chapter_id}`}
                      className="bg-amber-500 transition duration-300 ease-in-out text-black hover:bg-black hover:text-amber-500 p-2"
                    >
                      Previous
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
                      Next
                    </Link>
                  );
                })}
              </Suspense>
            </div>
          </div>

          {currentChapter.contents.map(async (content) => {
            return (
              <Link
                key={content.id}
                href={`/courses/${courseId}/chapters/${currentChapter.chapter_id}/contents/${content.id}`}
                className=" bg-zinc-950 p-2 w-full"
              >
                {await checkableLabel(
                  content.title,
                  "hover:underline",
                  "text-lime-500 hover:underline",
                  "text-xl",
                  getContentCompletionStatus(userId, content.id)
                )}
              </Link>
            );
          })}
        </>
      }
    </div>
  );
}
