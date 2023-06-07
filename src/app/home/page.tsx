import { auth } from "@clerk/nextjs";

import {
  getCourseCompletionStatus,
  getOwnedCourses,
  getStudyLocator,
} from "@/lib/supabaseRequests";
import { Suspense } from "react";
import Link from "next/link";
import { CheckableLabel } from "../components/checkableLabel";

export default async function HomePage() {
  let userId = auth().userId!;
  const userCourses = getOwnedCourses(userId);

  return (
    <main>
      <div className="flex flex-col items-center justify-center pt-8 md:flex-1 ">
        <section className="md: m-2 w-full bg-zinc-900 p-8 md:w-11/12 lg:mt-12 lg:w-2/3 xl:w-1/2">
          <h2 className="text-4xl">Your Courses</h2>
          <ul className="space-y-2">
            <Suspense>
              <div className="mt-4" />
              {userCourses.then((courses) =>
                courses.map(async (course) => {
                  const courseCompletionRatioPromise =
                    getCourseCompletionStatus(
                      userId,
                      course.id
                    );
                  const studyLocationPromise =
                    getStudyLocator(userId, course.id);
                  const [
                    courseCompletionRatio,
                    studyLocation,
                  ] = await Promise.all([
                    courseCompletionRatioPromise,
                    studyLocationPromise,
                  ]);
                  return (
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
                                courseCompletionRatio === 1
                              );
                            })
                          }
                          labelText={course.title}
                        />
                      </Link>

                      <div className="flex">
                        <Link
                          href={studyLocation}
                          className="bg-white p-2 text-black"
                        >
                          {courseCompletionRatio == 0 ||
                          courseCompletionRatio == 1
                            ? "Study"
                            : `Continue (${Math.floor(
                                courseCompletionRatio * 100
                              )}%)`}
                        </Link>
                      </div>
                    </li>
                  );
                })
              )}
            </Suspense>
          </ul>
        </section>
      </div>
    </main>
  );
}
