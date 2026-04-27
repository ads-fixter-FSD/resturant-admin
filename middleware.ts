import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth?.token;
    const pathname = req.nextUrl.pathname;

    // =========================
    // NOT LOGGED IN
    // =========================
    if (!token) {
      if (pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/", req.url));
      }
      return NextResponse.next();
    }

    // =========================
    // NOT ADMIN
    // =========================
    if (token.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // =========================
    // ALREADY LOGGED IN ADMIN
    // =========================
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true,
    },
  },
);

export const config = {
  matcher: ["/", "/admin/:path*"],
};
