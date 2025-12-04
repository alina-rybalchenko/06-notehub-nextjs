// types/note.ts
export type Tag = 'Work' | 'Personal' | 'Meeting' | 'Shopping' | 'Todo';

export interface Note {
  id: string;
  title: string;
  content: string;
  tag: Tag;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateNote {
  title: string;
  content?: string;
  tag: Tag;
}

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: Tag | string;
  sortBy?: 'created' | 'updated';
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
  total?: number;
  page?: number;
  perPage?: number;
}
