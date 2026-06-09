"use client";

import { useState } from 'react';
import { Search, Zap, BatteryCharging, TrendingUp, Sun, Plug } from 'lucide-react';

const mockSessions = [
  { id: '1', node: 'SAN-02-BUCARAMANGA', tier: 'Tier 03 (240kW)', source: 'SOLAR_PARK', duration: 32, kwh: 95, grossBilling: 45.50, energyInputCost: 5.20, margin: 40.30, date: '2026-06-09T08:30:00' },
  { id: '2', node: 'GIR-01-INDUSTRIAL', tier: 'Tier 02 (120kW)', source: 'GRID', duration: 45, kwh: 70, grossBilling: 33.60, energyInputCost: 21.00, margin: 12.60, date: '2026-06-09T09:15:00' },
  { id: '3', node: 'MED-05-POBLADO', tier: 'Tier 01 (60kW)', source: 'SOLAR_PARK', duration: 25, kwh: 22, grossBilling: 10.56, energyInputCost: 1.20, margin: 9.36, date: '2026-06-09T10:05:00' },
  { id: '4', node: 'SAN-02-BUCARAMANGA', tier: 'Tier 03 (240kW)', source: 'GRID', duration: 18, kwh: 54, grossBilling: 25.92, energyInputCost: 16.20, margin: 9.72, date: '2026-06-09T11:20:00' },
];

export default function GrossMarginLedgerPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState('ALL');

  const fmt = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v);

  const filtered = mockSessions.filter(e => 
    (tierFilter === 'ALL' || e.tier.includes(tierFilter)) &&
    e.node.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#FFFDF0]">Grid Arbitrage Ledger</h1>
          <p className="text-[#8CB4BC] text-sm mt-1">Real-time margins from retail vehicle sessions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0E4D58] p-4 rounded-xl border border-[#1A6B78]/50">
          <p className="text-xs text-[#8CB4BC] uppercase tracking-wider">Total Gross Billing</p>
          <p className="text-xl font-bold text-[#FFFDF0] mt-1">{fmt(115.58)}</p>
        </div>
        <div className="bg-[#0E4D58] p-4 rounded-xl border border-[#1A6B78]/50">
          <p className="text-xs text-[#8CB4BC] uppercase tracking-wider">Energy Input Cost</p>
          <p className="text-xl font-bold text-red-400 mt-1">{fmt(43.60)}</p>
        </div>
        <div className="bg-[#0E4D58] p-4 rounded-xl border border-[#1A6B78]/50 border-t-4 border-t-[#D8DA00]">
          <p className="text-xs text-[#D8DA00] uppercase tracking-wider font-bold">Net Gross Margin</p>
          <p className="text-2xl font-bold text-[#FFFDF0] mt-1">{fmt(71.98)}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8CB4BC]" />
          <input type="text" placeholder="Search by Node ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#0E4D58] border border-[#1A6B78]/50 rounded-xl text-[#FFFDF0] placeholder-[#8CB4BC]/50 focus:outline-none focus:border-[#D8DA00]/50 text-sm" />
        </div>
        <select value={tierFilter} onChange={(e) => setTierFilter(e.target.value)}
          className="px-4 py-2.5 bg-[#0E4D58] border border-[#1A6B78]/50 rounded-xl text-[#FFFDF0] focus:outline-none focus:border-[#D8DA00]/50 text-sm font-mono">
          <option value="ALL">All Tiers</option>
          <option value="Tier 01">Tier 01 (60kW)</option>
          <option value="Tier 02">Tier 02 (120kW)</option>
          <option value="Tier 03">Tier 03 (240kW)</option>
        </select>
      </div>

      <div className="bg-[#0E4D58] rounded-2xl border border-[#1A6B78]/50 overflow-hidden font-mono">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#0A3A43]/40 border-b border-[#1A6B78]/30">
                <th className="text-left px-6 py-4 text-xs font-bold text-[#8CB4BC] uppercase">Hardware Node</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-[#8CB4BC] uppercase">Energy Source</th>
                <th className="text-center px-6 py-4 text-xs font-bold text-[#8CB4BC] uppercase">Dispensed</th>
                <th className="text-right px-6 py-4 text-xs font-bold text-[#8CB4BC] uppercase">Gross Billing</th>
                <th className="text-right px-6 py-4 text-xs font-bold text-[#8CB4BC] uppercase">Input Cost</th>
                <th className="text-right px-6 py-4 text-xs font-bold text-[#8CB4BC] uppercase">Gross Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A6B78]/20">
              {filtered.map((e) => (
                <tr key={e.id} className="hover:bg-[#0A3A43]/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-[#FFFDF0]">{e.node}</div>
                    <div className="text-xs text-[#8CB4BC] mt-0.5">{e.tier}</div>
                  </td>
                  <td className="px-6 py-4">
                    {e.source === 'SOLAR_PARK' ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-[#D8DA00]/10 text-[#D8DA00] text-xs font-bold rounded border border-[#D8DA00]/20">
                        <Sun className="w-3.5 h-3.5" /> SOLAR PARK
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-red-500/10 text-red-400 text-xs font-bold rounded border border-red-500/20">
                        <Plug className="w-3.5 h-3.5" /> GRID IMPORT
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-[#FFFDF0]">{e.kwh} kWh</span>
                    <span className="block text-xs text-[#8CB4BC]">{e.duration} min</span>
                  </td>
                  <td className="px-6 py-4 text-right text-[#FFFDF0]">{fmt(e.grossBilling)}</td>
                  <td className="px-6 py-4 text-right text-red-400">{fmt(e.energyInputCost)}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-[#D8DA00] font-bold text-base bg-[#D8DA00]/5 px-2 py-1 rounded">{fmt(e.margin)}</span>
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
