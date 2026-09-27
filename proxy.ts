import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import AppConfig from "@/backend/config";
import { CookieName } from "@/common/enums";
import db from "@/backend/mongodb";

const secret = AppConfig.ADMIN_PAGE_SECRET;

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // --- Maintenance mode check (runs first, applies to all non-excluded paths) ---
  const maintenanceMode = await db.isInMaintenance();
  if (maintenanceMode) {
    const isMaintenancePage = path.startsWith("/maintenance");
    const isExcluded = path.startsWith("/api") ||
                       path.startsWith("/admin") ||
                       path.startsWith("/_next") ||
                       path.startsWith("/favicon") ||
                       path.startsWith("/sitemap") ||
                       path.startsWith("/robots");

    if (!isMaintenancePage && !isExcluded) {
      return NextResponse.redirect(new URL("/maintenance", request.url));
    }
  }

  // --- Admin auth (only runs on admin routes per matcher config) ---
  const cookieToken = request.cookies.get(CookieName.ADMIN_TOKEN)?.value;

  // If cookie has valid token, allow access
  if (cookieToken && isValidJwt(cookieToken)) {
    return NextResponse.next();
  }

  // If url has valid token, set cookie and allow access
  if (request.nextUrl.searchParams.get("token") === secret) {
    return withJwtTokenInCookie(NextResponse.next());
  }

  // At this point there's no valid token so block access.
  if (path.startsWith("/api")) {
    return NextResponse.next({ status: 401 });
  }

  const { origin } = request.nextUrl

  return NextResponse.redirect(origin);
}

export const config = {
  matcher: [
    // Maintenance mode: all routes except API, static assets, metadata
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|maintenance).*)",
    // Admin routes (also covered by above, but explicit for clarity)
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};


function isValidJwt(jwtToken: string) {
  try {
    jwt.verify(jwtToken, secret);
    return true;
  } catch {
    return false;
  }
}

function withJwtTokenInCookie(res: NextResponse) {;
  res.cookies.set(CookieName.ADMIN_TOKEN, jwt.sign({}, secret), {
    path: "/" as const,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 315360000
  });

  return res;
}