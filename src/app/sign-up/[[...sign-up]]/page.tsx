import { SignUp } from "@clerk/nextjs";


export default function Page() {
  return (
    <div className="flex min-h-screen flex-1 items-center justify-center">
      <SignUp />
    </div>
  );
}
