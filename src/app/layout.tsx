import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Cine Digital',
  description: 'Deconstruyendo el Séptimo Arte. Un espacio para explorar el lenguaje del cine, analizar las obras de grandes maestros y entender por qué ciertas películas nos marcan para siempre.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Roboto:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body")}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
