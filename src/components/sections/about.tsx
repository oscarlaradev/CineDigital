'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { PageSectionContent } from '@/lib/types';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

export default function AboutSection() {
  const [content, setContent] = useState<PageSectionContent | null>(null);
  const [loading, setLoading] = useState(true);

  const defaultContent = {
    id: 'about',
    title: 'Hola, soy Cine Digital',
    content: `Desde que vi "2001: A Space Odyssey" en un cine de barrio, supe que las películas eran algo más que simple entretenimiento. Para mí, son la forma de arte más poderosa del siglo XX y XXI, un lenguaje universal capaz de encapsular toda la complejidad de la experiencia humana.\n\nCreé este espacio para compartir esa pasión y para investigar junto a ustedes el "porqué" y el "cómo" del cine. No soy un crítico tradicional; me considero un traductor, un explorador que intenta descifrar los mensajes ocultos en la luz, la sombra y el sonido. Gracias por acompañarme en este viaje.`,
    imageUrl: 'https://placehold.co/400x400.png',
  };

  useEffect(() => {
    async function fetchContent() {
      if (!db) {
        setContent(defaultContent);
        setLoading(false);
        return;
      }
      try {
        const docRef = doc(db, 'pageContent', 'about');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().title) {
          setContent(docSnap.data() as PageSectionContent);
        } else {
           setContent(defaultContent);
        }
      } catch (error) {
        console.error("Error fetching about content:", error);
        setContent(defaultContent);
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
  }, []);

  return (
    <section id="sobre-mi" className="py-24">
      <div className="container mx-auto px-6">
        {loading ? (
            <div className="md:grid md:grid-cols-3 md:gap-12 items-center">
                <div className="md:col-span-1 flex justify-center">
                    <Skeleton className="w-48 h-48 md:w-64 md:h-64 rounded-full" />
                </div>
                <div className="md:col-span-2 mt-8 md:mt-0 space-y-4">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                </div>
            </div>
        ) : (
          <div className="md:grid md:grid-cols-3 md:gap-12 items-center">
            <div className="md:col-span-1 flex justify-center">
              <Avatar className="w-48 h-48 md:w-64 md:h-64 object-cover border-4 border-primary">
                  <AvatarImage src={content?.imageUrl || 'https://placehold.co/400x400.png'} alt="Foto del creador" data-ai-hint="portrait filmmaker" />
                  <AvatarFallback>CD</AvatarFallback>
              </Avatar>
            </div>
            <div className="md:col-span-2 mt-8 md:mt-0">
              <h2 className="text-3xl font-bold text-white">{content?.title}</h2>
              {content?.content?.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mt-4 text-gray-300">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
