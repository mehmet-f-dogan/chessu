"use client";

import { isUserMember } from "@/lib/actions";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PulseLoader } from "react-spinners";


export default function MembershipPaymentSuccessfulPage() {
  const router = useRouter();
  let userId = useAuth().userId!;

  async function checkOwnership() {
    const maxNumberOfTries = 20;
    let registered = false;
    for (let i = 0; i < maxNumberOfTries && !registered; i++) {
      registered = await isUserMember(userId)
      await new Promise((resolve) =>
        setTimeout(resolve, 3000)
      );
    }
    if (registered) {
      router.replace("/home");
    } else {
      throw new Error("Cannot process Membership purchase.")
    }
  }

  useEffect(()=>{
    checkOwnership();
  },[])

  return (
    <div className="container mx-auto flex flex-grow flex-col items-center justify-center">
      <PulseLoader color="#f59e0b" />
      <h1 className="mt-8">
        Please wait while we are processing your purchase.
      </h1>
    </div>
  );
}