// components/NoteDetails/NoteDetails.tsx

import styles from './NoteDetails.module.css';
import type { Note } from '../../types/note';

interface Props {
  note: Note;
}

export default function NoteDetails({ note }: Props) {
  if (!note) return null;
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
