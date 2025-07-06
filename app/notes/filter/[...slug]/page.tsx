
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";
import { Metadata } from "next";

type NotesProps = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({
  params,
}: NotesProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug[0] === "All" ? "All" : slug[0];

  const descriptionTag =
    tag === "All"
      ? "All notes — view your complete collection of notes."
      : `Notes tagged with '${tag}' — browse notes filtered by '${tag}'.`;

  const tagUrl =
    tag === "All"
      ? "https://08-zustand-seven.vercel.app/notes/filter/All"
      : `https://08-zustand-seven.vercel.app/notes/filter/${tag}`;

  return {
    title: `Notes: ${tag}`,
    description: descriptionTag,
    openGraph: {
      title: `Notes: ${tag}`,
      description: descriptionTag,
      url: tagUrl,
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
      title: `Notes: ${tag}`,
      description: descriptionTag,
      images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
    },
  };
}

export default async function Notes({ params }: NotesProps) {
  const { slug } = await params;

  const category = slug[0] === "All" ? undefined : slug[0];

  const initialData = await fetchNotes("", 1, category);

  return <NotesClient initialData={initialData} initialTag={category} />;
}
