import { HydrationBoundary, dehydrate, QueryClient } from '@tanstack/react-query';
import NoteDetailsClient from './NoteDetails.client';
import { getSingleNote } from '@/lib/api';
import type { ReactElement } from 'react';

interface NoteDetailsProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: NoteDetailsProps): Promise<ReactElement> {
  const resolvedParams = await params;
  const queryClient = new QueryClient();
  const noteId = Number(resolvedParams.id);

  await queryClient.prefetchQuery({
    queryKey: ['note', noteId],
    queryFn: () => getSingleNote(noteId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}