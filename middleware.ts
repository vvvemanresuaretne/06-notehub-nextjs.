import { NextRequest, NextResponse } from "next/server";
import { checkServerSession } from "./lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));
  const isPrivateRoute = privateRoutes.some((route) => pathname.startsWith(route));


  if (!accessToken) {
    if (refreshToken) {
      try {
        const data = await checkServerSession();
        const setCookie = data.headers["set-cookie"];
        const response = NextResponse.next();

        if (setCookie) {
          const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

          for (const cookieStr of cookieArray) {
            const [cookieNameValue, ...attributes] = cookieStr.split("; ");
            const [name, value] = cookieNameValue.split("=");

            const cookieOptions: Record<string, string | number | Date> = {};
            for (const attr of attributes) {
              const [key, val] = attr.split("=");
              const keyLower = key.toLowerCase();

              if (keyLower === "path") cookieOptions.path = val;
              if (keyLower === "max-age") cookieOptions.maxAge = parseInt(val);
              if (keyLower === "expires") cookieOptions.expires = new Date(val);
            }

            if (name === "accessToken" || name === "refreshToken") {
              response.cookies.set(name, value, cookieOptions);
            }
          }

          if (isPublicRoute) {
            return NextResponse.redirect(new URL("/", request.url), response);
          }

          if (isPrivateRoute) {
            return response;
          }
        }
      } catch {
        if (isPrivateRoute) {
          return NextResponse.redirect(new URL("/sign-in", request.url));
        }
      }
    }

    if (isPublicRoute) {
      return NextResponse.next();
    }

    if (isPrivateRoute) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  if (isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
