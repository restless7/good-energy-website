import React from 'react';
import { InvestmentSimulatorWorkspace } from './components/InvestmentSimulatorWorkspace';

export const metadata = {
  title: 'Simulador de Inversión - Good Energy',
  description: 'Proyecta tus retornos y compara modelos de negocio: Electrolineras Premium y Granjas Solares.',
};

export default function InvestmentSimulatorPage() {
  return (
    <div className="min-h-screen bg-[#052126] p-4 md:p-8 lg:p-12 font-sans selection:bg-[#D8DA00]/30 text-[#FFFDF0]">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col gap-2 border-b border-[#1A6B78]/50 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D8DA00]/10 text-[#D8DA00] rounded-full text-xs font-bold border border-[#D8DA00]/20 self-start">
            MOTOR DE SIMULACIÓN 2.0
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Simulador de Inversiones <span className="text-[#D8DA00]">Premium</span>
          </h1>
          <p className="text-lg text-[#8CB4BC] max-w-3xl mt-2">
            Espacio interactivo de modelado para inversiones de doble vía. Compara la dinámica de alta rentabilidad de nuestra red de Electrolineras Premium con los retornos estables y fraccionados de las Granjas Solares Good Energy.
          </p>
        </div>

        <InvestmentSimulatorWorkspace />
      </div>
    </div>
  );
}