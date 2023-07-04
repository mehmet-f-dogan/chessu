"use server"

import { GetCourse } from "@/lib/materials";

export async function getCourseTitle(courseId: string) : Promise<string> {
	return (await GetCourse(courseId))!.title || ""
}