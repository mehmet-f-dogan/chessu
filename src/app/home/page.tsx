import { auth } from "@clerk/nextjs";

import { getCourseCompletionStatus, getOwnedCourses, getStudyLocator } from "@/lib/supabaseRequests";
import { Suspense } from "react";
import Link from "next/link";
import { checkableLabel } from "../components/checkableLabel";

export default function HomePage() {
  let userId = auth().userId!;
  return (
    <main>
      <div className="flex flex-col justify-center items-center pt-8 md:p-8 md:flex-1">
        <section className="bg-zinc-900 m-2 p-8 lg:mt-12 md: w-full md:w-11/12 lg:w-2/3 xl:w-1/2">
          <h2 className="text-4xl mb-4">Your Courses</h2>
          <Suspense>
            <ul className="space-y-2">
              {getOwnedCourses(userId).then((courses) =>
                courses.map(async (course) => {
                  return (
                    <li
                      className="flex justify-between items-center border bg-zinc-950 border-white"
                      key={course.id}
                    >
                      <Link
                        className=" pl-2"
                        href={`/courses/${course.id}`}
                      >
                        {await checkableLabel(course.title
                  ,"underline","underline text-lime-500","text-xl",getCourseCompletionStatus(userId, course.id)
                  )}
                      </Link>
                      <div className="flex">
                        <Link href={await getStudyLocator(userId, course.id)} className="bg-white text-black p-2">
                          Study
                        </Link>
                      </div>
                    </li>
                  );
                })
              )}
            </ul>
          </Suspense>
        </section>
      </div>
    </main>
  );
}
