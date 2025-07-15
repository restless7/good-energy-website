// app/layout.tsx

import type { Metadata } from 'next';
// 1. Importa la función 'localFont' de next/font
import localFont from 'next/font/local'; 
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer'; // <--- 1. IMPORTA EL FOOTER


// 2. Configura tu fuente local
const unbounded = localFont({
  src: './fonts/Unbounded-VariableFont_wght.ttf', // Asegúrate de que el nombre del archivo coincida
  display: 'swap',
  variable: '--font-unbounded', // Le asignamos un nombre de variable CSS
});

export const metadata: Metadata = {
  title: 'Good Energy - Invierte en Energía Solar',
  description: 'Genera rendimientos mensuales invirtiendo en nuestra granja de energía solar.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      {/* 3. Aplica la variable de la fuente al body */}
      <body className={`${unbounded.variable} font-sans antialiased bg-good-white text-good-green`}>
        <Navbar />
        {children}
        <Footer /> {/* <--- 2. AÑADE EL FOOTER AQUÍ */}

      </body>
    </html>
  );
}