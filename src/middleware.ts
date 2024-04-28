import { type NextRequest, NextResponse } from "next/server";

const VERCEL_DEPLOYMENT = !!process.env.VERCEL;

export default async function middleware(req: NextRequest) {
  const cookieName = `${VERCEL_DEPLOYMENT ? "__Secure-" : ""}next-auth.session-token`;
  const session = !!req.cookies.get(cookieName);
  if (!session) {
    const path = req.nextUrl.pathname;
    return NextResponse.redirect(
      new URL(`/api/auth/signin?callbackUrl=${path}`, req.url),
    );
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
