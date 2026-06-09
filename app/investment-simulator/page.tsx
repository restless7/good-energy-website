import React from 'react';
import { InvestmentSimulatorWorkspace } from './components/InvestmentSimulatorWorkspace';

export const metadata = {
  title: 'Investment Simulator - Good Energy',
  description: 'Proyecta tus retornos y compara modelos de negocio: Electrolineras Premium y Granjas Solares.',
};

export default function InvestmentSimulatorPage() {
  return (
    <div className="min-h-screen bg-[#052126] p-4 md:p-8 lg:p-12 font-sans selection:bg-[#D8DA00]/30 text-[#FFFDF0]">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col gap-2 border-b border-[#1A6B78]/50 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D8DA00]/10 text-[#D8DA00] rounded-full text-xs font-bold border border-[#D8DA00]/20 self-start">
            SIMULATOR ENGINE 2.0
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Asset-Heavy <span className="text-[#D8DA00]">Investment Simulator</span>
          </h1>
          <p className="text-lg text-[#8CB4BC] max-w-3xl mt-2">
            Interactive modeling workspace for dual-path investments. Compare the high-yield dynamics of our Electrolineras Premium network with the steady fractional returns of Good Energy Farms.
          </p>
        </div>

        <InvestmentSimulatorWorkspace />
      </div>
    </div>
  );
}