import { getSupabaseClient } from "@/lib/db/supabaseClient";

export async function getUsersCoursesIds(userId: string) {
  if (!userId) return [];

  const client = await getSupabaseClient({
    cache: false,
  });

  let { data } = await client
    .from("course_purchase")
    .select("course_id")
    .eq("user_id", userId);

  return data?.flatMap((x) => x.course_id) ?? [];
}

export async function getOwnedCourses(userId: string) {
  const registeredCourseIds = await getUsersCoursesIds(
    userId
  );

  const client = await getSupabaseClient({
    cache: false,
  });

  let { data } = await client
    .from("course")
    .select("*")
    .in("id", registeredCourseIds);

  return data ?? [];
}

export async function getStripeUserId(userId: string) {
  const client = await getSupabaseClient({
    cache: false,
  });
  const { data } = await client
    .from("stripe_customer_id")
    .select("stripe_customer_id")
    .eq("user_id", userId)
    .limit(1)
    .single();
  return data?.stripe_customer_id ?? null;
}

export async function setStripeUserId(
  userId: string,
  stripeCustomerId: string
) {
  const client = await getSupabaseClient({
    cache: false,
  });
  const { error } = await client
    .from("stripe_customer_id")
    .insert({
      user_id: userId,
      stripe_customer_id: stripeCustomerId,
    });
  return !error;
}
