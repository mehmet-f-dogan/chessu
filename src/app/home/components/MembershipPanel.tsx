"use client"

import Link from "next/link";

import { useEffect, useState } from "react";
import { isUserMember } from "@/lib/actions";


export default function MembershipPanel({userId} : {userId:string}) {
  const [userMember, setUserMember] = useState<boolean|null>(null)

  useEffect(()=>{
    isUserMember(userId).then((result) => setUserMember(result))    
  },[])

	return (
    <div>
      {userMember === true ? (
        <>
          <p>You are a member.</p>
          <Link href={`/membership/cancel`} className="underline">
            Cancel membership!
          </Link>
        </>
      ) : userMember === false ? (
        <>
          <p>You are not a member.</p>
          <Link href={`/membership/checkout`} className="underline">
            Become a member!
          </Link>
          <br />
        </>
      ) : (<></>)}
    </div>
  )
}