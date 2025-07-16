"use client";
import { useQuery } from "@tanstack/react-query";
import css from "./NoteDetails.module.css";
import { useParams, useRouter } from "next/navigation";
import Loader from "@/components/Loader/Loader";
import ErrorText from "@/components/Error/ErrorText";
import { fetchNoteById } from "@/lib/api/clientApi";

export default function NoteDetailsClient() {
  const { id } = useParams<{id: string}>();
  const router = useRouter();

  const back = () => router.back();

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  console.log(note);

  const formattedDate = note?.createdAt
    ? new Date(note?.createdAt).toUTCString()
    : "";

  return (
    <>
      {isLoading && <Loader />}
      {isError && <ErrorText message="Something went wrong." />}
      {note && (
        <div className={css.container}>
          <div className={css.item}>
            <div className={css.header}>
              <h2>{note?.title}</h2>
              <button className={css.backBtn} onClick={back}>
                Go back
              </button>
            </div>
            <p className={css.content}>{note?.content}</p>
            <p className={css.date}>{formattedDate}</p>
          </div>
        </div>
      )}
    </>
  );
}