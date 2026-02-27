import { NextRequest, NextResponse } from "next/server";
import { getSession, updateSession } from "@/server-actions/auth";
import { cookies } from "next/headers";

const PUBLIC_PATHS = ["/login", "/register", "/api/public"];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const session = await getSession();

  const now = Math.floor(Date.now() / 1000);
  if (!session || !session.user || !session.exp || session.exp < now) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname.startsWith("/room")) {
    (await cookies()).set("last-room-path", pathname);
  }

  return await updateSession(session);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
