import axios from "axios";
import { cookies } from "next/headers";

import { FetchNotesProps, Note } from "@/types/note";
import { CheckSessionResp } from "@/types/session";
import { UserRes } from "@/types/user";

const baseURL = process.env.NEXT_PUBLIC_API_URL + "/api";
export const nextServer = axios.create({
  baseURL,
  withCredentials: true,
});

export async function fetchNotesServer(
  search: string,
  page: number,
  tag?: string
): Promise<FetchNotesProps> {
  const cookieStore = await cookies();
  const res = await nextServer.get<FetchNotesProps>("/notes", {
    params: {
      ...(search && { search }),
      page,
      perPage: 12,
      ...(tag && { tag }),
    },
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return res.data;
}

export async function fetchNoteByIdServer(id: string): Promise<Note> {
  const cookieStore = await cookies();
  const res = await nextServer.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  console.log("Server Api", res.data);

  return res.data;
}

export async function checkServerSession() {
  const cookieStore = await cookies();
  const response = await nextServer.get<CheckSessionResp>("/auth/session", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response;
}

export async function fetchServerUser(): Promise<UserRes> {
  const cookieStore = await cookies();
  const res = await nextServer.get<UserRes>("/users/me", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return res.data;
}
