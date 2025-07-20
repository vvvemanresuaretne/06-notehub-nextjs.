export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  tag: string;
}

export type Tag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";

export interface NewNote {
  title: string;
  content?: string;
  tag: Tag;
}

export type FetchNotesProps = {
  notes: Note[];
  totalPages: number;
};