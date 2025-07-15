// components/Footer.tsx

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Instagram, Facebook } from 'lucide-react'; // Importamos los iconos

// Datos para los links del footer para no repetirlos
const footerLinks = [
  { href: '#home', label: 'HOME' },
  { href: '#somos', label: 'SOMOS' },
  { href: '#invertir', label: 'INVIERTE' },
  { href: '#como-funciona', label: 'CÓMO' },
  { href: '#contacto', label: 'CONTACTO' },
];

const Footer = () => {
  return (
    // Se ha eliminado el 'relative' y 'overflow-hidden' que ya no son necesarios
    <footer id="footer" className="bg-good-green text-good-white pt-20 pb-10">
      
      {/* Elemento decorativo de las cruces ha sido eliminado. */}

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12">

          {/* ---- COLUMNA 1: LOGO ---- */}
          <div className="lg:col-span-2">
            <Link href="/">
              <Image 
                src="/images/logo-light.png" 
                alt="Good Energy Logo"
                width={320} 
                height={80}
              />
            </Link>
          </div>

          {/* ---- COLUMNA 2: LINKS DE NAVEGACIÓN ---- */}
          <div>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-good-lime transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ---- COLUMNA 3: CONTACTO Y REDES SOCIALES ---- */}
          <div>
            <div className="mb-6">
              <p className="font-bold uppercase tracking-wider">Teléfono</p>
              <a href="tel:+573159780531" className="text-good-lime hover:underline">315 978 0531</a>
            </div>
            
            <div className="mb-6">
              <p className="font-bold uppercase tracking-wider">Correo:</p>
              <a href="mailto:hola@goodenergycol.com" className="text-good-lime hover:underline">hola@goodenergycol.com</a>
            </div>

            <div className="flex gap-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="bg-white rounded-full p-2 group">
                <Instagram className="w-6 h-6 text-good-green group-hover:scale-110 transition-transform" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="bg-white rounded-full p-2 group">
                <Facebook className="w-6 h-6 text-good-green group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

        </div>

        {/* Línea divisoria y copyright opcional (buena práctica) */}
        <div className="mt-16 border-t border-white/20 pt-6 text-center text-white/60 text-sm">
          <p>© {new Date().getFullYear()} Good Energy. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;