import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { checkServerSession } from "./lib/api/serverApi";
import { parse } from "cookie";

const privateRoutes = ["/notes", "/profile"];
const publicRoutes = ["/sign-in", "/sign-up"];

export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const { pathname } = request.nextUrl;
  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isPrivateRoute) {
    if (!accessToken) {
      if (refreshToken) {
        try {
          const data = await checkServerSession();
          const setCookie = data.headers["set-cookie"];
          if (setCookie) {
            const cookieArray = Array.isArray(setCookie)
              ? setCookie
              : [setCookie];
            for (const cookieStr of cookieArray) {
              const parsed = parse(cookieStr);

              const options = {
                expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
                path: parsed.Path,
                maxAge: Number(parsed["Max-Age"]),
              };

              if (parsed.accessToken)
                cookieStore.set("accessToken", parsed.accessToken, options);
              if (parsed.refreshToken)
                cookieStore.set("refreshToken", parsed.refreshToken, options);
            }

            if (isPrivateRoute) {
              return NextResponse.next({
                headers: {
                  Cookie: cookieStore.toString(),
                },
              });
            }
          }
        } catch {
          return NextResponse.redirect(new URL("/sign-in", request.url));
        }
      }

      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  if (isPublicRoute) {
    if (accessToken) {
      return NextResponse.redirect(new URL("/profile", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/notes/:path*", "/profile/:path*", "/sign-in", "/sign-up"],
};