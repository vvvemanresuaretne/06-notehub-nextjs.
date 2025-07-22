import { NextResponse } from "next/server";
import { api } from "../../api";
import { cookies } from "next/headers";
import { isAxiosError } from "axios";
import { logErrorResponse } from "../../../utils/logErrorResponse";

export async function POST() {
  const cookieStore = await cookies();

  try {
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    await api.post("auth/logout", null, {
      headers: {
        Cookie: `accessToken=${accessToken}; refreshToken=${refreshToken}`,
      },
    });

    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");

    return NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      logErrorResponse(error);
      const status = error.response?.status || 500;
      const message = error.response?.data || { error: "Logout failed" };
      return NextResponse.json(message, { status });
    }

    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
