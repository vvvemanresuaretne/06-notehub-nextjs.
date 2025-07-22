import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { api } from "../../api";
import { parse } from "cookie";
import { isAxiosError } from "axios";
import { logErrorResponse } from "../../../utils/logErrorResponse";

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (accessToken) {
    return NextResponse.json({ message: "Session refreshed successfully" });
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
        const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

        for (const cookieStr of cookieArray) {
          const parsed = parse(cookieStr);
          const options = {
            expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
            path: parsed.Path || "/",
            maxAge: parsed["Max-Age"] ? Number(parsed["Max-Age"]) : undefined,
          };

          if (parsed.accessToken) {
            cookieStore.set("accessToken", parsed.accessToken, options);
          }
          if (parsed.refreshToken) {
            cookieStore.set("refreshToken", parsed.refreshToken, options);
          }
        }

        return NextResponse.json({ message: "Session refreshed successfully" }, { status: apiRes.status });
      }
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        logErrorResponse(error);
        const status = error.response?.status || 500;
        const message = error.response?.data || { error: "Internal Server Error" };
        return NextResponse.json(message, { status });
      }

      return NextResponse.json({ error: "Unknown error" }, { status: 500 });
    }
  }

  return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
}
