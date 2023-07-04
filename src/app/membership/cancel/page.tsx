"use client";

import { cancelMembership } from "@/lib/actions";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { PulseLoader } from "react-spinners";

export default function MembershipCancellationPage() {
  const router = useRouter();
  let userId = useAuth().userId!;

  async function redirectToHome() {
    const redirectionLink =
      await getMembershipPaymentLinkRouteRequestHelper(userId);
    router.replace(redirectionLink);
    router.refresh()
  }

  useEffect(() => {
    redirectToHome();
  }, [])

  return (
    <div className="container mx-auto flex flex-grow flex-col items-center justify-center">
      <PulseLoader color="#f59e0b" />
      <h1 className="mt-8">
        Please wait while we are cancelling your membership.
      </h1>
    </div>
  );
}

async function getMembershipPaymentLinkRouteRequestHelper(userId: string) {
  const cancellationResponse = await cancelMembership(userId)
  return `/home`;
}