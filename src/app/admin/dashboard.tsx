'use client';

import { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, serverTimestamp, getDoc, query, orderBy, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { Post, PageSectionContent, FooterContent } from '@/lib/types';
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
import { Label } from '@/components/ui/label';

interface PostFormData {
  title: string;
  category: 'analisis' | 'directores' | 'generos';
  imageUrl: string;
  summary: string;
}

const initialPostFormState: PostFormData = {
  title: '',
  category: 'analisis',
  imageUrl: '',
  summary: '',
};

const initialPageContentState: PageSectionContent = {
    id: '',
    title: '',
    subtitle: '',
    content: '',
    imageUrl: '',
}

const initialFooterContentState: FooterContent = {
    youtube: '',
    twitter: '',
    instagram: '',
    description: '',
    copyright: '',
}

export default function Dashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [postFormData, setPostFormData] = useState<PostFormData>(initialPostFormState);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  
  const [heroContent, setHeroContent] = useState<PageSectionContent>(initialPageContentState);
  const [aboutContent, setAboutContent] = useState<PageSectionContent>(initialPageContentState);
  const [footerContent, setFooterContent] = useState<FooterContent>(initialFooterContentState);


  const { toast } = useToast();

  useEffect(() => {
    if (!db) return;
    
    const postsCollection = collection(db, 'posts');
    const q = query(postsCollection, orderBy('createdAt', 'desc'));
    const unsubscribePosts = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
      setPosts(postsData);
    });

    const fetchPageContent = async (sectionId: string, setter: React.Dispatch<React.SetStateAction<any>>) => {
        const docRef = doc(db, 'pageContent', sectionId);
        const docSnap = await getDoc(docRef);
        if(docSnap.exists()) {
            setter(docSnap.data());
        }
    }
    fetchPageContent('hero', setHeroContent);
    fetchPageContent('about', setAboutContent);
    fetchPageContent('footer', setFooterContent);

    return () => unsubscribePosts();
  }, []);

  const handlePostInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setPostFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleCategoryChange = (value: 'analisis' | 'directores' | 'generos') => {
      setPostFormData(prev => ({ ...prev, category: value }));
  };

  const handleHeroContentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setHeroContent(prev => ({ ...prev, [id]: value }));
  }

  const handleAboutContentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setAboutContent(prev => ({ ...prev, [id]: value }));
  }

  const handleFooterContentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { id, value } = e.target;
      setFooterContent(prev => ({...prev, [id]: value}));
  }

  const handlePageContentSave = async (sectionId: string, data: any) => {
    if (!db) return;
    try {
        const docRef = doc(db, 'pageContent', sectionId);
        await setDoc(docRef, data, { merge: true });
        toast({ title: 'Éxito', description: `Sección '${sectionId}' actualizada.` });
    } catch(error) {
        console.error("Error saving page content:", error);
        toast({ title: "Error", description: `Error al guardar la sección '${sectionId}'.`, variant: "destructive" });
    }
  }

  const resetPostForm = () => {
    setPostFormData(initialPostFormState);
    setEditingPostId(null);
  };

  const handlePostFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postFormData.title || !postFormData.category || !postFormData.imageUrl || !postFormData.summary) {
        toast({ title: "Error", description: "Todos los campos de la publicación son obligatorios.", variant: "destructive" });
        return;
    }

    try {
      if (editingPostId) {
        const postRef = doc(db, 'posts', editingPostId);
        await updateDoc(postRef, postFormData);
        toast({ title: "Éxito", description: "Publicación actualizada correctamente." });
      } else {
        await addDoc(collection(db, 'posts'), {
          ...postFormData,
          createdAt: serverTimestamp(),
        });
        toast({ title: "Éxito", description: "Publicación creada correctamente." });
      }
      resetPostForm();
    } catch (error) {
      console.error("Error saving post:", error);
      toast({ title: "Error", description: "Hubo un error al guardar la publicación.", variant: "destructive" });
    }
  };

  const handleEditPost = async (id: string) => {
    const postRef = doc(db, 'posts', id);
    const postSnap = await getDoc(postRef);
    if (postSnap.exists()) {
      const postData = postSnap.data() as Omit<Post, 'id' | 'createdAt'>;
      setPostFormData({
          title: postData.title,
          category: postData.category,
          imageUrl: postData.imageUrl,
          summary: postData.summary,
      });
      setEditingPostId(id);
      window.scrollTo(0, 0);
    }
  };

  const handleDeletePost = async (id: string) => {
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
        await handleDeletePost(postToDelete);
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

        <main className="container mx-auto p-6 space-y-8">
          
          <Card>
            <CardHeader>
              <CardTitle>Gestionar Contenido de la Página</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <form onSubmit={(e) => { e.preventDefault(); handlePageContentSave('hero', heroContent); }} className="space-y-4 p-4 border rounded-md">
                    <h3 className="font-semibold text-lg">Sección Hero</h3>
                    <div className="space-y-2">
                        <Label htmlFor="title">Título Principal</Label>
                        <Input id="title" value={heroContent.title} onChange={handleHeroContentChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="subtitle">Subtítulo / Párrafo</Label>
                        <Textarea id="subtitle" rows={4} value={heroContent.subtitle} onChange={handleHeroContentChange} />
                    </div>
                    <Button type="submit">Guardar Sección Hero</Button>
                </form>

                <form onSubmit={(e) => { e.preventDefault(); handlePageContentSave('about', aboutContent); }} className="space-y-4 p-4 border rounded-md">
                    <h3 className="font-semibold text-lg">Sección Sobre Mí</h3>
                    <div className="space-y-2">
                        <Label htmlFor="title">Título</Label>
                        <Input id="title" value={aboutContent.title} onChange={handleAboutContentChange} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="imageUrl">URL de la Imagen</Label>
                        <Input id="imageUrl" type="url" value={aboutContent.imageUrl} onChange={handleAboutContentChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="content">Contenido (puedes usar párrafos separados por una línea en blanco)</Label>
                        <Textarea id="content" rows={6} value={aboutContent.content} onChange={handleAboutContentChange} />
                    </div>
                    <Button type="submit">Guardar Sección Sobre Mí</Button>
                </form>

                <form onSubmit={(e) => { e.preventDefault(); handlePageContentSave('footer', footerContent); }} className="space-y-4 p-4 border rounded-md">
                    <h3 className="font-semibold text-lg">Gestionar Pie de Página</h3>
                    <div className="space-y-2">
                        <Label htmlFor="description">Descripción del Pie de Página</Label>
                        <Textarea id="description" value={footerContent.description} onChange={handleFooterContentChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="copyright">Texto de Copyright (sin año ni ©)</Label>
                        <Input id="copyright" value={footerContent.copyright} onChange={handleFooterContentChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="youtube">URL de YouTube</Label>
                        <Input id="youtube" type="url" value={footerContent.youtube} onChange={handleFooterContentChange} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="twitter">URL de Twitter/X</Label>
                        <Input id="twitter" type="url" value={footerContent.twitter} onChange={handleFooterContentChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="instagram">URL de Instagram</Label>
                        <Input id="instagram" type="url" value={footerContent.instagram} onChange={handleFooterContentChange} />
                    </div>
                    <Button type="submit">Guardar Pie de Página</Button>
                </form>
            </CardContent>
          </Card>
          
          <h2 className="text-2xl font-bold text-gray-800">Gestionar Publicaciones</h2>

          <Card>
              <CardHeader>
                  <CardTitle>{editingPostId ? 'Editando Publicación' : 'Añadir Nueva Publicación'}</CardTitle>
              </CardHeader>
              <CardContent>
                  <form onSubmit={handlePostFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2 space-y-2">
                          <Label htmlFor="title">Título</Label>
                          <Input id="title" value={postFormData.title} onChange={handlePostInputChange} required />
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="category">Categoría</Label>
                           <Select value={postFormData.category} onValueChange={handleCategoryChange}>
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
                          <Label htmlFor="imageUrl">URL de la Imagen</Label>
                          <Input id="imageUrl" type="url" value={postFormData.imageUrl} onChange={handlePostInputChange} required />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                          <Label htmlFor="summary">Resumen</Label>
                          <Textarea id="summary" rows={4} value={postFormData.summary} onChange={handlePostInputChange} required />
                      </div>
                      <div className="md:col-span-2 flex items-center gap-4">
                          <Button type="submit">{editingPostId ? 'Guardar Cambios' : 'Guardar Publicación'}</Button>
                          {editingPostId && (
                              <Button type="button" variant="outline" onClick={resetPostForm}>Cancelar Edición</Button>
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
                                  <Button size="sm" variant="outline" onClick={() => handleEditPost(post.id)}>Editar</Button>
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
