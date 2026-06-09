"use client";

import { useState } from 'react';
import { Wallet, CreditCard, ArrowUpRight, Activity, Server, FileCheck, Search, Banknote } from 'lucide-react';

const mockBatches = [
  { id: '1', period: 'May 2026', totalGross: 145000.00, energyCost: 25000.00, netMargin: 120000.00, platformFee: 36000.00, partnerUtility: 84000.00, status: 'SETTLED', date: '2026-06-01' },
  { id: '2', period: 'June 2026', totalGross: 160000.00, energyCost: 30000.00, netMargin: 130000.00, platformFee: 39000.00, partnerUtility: 91000.00, status: 'PROCESSING', date: '2026-06-30' },
  { id: '3', period: 'July 2026 (MTD)', totalGross: 45000.00, energyCost: 8000.00, netMargin: 37000.00, platformFee: 11100.00, partnerUtility: 25900.00, status: 'PENDING', date: 'N/A' }
];

export default function PagosPage() {
  const fmt = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#FFFDF0]">Automated Fee Splits Ledger</h1>
          <p className="text-[#8CB4BC] text-sm mt-1">30/70 Platform & Asset Partner distribution engine</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#D8DA00] hover:bg-[#D8DA00]/90 text-[#0D4651] font-semibold rounded-xl transition-colors text-sm">
          <Server className="w-4 h-4" />
          Run Batch Split Ledger
        </button>
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-[#0E4D58] p-4 rounded-xl border border-[#1A6B78]/50">
          <p className="text-xs text-[#8CB4BC] uppercase tracking-wider">Gross Billing (YTD)</p>
          <p className="text-xl font-bold text-[#FFFDF0] mt-1">{fmt(350000)}</p>
        </div>
        <div className="bg-[#0E4D58] p-4 rounded-xl border border-[#1A6B78]/50">
          <p className="text-xs text-[#8CB4BC] uppercase tracking-wider">Energy Inputs</p>
          <p className="text-xl font-bold text-red-400 mt-1">{fmt(63000)}</p>
        </div>
        <div className="bg-[#0A3A43] p-4 rounded-xl border border-[#D8DA00]/30 border-l-4 border-l-[#D8DA00]">
          <p className="text-xs text-[#D8DA00] uppercase tracking-wider font-bold">Good Energy Fee (30%)</p>
          <p className="text-xl font-bold text-[#FFFDF0] mt-1">{fmt(86100)}</p>
        </div>
        <div className="bg-[#0A3A43] p-4 rounded-xl border border-blue-400/30 border-l-4 border-l-blue-400">
          <p className="text-xs text-blue-400 uppercase tracking-wider font-bold">Partner Utility (70%)</p>
          <p className="text-xl font-bold text-[#FFFDF0] mt-1">{fmt(200900)}</p>
        </div>
      </div>

      {/* Transfer Verification Board */}
      <div className="bg-[#0E4D58] rounded-2xl border border-[#1A6B78]/50 overflow-hidden font-mono mt-6">
        <div className="bg-[#0A3A43]/40 px-6 py-4 border-b border-[#1A6B78]/30 flex items-center gap-3">
          <FileCheck className="w-5 h-5 text-[#D8DA00]" />
          <h2 className="text-lg font-bold text-[#FFFDF0] uppercase tracking-wider">Transfer Verification Board</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#0A3A43]/20 border-b border-[#1A6B78]/30 text-xs text-[#8CB4BC] uppercase tracking-wider text-left">
                <th className="px-6 py-4">Billing Period</th>
                <th className="px-6 py-4 text-right">Node Gross</th>
                <th className="px-6 py-4 text-right">Energy Cost</th>
                <th className="px-6 py-4 text-right">Platform Fee (30%)</th>
                <th className="px-6 py-4 text-right">Partner Payout (70%)</th>
                <th className="px-6 py-4 text-center">Batch Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A6B78]/20">
              {mockBatches.map((batch) => (
                <tr key={batch.id} className="hover:bg-[#0A3A43]/30 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-bold text-[#FFFDF0]">{batch.period}</span>
                    <span className="block text-xs text-[#8CB4BC] mt-1">Processed: {batch.date}</span>
                  </td>
                  <td className="px-6 py-4 text-right text-[#FFFDF0]">{fmt(batch.totalGross)}</td>
                  <td className="px-6 py-4 text-right text-red-400">{fmt(batch.energyCost)}</td>
                  <td className="px-6 py-4 text-right text-[#D8DA00] font-bold bg-[#D8DA00]/5">{fmt(batch.platformFee)}</td>
                  <td className="px-6 py-4 text-right text-blue-400 font-bold bg-blue-400/5">{fmt(batch.partnerUtility)}</td>
                  <td className="px-6 py-4 text-center">
                    {batch.status === 'SETTLED' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 text-green-400 text-xs font-bold rounded border border-green-500/20">
                        <Banknote className="w-3.5 h-3.5" /> SETTLED
                      </span>
                    ) : batch.status === 'PROCESSING' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/10 text-blue-400 text-xs font-bold rounded border border-blue-500/20">
                        <Activity className="w-3.5 h-3.5 animate-pulse" /> PROCESSING
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#8CB4BC]/10 text-[#8CB4BC] text-xs font-bold rounded border border-[#8CB4BC]/30">
                        <Wallet className="w-3.5 h-3.5" /> PENDING
                      </span>
                    )}
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
