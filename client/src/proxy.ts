import { jwtVerify } from "jose";
import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE, AUTH_ROUTES, PROTECTED_ROUTES, ROLE_HOME, ROUTES } from "@/constants/routes";
import type { Role } from "@/types";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

const getRole = async (token: string | undefined): Promise<Role | null> => {
  if (!token || !process.env.JWT_SECRET) return null;
  try {
    const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
    return payload.role === "STUDENT" || payload.role === "MENTOR" ? payload.role : null;
  } catch {
    return null;
  }
};

/**
 * Optimistic, role-based route guard. It only decides where a user may navigate; the API re-checks
 * the token and the user's current role on every request, so this is never the security boundary.
 */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE)?.value;
  const role = await getRole(token);

  const area = PROTECTED_ROUTES.find(({ prefix }) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  const isAuthPage = AUTH_ROUTES.includes(pathname);

  if (area && !role) {
    const loginUrl = new URL(ROUTES.login, request.url);
    loginUrl.searchParams.set("redirect", `${pathname}${search}`);
    const response = NextResponse.redirect(loginUrl);
    // An expired or tampered token would otherwise keep bouncing the user around.
    if (token) response.cookies.delete(AUTH_COOKIE);
    return response;
  }

  if (area && role && area.role !== role) {
    return NextResponse.redirect(new URL(ROLE_HOME[role], request.url));
  }

  if (isAuthPage && role) {
    return NextResponse.redirect(new URL(ROLE_HOME[role], request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/student/:path*", "/mentor/:path*", "/login", "/register"],
};
