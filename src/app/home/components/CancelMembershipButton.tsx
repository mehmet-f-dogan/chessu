"use client";

export default function CancelMembershipButton() {
  async function cancelMembership() {
    await fetch("/api/cancel-membership", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return (
    <button onClick={cancelMembership}>
      Cancel Membership
    </button>
  );
}