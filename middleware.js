import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("token");
  const path = request.nextUrl.pathname;
  const isProtectedRoute = ["/groups", "/account", "/mygroups"].some((p) =>
    path.startsWith(p)
  );

  if (isProtectedRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/groups/:path*", "/account/:path*", "/mygroups/:path*"],
};
