import { auth } from "@clerk/nextjs";

import { getOwnedCourses } from "@/lib/supabaseRequests";
import { Suspense } from "react";
import Link from "next/link";

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
                courses.map((course) => {
                  return (
                    <li
                      className="flex justify-between items-center border bg-zinc-950 border-amber-500"
                      key={course.id}
                    >
                      <Link
                        className="underline pl-2"
                        href={`/courses/${course.id}`}
                      >
                        {course.title}
                      </Link>
                      <div className="flex">
                        <button className="bg-amber-500 text-black p-2">
                          Study
                        </button>
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
