
'use client';

import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useQuery } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import SearchBox from '@/app/components/SearchBox/SearchBox';
import NoteList from '@/app/components/NoteList/NoteList';
import Loader from '@/app/components/Loader/Loader';
import ErrorMessage from '@/app/components/ErrorMessage/ErrorMessage';
import NoteModal from '@/app/components/NoteModal/NoteModal';
import Pagination from '@/app/components/Pagination/Pagination';
import { fetchNotes } from '@/app/lib/api';
import type { Note } from '@/app/types/note';

interface Props {
  initialData: {
    notes: Note[];
    totalPages: number;
  };
}

export default function NotesClient({ initialData }: Props) {
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 1000);
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['notes', debouncedSearch, page],
    queryFn: () => fetchNotes(debouncedSearch, page),
    placeholderData: (prev) => prev ?? initialData,  // <- по вимогам ментора
    staleTime: 1000 * 60 * 5,
  });

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div>
      <Toaster />
      <header>
        <SearchBox value={search} onChange={handleSearch} />
        <button onClick={() => setIsModalOpen(true)}>Create note +</button>
      </header>

      {isLoading && <Loader />}
      {isError && error && <ErrorMessage>{error.message}</ErrorMessage>}
      {data && data.notes.length > 0 ? (
        <>
          <NoteList notes={data.notes} />
          {data.totalPages > 1 && (
            <Pagination totalPages={data.totalPages} currentPage={page} onPageChange={setPage} />
          )}
        </>
      ) : (
        <p>No notes found.</p>
      )}

      {isModalOpen && <NoteModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
