import { CheckableLabel } from "@/app/components/checkableLabel";
import { auth } from "@clerk/nextjs";
import Link from "next/link";
import VideoContentContainer from "./components/videoContentContainer";
import {
  ContentData,
  VideoContentData,
} from "@/lib/content.types";

import { ContentPageControllerService } from "@/lib/api";
import { GetCourseAndChapterAndContent } from "@/lib/materials";
import { isChapterComplete, isContentComplete, isCourseComplete } from "@/lib/actions";

function getContentContainer(contentData: ContentData) {
  switch (contentData.contentType) {
    case "VIDEO":
      contentData = contentData as VideoContentData;
      return (
        <VideoContentContainer
          videoUrl={contentData.videoUrl}
        />
      );
    default:
      return <></>;
  }
}

type ContentPageProps = {
  contentId: string;
};

export default async function ContentPage({
  params,
}: {
  params: ContentPageProps;
}) {
  const userId = auth().userId!;


  const [course, chapter, content] = await GetCourseAndChapterAndContent(params.contentId)

  if(!course || !chapter || !content){
    throw new Error("Something went wrong")
  }

  return (
    <div className="container mx-auto mt-0 flex max-w-prose flex-col justify-center space-y-4 bg-zinc-900 p-8">
      <Link
        href={`/course/${course.id}`}
        className="bg-zinc-950 p-2 "
      >
        <CheckableLabel
          labelText={course.title}
          checkedLabelClassNames="text-2xl hover:underline text-lime-500"
          uncheckedLabelClassNames="text-2xl hover:underline"
          shouldBeChecked={isCourseComplete(userId, course.id)}
          checkSize="text-xl"
        />
      </Link>
      <Link
        href={`/chapter/${chapter.id}`}
        className="bg-zinc-950 p-2 text-xl"
      >
        <CheckableLabel
          labelText={chapter.title}
          checkedLabelClassNames="text-xl hover:underline text-lime-500"
          uncheckedLabelClassNames="text-xl hover:underline"
          shouldBeChecked={isChapterComplete(userId, chapter.id)}
          checkSize="text-base"
        />
      </Link>
      <div className="flex items-start justify-between">
        <CheckableLabel
          labelText={content.title}
          checkedLabelClassNames="text-lime-500"
          shouldBeChecked={isContentComplete(userId, content.id)}
          checkSize="text-xl"
        />
      </div>

      {getContentContainer(
        content.contentData as ContentData
      )}
    </div>
  );
}