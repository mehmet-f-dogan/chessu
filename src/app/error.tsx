"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const { name, message, stack } = error;
  return (
    <div className="items m-auto  flex max-w-prose flex-col items-center">
      <h1>Something went wrong!</h1>
      <h2>{name}</h2>
      <h3>{message}</h3>
      <p>{JSON.stringify(error.stack)}</p>
    </div>
  );
}
