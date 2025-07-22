"use client";

import { useParams, useRouter } from "next/navigation";
import Modal from "@/components/Modal/Modal";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api/clientApi";

export default function PreviewClient() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const closeModal = () => router.back();

  const {
    data: note,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    enabled: !!id,
  });

  return (
    <Modal onClose={closeModal}>
      {isLoading && <p>Завантаження...</p>}
      {isError && <p>Сталася помилка: {error.message}</p>}
      {note && (
        <div>
          <h2 className="text-xl font-semibold mb-2">{note.title}</h2>
          <p className="text-gray-700 whitespace-pre-line">{note.content}</p>
        </div>
      )}
    </Modal>
  );
}
