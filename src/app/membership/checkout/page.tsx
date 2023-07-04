"use client";

import { getCheckoutLink } from "@/lib/actions";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { PulseLoader } from "react-spinners";

export default function MembershipCheckoutPage() {
  const router = useRouter();
  let userId = useAuth().userId!;

  async function redirectToCheckout() {
    const checkoutLink =
      await getMembershipPaymentLinkRouteRequestHelper(userId);
    router.replace(checkoutLink);
  }

  redirectToCheckout();

  return (
    <div className="container mx-auto flex flex-grow flex-col items-center justify-center">
      <PulseLoader color="#f59e0b" />
      <h1 className="mt-8">
        Please wait while we are redirecting you to payment
        page.
      </h1>
    </div>
  );
}

async function getMembershipPaymentLinkRouteRequestHelper(userId:string) {
  const checkoutLink = await getCheckoutLink(userId)
  if(!checkoutLink){
    throw new Error("Cannot create checkout link")
  }
  return checkoutLink 
}
