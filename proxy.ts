import { NextRequest, NextResponse } from "next/server";

const ADMIN_COOKIE_NAME = "admin_access";
const ADMIN_COOKIE_VALUE = "1";
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

const secret = process.env.ADMIN_PAGE_SECRET;

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path === "/api/admin/exit") {
    return NextResponse.next();
  }

  if (!secret) {
    if (path === "/admin" || path.startsWith("/admin/") || path.startsWith("/api/admin/")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  const token = request.nextUrl.searchParams.get("token");
  const hasValidCookie =
    request.cookies.get(ADMIN_COOKIE_NAME)?.value === ADMIN_COOKIE_VALUE;

  if (token === secret) {
    const cookieOpts = {
      path: "/" as const,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      maxAge: ONE_YEAR_SECONDS,
    };
    if (path.startsWith("/api/admin/")) {
      const res = NextResponse.next();
      res.cookies.set(ADMIN_COOKIE_NAME, ADMIN_COOKIE_VALUE, cookieOpts);
      return res;
    }
    const redirect = NextResponse.redirect(new URL("/admin", request.url));
    redirect.cookies.set(ADMIN_COOKIE_NAME, ADMIN_COOKIE_VALUE, cookieOpts);
    return redirect;
  }

  if (hasValidCookie) {
    return NextResponse.next();
  }

  if (path.startsWith("/api/admin/")) {
    return new NextResponse(null, { status: 401 });
  }

  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin", "/api/admin/:path*"],
};
