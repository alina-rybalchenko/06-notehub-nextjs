// lib/api.ts
import axios from 'axios';
import type {
  Note,
  CreateNote,
  FetchNotesParams,
  FetchNotesResponse,
} from '../types/note';

const PER_PAGE_DEFAULT = 12;
const BASE_URL =
  (process.env.NEXT_PUBLIC_NOTEHUB_BASE_URL as string) ??
  'https://notehub-public.goit.study/api';
const TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN as string | undefined;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: 'application/json',
    Authorization: TOKEN ? `Bearer ${TOKEN}` : undefined,
  },
});

export async function fetchNotes({
  page = 1,
  perPage = PER_PAGE_DEFAULT,
  search = '',
  tag,
  sortBy,
}: FetchNotesParams = {}): Promise<FetchNotesResponse> {
  const params: Record<string, unknown> = { page, perPage, search };
  if (tag) params.tag = tag;
  if (sortBy) params.sortBy = sortBy;
  const { data } = await api.get<FetchNotesResponse>('/notes', { params });
  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
}

export async function createNote(newNote: CreateNote): Promise<Note> {
  const { data } = await api.post<Note>('/notes', newNote);
  return data;
}

export async function deleteNote(id: string): Promise<Note> {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
}
