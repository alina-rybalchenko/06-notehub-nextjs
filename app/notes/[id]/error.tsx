// app/notes/[id]/error.tsx (server route error)
'use client';
import { useEffect } from 'react';

export default function NoteDetailsError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Note details route error:', error);
  }, [error]);

  return (
    <div style={{ padding: 24 }}>
      <p>Could not fetch note details. {error?.message}</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
