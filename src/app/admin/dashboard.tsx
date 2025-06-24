'use client';

import { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, serverTimestamp, getDoc, query, orderBy } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { Post } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface PostFormData {
  title: string;
  category: 'analisis' | 'directores' | 'generos';
  imageUrl: string;
  summary: string;
}

const initialFormState: PostFormData = {
  title: '',
  category: 'analisis',
  imageUrl: '',
  summary: '',
};

export default function Dashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [formData, setFormData] = useState<PostFormData>(initialFormState);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!db) return;
    const postsCollection = collection(db, 'posts');
    const q = query(postsCollection, orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
      setPosts(postsData);
    });
    return () => unsubscribe();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleCategoryChange = (value: 'analisis' | 'directores' | 'generos') => {
      setFormData(prev => ({ ...prev, category: value }));
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setEditingPostId(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.category || !formData.imageUrl || !formData.summary) {
        toast({ title: "Error", description: "Todos los campos son obligatorios.", variant: "destructive" });
        return;
    }

    try {
      if (editingPostId) {
        const postRef = doc(db, 'posts', editingPostId);
        await updateDoc(postRef, formData);
        toast({ title: "Éxito", description: "Publicación actualizada correctamente." });
      } else {
        await addDoc(collection(db, 'posts'), {
          ...formData,
          createdAt: serverTimestamp(),
        });
        toast({ title: "Éxito", description: "Publicación creada correctamente." });
      }
      resetForm();
    } catch (error) {
      console.error("Error saving post:", error);
      toast({ title: "Error", description: "Hubo un error al guardar la publicación.", variant: "destructive" });
    }
  };

  const handleEdit = async (id: string) => {
    const postRef = doc(db, 'posts', id);
    const postSnap = await getDoc(postRef);
    if (postSnap.exists()) {
      const postData = postSnap.data() as Omit<Post, 'id' | 'createdAt'>;
      setFormData({
          title: postData.title,
          category: postData.category,
          imageUrl: postData.imageUrl,
          summary: postData.summary,
      });
      setEditingPostId(id);
      window.scrollTo(0, 0);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'posts', id));
      toast({ title: "Éxito", description: "Publicación eliminada." });
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({ title: "Error", description: "Error al eliminar la publicación.", variant: "destructive" });
    }
  };

  const confirmDelete = async () => {
    if (postToDelete) {
        await handleDelete(postToDelete);
        setPostToDelete(null);
    }
  }

  return (
    <>
      <div className="bg-muted/40 min-h-screen">
        <header className="bg-gray-800 text-white shadow-md">
          <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">Dashboard - Cine Digital</h1>
            <Button onClick={() => signOut(auth)} variant="destructive" className="bg-primary hover:bg-accent text-primary-foreground">Cerrar Sesión</Button>
          </nav>
        </header>

        <main className="container mx-auto p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Gestionar Publicaciones</h2>

          <Card className="mb-8">
              <CardHeader>
                  <CardTitle>{editingPostId ? 'Editando Publicación' : 'Añadir Nueva Publicación'}</CardTitle>
              </CardHeader>
              <CardContent>
                  <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2 space-y-2">
                          <label htmlFor="title">Título</label>
                          <Input id="title" value={formData.title} onChange={handleInputChange} required />
                      </div>
                      <div className="space-y-2">
                          <label htmlFor="category">Categoría</label>
                           <Select value={formData.category} onValueChange={handleCategoryChange}>
                              <SelectTrigger id="category">
                                  <SelectValue placeholder="Selecciona una categoría" />
                              </SelectTrigger>
                              <SelectContent>
                                  <SelectItem value="analisis">Análisis</SelectItem>
                                  <SelectItem value="directores">Directores</SelectItem>
                                  <SelectItem value="generos">Géneros</SelectItem>
                              </SelectContent>
                          </Select>
                      </div>
                      <div className="space-y-2">
                          <label htmlFor="imageUrl">URL de la Imagen</label>
                          <Input id="imageUrl" type="url" value={formData.imageUrl} onChange={handleInputChange} required />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                          <label htmlFor="summary">Resumen</label>
                          <Textarea id="summary" rows={4} value={formData.summary} onChange={handleInputChange} required />
                      </div>
                      <div className="md:col-span-2 flex items-center gap-4">
                          <Button type="submit">{editingPostId ? 'Guardar Cambios' : 'Guardar Publicación'}</Button>
                          {editingPostId && (
                              <Button type="button" variant="outline" onClick={resetForm}>Cancelar Edición</Button>
                          )}
                      </div>
                  </form>
              </CardContent>
          </Card>

          <Card>
              <CardHeader>
                  <CardTitle>Publicaciones Existentes</CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="space-y-4">
                      {posts.map(post => (
                          <div key={post.id} className="flex items-center justify-between p-4 border rounded-md bg-background">
                              <div>
                                  <p className="font-bold text-gray-800">{post.title}</p>
                                  <p className="text-sm text-gray-500 capitalize">{post.category}</p>
                              </div>
                              <div className="flex gap-2">
                                  <Button size="sm" variant="outline" onClick={() => handleEdit(post.id)}>Editar</Button>
                                  <Button size="sm" variant="destructive" onClick={() => setPostToDelete(post.id)}>Eliminar</Button>
                              </div>
                          </div>
                      ))}
                  </div>
              </CardContent>
          </Card>
        </main>
      </div>
      <AlertDialog open={!!postToDelete} onOpenChange={(isOpen) => !isOpen && setPostToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro de que quieres eliminar esta publicación?</AlertDialogTitle>
            <AlertDialogDescription>
                Esta acción no se puede deshacer y la publicación se eliminará permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPostToDelete(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
                onClick={confirmDelete}
                className="bg-destructive hover:bg-destructive/90"
            >
                Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
