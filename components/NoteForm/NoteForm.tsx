// components/NoteForm/NoteForm.tsx
'use client';

import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useId } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import styles from './NoteForm.module.css';
import { createNote } from '../../lib/api';
import type { CreateNote, Note, Tag } from '../../types/note';

interface NoteFormProps {
  onSuccessClose: () => void;
  onCancel: () => void;
}

interface NoteFormValues {
  title: string;
  content: string;
  tag: Tag;
}

const initialValues: NoteFormValues = {
  title: '',
  content: '',
  tag: 'Todo',
};

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Title is too short')
    .max(50, 'Title is too long')
    .required('Title is required'),
  content: Yup.string().max(500, 'Content is too long'),
  tag: Yup.string()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'])
    .required('Tag is required'),
});

export default function NoteForm({ onSuccessClose, onCancel }: NoteFormProps) {
  const id = useId();
  const queryClient = useQueryClient();

  const mutation = useMutation<Note, Error, CreateNote>({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onSuccessClose();
    },
  });

  const handleSubmit = (
    values: NoteFormValues,
    actions: FormikHelpers<NoteFormValues>
  ) => {
    mutation.mutate(
      { title: values.title, content: values.content, tag: values.tag },
      { onSettled: () => actions.setSubmitting(false) }
    );
    actions.resetForm();
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isValid, dirty }) => (
        <Form className={styles.form} aria-label="Create note form">
          <div className={styles.formGroup}>
            <label htmlFor={`${id}-title`}>Title</label>
            <Field
              id={`${id}-title`}
              name="title"
              type="text"
              className={styles.input}
              aria-required
            />
            <ErrorMessage
              name="title"
              component="span"
              className={styles.error}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor={`${id}-content`}>Content</label>
            <Field
              as="textarea"
              id={`${id}-content`}
              name="content"
              rows={8}
              className={styles.textarea}
            />
            <ErrorMessage
              name="content"
              component="span"
              className={styles.error}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor={`${id}-tag`}>Tag</label>
            <Field
              as="select"
              id={`${id}-tag`}
              name="tag"
              className={styles.select}
            >
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage
              name="tag"
              component="span"
              className={styles.error}
            />
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={!isValid || !dirty}
            >
              Create
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
