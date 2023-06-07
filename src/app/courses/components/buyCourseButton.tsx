"use client";

import { isUserCourseOwner } from "@/lib/serverActionsSupabaseRequests";
import {
  getCourseBasePrice,
  getCourseCheckoutLink,
} from "@/lib/stripe";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";

type BuyCourseButtonParams = {
  courseId: number;
  userId: string;
};

function BuyCourseButtonWrapper({
  courseId,
  userId,
}: BuyCourseButtonParams) {
  const [isButtonDisabled, setIsButtonDisabled] =
    useState(false);

  const [isOwner, setIsOwner] = useState(true);

  const router = useRouter();

  async function buyButtonClicked() {
    setIsButtonDisabled(true);
    const checkoutLink = await getCourseCheckoutLink(
      userId,
      courseId
    );
    router.push(checkoutLink!);
  }

  isUserCourseOwner(userId, courseId).then((ownership) =>
    setIsOwner(ownership)
  );

  const pricePromise = getCourseBasePrice(courseId);
  var formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return !isOwner ? (
    <button
      className={`${
        isButtonDisabled ? "bg-lime-200" : "bg-lime-500"
      } p-2 text-black transition duration-300 ease-in-out hover:bg-black hover:text-white`}
      disabled={isButtonDisabled}
      onClick={() => {
        buyButtonClicked();
      }}
    >
      {isButtonDisabled ? (
        "Loading"
      ) : (
        <Suspense fallback={<span>Loading</span>}>
          <span>
            {pricePromise.then(
              (price) =>
                `Get for ${formatter.format(price / 100)}`
            )}
          </span>
        </Suspense>
      )}
    </button>
  ) : (
    <></>
  );
}

export const BuyCourseButton = BuyCourseButtonWrapper;
