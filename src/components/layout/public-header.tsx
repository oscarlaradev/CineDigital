'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import AnimatedLogo from '../animated-logo';

const navLinks = [
  { href: '#analisis', label: 'Análisis' },
  { href: '#sobre-mi', label: 'Sobre Mí' },
];

export default function PublicHeader() {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const handleLinkClick = () => {
    setMenuOpen(false);
  }
  
  const NavItems = () => (
    <>
      {navLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          onClick={handleLinkClick}
          className="nav-link-animated text-gray-300 hover:text-white transition-colors"
        >
          {link.label}
        </a>
      ))}
      <a href="#contacto" onClick={handleLinkClick}>
        <Button
          variant="default"
          className="bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground font-medium"
        >
          Contacto
        </Button>
      </a>
    </>
  );

  return (
    <header className="py-6 sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
      <nav className="container mx-auto px-6 flex justify-between items-center">
        <AnimatedLogo />
        <div className="hidden md:flex items-center space-x-8">
          <NavItems />
        </div>
        <div className="md:hidden">
          <Sheet open={isMenuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6 text-white" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-card border-l-border">
              <div className="flex flex-col items-center space-y-6 pt-12">
                <NavItems />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
