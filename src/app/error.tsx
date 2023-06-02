"use client";

import { redirect } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const { name, message, stack } = error;
  return (
    <div className="flex flex-col  items-center m-auto max-w-prose items">
      <h1>Something went wrong!</h1>
      <h2>{name}</h2>
      <h3>{message}</h3>
      <p>{JSON.stringify(error.stack)}</p>
    </div>
  );
}
