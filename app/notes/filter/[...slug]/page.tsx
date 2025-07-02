import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

type NotesProps = {
  params: Promise<{ slug: string[] }>;
};

export default async function Notes({ params }: NotesProps) {
  const { slug } = await params;
  
  const category = slug[0] === "All" ? undefined : slug[0];

  const initialData = await fetchNotes("", 1, category);

  return <NotesClient initialData={initialData} initialTag={category} />;
}