"use client"

import Link from "next/link";
import { getCourseTitle } from "../actions"
import { useEffect, useState } from "react";
import { UserHomepageCoursesResponse, loadMyCourses } from "@/lib/actions";

export default function MyCoursesPanel({ userId }: { userId: string }) {
  const [isLoaded, setLoaded] = useState(false)
  const [myCoursesResponse, setMyCoursesResponse] = useState({} as UserHomepageCoursesResponse)
  const [myCoursesTitles, setMyCoursesTitles] = useState([] as string[])

  
  useEffect(() => {
    loadCourses();
  }, []);
  

  const loadCourses = async () => {
    try {
      const courses = await loadMyCourses(userId);
      setMyCoursesResponse(courses);
      const courseTitles = await Promise.all(courses.CourseResponses.map((response) => getCourseTitle(response.course_id)));
      setMyCoursesTitles(courseTitles);
      setLoaded(true);
    } catch (error) {
    }
  };

  //loadCourses();

  return (<>
    <h2 className="text-4xl">My Courses</h2>
    {isLoaded && <ul className="mt-4 space-y-2">
      {myCoursesResponse.CourseResponses.map((course, idx) => {
        return (
          <li
            className="flex items-center justify-between border border-white bg-zinc-950"
            key={idx}
          >
            <Link
              className=" pl-2"
              href={`/course/${course.course_id}`}
            >
             {
              myCoursesTitles[idx]
             }
            </Link>

            <div className="flex">
              <Link
                href={`/course/${course.course_id}`}
                className="bg-white p-2 text-black"
              >
                {course.completion == 0 ||
                  course.completion == 100
                  ? "Study"
                  : `Continue (${course.completion}%)`}
              </Link>
            </div>
          </li>
        );
      })}
    </ul>
    }
  </>)
}