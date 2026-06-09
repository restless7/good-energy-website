"use client";

import { useState } from 'react';
import { Search, Plus, Upload, CheckCircle2, FileText, Lock, Unlock } from 'lucide-react';
import { useRBAC } from '@/hooks/useRBAC';

const mockInvestments = [
  {
    id: '1', investor: 'Alejandro Gomez', type: 'Foundational', amount: 250000, status: 'Activa', node: 'Node-Bucaramanga-Centro',
    drawdowns: [
      { id: 'd1', phase: 'Phase 01: Hardware Import', description: 'Bills of Lading / Custom clearance validation', percent: 50, amount: 125000, status: 'DISBURSED', pdfUrl: 'bill_of_lading_BG.pdf' },
      { id: 'd2', phase: 'Phase 02: Civil Works', description: 'Civil engineering sign-off / Padmounted transformer placement', percent: 20, amount: 50000, status: 'ESCROWED', pdfUrl: null },
      { id: 'd3', phase: 'Phase 03: Energization', description: 'RETIE Inspection Approval & App Store deployment', percent: 30, amount: 75000, status: 'ESCROWED', pdfUrl: null },
    ]
  },
  {
    id: '2', investor: 'Ana López', type: 'Growth', amount: 100000, status: 'Activa', node: 'Node-Medellin-Poblado',
    drawdowns: [
      { id: 'd4', phase: 'Phase 01: Hardware Import', description: 'Bills of Lading / Custom clearance validation', percent: 50, amount: 50000, status: 'DISBURSED', pdfUrl: 'bill_of_lading_MD.pdf' },
      { id: 'd5', phase: 'Phase 02: Civil Works', description: 'Civil engineering sign-off / Padmounted transformer placement', percent: 20, amount: 20000, status: 'DISBURSED', pdfUrl: 'civil_signoff.pdf' },
      { id: 'd6', phase: 'Phase 03: Energization', description: 'RETIE Inspection Approval & App Store deployment', percent: 30, amount: 30000, status: 'ESCROWED', pdfUrl: null },
    ]
  }
];

export default function InversionesPage() {
  const { isSuperAdmin } = useRBAC();
  const [searchTerm, setSearchTerm] = useState('');

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

  const filtered = mockInvestments.filter(inv =>
    inv.investor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.node.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#FFFDF0]">Capital Drawdown Tracker</h1>
          <p className="text-[#8CB4BC] text-sm mt-1">Multi-step administrative verification & disbursement</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0E4D58] p-4 rounded-xl border border-[#1A6B78]/50">
          <p className="text-xs text-[#8CB4BC] uppercase tracking-wider">Total Escrowed (Pending)</p>
          <p className="text-xl font-bold text-[#FFFDF0] mt-1">{formatCurrency(155000)}</p>
        </div>
        <div className="bg-[#0E4D58] p-4 rounded-xl border border-[#1A6B78]/50">
          <p className="text-xs text-[#8CB4BC] uppercase tracking-wider">Total Disbursed (Released)</p>
          <p className="text-xl font-bold text-[#D8DA00] mt-1">{formatCurrency(195000)}</p>
        </div>
        <div className="bg-[#0E4D58] p-4 rounded-xl border border-[#1A6B78]/50">
          <p className="text-xs text-[#8CB4BC] uppercase tracking-wider">Active Deployments</p>
          <p className="text-xl font-bold text-[#FFFDF0] mt-1">2 Nodes</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8CB4BC]" />
        <input
          type="text"
          placeholder="Search by investor or node..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-[#0E4D58] border border-[#1A6B78]/50 rounded-xl text-[#FFFDF0] placeholder-[#8CB4BC]/50 focus:outline-none focus:border-[#D8DA00]/50 text-sm"
        />
      </div>

      {/* Drawdown Multi-Step Tables */}
      <div className="space-y-6">
        {filtered.map((inv) => (
          <div key={inv.id} className="bg-[#0E4D58] rounded-2xl border border-[#1A6B78]/50 overflow-hidden font-mono">
            {/* Investment Context Header */}
            <div className="bg-[#0A3A43]/60 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1A6B78]/30">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-[#FFFDF0] uppercase">{inv.node}</h3>
                  <span className="px-2 py-0.5 bg-[#1A6B78]/30 text-[#8CB4BC] text-xs rounded">{inv.type}</span>
                </div>
                <p className="text-sm text-[#8CB4BC] mt-1">Sponsor: <span className="text-[#FFFDF0]">{inv.investor}</span> | Total Placed: {formatCurrency(inv.amount)}</p>
              </div>
            </div>

            {/* Verification Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#0A3A43]/20 border-b border-[#1A6B78]/30 text-xs text-[#8CB4BC] uppercase tracking-wider text-left">
                    <th className="px-6 py-3">Mobilization Phase</th>
                    <th className="px-6 py-3">Requirement</th>
                    <th className="px-6 py-3 text-right">Allocation</th>
                    <th className="px-6 py-3 text-center">Documentation</th>
                    <th className="px-6 py-3 text-right">Disbursement State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A6B78]/20">
                  {inv.drawdowns.map((drawdown) => (
                    <tr key={drawdown.id} className="hover:bg-[#0A3A43]/30 transition-colors group">
                      <td className="px-6 py-4">
                        <span className="font-bold text-[#FFFDF0]">{drawdown.phase}</span>
                      </td>
                      <td className="px-6 py-4 text-[#8CB4BC] text-xs max-w-xs leading-relaxed">
                        {drawdown.description}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="block text-[#FFFDF0] font-bold">{formatCurrency(drawdown.amount)}</span>
                        <span className="text-xs text-[#8CB4BC]">{drawdown.percent}% Advance</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {drawdown.pdfUrl ? (
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#1A6B78]/20 border border-[#1A6B78] rounded-lg text-[#8CB4BC]">
                            <FileText className="w-4 h-4 text-blue-400" />
                            <span className="text-xs truncate max-w-[100px]">{drawdown.pdfUrl}</span>
                          </div>
                        ) : (
                          <button className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#D8DA00]/10 hover:bg-[#D8DA00]/20 text-[#D8DA00] border border-[#D8DA00]/30 rounded-lg transition-colors text-xs font-semibold">
                            <Upload className="w-3.5 h-3.5" />
                            Upload PDF
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {drawdown.status === 'DISBURSED' ? (
                          <div className="inline-flex flex-col items-end">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 text-green-400 text-xs font-bold rounded border border-green-500/20">
                              <Unlock className="w-3.5 h-3.5" /> DISBURSED
                            </span>
                          </div>
                        ) : (
                          <div className="inline-flex flex-col items-end">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#8CB4BC]/10 text-[#8CB4BC] text-xs font-bold rounded border border-[#8CB4BC]/30">
                              <Lock className="w-3.5 h-3.5" /> ESCROWED
                            </span>
                            {drawdown.pdfUrl && (
                              <button className="mt-2 text-xs text-[#D8DA00] hover:underline underline-offset-2 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Approve Release
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
