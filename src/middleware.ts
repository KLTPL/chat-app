import { NextRequest, NextResponse } from "next/server";
import { getSession, updateSession } from "./lib/auth";

const PUBLIC_PATHS = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  const session = await getSession();

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return await updateSession(session);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
