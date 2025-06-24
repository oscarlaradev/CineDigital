'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import Login from './login';
import Dashboard from './dashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function AdminPage() {
  if (!auth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted/40">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-2xl text-destructive">Firebase no configurado</CardTitle>
            <CardDescription className="mt-2 p-4">
              Falta la configuración de Firebase en la aplicación. Por favor, configura las variables de entorno de Firebase correctas para usar las funciones de administración.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
            <Skeleton className="h-8 w-2/3 mx-auto" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-destructive">Error: {error.message}</p>
      </div>
    );
  }

  if (user) {
    return <Dashboard />;
  }

  return <Login />;
}
