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
    <header className="m-auto min-w-full px-8 py-4">
      <div className="flex flex-1 items-center justify-between">
        <Link
          className="select-none text-2xl font-bold"
          href="/home"
        >
          ChessU
        </Link>
        <nav className="flex items-center space-x-2">
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
        </nav>
      </div>
    </header>
  ) : (
    <></>
  );
}
