import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  privateRoutes,
} from "./routes";

export async function proxy(request: NextRequest) {
  const session = getSessionCookie(request);
  const { pathname } = request.nextUrl;

  const response = NextResponse.next({
    request: {
      headers: new Headers(request.headers),
    },
  });

  if (process.env.NODE_ENV === "development") {
    response.headers.set("ngrok-skip-browser-warning", "true");
  }
  response.headers.set("x-pathname", pathname);

  const isApiAuth = pathname.startsWith(apiAuthPrefix);
  const isAuthRoute = authRoutes.some((path) => pathname.startsWith(path));
  const isPrivateRoute = privateRoutes.some((path) => pathname.startsWith(path));

  if (isApiAuth) return response

  if (isAuthRoute) {
    if (session) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, request.url));
    }
    return response;
  }

  if (!session && isPrivateRoute) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
