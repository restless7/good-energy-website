"use client";

import { BatteryCharging, MapPin, Activity, ShieldCheck, Zap, ThermometerSnowflake, CheckCircle2, AlertTriangle } from 'lucide-react';

const mockElectrolineras = [
  { 
    id: '1', 
    name: 'Node San Gil-Bucaramanga', 
    location: 'Ruta 45A, Santander', 
    tier: 'Tier 02 (120kW)',
    capacity: 120, 
    instantaneousOutput: 110.5, 
    totalDispatched: 34500, 
    activePlugs: [
      { id: 'Plug A (CCS2)', state: 'Charging', kW: 85 },
      { id: 'Plug B (CHAdeMO)', state: 'Charging', kW: 25.5 },
    ],
    thermal: 'NORMAL',
    networkLoad: '92%',
    status: 'ACTIVE' 
  },
  { 
    id: '2', 
    name: 'Node Medellin-Poblado', 
    location: 'El Poblado, Antioquia', 
    tier: 'Tier 01 (60kW)',
    capacity: 60, 
    instantaneousOutput: 0.0, 
    totalDispatched: 18200, 
    activePlugs: [
      { id: 'Plug A (CCS2)', state: 'Idle', kW: 0 },
      { id: 'Plug B (CCS2)', state: 'Idle', kW: 0 },
    ],
    thermal: 'OPTIMAL',
    networkLoad: '0%',
    status: 'ACTIVE' 
  },
  { 
    id: '3', 
    name: 'Node Bogota-Norte', 
    location: 'Autopista Norte, Cundinamarca', 
    tier: 'Tier 03 (240kW)',
    capacity: 240, 
    instantaneousOutput: 0.0, 
    totalDispatched: 8500, 
    activePlugs: [
      { id: 'Plug A (CCS2)', state: 'Offline', kW: 0 },
      { id: 'Plug B (CCS2)', state: 'Offline', kW: 0 },
    ],
    thermal: 'WARNING',
    networkLoad: '0%',
    status: 'MAINTENANCE' 
  },
];

export default function ElectrolinerasPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#FFFDF0]">Electrolineras Premium</h1>
        <p className="text-[#8CB4BC] text-sm mt-1">DC Fast-Charging Fleet Telemetry & Hardware State</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {mockElectrolineras.map((node) => (
          <div key={node.id} className="bg-[#0E4D58] rounded-2xl border border-[#1A6B78]/50 overflow-hidden font-mono text-sm shadow-xl">
            {/* Status Header */}
            <div className={`px-5 py-3 flex items-center justify-between border-b border-[#1A6B78]/50 ${
              node.status === 'ACTIVE' ? 'bg-[#D8DA00]/10' : 'bg-orange-500/10'
            }`}>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${node.status === 'ACTIVE' ? 'bg-[#D8DA00] animate-pulse' : 'bg-orange-400'}`} />
                <span className={`font-bold uppercase tracking-widest ${node.status === 'ACTIVE' ? 'text-[#D8DA00]' : 'text-orange-400'}`}>{node.status}</span>
              </div>
              <span className="text-[#8CB4BC] text-xs">SN-NODE-{node.id.padStart(4, '0')}</span>
            </div>

            <div className="p-5">
              <div className="flex items-start justify-between mb-6 border-b border-[#1A6B78]/30 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-[#FFFDF0] uppercase tracking-wider">{node.name}</h3>
                  <div className="flex items-center gap-1 mt-1 text-[#8CB4BC]">
                    <MapPin className="w-3.5 h-3.5 text-[#D8DA00]" />
                    <span className="text-xs">{node.location}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-transparent border border-blue-500/30 rounded-xl flex items-center justify-center ml-auto">
                    <BatteryCharging className="w-6 h-6 text-blue-400" />
                  </div>
                  <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mt-2 inline-block">{node.tier}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Dispenser Metrics */}
                <div className="space-y-4">
                  <h4 className="text-[#8CB4BC] text-xs uppercase tracking-wider border-b border-[#1A6B78]/30 pb-1">Dispenser Load</h4>
                  <div className="bg-[#0A3A43]/50 p-3 rounded-lg border border-[#1A6B78]/30 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-10">
                      <Zap className="w-12 h-12 text-[#D8DA00]" />
                    </div>
                    <p className="text-[10px] text-[#8CB4BC] uppercase mb-1 flex items-center gap-1"><Activity className="w-3 h-3 text-[#D8DA00]" /> Instantaneous Draw</p>
                    <p className="text-2xl font-bold text-[#FFFDF0] relative z-10">{node.instantaneousOutput} <span className="text-sm text-[#8CB4BC]">kW</span></p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#0A3A43]/30 p-2 rounded-lg border border-[#1A6B78]/20">
                      <p className="text-[10px] text-[#8CB4BC] uppercase mb-1">Lifetime Vol</p>
                      <p className="font-bold text-[#D8DA00]">{node.totalDispatched.toLocaleString()} <span className="text-[10px]">kWh</span></p>
                    </div>
                    <div className="bg-[#0A3A43]/30 p-2 rounded-lg border border-[#1A6B78]/20">
                      <p className="text-[10px] text-[#8CB4BC] uppercase mb-1">Max Rating</p>
                      <p className="font-bold text-[#FFFDF0]">{node.capacity} <span className="text-[10px]">kW</span></p>
                    </div>
                  </div>
                </div>

                {/* Connector States & Health */}
                <div className="space-y-4">
                  <h4 className="text-[#8CB4BC] text-xs uppercase tracking-wider border-b border-[#1A6B78]/30 pb-1">Connector Matrix</h4>
                  <div className="space-y-2">
                    {node.activePlugs.map((plug, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-[#0A3A43]/50 p-2 rounded border border-[#1A6B78]/30">
                        <span className="text-xs text-[#8CB4BC] font-bold">{plug.id}</span>
                        <div className="flex items-center gap-3">
                          <span className={`text-[10px] px-2 py-0.5 rounded ${
                            plug.state === 'Charging' ? 'bg-[#D8DA00]/20 text-[#D8DA00]' : 
                            plug.state === 'Idle' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>{plug.state}</span>
                          <span className="text-[#FFFDF0] font-bold w-12 text-right">{plug.kW}kW</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <h4 className="text-[#8CB4BC] text-xs uppercase tracking-wider border-b border-[#1A6B78]/30 pb-1 mt-4">Hardware Telemetry</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[#8CB4BC] flex items-center gap-1"><ThermometerSnowflake className="w-3 h-3" /> Thermal Core</span>
                      <span className={`font-bold ${
                        node.thermal === 'NORMAL' || node.thermal === 'OPTIMAL' ? 'text-green-400' : 'text-orange-400'
                      }`}>{node.thermal}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#8CB4BC] flex items-center gap-1"><Activity className="w-3 h-3" /> Network Load</span>
                      <span className="font-bold text-[#D8DA00]">{node.networkLoad}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#8CB4BC] flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Controller Sync</span>
                      <span className="font-bold text-green-400">ONLINE</span>
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
