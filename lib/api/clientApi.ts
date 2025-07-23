import { FetchNotesProps, NewNote, Note } from "@/types/note";
import { NewUser, User, UpdateUserProps  } from "@/types/user";
import { nextServer } from "./api";
import { CheckSessionResp } from "@/types/session";

export async function fetchNotes(
  search: string,
  page: number,
  tag?: string
): Promise<FetchNotesProps> {
  const res = await nextServer.get<FetchNotesProps>("/notes", {
    params: {
      ...(search && { search }),
      page,
      perPage: 12,
      ...(tag && { tag }),
    },
  });

  return res.data;
}

export async function createNote(newNote: NewNote): Promise<Note> {
  const res = await nextServer.post<Note>("/notes", newNote);
  return res.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const res = await nextServer.delete<Note>(`/notes/${id}`);
  return res.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const res = await nextServer.get<Note>(`/notes/${id}`);
  return res.data;
}

export async function register(newUser: NewUser): Promise<User> {
  const res = await nextServer.post<User>("/auth/register", newUser);
  return res.data;
}

export async function login(newUser: NewUser): Promise<User> {
  const res = await nextServer.post<User>("/auth/login", newUser);
  return res.data;
}

export async function checkSession(): Promise<CheckSessionResp> {
  const res = await nextServer.get<CheckSessionResp>("/auth/session");
  return res.data;
}

export async function fetchUser(): Promise<User> {
  const res = await nextServer.get<User>("/users/me");
  return res.data;
}

export async function logOut(): Promise<void> {
  await nextServer.post("/auth/logout");
}

export async function updateUser(value: UpdateUserProps): Promise<User> {
  const res = await nextServer.patch<User>("/users/me", value);
  return res.data;
}
