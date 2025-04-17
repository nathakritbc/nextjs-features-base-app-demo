import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET;

  // Get the pathname
  const pathname = req.nextUrl.pathname;

  // Paths that are public
  const publicPaths = [
    "/",
    "/auth/signin",
    "/products",
    "/products/[0-9]+",
    "/api/auth/(.)*",
  ];

  // Check if the path is public or needs authentication
  const isPathPublic = publicPaths.some((path) => {
    const regex = new RegExp(`^${path.replace(/\[0-9\]\+/g, "[0-9]+")}$`);
    return regex.test(pathname);
  });

  if (isPathPublic) {
    return NextResponse.next();
  }

  // Verify authentication
  const token = await getToken({ req, secret });

  // If not authenticated, redirect to sign-in page
  if (!token) {
    const signInUrl = new URL("/auth/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};
