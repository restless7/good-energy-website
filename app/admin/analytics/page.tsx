"use client";

import { BarChart3, TrendingUp, Users, Eye } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#FFFDF0]">Analytics</h1>
        <p className="text-[#8CB4BC] text-sm mt-1">Métricas y estadísticas de la plataforma</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-[#0E4D58] p-4 rounded-xl border border-[#1A6B78]/50">
          <p className="text-xs text-[#8CB4BC]">Visitas al Sitio</p>
          <p className="text-xl font-bold text-[#FFFDF0] mt-1">1,247</p>
          <p className="text-[10px] text-[#D8DA00] mt-1">+18% este mes</p>
        </div>
        <div className="bg-[#0E4D58] p-4 rounded-xl border border-[#1A6B78]/50">
          <p className="text-xs text-[#8CB4BC]">Usuarios Registrados</p>
          <p className="text-xl font-bold text-[#FFFDF0] mt-1">89</p>
        </div>
        <div className="bg-[#0E4D58] p-4 rounded-xl border border-[#1A6B78]/50">
          <p className="text-xs text-[#8CB4BC]">Tasa de Conversión</p>
          <p className="text-xl font-bold text-[#D8DA00] mt-1">4.2%</p>
        </div>
        <div className="bg-[#0E4D58] p-4 rounded-xl border border-[#1A6B78]/50">
          <p className="text-xs text-[#8CB4BC]">Simulaciones</p>
          <p className="text-xl font-bold text-[#FFFDF0] mt-1">312</p>
        </div>
      </div>

      <div className="bg-[#0E4D58] rounded-2xl border border-[#1A6B78]/50 p-12 text-center">
        <BarChart3 className="w-12 h-12 text-[#D8DA00] mx-auto mb-4" />
        <h3 className="text-lg font-medium text-[#FFFDF0] mb-2">Panel de Analytics</h3>
        <p className="text-[#8CB4BC] text-sm max-w-md mx-auto">
          Gráficos de tráfico, embudos de conversión y métricas de engagement serán implementados aquí.
        </p>
      </div>
    </div>
  );
}
