"use client";

import React from "react";
import Modal from "@/components/Modal/Modal";
import NotePreview from "@/components/NotePreview/NotePreview";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import { Note } from "@/types/note"; 

export default function PreviewClient() {
  const { id } = useParams();
  const router = useRouter();

  const closeModal = () => router.back();

  const noteId = Number(id);

  const { data, isLoading, isError } = useQuery<Note>({
    queryKey: ["note", noteId],
    queryFn: () => fetchNoteById(noteId),
    enabled: !isNaN(noteId),
  });

  return (
    <Modal onClose={closeModal}>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading note.</p>}
      {data && <NotePreview note={data} onClose={closeModal} />}
    </Modal>
  );
}
