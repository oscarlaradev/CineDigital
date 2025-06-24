'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import Login from './login';
import Dashboard from './dashboard';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminPage() {
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
