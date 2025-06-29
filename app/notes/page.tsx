import NotesClient from './Notes.client';
import { getNotes } from '@/app/lib/api';

export default async function NotesPage() {
  const data = await getNotes();

  return <NotesClient initialData={data} />;
}