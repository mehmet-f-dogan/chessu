import { checkableLabel } from "@/app/components/checkableLabel";
import {
  getCourse,
  isUserCourseOwner,
  getCourseStructure,
  getCourseCompletionStatus,
  getChapterCompletionStatus,
  getStudyLocator,
} from "@/lib/supabaseRequests";
import { auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { BsFillCheckCircleFill } from "react-icons/bs";

type CoursePageProps = {
  courseId: string;
};

export default async function CoursePage({
  params,
}: {
  params: CoursePageProps;
}) {
  const courseId = parseInt(params.courseId);
  const course = await getCourse(courseId);
  const overviewArray = await getCourseStructure(courseId);
  const userId = auth().userId!;
  const isOwner = await isUserCourseOwner(userId, courseId);
  if (!course || !overviewArray) redirect("/");

  const studyLocation = await getStudyLocator(userId,course.id)

  return (
    <div className="container p-8 max-w-prose mx-auto my-8 space-y-4 flex flex-col bg-zinc-900 justify-center">
      <Image
        width={300}
        height={300}
        src="https://placehold.co/300x300.jpg"
        className="w-[300px] self-center"
        alt={`${course.title} course image`}
      />
      {await checkableLabel(course.title, "text-3xl text-amber-500", "text-3xl text-lime-500", "text-4xl", getCourseCompletionStatus(userId, courseId))}
      <h2 className={`text-zinc-100`}>{course.subtitle}</h2>
      <p className="text-zinc-300">{course.description}</p>
      <Suspense
        fallback={
          <button
            className={`self-center text-xl  p-2 bg-white hover:bg-black hover:text-white text-black transition duration-300 ease-in-out`}
          >
            Loading
          </button>
        }
      >
        {isOwner ? (
          <Link
            href={studyLocation}
            className={`self-center text-xl  p-2 bg-white hover:bg-black hover:text-white text-black transition duration-300 ease-in-out`}
          >
            Study
          </Link>
        ) : (
          <Link
            href={""}
            className={`self-center text-xl  p-2 bg-white hover:bg-black hover:text-white text-black transition duration-300 ease-in-out`}
          >{`Buy for \$${course.price}`}</Link>
        )}
      </Suspense>
      {overviewArray.map(async (chapterData, index) => {
        return (
          <div key={chapterData.chapter_id}>
            {isOwner ? (
              <Link
                href={`/courses/${courseId}/chapters/${chapterData.chapter_id}`}
              >
                {await checkableLabel("" + (index + 1)+ ". " +chapterData.chapter_title
                  ,"text-2xl text-amber-500 hover:underline","text-2xl text-lime-500 hover:underline","text-3xl",getChapterCompletionStatus(userId, chapterData.chapter_id)
                  )}
              </Link>
            ) : (
              <>
                {await checkableLabel("" + (index + 1)+ ". " +chapterData.chapter_title
                  ,"text-2xl text-amber-500","text-2xl text-lime-500","text-3xl",getChapterCompletionStatus(userId, chapterData.chapter_id)
                  )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
