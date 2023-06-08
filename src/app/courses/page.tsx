import Link from "next/link";
import Image from "next/image";

import { PrismaClient } from "@prisma/client";

export default async function CoursesPage() {

  const prisma = new PrismaClient();

  const courses = await prisma.course.findMany()
  return (
    <div className="container m-auto flex flex-col items-center justify-center">
      <h1 className="m-4 p-2 text-6xl font-semibold ">
        Available Courses
      </h1>
      <div className="w-full max-w-prose">
        <ol className="grid grid-cols-1 gap-4 ">
          {courses.map((course) => (
            <li key={course.id}>
              <div className="flex flex-1 flex-col items-center space-y-4  bg-zinc-900 p-8 text-xl md:flex-row">
                <Image
                  width={200}
                  height={200}
                  alt={`${course.title} course image`}
                  src="https://placehold.co/200x200.jpg"
                  className="w-[200px]"
                />
                <div className="flex flex-col justify-start gap-4 p-4">
                  <h2 className="font-medium">{course.title}</h2>
                  <p>{course.subtitle}</p>
                  <Link
                    href={`/courses/${course.id}`}
                    className="w-fit bg-amber-500 p-2 text-base text-black transition duration-300 ease-in-out hover:bg-black hover:text-white"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
