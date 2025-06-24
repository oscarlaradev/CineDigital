'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { PageSectionContent } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function HeroSection() {
  const [content, setContent] = useState<PageSectionContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      if (!db) {
        setLoading(false);
        // Fallback content if firebase is not configured
        setContent({
            id: 'hero',
            title: 'Deconstruyendo el Séptimo Arte.',
            subtitle: 'Un espacio para explorar el lenguaje del cine, analizar las obras de grandes maestros y entender por qué ciertas películas nos marcan para siempre. Soy Cine Digital, y te invito a ver más allá del fotograma.',
        });
        return;
      }
      try {
        const docRef = doc(db, 'pageContent', 'hero');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().title) {
          setContent(docSnap.data() as PageSectionContent);
        } else {
          // Default content if nothing in DB
          setContent({
            id: 'hero',
            title: 'Deconstruyendo el Séptimo Arte.',
            subtitle: 'Un espacio para explorar el lenguaje del cine, analizar las obras de grandes maestros y entender por qué ciertas películas nos marcan para siempre. Soy Cine Digital, y te invito a ver más allá del fotograma.',
          });
        }
      } catch (error) {
        console.error("Error fetching hero content:", error);
         // Fallback default content on error
         setContent({
            id: 'hero',
            title: 'Deconstruyendo el Séptimo Arte.',
            subtitle: 'Un espacio para explorar el lenguaje del cine, analizar las obras de grandes maestros y entender por qué ciertas películas nos marcan para siempre. Soy Cine Digital, y te invito a ver más allá del fotograma.',
          });
      } finally {
        setLoading(false);
      }
    }

    fetchContent();
  }, []);

  return (
    <section id="hero" className="py-24">
      <div className="container mx-auto px-6 text-center">
        {loading ? (
          <div className="max-w-2xl mx-auto space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-6 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6 mx-auto" />
          </div>
        ) : (
          <>
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              {content?.title}
            </h1>
            <p className="mt-4 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
              {content?.subtitle}
            </p>
          </>
        )}
      </div>
    </section>
  );
}
