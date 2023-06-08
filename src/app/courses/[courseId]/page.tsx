import { CheckableLabel } from "@/app/components/checkableLabel";
import { auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCourseBasePrice } from "@/lib/stripe";

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
  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  const coursePromise = getCourse(courseId);
  const overviewArrayPromise = getCourseStructure(courseId);
  const isOwnerPromise = isUserCourseOwner(
    userId,
    courseId
  );
  const courseCompletionAmountPromise =
    getCourseCompletionAmount(userId, courseId);
  const studyLocationPromise = getStudyLocator(
    userId,
    courseId
  );

  const coursePricePromise = getCourseBasePrice(courseId);

  const [
    course,
    overviewArray,
    isOwner,
    courseCompletionAmount,
    studyLocation,
    coursePrice,
  ] = await Promise.all([
    coursePromise,
    overviewArrayPromise,
    isOwnerPromise,
    courseCompletionAmountPromise,
    studyLocationPromise,
    coursePricePromise,
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
        resolvingPromise={getCourseCompletionAmount(
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
        <Link
          href={studyLocation}
          className="bg-amber-500 p-2 text-black transition duration-300 ease-in-out hover:bg-black hover:text-white"
        >
          {courseCompletionAmount === 0 ? (
            <span>Study</span>
          ) : (
            <span>Continue Studying</span>
          )}
        </Link>
        {!isOwner && (
          <Link
            className="bg-lime-500 p-2 text-black transition duration-300 ease-in-out hover:bg-black hover:text-white"
            href={`/courses/${courseId}/checkout`}
          >
            {`Get for ${currencyFormatter.format(
              coursePrice / 100
            )}`}
          </Link>
        )}
      </div>
      {overviewArray.map(async (chapterData, index) => {
        const checkableLabel = (
          <CheckableLabel
            checkSize="text-3xl"
            uncheckedLabelClassNames="text-2xl hover:underline"
            checkedLabelClassNames="text-2xl text-lime-500 hover:underline"
            resolvingPromise={getChapterCompletionAmount(
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
