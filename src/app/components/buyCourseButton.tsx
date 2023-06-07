import { stripe } from "@/lib/stripe";
import { getCourse } from "@/lib/supabaseRequests";
import { redirect } from "next/navigation";

type BuyCourseButtonProps = {
  courseId: number;
  userId: string;
};

export default async function BuyCourseButton({
  courseId,
  userId,
}: BuyCourseButtonProps) {

  const course = getCourse(courseId)

  const createCheckoutSession = async () => {
  const session =  await stripe.checkout.sessions.create({
    success_url: `/courses/${courseId}`,
    line_items:[
    {}
    ],
    metadata:{
      userId
    }
  })
    return session.url

  }
  return (
    <button
    onClick={async (event)=>{
      event.preventDefault()
      const sessionUrl = await createCheckoutSession()
      if(!sessionUrl) return
      redirect(sessionUrl)
    }}
    ></button>
  )
}
