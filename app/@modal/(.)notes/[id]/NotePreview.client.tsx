"use client";

import React from "react";
import Modal from "@/components/Modal/Modal";
import NotePreview from "@/components/NotePreview/NotePreview";
import { useParams, useRouter } from "next/navigation";

export default function PreviewClient() {
  const { id } = useParams();
  const router = useRouter();

  const closeModal = () => router.back();
  const noteId = Number(id);

  return (
    <Modal onClose={closeModal}>
      {!isNaN(noteId) && <NotePreview id={noteId} onClose={closeModal} />}
    </Modal>
  );
}
