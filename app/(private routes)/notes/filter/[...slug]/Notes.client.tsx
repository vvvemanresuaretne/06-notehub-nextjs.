"use client";
import css from "./NotesPage.module.css";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Pagination from "@/components/Pagination/Pagination";
import { useDebounce } from "use-debounce";
import NoteList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox";
import Link from "next/link";
import { fetchNotes } from "@/lib/api/clientApi";
import { FetchNotesProps } from "@/types/note";


interface NotesClientProps {
  initialData: FetchNotesProps;
  initialTag?: string;
}

export default function NotesClient({
  initialData,
  initialTag,
}: NotesClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");

  const [debounceQuery] = useDebounce(searchText, 400);

  const { data } = useQuery({
    queryKey: ["notes", debounceQuery, currentPage, initialTag],
    queryFn: () => fetchNotes(searchText, currentPage, initialTag),
    placeholderData: keepPreviousData,
    initialData,
  });

  const handleSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  const totalPages = data?.totalPages ?? 1;
  const notes = data?.notes ?? [];

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchText} onSearch={handleSearch} />
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onChangePage={setCurrentPage}
          />
        )}
        <Link href={"/notes/action/create"} className={css.button}>
          Create note +
        </Link>
      </header>
      {data && notes.length > 0 && <NoteList notes={notes} />}
    </div>
  );
}
