import { getSupabaseClient } from "@/lib/supabaseClient";
import { wrapFunctionWithSelectiveCache } from "./util";

const isUserCourseOwnerFunction =
  wrapFunctionWithSelectiveCache(
    true,
    async ({
      userId,
      courseId,
    }: {
      userId: string;
      courseId: number;
    }) => {
      const client = await getSupabaseClient({
        cache: false,
        authorize: true,
      });

      const { data } = await client
        .from("course_purchase")
        .select("*")
        .eq("course_id", courseId)
        .eq("user_id", userId)
        .limit(1)
        .single();

      return !!data;
    }
  );

export async function isUserCourseOwner(
  userId: string,
  courseId: number
) {
  return await isUserCourseOwnerFunction({
    userId,
    courseId,
  });
}
