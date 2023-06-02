"use client";

import { redirect } from "next/navigation";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  redirect("/");
}
