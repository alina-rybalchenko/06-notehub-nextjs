// app/notes/page.tsx
import React from 'react';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import TanStackProvider from '../../components/TanStackProvider/TanStackProvider';
import NotesClient from './Notes.client';
import { fetchNotes } from '../../lib/api';
import styles from './NotesPage.module.css';

export default async function NotesPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, ''],
    queryFn: () => fetchNotes({ page: 1, perPage: 12, search: '' }),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <TanStackProvider dehydratedState={dehydratedState}>
      <div className={styles.app}>
        <NotesClient />
      </div>
    </TanStackProvider>
  );
}
