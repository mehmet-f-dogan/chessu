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

    if (auth.userId && (!pathname || pathname === "" || pathname === "/")) {
      return NextResponse.rewrite(new URL("/home", req.url));
    }

    const contentAccessRegex = /\/courses\/([^\/]+)/;

    if (contentAccessRegex.test(pathname)) {
      const match = pathname.match(contentAccessRegex)!;
      const courseId = match && match[1];

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
            : NextResponse.rewrite(new URL("/", req.url))
        )
        .catch(() => NextResponse.rewrite(new URL("/", req.url)));
    }

    return NextResponse.next();
  },
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
