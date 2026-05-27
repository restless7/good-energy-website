// app/layout.tsx

import type { Metadata } from 'next';
import localFont from 'next/font/local'; 
import './globals.css';
import AuthWrapper from '@/components/wrapper/AuthWrapper';
import { Toaster } from 'sonner';

// Configure local font
const unbounded = localFont({
  src: './fonts/Unbounded-VariableFont_wght.ttf',
  display: 'swap',
  variable: '--font-unbounded',
});

export const metadata: Metadata = {
  title: {
    default: 'Good Energy - Invierte en Energía Solar',
    template: '%s | Good Energy',
  },
  description: 'Genera rendimientos mensuales invirtiendo en nuestra granja de energía solar.',
  keywords: ['energía solar', 'inversión', 'rendimientos', 'sostenibilidad', 'Good Energy'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${unbounded.variable} font-sans antialiased`}>
        <AuthWrapper>
          {children}
        </AuthWrapper>
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: {
              background: '#0A3A43',
              border: '1px solid rgba(26,107,120,0.5)',
              color: '#FFFDF0',
            },
          }}
          richColors
        />
      </body>
    </html>
  );
}