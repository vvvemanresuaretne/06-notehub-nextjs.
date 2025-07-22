export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { api } from "../../api";
import { cookies } from "next/headers";
import { isAxiosError } from "axios";
import { logErrorResponse } from "../../../utils/logErrorResponse";

export async function GET() {
  const cookieStore = await cookies();

  try {
    const { data } = await api.get("/users/me", {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      logErrorResponse(error);
      const status = error.response?.status || 401;
      const message = error.response?.data || { error: "Unauthorized" };
      return NextResponse.json(message, { status });
    }

    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const cookieStore = await cookies();

  try {
    const body = await request.json();

    const { data } = await api.patch("/users/me", body, {
      headers: {
        Cookie: cookieStore.toString(),
        "Content-Type": "application/json",
      },
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      logErrorResponse(error);
      const status = error.response?.status || 500;
      const message = error.response?.data || { error: "Failed to update user" };
      return NextResponse.json(message, { status });
    }

    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
