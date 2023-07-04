import { CheckableLabel } from "@/app/components/checkableLabel";

import { auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import Header from "@/app/components/header";
import { GetCourse } from "@/lib/materials";
import { getCoursePrice, isChapterComplete, isContentComplete, isCourseComplete, isCoursePurchased } from "@/lib/actions";

type CoursePageProps = {
  courseId: string;
};

export default async function CoursePage({
  params,
}: {
  params: CoursePageProps;
}) {
  const userId = auth().userId!;
  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const course = await getPageData(params.courseId);

  if(!course){
    throw new Error("Course cannot be found")
  }

  return (
    <>
      <Header />
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
          shouldBeChecked={isCourseComplete(userId, course.id)}
          labelText={course.title}
        />

        <h2 className="italic text-zinc-100">
          {course.subtitle}
        </h2>
        <p className="text-zinc-300">
          {course.description}
        </p>
        <div className="flex items-center justify-center space-x-2">
          {!(await isCoursePurchased(userId, course.id)) && (
            <Link
              className="bg-lime-500 p-2 text-black transition duration-300 ease-in-out hover:bg-black hover:text-white"
              href={`/course/${params.courseId}/checkout`}
            >
              {`Get for ${currencyFormatter.format(
                (await getCoursePrice(userId, course.id))/100
              )}`}
            </Link>
          )}
        </div>
        {(course.chapters ?? []).map(
          async (chapterData, idx) => {
            const accesible =
              await isCoursePurchased(userId, course.id) || chapterData.isSample;
            const checkableLabel = (
              <CheckableLabel
                checkSize="text-3xl"
                uncheckedLabelClassNames={`text-2xl hover:underline`}
                checkedLabelClassNames={`text-2xl text-lime-500 hover:underline`}
                shouldBeChecked={isChapterComplete(userId, chapterData.id)}
                labelText={
                  "" + (idx + 1) + ". " + chapterData.title
                }
              />
            );

            return (
              <div
                key={idx}
                className={`p-2 ${
                  chapterData.isSample
                    ? "bg-emerald-950"
                    : ""
                } `}
              >
                <Link href={`/chapter/${chapterData.id}` ?? ""}>
                  {checkableLabel}
                </Link>
                <ol>
                  {(chapterData.contents ?? []).map(
                    (content, idx) => {
                      const checkableContentLabel = (
                        <CheckableLabel
                          checkSize="text-2xl"
                          uncheckedLabelClassNames={`text-xl  ${
                            accesible
                              ? "hover:underline"
                              : ""
                          }`}
                          checkedLabelClassNames={`text-xl text-lime-500 ${
                            accesible
                              ? "hover:underline"
                              : ""
                          }`}
                          shouldBeChecked={isContentComplete(userId, content.id)}
                          labelText={
                            "" +
                            (idx + 1) +
                            ". " +
                            content.title
                          }
                        />
                      );
                      return (
                        <li className="pl-4" key={idx}>
                          {accesible ? (
                            <Link href={`/content/${content.id}`}>
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
          }
        )}
      </div>
    </>
  );
}

async function getPageData(
  courseId: string
) {
  return await GetCourse(courseId);
}