import Link from "next/link";
import {
  auth,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";

export default function Header() {
  let { userId } = auth();
  const buttonClass =
    "hover:bg-amber-500 hover:text-black shadow-2xl p-2  transition duration-300 ease-in-out";
  return userId ? (
    <header className="flex justify-between p-4">
      <Link className="text-2xl font-bold select-none" href="/home">
        ChessU
      </Link>
      <div className="flex items-center space-x-2">
        <Link href="/home" className={buttonClass}>
          Home
        </Link>
        <Link href="/courses" className={buttonClass}>
          Courses
        </Link>
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
  ) : (
    <></>
  );
}
