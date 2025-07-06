import NoteForm from "@/components/NoteForm/NoteForm";
import css from "./NoteCreate.module.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Note",
  description:
    "Create a new note to keep your thoughts organized and accessible.",
  openGraph: {
    title: "Create Note",
    description:
      "Create a new note to keep your thoughts organized and accessible.",
    url: "https://08-zustand-seven.vercel.app/notes/action/create",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "Note Hub App",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Create Note",
    description:
      "Create a new note to keep your thoughts organized and accessible.",
    images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
  },
};

export default function CreateNote() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
}