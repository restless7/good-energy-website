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

export default function DispatchDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#1A6B78]/50 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#FFFDF0]">Network Dispatch Dashboard</h1>
          <p className="text-[#8CB4BC] text-sm mt-1">Continuous uptime and fleet customer experience routing</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-400 rounded-lg text-sm font-bold border border-green-500/20">
            <Activity className="w-4 h-4 animate-pulse" /> NETWORK OK
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
          </div>
        ))}
      </div>
    </div>
  );
}
