import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";

export default function Header() {
  return (
    <header className="min-w-full py-4">
      <div className="flex flex-1 items-center justify-between">
        <Link
          className="select-none text-2xl font-bold"
          href="/home"
        >
          ChessU
        </Link>
        <nav className="flex items-center space-x-2">
          <Link
            href="/home"
            className="p-2 shadow-2xl transition duration-300  ease-in-out hover:bg-amber-500 hover:text-black"
          >
            Home
          </Link>
          <Link
            href="/courses"
            className="p-2 shadow-2xl transition duration-300  ease-in-out hover:bg-amber-500 hover:text-black"
          >
            Courses
          </Link>
          <Link
            href="/board"
            className="p-2 shadow-2xl transition duration-300  ease-in-out hover:bg-amber-500 hover:text-black"
          >
            Board
          </Link>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <div className="p-2 shadow-2xl transition duration-300  ease-in-out hover:bg-amber-500 hover:text-black">
              <SignInButton />
            </div>
          </SignedOut>
        </nav>
      </div>
    </header>
  );
} 