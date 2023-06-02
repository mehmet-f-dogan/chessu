import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex flex-1 justify-center items-center min-h-screen">
      <SignUp />
    </div>
  );
}
