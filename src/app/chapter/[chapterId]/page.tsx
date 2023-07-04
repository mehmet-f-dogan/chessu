import { CheckableLabel } from "@/app/components/checkableLabel";
import { isChapterComplete, isContentComplete, isCourseComplete, isCoursePurchased } from "@/lib/actions";
import { GetCourseAndChapter } from "@/lib/materials";
import { auth } from "@clerk/nextjs";
import Link from "next/link";

type ChapterPageProps = {
  chapterId: string;
};

export default async function ChapterPage({
  params,
}: {
  params: ChapterPageProps;
}) {
  const userId = auth().userId!;

  const [course, chapter] = await GetCourseAndChapter(params.chapterId)

  if(!course || !chapter){
    throw new Error("Something went wrong")
  }

  const courseOwner = await isCoursePurchased(userId, course.id)


  return (
    <div className="container mx-auto mt-0 flex max-w-prose flex-col justify-center space-y-4 bg-zinc-900 p-8">
      <Link
        href={`/course/${course.id}`}
        className="bg-zinc-950 p-2 "
      >
        <CheckableLabel
          labelText={course.title}
          checkedLabelClassNames="text-xl hover:underline text-lime-500"
          uncheckedLabelClassNames="text-xl hover:underline"
          shouldBeChecked={isCourseComplete(userId, course.id)}
          checkSize="text-2xl"
        />
      </Link>
      {
        <>
          <div className="flex items-start justify-between">
            <CheckableLabel
              labelText={chapter.title}
              checkedLabelClassNames="text-2xl text-lime-500"
              uncheckedLabelClassNames="text-2xl "
              shouldBeChecked={isChapterComplete(userId, chapter.id)}
              checkSize="text-3xl"
            />
          </div>

          {chapter.contents.map(
            async (content, idx) => {
              const checkableLabel = (
                <CheckableLabel
                  checkSize="text-xl"
                  uncheckedLabelClassNames={
                    (courseOwner || chapter.isSample) ? `hover:underline` : ""
                  }
                  checkedLabelClassNames={
                    (courseOwner || chapter.isSample)
                      ? `hover:underline text-lime-500`
                      : "text-lime"
                  }
                  shouldBeChecked={isContentComplete(userId, content.id)}
                  labelText={idx + 1 + ". " + content.title}
                />
              );  
              return (courseOwner || chapter.isSample) ? (
                <Link
                  key={idx}
                  href={`/content/${content.id}`}
                  className=" w-full bg-zinc-950 p-2"
                >
                  {checkableLabel}
                </Link>
              ) : (
                <div className=" w-full bg-zinc-950 p-2">
                  {checkableLabel}
                </div>
              );
            }
          )}
        </>
      }
    </div>
  );
}