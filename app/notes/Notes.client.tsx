// app/notes/Notes.client.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { fetchNotes } from '../../lib/api';
import SearchBox from '../../components/SearchBox/SearchBox';
import Pagination from '../../components/Pagination/Pagination';
import Loader from '../../components/Loader/Loader';
import Error from '../../components/Error/Error';
import NoteList from '../../components/NoteList/NoteList';
import Modal from '../../components/Modal/Modal';
import NoteForm from '../../components/NoteForm/NoteForm';
import useModalControl from '../../hooks/useModalControl';
import styles from './NotesPage.module.css';
import { Note } from '../../types/note';

const PER_PAGE = 12;

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export default function NotesClient() {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const { isModalOpen, openModal, closeModal } = useModalControl();
  const queryClient = useQueryClient();

  const debounced = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 300);

  const { data, isLoading, isError, isFetching, isSuccess } = useQuery<
    FetchNotesResponse,
    Error
  >({
    queryKey: ['notes', page, search],
    queryFn: () => fetchNotes({ page, perPage: PER_PAGE, search }),
    placeholderData: prev => prev,
  });

  const totalPages = data?.totalPages ?? 0;
  const notes =
    data?.notes.map(note => ({ ...note, tag: note.tag ?? '' })) ?? [];

  useEffect(() => {
    if (isSuccess && notes.length === 0 && (search || page !== 1)) {
      console.warn('No notes found for your request.');
    }
  }, [isSuccess, notes.length, search, page]);

  const handleCreateSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['notes'] });
    closeModal();
  };

  return (
    <div className={styles.app}>
      <header className={styles.toolbar}>
        <SearchBox
          search={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            debounced(e.target.value)
          }
        />

        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            page={page}
            onPageChange={setPage}
          />
        )}

        <button className={styles.button} onClick={openModal}>
          Create note +
        </button>
      </header>

      {(isLoading || isFetching) && <Loader />}
      {isError && <Error />}
      {isSuccess && notes.length > 0 && <NoteList notes={notes} />}
      {isSuccess && notes.length === 0 && (
        <p className={styles.empty}>No notes yet.</p>
      )}

      {totalPages > 1 && (
        <footer className={styles.footerPagination}>
          <Pagination
            totalPages={totalPages}
            page={page}
            onPageChange={setPage}
          />
        </footer>
      )}

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm
            onSuccessClose={handleCreateSuccess}
            onCancel={closeModal}
          />
        </Modal>
      )}
    </div>
  );
}
