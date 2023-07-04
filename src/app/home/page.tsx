import MyCoursesPanel from "./components/MyCoursesPanel";
import MembershipPanel from "./components/MembershipPanel";
import { auth } from "@clerk/nextjs";

export default async function HomePage() {
  let userId = auth().userId!;

  return (
    <main>
      <div className="flex flex-col items-center justify-center md:flex-1 ">
        <section className="w-full bg-zinc-900 p-8 md:w-11/12 lg:w-2/3 xl:w-1/2">
          <MyCoursesPanel userId={userId} />
        </section>

        <section>
          <MembershipPanel userId={userId} />
        </section>
      </div>
    </main>
  );
}

/*

          <MyCoursesPanel userId={userId}/>

*/