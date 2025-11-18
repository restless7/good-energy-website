// app/investment-simulator/page.tsx

import type { Metadata } from 'next';
import InvestmentSimulatorPage from '@/components/InvestmentSimulatorPage';

export const metadata: Metadata = {
  title: 'Simulador de Inversión - Good Energy',
  description: 'Simula tu inversión en energía solar y descubre cuánto podrías ganar invirtiendo en energía limpia con Good Energy.',
  keywords: ['inversión solar', 'energía renovable', 'ROI', 'simulador', 'Colombia'],
  openGraph: {
    title: 'Simulador de Inversión Solar - Good Energy',
    description: 'Descubre cuánto podrías ganar invirtiendo en energía limpia',
    type: 'website',
  },
};

export default function SimulatorPage() {
  return <InvestmentSimulatorPage />;
}