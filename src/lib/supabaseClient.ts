import { createClient } from "@supabase/supabase-js";
import { Database } from "@/lib/database.types";
import { auth, useAuth } from "@clerk/nextjs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

export async function getSupabaseClient(supabaseAccessToken?: string | null) {
  if (!supabaseAccessToken)
    supabaseAccessToken = await auth().getToken({ template: "supabase" });
  /*if (!supabaseAccessToken){
    supabaseAccessToken = await useAuth().getToken({ template: "supabase" });
  }*/

  if (!supabaseAccessToken)
    return createClient<Database>(supabaseUrl, supabaseServiceKey!, {
      global: {
        fetch: (...args) => fetch(...args),
      },
      auth: {
        persistSession: false,
      },
    });

  return createClient<Database>(supabaseUrl, supabaseKey, {
    global: {
      headers: { Authorization: `Bearer ${supabaseAccessToken}` },
      fetch: (...args) => fetch(...args),
    },
    auth: {
      persistSession: false,
    },
  });
}
