'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError('Error de inicio de sesión. Verifica tus credenciales.');
      console.error("Login Error:", err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
      <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Panel de Administración</CardTitle>
            <CardDescription>Inicia sesión para gestionar el contenido</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                        type="email" 
                        id="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                        className="bg-background"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input 
                        type="password" 
                        id="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                        className="bg-background"
                    />
                </div>
                <Button type="submit" className="w-full bg-gray-800 hover:bg-gray-900 text-white">
                    Iniciar Sesión
                </Button>
                {error && <p className="text-sm text-center text-destructive">{error}</p>}
            </form>
          </CardContent>
      </Card>
    </div>
  );
}
