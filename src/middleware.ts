import { authMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isUserCourseOwnerMiddleware } from "./lib/supabaseRequests";

export default authMiddleware({
  publicRoutes: ["/"],

  afterAuth(auth, req, evt) {
    if (!auth.userId && !auth.isPublicRoute) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", req.url);
      return NextResponse.redirect(signInUrl);
    }

    const { pathname } = req.nextUrl;

    const contentAccessRegex = /^\/courses\/([^/]+)\/(.+)$/;
    if (contentAccessRegex.test(pathname)) {
      const [, courseId] = pathname.match(contentAccessRegex)!;

      return isUserCourseOwnerMiddleware(
        auth.userId!,
        parseInt(courseId),
        auth.getToken({
          template: "supabase",
        })
      )
        .then((exists) =>
          exists
            ? NextResponse.next()
            : NextResponse.redirect("http://localhost:3000/home")
        )
        .catch((e) => {
          NextResponse.redirect("http://localhost:3000/home");
        });
    }

    return NextResponse.next();
  },
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
