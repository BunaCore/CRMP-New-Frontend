import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// ============================================================
// EDGE PROXY — runs server-side before page renders.
//
// This proxy is intentionally minimal:
// - Only checks presence of the JWT token cookie (`access_token`)
// - If token is missing, redirect immediately to `/login`
//
// All granular permission logic lives in client guards/components.
// ============================================================

export function proxy(request: NextRequest) {
  const _tokenCookie = request.cookies.get("access_token")?.value;
  const { pathname: _pathname } = request.nextUrl;

  // Block unauthenticated access to protected routes.
  const isProtected = _pathname.startsWith("/admin") || _pathname.startsWith("/dashboard");
  if (isProtected && !_tokenCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", _pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
