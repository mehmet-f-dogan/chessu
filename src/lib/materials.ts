import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3"

let materials: Course[] = []

export async function GetMaterials(): Promise<Course[]> {

    if (materials.length > 0) {
        return materials
    }

    const bareBonesS3 = new S3Client({
        credentials: {
            accessKeyId: process.env.AWS_KEY!,
            secretAccessKey: process.env.AWS_SECRET!
        },
    });

    const coursesBucketObjectsList = await bareBonesS3.send(new ListObjectsV2Command({
        Bucket: process.env.AWS_MATERIALS_S3_BUCKET_NAME!,
    }))

    const objects = coursesBucketObjectsList.Contents ?? []

    await Promise.all(objects.map(async (item) => {
        const courseObject = await bareBonesS3.send(new GetObjectCommand({
            Bucket: process.env.AWS_MATERIALS_S3_BUCKET_NAME!,
            Key: item.Key
        }));

        try {
            const body = await courseObject.Body?.transformToString() || ""
            const course = JSON.parse(body);
            if (materials.findIndex(iCourse => iCourse.id == course.id) < 0) {
                materials.push(course);
            }

        } catch (ignored) {
        }
    }));
    return materials
}

export async function GetCourse(courseId: string): Promise<Course | null> {
    for (const course of await GetMaterials()) {
        if (course.id === courseId) {
            return course;
        }
    }
    return null;
}

export async function GetCourseAndChapter(chapterId: string): Promise<[Course | null, Chapter | null]> {
    for (const course of await GetMaterials()) {
        for (const chapter of course.chapters) {
            if (chapter.id === chapterId) {
                return [course, chapter];
            }
        }
    }
    return [null, null];
}

export async function GetCourseAndChapterAndContent(contentId: string): Promise<[Course | null, Chapter | null, Content | null]> {
    for (const course of await GetMaterials()) {
        for (const chapter of course.chapters) {
            for (const content of chapter.contents) {
                if (content.id === contentId) {
                    return [course, chapter, content];
                }
            }
        }
    }
    return [null, null, null];
}

export type Course = {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    imageUrl: string;
    stripePriceId: string;
    chapters: Chapter[];
};

export type Chapter = {
    id: string;
    title: string;
    isSample: boolean;
    contents: Content[];
};

export type Content = {
    id: string;
    title: string;
    contentData: VideoContentData;
};

export type VideoContentData = {
    contentType: 'VIDEO';
    videoUrl: string;
};
