'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Post } from '@/lib/types';
import PostCard from '@/components/post-card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type FilterType = 'all' | 'analisis' | 'directores' | 'generos';

const filters: { label: string; value: FilterType }[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Análisis', value: 'analisis' },
  { label: 'Directores', value: 'directores' },
  { label: 'Géneros', value: 'generos' },
];

export default function AnalysisSection() {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        setError(null);
        const postsCollection = collection(db, 'posts');
        const q = query(postsCollection, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
        setAllPosts(posts);
        setFilteredPosts(posts);
      } catch (err) {
        console.error("Error fetching posts: ", err);
        setError('No se pudieron cargar las publicaciones.');
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredPosts(allPosts);
    } else {
      setFilteredPosts(allPosts.filter(post => post.category === activeFilter));
    }
  }, [activeFilter, allPosts]);

  return (
    <section id="analisis" className="py-16 bg-card/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Mis Análisis y Videoensayos</h2>
          <div id="filters" className="mt-6 flex flex-wrap justify-center gap-2">
            {filters.map(filter => (
              <Button
                key={filter.value}
                variant="outline"
                className={cn(
                  'rounded-full border-[#444] transition-all duration-300 ease-in-out hover:bg-primary hover:text-primary-foreground hover:border-primary',
                  activeFilter === filter.value && 'bg-primary text-primary-foreground border-primary'
                )}
                onClick={() => setActiveFilter(filter.value)}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        <div id="content-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
             Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex flex-col space-y-3">
                  <Skeleton className="h-[200px] w-full rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                </div>
              ))
          ) : error ? (
            <p className="text-destructive col-span-full text-center">{error}</p>
          ) : filteredPosts.length > 0 ? (
            filteredPosts.map(post => <PostCard key={post.id} post={post} />)
          ) : (
            <p className="text-gray-400 col-span-full text-center">No hay publicaciones en esta categoría.</p>
          )}
        </div>
      </div>
    </section>
  );
}
