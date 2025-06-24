'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { YouTubeIcon, TwitterIcon, InstagramIcon } from "@/components/icons";
import { Skeleton } from '@/components/ui/skeleton';

interface SocialLinksData {
    youtube: string;
    twitter: string;
    instagram: string;
}

export default function NewsletterSection() {
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
    <section id="contacto" className="py-20 bg-card/50">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-white">Sígueme en Redes</h2>
        <p className="mt-4 text-gray-400 max-w-xl mx-auto">
          Conectemos para no perderte ningún análisis, recomendación o contenido exclusivo.
        </p>
        <div className="mt-8 flex justify-center space-x-6 sm:space-x-10">
          {loading ? (
             Array.from({ length: 3 }).map((_, i) => (
                 <div key={i} className="flex flex-col items-center gap-3">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <Skeleton className="h-5 w-20 rounded-md" />
                 </div>
              ))
          ) : (
            socialLinksConfig.map((link) => (
             <a 
                key={link.label} 
                href={link.href || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-3 text-gray-400 hover:text-white transition-colors group"
                aria-label={link.label}
             >
                <div className="bg-muted p-4 rounded-full transition-all duration-300 group-hover:bg-primary group-hover:scale-110 shadow-lg">
                    <link.icon className="h-8 w-8 transition-colors group-hover:text-primary-foreground" />
                </div>
                <span className="font-medium tracking-wide transition-colors group-hover:text-primary">{link.label}</span>
             </a>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
