import { Note, Tag } from "@/types/note";
import axios from "axios";

const myToken = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
axios.defaults.baseURL = "https://notehub-public.goit.study/api";
axios.defaults.headers.common["Authorization"] = `Bearer ${myToken}`;

export type FetchNotesProps = {
  notes: Note[];
  totalPages: number;
};

export async function fetchNotes(
  searchText: string,
  page: number,
  tag?: string
): Promise<FetchNotesProps> {
  const res = await axios.get<FetchNotesProps>("/notes", {
    params: {
      ...(searchText && { search: searchText }),
      ...(tag && {tag}),
      page,
      perPage: 12,
    },
  });
  return res.data;
}

interface NewNote {
  title: string;
  content?: string;
  tag: Tag;
}

export async function createNote(newNote: NewNote): Promise<Note> {
  const res = await axios.post<Note>("/notes", newNote);
  return res.data;
}

export async function deleteNote(id: number): Promise<Note> {
  const res = await axios.delete<Note>(`/notes/${id}`);
  return res.data;
}

export async function fetchNoteById(id: number): Promise<Note> {
  const res = await axios.get<Note>(`/notes/${id}`);
  return res.data;
}