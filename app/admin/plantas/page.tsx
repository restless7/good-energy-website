"use client";

import { Sun, MapPin, Zap, Activity, ShieldCheck, Battery, ArrowRightLeft } from 'lucide-react';

const mockTelemetry = [
  { id: '1', name: 'Array Bucaramanga-Centro', location: 'Santander, Col', capacity: 500, instantaneousOutput: 420.5, cumulativeYield: 145000, 
    interconnection: 'NODE_BUFFER', bufferLoad: '95%',
    substation: { transformer: 'NORMAL', protection: 'ACTIVE', lvDistribution: 'OPTIMAL' },
    status: 'ACTIVE' },
  { id: '2', name: 'Array Giron-Industrial', location: 'Santander, Col', capacity: 350, instantaneousOutput: 310.0, cumulativeYield: 85000, 
    interconnection: 'GRID_INJECTION', bufferLoad: '0%',
    substation: { transformer: 'WARNING', protection: 'ACTIVE', lvDistribution: 'NORMAL' },
    status: 'ACTIVE' },
];

export default function PlantasPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#FFFDF0]">Telemetry & Generation Arrays</h1>
        <p className="text-[#8CB4BC] text-sm mt-1">Co-located Solar Infrastructure & Substation Monitoring</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {mockTelemetry.map((plant) => (
          <div key={plant.id} className="bg-[#0E4D58] rounded-2xl border border-[#1A6B78]/50 overflow-hidden font-mono text-sm">
            {/* Status Header */}
            <div className={`px-5 py-3 flex items-center justify-between border-b border-[#1A6B78]/50 ${
              plant.status === 'ACTIVE' ? 'bg-[#D8DA00]/10' : 'bg-red-500/10'
            }`}>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${plant.status === 'ACTIVE' ? 'bg-[#D8DA00] animate-pulse' : 'bg-red-400'}`} />
                <span className={`font-bold ${plant.status === 'ACTIVE' ? 'text-[#D8DA00]' : 'text-red-400'}`}>{plant.status}</span>
              </div>
              <span className="text-[#8CB4BC] text-xs">ID: {plant.id.padStart(4, '0')}</span>
            </div>

            <div className="p-5">
              <div className="flex items-start justify-between mb-6 border-b border-[#1A6B78]/30 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-[#FFFDF0] uppercase tracking-wider">{plant.name}</h3>
                  <div className="flex items-center gap-1 mt-1 text-[#8CB4BC]">
                    <MapPin className="w-3.5 h-3.5 text-[#D8DA00]" />
                    <span className="text-xs">{plant.location}</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-[#D8DA00]/20 to-transparent border border-[#D8DA00]/30 rounded-xl flex items-center justify-center">
                  <Sun className="w-6 h-6 text-[#D8DA00]" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Generation Metrics */}
                <div className="space-y-4">
                  <h4 className="text-[#8CB4BC] text-xs uppercase tracking-wider border-b border-[#1A6B78]/30 pb-1">Generation Capture</h4>
                  <div className="bg-[#0A3A43]/50 p-3 rounded-lg border border-[#1A6B78]/30">
                    <p className="text-[10px] text-[#8CB4BC] uppercase mb-1 flex items-center gap-1"><Zap className="w-3 h-3 text-[#D8DA00]" /> Instantaneous Output</p>
                    <p className="text-2xl font-bold text-[#FFFDF0]">{plant.instantaneousOutput} <span className="text-sm text-[#8CB4BC]">kW</span></p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#0A3A43]/30 p-2 rounded-lg border border-[#1A6B78]/20">
                      <p className="text-[10px] text-[#8CB4BC] uppercase mb-1">Cumulative Yield</p>
                      <p className="font-bold text-[#D8DA00]">{plant.cumulativeYield.toLocaleString()} <span className="text-[10px]">kWh</span></p>
                    </div>
                    <div className="bg-[#0A3A43]/30 p-2 rounded-lg border border-[#1A6B78]/20">
                      <p className="text-[10px] text-[#8CB4BC] uppercase mb-1">Max Capacity</p>
                      <p className="font-bold text-[#FFFDF0]">{plant.capacity} <span className="text-[10px]">kW</span></p>
                    </div>
                  </div>
                </div>

                {/* Routing & Substation */}
                <div className="space-y-4">
                  <h4 className="text-[#8CB4BC] text-xs uppercase tracking-wider border-b border-[#1A6B78]/30 pb-1">Interconnection Routing</h4>
                  <div className="flex items-center gap-3 bg-[#0A3A43]/50 p-3 rounded-lg border border-[#1A6B78]/30">
                    <div className="w-8 h-8 rounded-full bg-[#1A6B78]/50 flex items-center justify-center">
                      {plant.interconnection === 'NODE_BUFFER' ? <Battery className="w-4 h-4 text-[#D8DA00]" /> : <ArrowRightLeft className="w-4 h-4 text-blue-400" />}
                    </div>
                    <div>
                      <p className="font-bold text-[#FFFDF0]">{plant.interconnection === 'NODE_BUFFER' ? 'Node Buffer Charging' : 'Grid Injection (Excedentes)'}</p>
                      <p className="text-xs text-[#8CB4BC]">Load: {plant.bufferLoad}</p>
                    </div>
                  </div>

                  <h4 className="text-[#8CB4BC] text-xs uppercase tracking-wider border-b border-[#1A6B78]/30 pb-1 mt-4">Substation Health</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[#8CB4BC]">Transformer</span>
                      <span className={`font-bold ${plant.substation.transformer === 'NORMAL' ? 'text-green-400' : 'text-orange-400'}`}>{plant.substation.transformer}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#8CB4BC]">Protection Elements</span>
                      <span className="font-bold text-green-400">{plant.substation.protection}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#8CB4BC]">LV Distribution</span>
                      <span className="font-bold text-[#D8DA00]">{plant.substation.lvDistribution}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
