import type { Timestamp } from "firebase/firestore";

export interface Post {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  category: 'analisis' | 'directores' | 'generos';
  createdAt: Timestamp;
}

export interface PageSectionContent {
  id: string;
  title?: string;
  subtitle?: string;
  content?: string;
  imageUrl?: string;
}

export interface FooterContent {
  youtube?: string;
  twitter?: string;
  instagram?: string;
  description?: string;
  copyright?: string;
}
