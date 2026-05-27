"use client";

import { Zap, Sun, TrendingUp } from 'lucide-react';

export default function ProduccionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#FFFDF0]">Producción de Energía</h1>
        <p className="text-[#8CB4BC] text-sm mt-1">Monitoreo en tiempo real de generación energética</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0E4D58] p-4 rounded-xl border border-[#1A6B78]/50">
          <p className="text-xs text-[#8CB4BC]">Generación Hoy</p>
          <p className="text-xl font-bold text-[#D8DA00] mt-1">145 kWh</p>
        </div>
        <div className="bg-[#0E4D58] p-4 rounded-xl border border-[#1A6B78]/50">
          <p className="text-xs text-[#8CB4BC]">Este Mes</p>
          <p className="text-xl font-bold text-[#FFFDF0] mt-1">3,420 kWh</p>
        </div>
        <div className="bg-[#0E4D58] p-4 rounded-xl border border-[#1A6B78]/50">
          <p className="text-xs text-[#8CB4BC]">Eficiencia</p>
          <p className="text-xl font-bold text-green-400 mt-1">94.2%</p>
        </div>
      </div>

      <div className="bg-[#0E4D58] rounded-2xl border border-[#1A6B78]/50 p-12 text-center">
        <Zap className="w-12 h-12 text-[#D8DA00] mx-auto mb-4" />
        <h3 className="text-lg font-medium text-[#FFFDF0] mb-2">Dashboard de Producción</h3>
        <p className="text-[#8CB4BC] text-sm max-w-md mx-auto">
          Gráficos de producción energética, eficiencia por planta y métricas históricas serán implementados aquí.
        </p>
      </div>
    </div>
  );
}
