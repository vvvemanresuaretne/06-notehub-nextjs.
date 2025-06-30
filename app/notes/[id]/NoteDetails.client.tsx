'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getSingleNote } from '@/lib/api';

export default function NoteDetailsClient() {
  const { id } = useParams<{ id: string }>();
  const noteId = Number(id);

  const { data: note, isLoading, error } = useQuery({
    queryKey: ['note', noteId],
    queryFn: () => getSingleNote(noteId),
    refetchOnMount: false,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error || !note) return <p>Some error...</p>;

  return (
    <div>
      <h2>{note.title}</h2>
      <p>{note.content}</p>
      <p>Tag: {note.tag}</p>
      <p>Created at: {note.createdAt}</p>
    </div>
  );
}