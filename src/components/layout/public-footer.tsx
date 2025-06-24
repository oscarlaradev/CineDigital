'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import AnimatedLogo from '../animated-logo';
import { YouTubeIcon, TwitterIcon, InstagramIcon } from "@/components/icons";
import { Skeleton } from '@/components/ui/skeleton';

const navLinks = [
  { href: '#analisis', label: 'Análisis' },
  { href: '#sobre-mi', label: 'Sobre Mí' },
  { href: '#contacto', label: 'Contacto' },
];

interface SocialLinksData {
    youtube: string;
    twitter: string;
    instagram: string;
}

export default function PublicFooter() {
  const [socialLinks, setSocialLinks] = useState<SocialLinksData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSocials() {
        if (!db) {
            setSocialLinks({ youtube: '#', twitter: '#', instagram: '#' });
            setLoading(false);
            return;
        }
        try {
            const docRef = doc(db, 'pageContent', 'socials');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setSocialLinks(docSnap.data() as SocialLinksData);
            } else {
                setSocialLinks({ youtube: '#', twitter: '#', instagram: '#' });
            }
        } catch (error) {
            console.error("Error fetching social links:", error);
            setSocialLinks({ youtube: '#', twitter: '#', instagram: '#' });
        } finally {
            setLoading(false);
        }
    }
    fetchSocials();
  }, []);

  const socialLinksConfig = [
    { href: socialLinks?.youtube, icon: YouTubeIcon, label: "YouTube" },
    { href: socialLinks?.twitter, icon: TwitterIcon, label: "Twitter" },
    { href: socialLinks?.instagram, icon: InstagramIcon, label: "Instagram" },
  ];

  return (
    <footer className="py-12 border-t border-border bg-card/20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-10 md:gap-x-8">

          <div className="md:col-span-5 lg:col-span-6 space-y-4">
             <div className="w-48 -ml-4">
                <AnimatedLogo />
             </div>
             <p className="text-gray-400 text-sm max-w-md">
                Deconstruyendo el Séptimo Arte. Un espacio para explorar el lenguaje del cine, analizar las obras de grandes maestros y entender por qué ciertas películas nos marcan para siempre.
             </p>
          </div>
          
          <div className="md:col-span-3 lg:col-span-3 space-y-4">
            <h3 className="text-lg font-semibold text-white tracking-wider uppercase">Navegación</h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="nav-link-animated text-gray-400 hover:text-white transition-colors pb-1">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="md:col-span-4 lg:col-span-3 space-y-4">
            <h3 className="text-lg font-semibold text-white tracking-wider uppercase">Sígueme</h3>
             {loading ? (
                <div className="flex space-x-3">
                    <Skeleton className="h-11 w-11 rounded-full" />
                    <Skeleton className="h-11 w-11 rounded-full" />
                    <Skeleton className="h-11 w-11 rounded-full" />
                </div>
             ) : (
                <div className="flex space-x-3">
                {socialLinksConfig.map((link) => (
                    <a 
                        key={link.label} 
                        href={link.href || '#'} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-muted p-3 rounded-full text-gray-400 hover:text-white hover:bg-primary transition-all duration-300 ease-in-out transform hover:scale-110"
                        aria-label={link.label}
                    >
                        <link.icon className="h-5 w-5" />
                    </a>
                ))}
                </div>
             )}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/50 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} Cine Digital. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
