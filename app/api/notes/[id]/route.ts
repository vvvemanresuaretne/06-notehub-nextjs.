import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { api } from "../../api";
import { isAxiosError } from "axios";
import { logErrorResponse } from "../../../utils/logErrorResponse";

// Утиліта для отримання ID з URL
function extractIdFromUrl(request: NextRequest): string | null {
  const url = new URL(request.url);
  const segments = url.pathname.split("/");
  return segments.pop() || null;
}

// GET /api/notes/[id]
export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const id = extractIdFromUrl(request);

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    const { data } = await api.get(`/notes/${id}`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      logErrorResponse(error);
      const status = error.response?.status || 500;
      const message = error.response?.data || { error: "Failed to fetch note" };
      return NextResponse.json(message, { status });
    }

    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}

// DELETE /api/notes/[id]
export async function DELETE(request: NextRequest) {
  const cookieStore = cookies();
  const id = extractIdFromUrl(request);

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    await api.delete(`/notes/${id}`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(
      { message: "Note deleted successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      logErrorResponse(error);
      const status = error.response?.status || 500;
      const message = error.response?.data || { error: "Failed to delete note" };
      return NextResponse.json(message, { status });
    }

    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}

// PATCH /api/notes/[id]
export async function PATCH(request: NextRequest) {
  const cookieStore = cookies();
  const id = extractIdFromUrl(request);

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const body = await request.json();

  try {
    const { data } = await api.patch(`/notes/${id}`, body, {
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
      const message = error.response?.data || { error: "Failed to update note" };
      return NextResponse.json(message, { status });
    }

    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
