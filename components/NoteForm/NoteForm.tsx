import { useId } from "react";
import css from "./NoteForm.module.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Tag } from "@/types/note";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api";
import toast from "react-hot-toast";

const FormSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Please enter at least 3 characters")
    .max(50, "Title is too long — maximum is 50 characters")
    .required("Don\u2019t forget to enter a title"),
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

type NoteFormProps = {
  onClose: () => void;
};

interface FormValues {
  title: string;
  content: string;
  tag: Tag;
}
const initialVelues: FormValues = {
  title: "",
  content: "",
  tag: "Todo",
};

export default function NoteForm({ onClose }: NoteFormProps) {
  const queryClient = useQueryClient();

  const fieldId = useId();

  const mutation = useMutation({
    mutationFn: (newNote: FormValues) => createNote(newNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onClose();
      toast.success("Note created");
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.");
    },
  });

  const handleSubmit = (values: FormValues) => {
    mutation.mutate({
      title: values.title,
      content: values.content,
      tag: values.tag,
    });
  };

  return (
    <Formik
      initialValues={initialVelues}
      validationSchema={FormSchema}
      onSubmit={handleSubmit}
    >
      {({ isValid }) => {
        return (
          <Form className={css.form}>
            <div className={css.formGroup}>
              <label htmlFor={`${fieldId}-title`}>Title</label>
              <Field
                id={`${fieldId}-title`}
                type="text"
                name="title"
                className={css.input}
              />
              <ErrorMessage
                name="title"
                component="span"
                className={css.error}
              />
            </div>

            <div className={css.formGroup}>
              <label htmlFor={`${fieldId}-content`}>Content</label>
              <Field
                as="textarea"
                id={`${fieldId}-content`}
                name="content"
                rows={8}
                className={css.textarea}
              />
              <ErrorMessage
                name="content"
                component="span"
                className={css.error}
              />
            </div>

            <div className={css.formGroup}>
              <label htmlFor={`${fieldId}-tag`}>Tag</label>
              <Field
                as="select"
                id={`${fieldId}-tag`}
                name="tag"
                className={css.select}
              >
                <option value="Todo">Todo</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Meeting">Meeting</option>
                <option value="Shopping">Shopping</option>
              </Field>
              <ErrorMessage name="tag" component="span" className={css.error} />
            </div>

            <div className={css.actions}>
              <button
                type="button"
                className={css.cancelButton}
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={css.submitButton}
                disabled={!isValid}
              >
                Create note
              </button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}