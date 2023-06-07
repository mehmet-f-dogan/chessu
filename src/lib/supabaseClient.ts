import { createClient } from "@supabase/supabase-js";
import { Database } from "@/lib/database.types";
import { auth } from "@clerk/nextjs";

const CACHE_REVALIDATION_DURATION_SECS = 5 * 60;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabasePublicKey =
  process.env.NEXT_PUBLIC_SUPABASE_KEY!;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_KEY!;

type getSupabaseClientParameters = {
  authorize: boolean;
  cache: boolean;
  cacheRevalidateAfterSeconds?: number;
};

export async function getSupabaseClient({
  authorize,
  cache,
  cacheRevalidateAfterSeconds,
}: getSupabaseClientParameters) {
  if (authorize && cache)
    throw new Error("Cannot cache authorized requests.");

  const clientConfig = {
    global: {
      autoRefreshToken: false,
      fetch: (
        ...args: [
          input: RequestInfo | URL,
          init?: RequestInit | undefined
        ]
      ) => {
        return fetch(args[0], {
          ...args[1],
          next: {
            revalidate: 0,
          },
        });
      },
    } as any,
    auth: {
      persistSession: false,
    },
  };

  if (authorize) {
    clientConfig.global.headers = {
      Authorization: `Bearer ${await auth().getToken({
        template: "supabase",
      })}`,
    };
  }

  if (cache) {
    clientConfig.global.fetch = (
      ...args: [
        input: RequestInfo | URL,
        init?: RequestInit | undefined
      ]
    ) => {
      return fetch(args[0], {
        ...args[1],
        next: {
          revalidate:
            cacheRevalidateAfterSeconds ??
            CACHE_REVALIDATION_DURATION_SECS,
        },
      });
    };
  }

  if (!authorize) {
    return createClient<Database>(
      supabaseUrl,
      supabaseServiceKey,
      clientConfig
    );
  }
  return createClient<Database>(
    supabaseUrl,
    supabasePublicKey,
    clientConfig
  );
}
