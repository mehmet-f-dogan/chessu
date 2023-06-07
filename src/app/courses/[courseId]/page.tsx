import { CheckableLabel } from "@/app/components/checkableLabel";
import {
  getCourse,
  isUserCourseOwner,
  getCourseStructure,
  getCourseCompletionStatus,
  getChapterCompletionStatus,
  getStudyLocator,
  getContentCompletionStatus,
} from "@/lib/supabaseRequests";
import { auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { StudyButton } from "../components/studyButton";
import { BuyCourseButton } from "../components/buyCourseButton";

type CoursePageProps = {
  courseId: string;
};

export default async function CoursePage({
  params,
}: {
  params: CoursePageProps;
}) {
  const courseId = parseInt(params.courseId);
  const userId = auth().userId!;

  const coursePromise = getCourse(courseId);
  const overviewArrayPromise = getCourseStructure(courseId);
  const isOwnerPromise = isUserCourseOwner(
    userId,
    courseId
  );
  const completionRatioPromise = getCourseCompletionStatus(
    userId,
    courseId
  );

  const studyLocationPromise = getStudyLocator(
    userId,
    courseId
  );

  const [
    course,
    overviewArray,
    isOwner,
    completionRatio,
    studyLocation,
  ] = await Promise.all([
    coursePromise,
    overviewArrayPromise,
    isOwnerPromise,
    completionRatioPromise,
    studyLocationPromise,
  ]);

  if (!course || !overviewArray) redirect("/");

  return (
    <div className="container mx-auto mt-0 flex max-w-prose flex-col justify-center space-y-4 bg-zinc-900 p-8">
      <Image
        width={300}
        height={300}
        src="https://placehold.co/300x300.jpg"
        className="w-[300px] self-center"
        alt={`${course.title} course image`}
      />
      <CheckableLabel
        checkSize="text-4xl"
        uncheckedLabelClassNames="text-3xl"
        checkedLabelClassNames="text-3xl text-lime-500"
        resolvingPromise={getCourseCompletionStatus(
          userId,
          courseId
        ).then((value) => value === 1)}
        labelText={course.title}
      />

      <h2 className="italic text-zinc-100">
        {course.subtitle}
      </h2>
      <p className="text-zinc-300">{course.description}</p>
      <div className="flex items-center justify-center space-x-2">
        <StudyButton courseId={courseId} userId={userId} />
        <BuyCourseButton
          courseId={courseId}
          userId={userId}
        />
      </div>
      {overviewArray.map(async (chapterData, index) => {
        const checkableLabel = (
          <CheckableLabel
            checkSize="text-3xl"
            uncheckedLabelClassNames="text-2xl hover:underline"
            checkedLabelClassNames="text-2xl text-lime-500 hover:underline"
            resolvingPromise={getChapterCompletionStatus(
              userId,
              chapterData.chapter_id
            ).then((value) => value === 1)}
            labelText={
              "" +
              (index + 1) +
              ". " +
              chapterData.chapter_title
            }
          />
        );

        return (
          <div key={chapterData.chapter_id}>
            {isOwner ? (
              <Link
                href={`/courses/${courseId}/chapters/${chapterData.chapter_id}`}
              >
                {checkableLabel}
              </Link>
            ) : (
              checkableLabel
            )}
            <ol>
              {chapterData.contents.map(
                (content, index) => {
                  const checkableContentLabel = (
                    <CheckableLabel
                      checkSize="text-2xl"
                      uncheckedLabelClassNames="text-xl  hover:underline"
                      checkedLabelClassNames="text-xl text-lime-500 hover:underline"
                      resolvingPromise={getContentCompletionStatus(
                        userId,
                        content.id
                      )}
                      labelText={
                        "" +
                        (index + 1) +
                        ". " +
                        content.title
                      }
                    />
                  );
                  return (
                    <li className="pl-4" key={index}>
                      {isOwner ? (
                        <Link
                          href={`/courses/${courseId}/chapters/${chapterData.chapter_id}/contents/${content.id}`}
                        >
                          {checkableContentLabel}
                        </Link>
                      ) : (
                        checkableContentLabel
                      )}
                    </li>
                  );
                }
              )}
            </ol>
          </div>
        );
      })}
    </div>
  );
}
