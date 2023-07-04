"use client";

export default function CompleteContentButton() {
  async function completeContent() {
    const result = await fetch("/api/complete-content", {
      body: JSON.stringify({
        contentId: "25b25e91-feeb-469b-8c63-114cd82dc9c4",
      }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return (
    <button onClick={completeContent}>
      Complete Content
    </button>
  );
}