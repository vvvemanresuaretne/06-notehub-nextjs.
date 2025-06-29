
import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type { Note, NewNoteData } from '@/app/types/note';

const BASE_URL = 'https://notehub-public.goit.study/api';
const TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

if (!TOKEN || typeof TOKEN !== 'string' || TOKEN.trim() === '') {
  throw new Error('NOTEHUB_TOKEN is missing or invalid. Set it in environment variables.');
}



const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
});

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (search: string, page: number): Promise<FetchNotesResponse> => {
  const response: AxiosResponse<FetchNotesResponse> = await axiosInstance.get('/notes', {
    params: {
      search: search.trim() || undefined,
      page,
      perPage: 12,
    },
  });
  return response.data;
};

export const getNotes = async (): Promise<FetchNotesResponse> => {
  const response: AxiosResponse<FetchNotesResponse> = await axiosInstance.get('/notes', {
    params: { page: 1, perPage: 12 },
  });
  return response.data;
};

export const getSingleNote = async (id: number): Promise<Note> => {
  const response: AxiosResponse<Note> = await axiosInstance.get(`/notes/${id}`);
  return response.data;
};

export const createNote = async (newNote: NewNoteData): Promise<Note> => {
  const response: AxiosResponse<Note> = await axiosInstance.post('/notes', newNote);
  return response.data;
};

export const deleteNote = async (id: number): Promise<Note> => {
  const response: AxiosResponse<Note> = await axiosInstance.delete(`/notes/${id}`);
  return response.data;
};
