import { NextRequest, NextResponse } from "next/server";
import { api } from "../../api";
import { cookies } from "next/headers";
import { parse } from "cookie";
import { isAxiosError } from "axios";
import { logErrorResponse } from "../../../util/logErrorResponse"; 

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const apiRes = await api.post("auth/login", body);

    const cookieStore = await cookies();
    const setCookie = apiRes.headers["set-cookie"];

    if (setCookie) {
      const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
      for (const cookieStr of cookieArray) {
        const parsed = parse(cookieStr);

        const options: {
          expires?: Date;
          maxAge?: number;
          domain?: string;
          path?: string;
          secure?: boolean;
          httpOnly?: boolean;
          sameSite?: boolean | 'lax' | 'strict' | 'none';
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
    }

    return NextResponse.json(apiRes.data, { status: apiRes.status });
  } catch (error: unknown) {
    let status = 500;
    let message = { error: "Internal Server Error" };

    if (isAxiosError(error)) {
      logErrorResponse(error);
      status = error.response?.status ?? 500;
      message = error.response?.data ?? message;
    }

    return NextResponse.json(message, { status });
  }
}
