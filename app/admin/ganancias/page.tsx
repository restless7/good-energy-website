"use client";

import { useState } from 'react';
import { TrendingUp, Search, DollarSign, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const mockEarnings = [
  { id: '1', investor: 'Carlos Mendoza', amount: 3750000, netAmount: 3375000, status: 'Pagado', paymentDate: '2026-05-01', investmentType: 'Premium' },
  { id: '2', investor: 'Ana López', amount: 1500000, netAmount: 1350000, status: 'Pendiente', paymentDate: null, investmentType: 'Base' },
  { id: '3', investor: 'María García', amount: 6500000, netAmount: 5850000, status: 'Procesando', paymentDate: null, investmentType: 'Premium' },
];

export default function GananciasPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const fmt = (v: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v);

  const filtered = mockEarnings.filter(e => e.investor.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#FFFDF0]">Ganancias</h1>
          <p className="text-[#8CB4BC] text-sm mt-1">Distribución y seguimiento de rendimientos</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#D8DA00] hover:bg-[#D8DA00]/90 text-[#0D4651] font-semibold rounded-xl transition-colors text-sm">
          <DollarSign className="w-4 h-4" />
          Distribuir Ganancias
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0E4D58] p-4 rounded-xl border border-[#1A6B78]/50">
          <p className="text-xs text-[#8CB4BC]">Total Distribuido</p>
          <p className="text-xl font-bold text-[#FFFDF0] mt-1">{fmt(14250000)}</p>
        </div>
        <div className="bg-[#0E4D58] p-4 rounded-xl border border-[#1A6B78]/50">
          <p className="text-xs text-[#8CB4BC]">Pendiente de Pago</p>
          <p className="text-xl font-bold text-orange-400 mt-1">{fmt(1500000)}</p>
        </div>
        <div className="bg-[#0E4D58] p-4 rounded-xl border border-[#1A6B78]/50">
          <p className="text-xs text-[#8CB4BC]">Retención Fiscal</p>
          <p className="text-xl font-bold text-[#8CB4BC] mt-1">{fmt(1425000)}</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8CB4BC]" />
        <input type="text" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-[#0E4D58] border border-[#1A6B78]/50 rounded-xl text-[#FFFDF0] placeholder-[#8CB4BC]/50 focus:outline-none focus:border-[#D8DA00]/50 text-sm" />
      </div>

      <div className="bg-[#0E4D58] rounded-2xl border border-[#1A6B78]/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1A6B78]/30">
                <th className="text-left px-6 py-4 text-xs font-medium text-[#8CB4BC] uppercase">Inversionista</th>
                <th className="text-right px-6 py-4 text-xs font-medium text-[#8CB4BC] uppercase">Bruto</th>
                <th className="text-right px-6 py-4 text-xs font-medium text-[#8CB4BC] uppercase">Neto</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-[#8CB4BC] uppercase">Plan</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-[#8CB4BC] uppercase">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A6B78]/20">
              {filtered.map((e) => (
                <tr key={e.id} className="hover:bg-[#0A3A43]/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-[#FFFDF0]">{e.investor}</td>
                  <td className="px-6 py-4 text-right text-sm text-[#FFFDF0]">{fmt(e.amount)}</td>
                  <td className="px-6 py-4 text-right text-sm text-[#D8DA00] font-medium">{fmt(e.netAmount)}</td>
                  <td className="px-6 py-4 text-sm text-[#8CB4BC]">{e.investmentType}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {e.status === 'Pagado' ? <CheckCircle className="w-4 h-4 text-green-400" /> :
                       e.status === 'Pendiente' ? <Clock className="w-4 h-4 text-orange-400" /> :
                       <AlertCircle className="w-4 h-4 text-blue-400" />}
                      <span className="text-sm text-[#FFFDF0]/80">{e.status}</span>
                    </div>
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
