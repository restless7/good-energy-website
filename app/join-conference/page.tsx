// app/join-conference/page.tsx

import type { Metadata } from 'next';
import ConferenceFunnelPage from './ConferenceFunnelPage';

export const metadata: Metadata = {
  title: 'Conferencia Exclusiva Sol Inversor - Good Energy',
  description: 'Únete a la conferencia más exclusiva de inversión en energía solar. Solo 15 cupos disponibles. Aprende cómo generar ingresos pasivos mensuales con energía limpia.',
  keywords: [
    'conferencia inversión solar',
    'energía renovable Colombia',
    'ingresos pasivos',
    'Good Energy',
    'Sol Inversor',
    'inversión sostenible',
  ],
  openGraph: {
    title: 'Conferencia Exclusiva Sol Inversor - Solo 15 Cupos',
    description: 'Descubre cómo obtener 8-12% de rentabilidad anual invirtiendo en energía solar. Conferencia exclusiva con cupos limitados.',
    type: 'website',
    images: [
      {
        url: '/images/conference-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Conferencia Sol Inversor - Good Energy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Conferencia Exclusiva Sol Inversor - Solo 15 Cupos',
    description: 'Aprende a generar ingresos pasivos con energía solar. Cupos limitados.',
  },
  other: {
    'theme-color': '#D8DA00',
  },
};

export default function ConferencePage() {
  return <ConferenceFunnelPage />;
}