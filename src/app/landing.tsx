import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col justify-center items-center p-8 flex-1 text-center">
      <h1 className="text-6xl">Welcome to <span className="text-amber-500">ChessU</span>!</h1>
      <h2 className="text-4xl">This is a chess course platform that is a WIP.</h2>
      <h3 className="text-xl mt-4">Supported features include:</h3>
      <ul>
        <li className="text-2xl text-rose-500">Authentication</li>
        {/* <li className="text-2xl text-lime-500">Payments</li>
                <li className="text-2xl text-sky-500">Videos</li> */}
      </ul>
      <Link href="/sign-in" className="border border-amber-500 rounded-md px-4 py-2 mt-8 hover:bg-amber-500 hover:text-black transition duration-300 ease-in-out">Sign in & Discover</Link>
    </div>
  )
}