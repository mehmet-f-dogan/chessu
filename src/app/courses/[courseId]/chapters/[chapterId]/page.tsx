import { CheckableLabel } from "@/app/components/checkableLabel";
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

  const coursePromise = getCourse(courseId);
  const overviewArrayPromise = getCourseStructure(courseId);
  const [course, overviewArray] = await Promise.all([
    coursePromise,
    overviewArrayPromise,
  ]);

  if (!course) redirect("/");

  const currentChapter = overviewArray?.find(
    (item) => item.chapter_id == chapterId
  );
  if (!currentChapter) redirect("/");

  const userId = auth().userId!;

  return (
    <div className="container mx-auto mt-0 flex max-w-prose flex-col justify-center space-y-4 bg-zinc-900 p-8">
      <Link
        href={`/courses/${courseId}`}
        className="bg-zinc-950 p-2 text-2xl hover:underline"
      >
        {course.title}
      </Link>
      {
        <>
          <div className="flex items-start justify-between">
            <CheckableLabel
              checkSize="text-2xl"
              uncheckedLabelClassNames="text-xl"
              checkedLabelClassNames="text-xl text-lime-500"
              resolvingPromise={getChapterCompletionStatus(
                userId,
                currentChapter.chapter_id
              ).then((value) => value === 1)}
              labelText={currentChapter.chapter_title}
            />
            <div className="">
              <Suspense>
                {getPreviousChapterIds(
                  chapterId,
                  courseId
                ).then((ids) => {
                  if (!ids) return <></>;
                  return (
                    <Link
                      href={`/courses/${courseId}/chapters/${ids.chapter_id}`}
                      className="bg-amber-500 p-2 text-black transition duration-300 ease-in-out hover:bg-black hover:text-white"
                    >
                      Previous
                    </Link>
                  );
                })}
              </Suspense>
              <Suspense>
                {getNextChapterIds(
                  chapterId,
                  courseId
                ).then((ids) => {
                  if (!ids) return <></>;
                  return (
                    <Link
                      href={`/courses/${courseId}/chapters/${ids.chapter_id}`}
                      className="ml-2 bg-amber-500 p-2 text-black transition duration-300 ease-in-out hover:bg-black hover:text-white"
                    >
                      Next
                    </Link>
                  );
                })}
              </Suspense>
            </div>
          </div>

          {currentChapter.contents.map(
            async (content, id) => {
              return (
                <Link
                  key={content.id}
                  href={`/courses/${courseId}/chapters/${currentChapter.chapter_id}/contents/${content.id}`}
                  className=" w-full bg-zinc-950 p-2"
                >
                  <CheckableLabel
                    checkSize="text-xl"
                    uncheckedLabelClassNames="hover:underline"
                    checkedLabelClassNames="text-lime-500 hover:underline"
                    resolvingPromise={getContentCompletionStatus(
                      userId,
                      content.id
                    )}
                    labelText={
                      id + 1 + ". " + content.title
                    }
                  />
                </Link>
              );
            }
          )}
        </>
      }
    </div>
  );
}
