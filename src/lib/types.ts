import type { Timestamp } from "firebase/firestore";

export interface Post {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  category: 'analisis' | 'directores' | 'generos';
  createdAt: Timestamp;
}
