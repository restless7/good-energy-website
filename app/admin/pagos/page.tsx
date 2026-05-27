"use client";

import { Wallet, CreditCard, ArrowUpRight } from 'lucide-react';

export default function PagosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#FFFDF0]">Pagos</h1>
        <p className="text-[#8CB4BC] text-sm mt-1">Procesamiento y registro de pagos a inversionistas</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0E4D58] p-4 rounded-xl border border-[#1A6B78]/50">
          <p className="text-xs text-[#8CB4BC]">Pagos Este Mes</p>
          <p className="text-xl font-bold text-[#FFFDF0] mt-1">12</p>
        </div>
        <div className="bg-[#0E4D58] p-4 rounded-xl border border-[#1A6B78]/50">
          <p className="text-xs text-[#8CB4BC]">Total Desembolsado</p>
          <p className="text-xl font-bold text-[#D8DA00] mt-1">$42.5M COP</p>
        </div>
        <div className="bg-[#0E4D58] p-4 rounded-xl border border-[#1A6B78]/50">
          <p className="text-xs text-[#8CB4BC]">Próximo Ciclo</p>
          <p className="text-xl font-bold text-[#8CB4BC] mt-1">Jun 1, 2026</p>
        </div>
      </div>

      <div className="bg-[#0E4D58] rounded-2xl border border-[#1A6B78]/50 p-12 text-center">
        <Wallet className="w-12 h-12 text-[#1A6B78] mx-auto mb-4" />
        <h3 className="text-lg font-medium text-[#FFFDF0] mb-2">Módulo de Pagos</h3>
        <p className="text-[#8CB4BC] text-sm max-w-md mx-auto">
          Aquí podrás procesar pagos masivos, generar comprobantes y llevar el registro de transferencias a inversionistas.
        </p>
      </div>
    </div>
  );
}
