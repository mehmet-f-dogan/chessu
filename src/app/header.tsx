"use client"
import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton
} from "@clerk/nextjs";

export default function Header() {
  const buttonClass = "hover:bg-amber-500 hover:text-black shadow-2xl p-2 rounded-md transition duration-300 ease-in-out"
  return (
    <header className="flex justify-between p-4">
      <h1 className="text-2xl font-bold">ChessU</h1>
      <div className="flex items-center space-x-2">
        <Link href="/" className={buttonClass}>Home</Link>
        <Link href="/" className={buttonClass}>Courses</Link>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
        <SignedOut>
          <div className={buttonClass}>
            <SignInButton />
          </div>
        </SignedOut>
      </div>
    </header>
  )
}