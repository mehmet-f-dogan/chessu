import { createClient } from "@supabase/supabase-js";
import { Database } from "@/lib/db/database.types";
import { auth } from "@clerk/nextjs";

const CACHE_REVALIDATION_DURATION_SECS = 5 * 60;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_KEY!;

type getSupabaseClientParameters = {
  cache: boolean;
  cacheRevalidateAfterSeconds?: number;
};

export async function getSupabaseClient({
  cache,
  cacheRevalidateAfterSeconds,
}: getSupabaseClientParameters) {
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

  return createClient<Database>(
    supabaseUrl,
    supabaseServiceKey,
    clientConfig
  );
}
