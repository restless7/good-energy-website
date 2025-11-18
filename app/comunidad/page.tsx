import type { Metadata } from 'next';
import ComunidadPageClient from './ComunidadPageClient';

export const metadata: Metadata = {
  title: 'Comunidad Good Energy - Tu Portal de Inversión Solar',
  description: 'Accede a todas las herramientas y recursos de la comunidad de inversionistas de Good Energy. Simulador, conferencias, dashboard y más.',
  keywords: [
    'comunidad Good Energy',
    'portal de inversionistas',
    'inversión solar',
    'dashboard de inversión',
    'simulador de inversión',
    'conferencia de energía solar',
  ],
  openGraph: {
    title: 'Comunidad Good Energy - Tu Portal de Inversión Solar',
    description: 'El punto de encuentro para los inversionistas de Good Energy. Accede a todas nuestras herramientas.',
    type: 'website',
    images: [
      {
        url: '/images/comunidad-og.jpg', // Asegúrate de tener una imagen para OG
        width: 1200,
        height: 630,
        alt: 'Comunidad Good Energy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Comunidad Good Energy',
    description: 'Tu portal de acceso al ecosistema de inversión solar de Good Energy.',
  },
};

export default function ComunidadPage() {
  return <ComunidadPageClient />;
}
