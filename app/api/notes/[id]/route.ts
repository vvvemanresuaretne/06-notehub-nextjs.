import { NextRequest, NextResponse } from "next/server";
import { api } from "@/app/api/api";
import { isAxiosError } from "axios";
import { logErrorResponse } from "@/app/util/logErrorResponse";

interface Params {
  params: {
    id: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: Params
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    const { data } = await api.get(`/notes/${id}`, {
      headers: {
        Cookie: request.headers.get("cookie") || "",
      },
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      logErrorResponse(error);
      const status = error.response?.status || 500;
      const message =
        typeof error.response?.data === "string"
          ? { error: error.response.data }
          : error.response?.data || { error: "Failed to fetch note" };
      return NextResponse.json(message, { status });
    }

    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: Params
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    await api.delete(`/notes/${id}`, {
      headers: {
        Cookie: request.headers.get("cookie") || "",
      },
    });

    return NextResponse.json({ message: "Note deleted successfully" }, { status: 200 });
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      logErrorResponse(error);
      const status = error.response?.status || 500;
      const message =
        typeof error.response?.data === "string"
          ? { error: error.response.data }
          : error.response?.data || { error: "Failed to delete note" };
      return NextResponse.json(message, { status });
    }

    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: Params
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const body = await request.json();

  try {
    const { data } = await api.patch(`/notes/${id}`, body, {
      headers: {
        Cookie: request.headers.get("cookie") || "",
        "Content-Type": "application/json",
      },
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      logErrorResponse(error);
      const status = error.response?.status || 500;
      const message =
        typeof error.response?.data === "string"
          ? { error: error.response.data }
          : error.response?.data || { error: "Failed to update note" };
      return NextResponse.json(message, { status });
    }

    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
