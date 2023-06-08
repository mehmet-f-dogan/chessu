import { auth } from "@clerk/nextjs";

import Link from "next/link";
import { CheckableLabel } from "../components/checkableLabel";
import { PrismaClient } from "@prisma/client";
import _ from "lodash-es";

export default async function HomePage() {
  let userId = auth().userId!;

  const pageData = await getPageData(userId);

  return (
    <main>
      <div className="flex flex-col items-center justify-center pt-8 md:flex-1 ">
        <section className="md: m-2 w-full bg-zinc-900 p-8 md:w-11/12 lg:mt-12 lg:w-2/3 xl:w-1/2">
          <h2 className="text-4xl">Your Courses</h2>
          <ul className="mt-4 space-y-2">
            {pageData.map((course) => {
              return (
                <>
                  <li
                    className="flex items-center justify-between border border-white bg-zinc-950"
                    key={course.id}
                  >
                    <Link
                      className=" pl-2"
                      href={`/courses/${course.id}`}
                    >
                      <CheckableLabel
                        checkSize="text-2xl"
                        uncheckedLabelClassNames="text-xl hover:underline"
                        checkedLabelClassNames="text-xl text-lime-500 hover:underline"
                        resolvingPromise={
                          new Promise((resolve) => {
                            resolve(
                              course.completionRatio === 1
                            );
                          })
                        }
                        labelText={course.title}
                      />
                    </Link>

                    <div className="flex">
                      <Link
                        href={`/courses/${course.id}`}
                        className="bg-white p-2 text-black"
                      >
                        {course.completionRatio == 0 ||
                          course.completionRatio == 1
                          ? "Study"
                          : `Continue (${Math.floor(
                            course.completionRatio * 100
                          )}%)`}
                      </Link>
                    </div>
                  </li>
                </>
              );
            })}
          </ul>
        </section>
      </div>
    </main>
  );
}

async function getPageData(userId: string) {
  const prisma = new PrismaClient();

  const coursesPurchasedPromise = prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      purchases: {
        select: {
          course: {
            include: {
              chapters: true,
            },
          },
        },
      },
    },
  });

  const coursesStartedPromise = prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      completion: {
        select: {
          contents: {
            select: {
              course: {
                include: {
                  chapters: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const coursesAndChaptersCompletedPromise =
    prisma.completion.findUnique({
      where: {
        userId: userId,
      },
      select: {
        chapters: true,
        courses: true,
      },
    });

  let [
    coursesPurchased,
    coursesStarted,
    coursesAndChaptersCompleted,
  ] = await Promise.all([
    coursesPurchasedPromise,
    coursesStartedPromise,
    coursesAndChaptersCompletedPromise,
  ]);

  const coursesPurchasedFlattened =
    coursesPurchased?.purchases.flatMap(
      (course) => course.course
    ) ?? [];

  const coursesStartedFlattened =
    coursesStarted?.completion?.contents?.flatMap(
      (content) => content.course
    ) ?? [];

  let coursesMerged = _.unionBy(
    coursesPurchasedFlattened,
    coursesStartedFlattened,
    "id"
  );

  const coursesCompleted =
    coursesAndChaptersCompleted?.courses ?? [];

  const chaptersCompleted =
    coursesAndChaptersCompleted?.chapters ?? [];

  let coursesMergedWithCompletionRatio = coursesMerged.map(
    (course) => {
      return { ...course, completionRatio: 0 };
    }
  );

  coursesCompleted?.forEach((course) => {
    const index =
      coursesMergedWithCompletionRatio.findIndex(
        (innerCourse) => innerCourse.id === course.id
      );
    if (index > -1)
      coursesMergedWithCompletionRatio[
        index
      ].completionRatio = 1;
  });

  coursesMergedWithCompletionRatio.forEach(
    (course, index) => {
      if (course.completionRatio === 1) return;

      let calculatedRatio =
        course.chapters.filter((chapter) =>
          chaptersCompleted
            .flatMap((innerChapter) => innerChapter.id)
            .includes(chapter.id)
        ).length / course.chapters.length;

      calculatedRatio = _.isFinite(calculatedRatio)
        ? calculatedRatio
        : 0;

      coursesMergedWithCompletionRatio[
        index
      ].completionRatio = calculatedRatio;
    }
  );

  return coursesMergedWithCompletionRatio;
}
