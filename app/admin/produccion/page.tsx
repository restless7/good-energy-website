"use client";

import { Zap, Activity, BatteryCharging, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

const mockNodes = [
  { 
    id: '1', 
    name: 'SAN-02-BUCARAMANGA', 
    mode: '24/7 Active', 
    load: 180, 
    status: 'Normal', 
    warranty: '24mo Factory Warranty Active', 
    utilization: 24.2, 
    breakeven: 18.0, 
    volume: 14200, 
    volumeTarget: '12,000 kWh (Tier 2)', 
    dwell: 28, 
    dwellTarget: '20-40 Minute Target',
    plugs: [
      { id: 'Plug 01', state: 'Charging (CCS2)' },
      { id: 'Plug 02', state: 'Idle' }
    ]
  },
  { 
    id: '2', 
    name: 'MED-05-POBLADO', 
    mode: '24/7 Active', 
    load: 45, 
    status: 'Warning', 
    warranty: '12mo Factory Warranty Active', 
    utilization: 14.5, 
    breakeven: 18.0, 
    volume: 5800, 
    volumeTarget: '8,000 kWh (Tier 1)', 
    dwell: 15, 
    dwellTarget: '20-40 Minute Target',
    plugs: [
      { id: 'Plug 01', state: 'Idle' },
      { id: 'Plug 02', state: 'Idle' }
    ]
  }
];

// Mock algorithm data that would come from lib/analytics/assetPortability.ts matching SimulatedScenario
const recommendedLeads = {
  '2': { leadName: 'Parque Comercial El Tesoro (Lead L1)', matchScore: 92, targetTier: 'Tier 01' }
};

export default function DispatchDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#1A6B78]/50 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#FFFDF0]">Network Dispatch & Operations Dashboard</h1>
          <p className="text-[#8CB4BC] text-sm mt-1">Autonomous fleet routing, grid arbitrage, and asset portability</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-400 rounded-lg text-sm font-bold border border-green-500/20">
            <Activity className="w-4 h-4 animate-pulse" /> NETWORK OK
          </div>
        </div>
      </div>

      {/* Module 1: XM Grid Integration & Dynamic Arbitrage Engine */}
      <div className="bg-[#052126] p-5 rounded-xl border border-[#1A6B78]/50 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
            <Zap className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-[#FFFDF0] font-bold">Live XM Grid Spot Price (Precio de Bolsa)</h3>
            <p className="text-[#8CB4BC] text-xs">Sistema Interconectado Nacional (SIN)</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-[10px] text-[#8CB4BC] uppercase tracking-widest">Local Solar LCOE</p>
            <p className="font-mono text-[#FFFDF0] font-bold">250 COP / kWh</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-[#8CB4BC] uppercase tracking-widest">Current Grid Spot</p>
            <p className="font-mono text-red-400 font-bold animate-pulse">850 COP / kWh</p>
          </div>
          <div className="bg-red-500/20 text-red-400 px-4 py-2 rounded border border-red-500/30 text-xs font-bold flex flex-col">
            <span>ARBITRAGE EVENT ACTIVE</span>
            <span className="text-[10px] opacity-80 mt-0.5">Switching sourcing to local solar & grid injection</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {mockNodes.map((node) => (
          <div key={node.id} className="bg-[#052126] rounded-xl border-2 border-[#1A6B78]/50 overflow-hidden font-mono text-sm shadow-xl">
            {/* Header */}
            <div className="bg-[#0A3A43] px-4 py-3 border-b-2 border-[#1A6B78]/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BatteryCharging className="w-5 h-5 text-[#D8DA00]" />
                <span className="font-bold text-[#FFFDF0] uppercase tracking-widest">NETWORK DISPATCH NODE: [{node.name}]</span>
              </div>
            </div>

            {/* Top Specs */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#1A6B78]/50 border-b-2 border-[#1A6B78]/50">
              <div className="p-4 space-y-2">
                <p className="text-[#8CB4BC]">Operational Mode: <span className="text-[#FFFDF0] font-bold">{node.mode}</span></p>
                <p className="text-[#8CB4BC]">Hardware Status: <span className={`font-bold ${node.status === 'Normal' ? 'text-green-400' : 'text-orange-400'}`}>{node.status} ({node.warranty})</span></p>
              </div>
              <div className="p-4 flex items-center">
                <p className="text-[#8CB4BC]">Current Station Load: <span className="text-2xl text-[#D8DA00] font-bold ml-2">{node.load}kW</span></p>
              </div>
            </div>

            {/* Metrics Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#0A3A43]/50 border-b border-[#1A6B78]/50 text-[#8CB4BC] uppercase text-xs">
                  <tr>
                    <th className="p-4 font-normal">METRIC</th>
                    <th className="p-4 font-normal">ACTUAL CURRENT</th>
                    <th className="p-4 font-normal">TARGET BENCHMARK</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A6B78]/30">
                  <tr className="hover:bg-[#0A3A43]/30 transition-colors">
                    <td className="p-4 text-[#8CB4BC] font-bold">Daily Node Utilization %</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-lg ${node.utilization >= node.breakeven ? 'text-green-400' : 'text-red-400'}`}>{node.utilization}%</span>
                        {node.utilization < node.breakeven && <AlertTriangle className="w-4 h-4 text-red-400" />}
                      </div>
                    </td>
                    <td className="p-4 text-[#8CB4BC]">{node.breakeven}% (Breakeven)</td>
                  </tr>
                  <tr className="hover:bg-[#0A3A43]/30 transition-colors">
                    <td className="p-4 text-[#8CB4BC] font-bold">Core Volume Dispatched</td>
                    <td className="p-4 font-bold text-[#FFFDF0]">{node.volume.toLocaleString()} kWh</td>
                    <td className="p-4 text-[#8CB4BC]">{node.volumeTarget}</td>
                  </tr>
                  <tr className="hover:bg-[#0A3A43]/30 transition-colors">
                    <td className="p-4 text-[#8CB4BC] font-bold">Dwell Time Average</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${node.dwell >= 20 && node.dwell <= 40 ? 'text-green-400' : 'text-orange-400'}`}>{node.dwell} Minutes</span>
                        <Clock className="w-4 h-4 text-[#8CB4BC]" />
                      </div>
                    </td>
                    <td className="p-4 text-[#8CB4BC]">{node.dwellTarget}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Outlets Footer */}
            <div className="bg-[#0A3A43] p-4 border-t-2 border-[#1A6B78]/50 flex items-center gap-4 text-[#FFFDF0]">
              <span className="text-[#8CB4BC] font-bold">&gt; Active Outlets:</span>
              <div className="flex flex-wrap gap-3">
                {node.plugs.map(plug => (
                  <span key={plug.id} className="bg-[#052126] px-3 py-1 rounded border border-[#1A6B78]/50 flex items-center gap-2">
                    <span className="text-[#8CB4BC]">{plug.id}:</span> 
                    <span className={`font-bold ${plug.state.includes('Charging') ? 'text-[#D8DA00]' : 'text-green-400'}`}>{plug.state}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Algorithmic "Asset Portability" Recommendation Engine Alert */}
            {node.utilization < node.breakeven && (
              <div className="bg-red-500/10 p-4 border-t-2 border-red-500/30 flex items-start gap-3 text-[#FFFDF0]">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-red-400 font-bold uppercase tracking-wider text-xs">Autonomous Redeployment Warning</h4>
                  <p className="text-sm mt-1">
                    Node <span className="font-bold">{node.name}</span> is performing under the {node.breakeven}% break-even mark (Current: {node.utilization}%).
                  </p>
                  {recommendedLeads[node.id as keyof typeof recommendedLeads] && (
                    <div className="mt-2 bg-[#052126] p-3 rounded border border-red-500/20 inline-block">
                      <p className="text-xs text-[#8CB4BC] uppercase tracking-wider mb-1">Recommended Physical Redeployment Match</p>
                      <p className="text-sm text-[#D8DA00] font-bold">
                        Target: {recommendedLeads[node.id as keyof typeof recommendedLeads].leadName} | Score: {recommendedLeads[node.id as keyof typeof recommendedLeads].matchScore}%
                      </p>
                    </div>
                  )}
                  <button className="mt-3 text-xs bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold px-3 py-1.5 rounded transition-colors">
                    Execute Redeployment Protocol
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
