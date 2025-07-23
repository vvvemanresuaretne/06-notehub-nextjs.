import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { logErrorResponse } from "@/app/util/logErrorResponse";
import { AxiosError } from "axios";

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const search = request.nextUrl.searchParams.get("search") ?? "";
  const page = Number(request.nextUrl.searchParams.get("page") ?? 1);
  const rawTag = request.nextUrl.searchParams.get("tag") ?? "";
  const tag = rawTag === "All" ? "" : rawTag;

  try {
    const response = await fetch(`${process.env.API_URL}/notes?${new URLSearchParams({
      ...(search && { search }),
      ...(tag && { tag }),
      page: page.toString(),
      perPage: "12",
    }).toString()}`, {
      method: "GET",
      headers: {
        Cookie: cookieStore.toString(),
      },
      credentials: "include",
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    logErrorResponse(error as AxiosError);
    return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const cookieStore = cookies();

  try {
    const body = await request.json();

    const response = await fetch(`${process.env.API_URL}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieStore.toString(),
      },
      body: JSON.stringify(body),
      credentials: "include",
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    logErrorResponse(error as AxiosError);
    return NextResponse.json({ error: "Failed to create note" }, { status: 500 });
  }
}
