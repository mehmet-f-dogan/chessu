import {
  getCourse,
  getAllCourses,
  isUserCourseOwner,
  getCourseChapterContentOverview,
} from "@/lib/supabaseRequests";
import { auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

type CoursePageProps = {
  courseId: string;
};

const mainButtonClasses =
  "self-center text-xl  p-2 bg-amber-500 hover:bg-black hover:text-amber-500 text-black transition duration-300 ease-in-out";

export default async function CoursePage({
  params,
}: {
  params: CoursePageProps;
}) {
  const courseId = parseInt(params.courseId);
  const course = await getCourse(courseId);
  const overviewArray = await getCourseChapterContentOverview(courseId);
  const userId = auth().userId!;
  const isOwner = await isUserCourseOwner(userId, courseId);

  if (!course) redirect("/home");

  return (
    <div className="container p-8 max-w-prose mx-auto my-8 space-y-4 flex flex-col bg-zinc-900 justify-center">
      <Image
        width={300}
        height={300}
        src="https://placehold.co/300x300.jpg"
        className="w-[300px] self-center"
        alt={`${course.title} course image`}
      />
      <h1 className="text-2xl text-amber-500">{course.title}</h1>
      <h2 className="text-amber-200">{course.subtitle}</h2>
      <p className="text-zinc-300">{course.description}</p>
      <Suspense
        fallback={<button className={mainButtonClasses}>Loading</button>}
      >
        {isOwner ? (
          <Link href={"/"} className={mainButtonClasses}>
            Study
          </Link>
        ) : (
          <Link
            href={""}
            className={mainButtonClasses}
          >{`Buy for \$${course.price}`}</Link>
        )}
      </Suspense>
      {overviewArray?.map((chapterData) => {
        return (
          <div key={chapterData.chapter_id}>
            {isOwner ? (
              <Link
                href={`/courses/${courseId}/chapters/${chapterData.chapter_id}`}
                className="text-xl hover:underline text-amber-500"
              >
                {chapterData.chapter_title}
              </Link>
            ) : (
              <h3 className="text-xl text-amber-500">
                {chapterData.chapter_title}
              </h3>
            )}
            {chapterData.contents.map((content) => {
              return (
                <div key={content.id}>
                  {isOwner ? (
                    <Link
                      href={`/courses/${courseId}/chapters/${chapterData.chapter_id}/contents/${content.id}`}
                      className="hover:underline"
                    >
                      {content.title}
                    </Link>
                  ) : (
                    <h4>{content.title}</h4>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
