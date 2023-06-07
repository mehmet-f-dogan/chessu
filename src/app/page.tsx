import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="container flex flex-grow flex-col items-center justify-center p-8 text-center">
      <h1 className="text-6xl">
        Welcome to{" "}
        <span className="text-amber-500">ChessU</span>!
      </h1>
      <h2 className="text-4xl">
        Batteries included Chess course platform.
      </h2>
      <h3 className="mt-4 text-xl">
        Supported features include:
      </h3>
      <ul>
        <li className="text-2xl text-red-500">
          Videos, Studies, Quizes
        </li>
        <li className="text-2xl text-purple-500">
          Stockfish 15
        </li>
        <li className="text-2xl text-green-500">
          Sales & Memberships
        </li>
        <li className="text-2xl text-blue-500">
          Free/Promotional Material
        </li>
      </ul>
      <Link
        href="/sign-in"
        className="mt-8 bg-amber-500  px-4 py-2 text-black transition duration-300 ease-in-out hover:bg-zinc-800 hover:text-white"
      >
        Sign in & Discover
      </Link>
    </div>
  );
}
