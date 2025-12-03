// components/Navbar.tsx

'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ChevronDown } from 'lucide-react';

const navLinks = [
  { href: '#home', label: 'HOME' },
  { href: '#somos', label: 'SOMOS' },
  { href: '#como-funciona', label: 'CÓMO' },
  { href: '#invertir', label: 'INVIERTE' },
  {
    label: 'COMUNIDAD',
    href: '/comunidad',
    dropdown: [
      { href: '/inversiones', label: 'DASHBOARD' },
      { href: '/blog', label: 'BLOG & NOTICIAS' },
      { href: '/join-conference', label: 'EVENTOS' },
      { href: '/investment-simulator', label: 'RECURSOS' },
    ]
  },
  { href: '#contacto', label: 'CONTACTO' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

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
    <header className="fixed top-0 left-0 w-full z-50">
      <div
        className={`absolute inset-0 -z-10 bg-good-white/50 backdrop-blur-sm shadow-md transition-opacity duration-300 
                   ${hasScrolled ? 'opacity-100' : 'opacity-0'}`}
      />

      <div className="container mx-auto flex h-20 items-center justify-between px-6">
        <Link href="/" className="relative group">
          <Image
            src="/images/logo-dark.png"
            alt="Good Energy Logo"
            width={112} height={35 / 8} priority
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
            <li key={link.label} className="relative group">
              {link.dropdown ? (
                <div
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(link.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    className={`flex items-center gap-1 font-medium tracking-wider hover:text-good-lime transition-colors duration-300
                               ${hasScrolled ? 'text-good-dark-green' : 'text-good-white'}`}
                  >
                    {link.label}
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {/* Dropdown Menu */}
                  <div className={`absolute top-full left-0 pt-4 w-48 transition-all duration-300 ${activeDropdown === link.label ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                    }`}>
                    <div className="bg-good-white rounded-lg shadow-xl overflow-hidden py-2 border border-good-green/10">
                      {link.dropdown.map((subLink) => (
                        <Link
                          key={subLink.href}
                          href={subLink.href}
                          className="block px-4 py-2 text-sm text-good-dark-green hover:bg-good-lime/20 hover:text-good-green transition-colors"
                        >
                          {subLink.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  href={link.href}
                  className={`font-medium tracking-wider hover:text-good-lime transition-colors duration-300
                             ${hasScrolled ? 'text-good-dark-green' : 'text-good-white'}`}
                >
                  {link.label}
                </Link>
              )}
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

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 h-screen w-full bg-good-green transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
          } md:hidden flex flex-col items-center justify-center overflow-y-auto`}
      >
        <button onClick={() => setIsOpen(false)} className="absolute top-7 right-6">
          <X className="h-8 w-8 text-good-white hover:text-good-lime" />
        </button>
        <ul className="flex flex-col items-center space-y-8 py-8">
          {navLinks.map((link) => (
            <li key={link.label} className="text-center">
              {link.dropdown ? (
                <div className="flex flex-col items-center space-y-4">
                  <span className="text-3xl font-semibold text-good-lime/80">
                    {link.label}
                  </span>
                  {link.dropdown.map((subLink) => (
                    <Link
                      key={subLink.href}
                      href={subLink.href}
                      onClick={() => setIsOpen(false)}
                      className="text-xl text-good-white hover:text-good-lime transition-colors"
                    >
                      {subLink.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-3xl font-semibold text-good-white hover:text-good-lime transition-colors"
                >
                  {link.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
};

export default Navbar;