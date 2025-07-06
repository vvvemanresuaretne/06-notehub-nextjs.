import { NewNote } from "@/types/note";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type UseNoteDraft = {
  draft: NewNote;
  setDraft: (note: NewNote) => void;
  clearDraft: () => void;
};

const initialDraft: NewNote = {
  title: "",
  content: "",
  tag: "Todo",
};

export const useNoteDraft = create<UseNoteDraft>()(
  persist(
    (set) => {
      return {
        draft: initialDraft,
        setDraft: (note: NewNote) => {
          return set({
            draft: note,
          });
        },
        clearDraft: () => {
          return set({
            draft: initialDraft,
          });
        },
      };
    },
    {
      name: "note-draft",
      partialize: (store) => {
        return {draft: store.draft};
      },
    }
  )
);