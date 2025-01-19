import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Exclude Next.js internals and static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Get hostname (e.g. vercel.com, test.vercel.app, etc.)
  const hostname = request.headers.get("host");
  const searchParams = request.nextUrl.searchParams.toString();
  const path = `${pathname}${searchParams.length > 0 ? `?${searchParams}` : ""}`;

  // Get session token for protected routes
  const token = await getToken({ req: request });
  const isAuth = !!token;

  // Handle authentication for protected routes
  if (pathname.startsWith("/dashboard")) {
    if (!isAuth) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  // Special case for localhost
  if (hostname?.includes("localhost")) {
    return NextResponse.rewrite(new URL(path, request.url));
  }

  // Handle tenant-specific domains
  try {
    const tenant = hostname?.split(".")[0];
    if (!tenant) {
      console.error("Tenant resolution failed: No tenant found in hostname");
      return NextResponse.redirect(new URL("/404", request.url));
    }

    // For tenant-specific routes, ensure user has access if authenticated
    if (isAuth && pathname.startsWith("/dashboard")) {
      const userTenant = token?.tenant;
      if (userTenant && userTenant !== tenant) {
        console.error(
          "Tenant mismatch: User does not have access to this tenant"
        );
        return NextResponse.redirect(new URL("/403", request.url));
      }
    }

    // Add tenant to query params
    const url = new URL(path, request.url);
    url.searchParams.set("tenant", tenant);
    return NextResponse.rewrite(url);
  } catch (error) {
    console.error("Tenant resolution error:", error);
    return NextResponse.redirect(new URL("/404", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|favicon.ico).*)"],
};
