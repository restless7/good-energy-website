"use client";

import { useState } from 'react';
import { DollarSign, Search, Plus, Filter, TrendingUp, ArrowUpRight } from 'lucide-react';
import { useRBAC } from '@/hooks/useRBAC';

const mockInvestments = [
  { id: '1', investor: 'Carlos Mendoza', type: 'Premium', amount: 75000000, roi: 15.5, status: 'Activa', plant: 'Planta Norte', startDate: '2025-06-01', maturityDate: '2026-06-01' },
  { id: '2', investor: 'Carlos Mendoza', type: 'Crecimiento', amount: 50000000, roi: 12.0, status: 'Activa', plant: 'Planta Sur', startDate: '2025-08-15', maturityDate: '2026-08-15' },
  { id: '3', investor: 'Ana López', type: 'Base', amount: 30000000, roi: 10.0, status: 'Activa', plant: 'Planta Norte', startDate: '2025-09-01', maturityDate: '2026-09-01' },
  { id: '4', investor: 'María García', type: 'Premium', amount: 100000000, roi: 16.2, status: 'Completada', plant: 'Planta Centro', startDate: '2024-12-01', maturityDate: '2025-12-01' },
];

export default function InversionesPage() {
  const { isSuperAdmin, canAction } = useRBAC();
  const [searchTerm, setSearchTerm] = useState('');

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);

  const filtered = mockInvestments.filter(inv =>
    inv.investor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#FFFDF0]">Inversiones</h1>
          <p className="text-[#8CB4BC] text-sm mt-1">Gestiona todas las inversiones de la plataforma</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#D8DA00] hover:bg-[#D8DA00]/90 text-[#0D4651] font-semibold rounded-xl transition-colors text-sm">
          <Plus className="w-4 h-4" />
          Nueva Inversión
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0E4D58] p-4 rounded-xl border border-[#1A6B78]/50">
          <p className="text-xs text-[#8CB4BC]">Total Invertido</p>
          <p className="text-xl font-bold text-[#FFFDF0] mt-1">{formatCurrency(255000000)}</p>
        </div>
        <div className="bg-[#0E4D58] p-4 rounded-xl border border-[#1A6B78]/50">
          <p className="text-xs text-[#8CB4BC]">Inversiones Activas</p>
          <p className="text-xl font-bold text-[#D8DA00] mt-1">3</p>
        </div>
        <div className="bg-[#0E4D58] p-4 rounded-xl border border-[#1A6B78]/50">
          <p className="text-xs text-[#8CB4BC]">ROI Promedio</p>
          <p className="text-xl font-bold text-[#FFFDF0] mt-1">13.4%</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8CB4BC]" />
        <input
          type="text"
          placeholder="Buscar inversiones..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-[#0E4D58] border border-[#1A6B78]/50 rounded-xl text-[#FFFDF0] placeholder-[#8CB4BC]/50 focus:outline-none focus:border-[#D8DA00]/50 text-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-[#0E4D58] rounded-2xl border border-[#1A6B78]/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1A6B78]/30">
                <th className="text-left px-6 py-4 text-xs font-medium text-[#8CB4BC] uppercase tracking-wider">Inversionista</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-[#8CB4BC] uppercase tracking-wider">Tipo</th>
                <th className="text-right px-6 py-4 text-xs font-medium text-[#8CB4BC] uppercase tracking-wider">Monto</th>
                <th className="text-center px-6 py-4 text-xs font-medium text-[#8CB4BC] uppercase tracking-wider">ROI</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-[#8CB4BC] uppercase tracking-wider">Planta</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-[#8CB4BC] uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A6B78]/20">
              {filtered.map((inv) => (
                <tr key={inv.id} className="hover:bg-[#0A3A43]/30 transition-colors cursor-pointer">
                  <td className="px-6 py-4 text-sm font-medium text-[#FFFDF0]">{inv.investor}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      inv.type === 'Premium' ? 'bg-[#D8DA00]/10 text-[#D8DA00]' :
                      inv.type === 'Crecimiento' ? 'bg-blue-500/10 text-blue-400' :
                      'bg-[#8CB4BC]/10 text-[#8CB4BC]'
                    }`}>
                      {inv.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-[#FFFDF0]">{formatCurrency(inv.amount)}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-medium text-[#D8DA00]">{inv.roi}%</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#8CB4BC]">{inv.plant}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      inv.status === 'Activa' ? 'bg-green-500/10 text-green-400' : 'bg-[#8CB4BC]/10 text-[#8CB4BC]'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
