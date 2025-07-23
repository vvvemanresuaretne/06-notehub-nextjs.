import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { api } from "../../api"; // рівно як у репозиторії
import { parse } from "cookie";
import { isAxiosError } from "axios";
import { logErrorResponse } from "../../../util/logErrorResponse"; // шлях має точно співпадати

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (accessToken) {
    return NextResponse.json(
      { message: "Session refreshed successfully" },
      { status: 200 }
    );
  }

  if (refreshToken) {
    try {
      const apiRes = await api.get("auth/session", {
        headers: {
          Cookie: cookieStore.toString(),
        },
      });

      const setCookie = apiRes.headers["set-cookie"];
      if (setCookie) {
        const cookieArray = Array.isArray(setCookie)
          ? setCookie
          : [setCookie];
        for (const cookieStr of cookieArray) {
          const parsed = parse(cookieStr);
          const options: {
            expires?: Date;
            maxAge?: number;
            path?: string;
          } = {};

          if (parsed.Expires) options.expires = new Date(parsed.Expires);
          if (parsed["Max-Age"]) options.maxAge = Number(parsed["Max-Age"]);
          if (parsed.Path) options.path = parsed.Path;

          if (parsed.accessToken) {
            cookieStore.set("accessToken", parsed.accessToken, options);
          }
          if (parsed.refreshToken) {
            cookieStore.set("refreshToken", parsed.refreshToken, options);
          }
        }

        return NextResponse.json(
          { message: "Session refreshed successfully" },
          { status: apiRes.status }
        );
      }

      // Якщо немає set-cookie — вважати, що помилка
      return NextResponse.json(
        { error: "Unable to refresh session" },
        { status: 500 }
      );
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        logErrorResponse(error);
        const status = error.response?.status ?? 500;
        const message = error.response?.data ?? {
          error: "Internal Server Error",
        };
        return NextResponse.json(message, { status });
      }

      return NextResponse.json({ error: "Unknown error" }, { status: 500 });
    }
  }

  return NextResponse.json(
    { message: "Invalid or expired token" },
    { status: 401 }
  );
}
