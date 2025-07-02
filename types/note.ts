export interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tag: string;
}

export type Tag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
