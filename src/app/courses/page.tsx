import {
  getAllCourses,
  getCourseCompletionStatus,
} from "@/lib/supabaseRequests";
import Link from "next/link";
import Image from "next/image";
import { checkableLabel } from "@/app/components/checkableLabel";
import { auth } from "@clerk/nextjs";

export default async function CoursesPage() {
  const courses = await getAllCourses();
  let userId = auth().userId!;

  return (
    <div className="flex flex-col items-center justify-center m-auto p-8 container">
      <h1 className="text-6xl m-4 p-2 font-semibold ">Available Courses</h1>
      <ol className="grid grid-cols-1 gap-4">
        {courses.map(async (course) => (
          <li key={course.id}>
            <section className="flex flex-col md:flex-row items-center  text-xl space-y-4 bg-zinc-950 p-8">
              <Image
                width={400}
                height={400}
                alt={`${course.title} course image`}
                src="https://placehold.co/400x400.jpg"
                className="w-[400px]"
              />
              <div className="flex flex-col p-4 space-y-4 items-center justify-center md:items-start">
                {await checkableLabel(
                  course.title,
                  "text-4xl font-medium",
                  "text-4xl font-medium text-lime-500",
                  "text-5xl",
                  getCourseCompletionStatus(userId, course.id)
                )}

                <p>{course.subtitle}</p>
                <Link
                  href={`/courses/${course.id}`}
                  className="bg-amber-500 hover:bg-black hover:text-amber-500 p-2 m-auto text-black text-xl transition duration-300 ease-in-out"
                >
                  Details
                </Link>
              </div>
            </section>
          </li>
        ))}
      </ol>
    </div>
  );
}
