// components/Navbar.tsx

'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { href: '#home', label: 'HOME' },
  { href: '#somos', label: 'SOMOS' },
  { href: '#como-funciona', label: 'CÓMO' },
  { href: '#invertir', label: 'INVIERTE' },
  { href: '#contacto', label: 'CONTACTO' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    // El header ahora es solo un contenedor de posicionamiento
    <header className="fixed top-0 left-0 w-full z-50">
      
      {/* CORRECCIÓN: Este es el DIV que actúa como fondo. */}
      {/* Está separado del contenido y se posiciona detrás (-z-10). */}
      <div
        className={`absolute inset-0 -z-10 bg-good-white/50 backdrop-blur-sm shadow-md transition-opacity duration-300 
                   ${hasScrolled ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* Este es el contenido, que permanece 100% nítido */}
      <div className="container mx-auto flex h-20 items-center justify-between px-6">
        
        <Link href="/" className="relative group">
          <Image
            src="/images/logo-dark.png"
            alt="Good Energy Logo"
            width={112} height={35/8} priority
            className={`transition-opacity duration-300 ${hasScrolled ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
          />
          <Image
            src="/images/logo-light.png"
            alt="Good Energy Logo"
            width={140} height={35} priority
            className={`absolute top-0 left-0 transition-opacity duration-300 ${hasScrolled ? 'opacity-0' : 'opacity-100 group-hover:opacity-0'}`}
          />
        </Link>

        <ul className="hidden items-center space-x-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link 
                href={link.href} 
                className={`font-medium tracking-wider hover:text-good-lime transition-colors duration-300
                           ${hasScrolled ? 'text-good-dark-green' : 'text-good-white'}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            <Menu 
              className={`h-8 w-8 transition-colors duration-300
                         ${hasScrolled ? 'text-good-dark-green' : 'text-good-white'}`}
            />
          </button>
        </div>
      </div>

      {/* Menú Overlay para móvil (sin cambios) */}
      <div
        className={`fixed top-0 left-0 h-screen w-full bg-good-green transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:hidden flex flex-col items-center justify-center`}
      >
        <button onClick={() => setIsOpen(false)} className="absolute top-7 right-6">
          <X className="h-8 w-8 text-good-white hover:text-good-lime" />
        </button>
        <ul className="flex flex-col items-center space-y-10">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-3xl font-semibold text-good-white hover:text-good-lime transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
};

export default Navbar;