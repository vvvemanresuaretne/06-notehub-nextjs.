"use client";

import React, { useId, useState } from "react";
import css from "./NoteForm.module.css";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useNoteDraft } from "@/lib/store/noteStore";

const FormSchema = Yup.object({
  title: Yup.string()
    .required("Don\u2019t forget to enter a title")
    .min(3, "Please enter at least 3 characters")
    .max(50, "Title is too long — maximum is 50 characters"),
  content: Yup.string().max(
    500,
    "Content is too long — maximum is 500 characters"
  ),
  tag: Yup.string()
    .oneOf(
      ["Todo", "Work", "Personal", "Meeting", "Shopping"],
      "Please select a valid tag"
    )
    .required("Tag is required"),
});

type FormValues = Yup.InferType<typeof FormSchema>;

export default function NoteForm() {
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormValues, string>>
  >({});
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const queryClient = useQueryClient();

  const router = useRouter();
  const close = () => router.push("/notes/filter/All");

  const fieldId = useId();

  const { draft, setDraft, clearDraft } = useNoteDraft();

  const handleChange = async ({
    target: { name, value },
  }: React.ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >) => {
    setDraft({ ...draft, [name]: value });
    try {
      const schema = Yup.reach(FormSchema, name) as Yup.StringSchema;
      await schema.validate(value);

      const isFormValid = await FormSchema.isValid({ ...draft, [name]: value });
      setIsValid(isFormValid);
      setErrors((prev) => ({ ...prev, [name]: "" }));
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        setErrors((prev) => ({ ...prev, [name]: error.message }));
      }
    }
  };

  const mutation = useMutation({
    mutationFn: (newNote: FormValues) => createNote(newNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      clearDraft();
      close();
      toast.success("Note created");
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.");
    },
  });

  const handleSubmit = async (formData: FormData) => {
    setIsSubmiting(true);
    setErrors({});

    const values = Object.fromEntries(formData) as unknown as FormValues;

    let validatedValue: FormValues;

    try {
      validatedValue = await FormSchema.validate(values, { abortEarly: false });
      setIsValid(true);
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const newError: Partial<Record<keyof FormValues, string>> = {};

        error.inner.forEach((err) => {
          if (err.path && !newError[err.path as keyof FormValues]) {
            newError[err.path as keyof FormValues] = err.message;
          }
        });
        setErrors(newError);
        setIsValid(false);
      }

      return;
    } finally {
      setIsSubmiting(false);
    }

    const newNote = {
      title: validatedValue.title,
      content: validatedValue.content,
      tag: validatedValue.tag,
    };

    mutation.mutate(newNote);
  };

  return (
    <form className={css.form} action={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-title`}>Title</label>
        <input
          id={`${fieldId}-title`}
          type="text"
          name="title"
          className={css.input}
          onChange={handleChange}
          defaultValue={draft.title}
        />
        {errors.title && <span className={css.error}>{errors.title}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-content`}>Content</label>
        <textarea
          id={`${fieldId}-content`}
          name="content"
          rows={8}
          className={css.textarea}
          onChange={handleChange}
          defaultValue={draft.content}
        />
        {errors.content && <span className={css.error}>{errors.content}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-tag`}>Tag</label>
        <select
          id={`${fieldId}-tag`}
          name="tag"
          className={css.select}
          onChange={handleChange}
          defaultValue={draft.tag}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
        {errors.tag && <span className={css.error}>{errors.tag}</span>}
      </div>

      <div className={css.actions}>
        <button type="button" className={css.cancelButton} onClick={close}>
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={!isValid || isSubmiting}
        >
          Create note
        </button>
      </div>
    </form>
  );
}