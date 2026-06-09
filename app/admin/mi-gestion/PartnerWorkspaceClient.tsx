'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Zap,
  Activity,
  Download,
  AlertTriangle,
  BatteryCharging,
  Clock,
  Banknote,
  ShieldAlert
} from 'lucide-react'

// Define the shape of our mock backend payload for this workspace
interface PartnerWorkspaceProps {
  profile: any; // Legacy profile data
  currentUserId: string;
  isSuperAdmin: boolean;
  activePartners?: { id: string; name: string }[];
}

export default function PartnerWorkspaceClient({ profile, isSuperAdmin, activePartners = [] }: PartnerWorkspaceProps) {
  const router = useRouter();

  // MOCK: In production, this would come securely from the `profile` backend record
  const [classification, setClassification] = useState<'SPACE_PARTNER' | 'ASSET_OWNER'>('SPACE_PARTNER');

  const fmt = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v);

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1A6B78]/50 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#FFFDF0]">Transparency Engine: Mi Gestión</h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm font-medium text-[#8CB4BC] uppercase tracking-wider">
              {classification === 'SPACE_PARTNER' ? 'Portal de Rentista (Space Partner)' : 'Portal de Inversión (Asset Owner)'}
            </p>
            {isSuperAdmin && (
              <select
                value={classification}
                onChange={(e) => setClassification(e.target.value as any)}
                className="ml-4 px-2 py-1 bg-[#0A3A43] border border-red-500/50 text-red-400 rounded-lg text-xs font-bold focus:outline-none cursor-pointer"
              >
                <option value="SPACE_PARTNER">ADMIN: View as Space Partner</option>
                <option value="ASSET_OWNER">ADMIN: View as Asset Owner</option>
              </select>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-400 rounded-lg text-sm font-bold border border-green-500/20">
            <Activity className="w-4 h-4 animate-pulse" /> SYSTEM ONLINE
          </div>
        </div>
      </div>

      {classification === 'SPACE_PARTNER' ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Live Scoreboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#052126] p-5 rounded-2xl border border-[#1A6B78]/50 shadow-xl relative overflow-hidden">
              <Zap className="absolute -right-4 -top-4 w-20 h-20 text-[#1A6B78]/10" />
              <p className="text-xs text-[#8CB4BC] uppercase tracking-wider font-bold">Node Utilization</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-[#D8DA00]">24.2%</span>
                <span className="text-xs text-green-400 font-bold">↑ 2.1%</span>
              </div>
              <p className="text-[10px] text-[#8CB4BC]/70 mt-1">Target Breakeven: 18.0%</p>
            </div>
            <div className="bg-[#052126] p-5 rounded-2xl border border-[#1A6B78]/50 shadow-xl relative overflow-hidden">
              <Activity className="absolute -right-4 -top-4 w-20 h-20 text-[#1A6B78]/10" />
              <p className="text-xs text-[#8CB4BC] uppercase tracking-wider font-bold">Volume Dispatched</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-[#FFFDF0]">14,200</span>
                <span className="text-xs text-[#8CB4BC] font-bold">kWh</span>
              </div>
              <p className="text-[10px] text-[#8CB4BC]/70 mt-1">Rolling 30 Days</p>
            </div>
            <div className="bg-[#0A3A43] p-5 rounded-2xl border border-blue-500/30 shadow-xl relative overflow-hidden">
              <p className="text-xs text-blue-400 uppercase tracking-wider font-bold">Grid Spot vs LCOE Ratio</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-[#FFFDF0]">3.4x</span>
                <span className="text-xs text-blue-400 font-bold">Arbitrage Margin</span>
              </div>
              <div className="w-full bg-[#052126] h-1.5 mt-3 rounded-full overflow-hidden">
                <div className="bg-blue-400 h-full w-[75%] rounded-full" />
              </div>
            </div>
          </div>

          {/* Dynamic Clearing Ledger */}
          <div className="bg-[#052126] rounded-2xl border border-[#1A6B78]/50 overflow-hidden font-mono shadow-xl">
            <div className="bg-[#0A3A43]/60 px-6 py-4 border-b border-[#1A6B78]/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Banknote className="w-5 h-5 text-[#D8DA00]" />
                <h2 className="text-lg font-bold text-[#FFFDF0] uppercase tracking-wider">Dynamic Clearing Ledger</h2>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#0A3A43]/20 border-b border-[#1A6B78]/30 text-[10px] text-[#8CB4BC] uppercase tracking-widest text-left">
                    <th className="px-6 py-4">Settlement Cycle</th>
                    <th className="px-6 py-4 text-right">Node Gross</th>
                    <th className="px-6 py-4 text-right">30% Platform Fee</th>
                    <th className="px-6 py-4 text-right">70% Net Payout</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-right">Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A6B78]/20 text-[#FFFDF0]">
                  <tr className="hover:bg-[#0A3A43]/30 transition-colors">
                    <td className="px-6 py-4">Jun 1 - Jun 15, 2026</td>
                    <td className="px-6 py-4 text-right">{fmt(4500000)}</td>
                    <td className="px-6 py-4 text-right text-red-400">-{fmt(1350000)}</td>
                    <td className="px-6 py-4 text-right font-bold text-[#D8DA00]">{fmt(3150000)}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 text-green-400 text-[10px] font-bold rounded border border-green-500/20">
                        SETTLED
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-[#8CB4BC] hover:text-[#D8DA00] transition-colors"><Download className="w-4 h-4 inline" /></button>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#0A3A43]/30 transition-colors">
                    <td className="px-6 py-4">Jun 16 - Jun 30, 2026</td>
                    <td className="px-6 py-4 text-right">{fmt(5100000)}</td>
                    <td className="px-6 py-4 text-right text-red-400">-{fmt(1530000)}</td>
                    <td className="px-6 py-4 text-right font-bold text-[#D8DA00]">{fmt(3570000)}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded border border-blue-500/20">
                        PROCESSING
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-[#8CB4BC]/40"><Download className="w-4 h-4 inline" /></span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Hardware Integrity Registry */}
          <div className="bg-[#052126] rounded-2xl border border-[#1A6B78]/50 overflow-hidden shadow-xl">
            <div className="bg-[#0A3A43]/60 px-6 py-5 border-b border-[#1A6B78]/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-[#FFFDF0] flex items-center gap-2">
                  <BatteryCharging className="w-5 h-5 text-[#D8DA00]" /> Hardware Integrity Registry
                </h2>
                <p className="text-xs text-[#8CB4BC] mt-1">Serial: SN-2026-MED-05-POBLADO</p>
              </div>
              <div className="flex items-center gap-4 bg-[#052126] px-4 py-2 rounded-xl border border-[#1A6B78]/30">
                <Clock className="w-4 h-4 text-[#8CB4BC]" />
                <div className="text-right">
                  <p className="text-[10px] text-[#8CB4BC] uppercase tracking-wider font-bold">Factory Warranty</p>
                  <p className="text-sm font-bold text-[#FFFDF0]">24 Months Remaining</p>
                </div>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Active Current Load */}
              <div className="space-y-4">
                <div className="flex justify-between items-end border-b border-[#1A6B78]/30 pb-2">
                  <span className="text-xs text-[#8CB4BC] uppercase tracking-wider font-bold">Active Current Load</span>
                  <span className="text-2xl font-bold text-[#D8DA00]">120 kW</span>
                </div>
                <div className="w-full bg-[#0A3A43] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#D8DA00] h-full w-[50%] rounded-full" />
                </div>
              </div>

              {/* Status Shield */}
              <div className="bg-[#0A3A43]/40 p-5 rounded-xl border border-[#D8DA00]/30 flex flex-col items-center justify-center text-center">
                <ShieldAlert className="w-8 h-8 text-[#D8DA00] mb-3" />
                <h3 className="text-sm font-bold text-[#D8DA00] uppercase tracking-widest mb-1">Estatus del Activo: Optimización de Ubicación en Progreso</h3>
                <p className="text-xs text-[#8CB4BC]">
                  La utilización bajó al 14.5% (umbral del 18%). El ecosistema está reubicando el activo hacia una zona de alta demanda para defender tu TIR del 22-26%.
                </p>
              </div>
            </div>
          </div>

          {/* Asset Owner Yield Ledger */}
          <div className="bg-[#052126] rounded-2xl border border-[#1A6B78]/50 overflow-hidden font-mono shadow-xl">
             <div className="bg-[#0A3A43]/60 px-6 py-4 border-b border-[#1A6B78]/30">
                <h2 className="text-sm font-bold text-[#FFFDF0] uppercase tracking-wider">Asset Yield Ledger</h2>
             </div>
             <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#0A3A43]/20 border-b border-[#1A6B78]/30 text-[10px] text-[#8CB4BC] uppercase tracking-widest text-left">
                    <th className="px-6 py-4">Settlement Cycle</th>
                    <th className="px-6 py-4 text-right">Node Gross</th>
                    <th className="px-6 py-4 text-right">Admin (10%) & Gateway (5%)</th>
                    <th className="px-6 py-4 text-right">Full Net Yield</th>
                    <th className="px-6 py-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A6B78]/20 text-[#FFFDF0]">
                  <tr className="hover:bg-[#0A3A43]/30 transition-colors">
                    <td className="px-6 py-4">Jun 1 - Jun 15, 2026</td>
                    <td className="px-6 py-4 text-right">{fmt(12000000)}</td>
                    <td className="px-6 py-4 text-right text-red-400">-{fmt(1800000)}</td>
                    <td className="px-6 py-4 text-right font-bold text-[#D8DA00]">{fmt(10200000)}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 text-green-400 text-[10px] font-bold rounded border border-green-500/20">
                        DEPOSITED
                      </span>
                    </td>
                  </tr>
                </tbody>
             </table>
          </div>
        </div>
      )}
    </div>
  );
}
