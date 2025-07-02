"use client";

import { fetchNoteById } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import css from "./NotePreview.module.css";
import Loader from "../Loader/Loader";
import ErrorText from "../Error/ErrorText";

type NotePreviewProps = {
  id: number;
  onClose: () => void;
};

export default function NotePreview({ id, onClose }: NotePreviewProps) {
  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    enabled: !isNaN(id),
    refetchOnMount: false,
  });

  if (isLoading) return <Loader />;
  if (isError) return <ErrorText message="Something went wrong." />;

  if (!note) return <ErrorText message="Note not found." />;

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
          <button className={css.backBtn} onClick={onClose}>
            Go back
          </button>
        </div>
        <p className={css.content}>{note.content}</p>
        <p className={css.date}>{note.createdAt}</p>
      </div>
    </div>
  );
}
