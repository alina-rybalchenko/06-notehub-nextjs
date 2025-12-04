// app/notes/[id]/NoteDetails.client.tsx
'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '../../../lib/api';
import styles from '../../../components/NoteDetails/NoteDetails.module.css';

export default function NoteDetailsClient() {
  const params = useParams();
  const id = params?.id as string | undefined;

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id!),
    enabled: !!id,
    refetchOnMount: false,
  });

  if (isLoading) {
    return <p style={{ padding: 24 }}>Loading, please wait...</p>;
  }

  if (isError || !note) {
    return <p style={{ padding: 24 }}>Something went wrong.</p>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <div className={styles.header}>
          <h2>{note.title}</h2>
        </div>
        <p className={styles.content}>{note.content}</p>
        <p className={styles.date}>
          {new Date(note.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
