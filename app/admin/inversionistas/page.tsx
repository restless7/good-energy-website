"use client";

import { useState } from 'react';
import { Users, Search, Plus, Filter, MoreVertical, Mail, Phone, MapPin, Zap, Sun, BarChart } from 'lucide-react';
import { useRBAC } from '@/hooks/useRBAC';
import { toast } from 'sonner';

// Mock data matching the new schema requirements
const mockInvestors = [
  { 
    id: '1', name: 'Alejandro Gomez', email: 'alejandro@example.com', phone: '+57 300 123 4567', country: 'Colombia', status: 'Activo', 
    tier: 'Foundational Tier', capitalPlaced: 250000, projectedIrrMin: 22, projectedIrrMax: 26,
    capexAlloc: 175000, realEstateAlloc: 50000, operationsAlloc: 25000,
    nodeAssociations: ['Node-Bucaramanga-Centro', 'Node-Giron-Industrial'],
    liquidityMonths: 41, leaseContractStatus: 'ACTIVE'
  },
  { 
    id: '2', name: 'Ana López', email: 'ana@example.com', phone: '+57 310 987 6543', country: 'Colombia', status: 'Activo', 
    tier: 'Growth Tier', capitalPlaced: 100000, projectedIrrMin: 18, projectedIrrMax: 22,
    capexAlloc: 70000, realEstateAlloc: 20000, operationsAlloc: 10000,
    nodeAssociations: ['Node-Medellin-Poblado'],
    liquidityMonths: 52, leaseContractStatus: 'RENEWAL_PENDING'
  },
];

const mockLeads = [
  {
    id: 'L1', name: 'Sebastian Garcia', email: 's.garcia@corporation.com', phone: '+57 300 111 2222',
    assetType: 'ELECTROLINERA', selectedTier: 'TIER_03',
    customParameters: { vehicleCapacity: 60, retailPrice: 2000, wholesaleCost: 900, inflationRate: 5, demandGrowth: 15 },
    createdAt: '2026-06-09T10:00:00Z'
  },
  {
    id: 'L2', name: 'Laura Martinez', email: 'laura.m@inversiones.co', phone: '+57 310 555 7777',
    assetType: 'SOLAR_FARM', unitsCount: 5,
    customParameters: { inflationRate: 7 },
    createdAt: '2026-06-08T15:30:00Z'
  }
];

export default function InversionistasPage() {
  const { isSuperAdmin } = useRBAC();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'SYNDICATE' | 'PROSPECTS'>('SYNDICATE');

  const filteredInvestors = mockInvestors.filter(inv => {
    const matchesSearch = inv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#FFFDF0]">Syndicate Investors</h1>
          <p className="text-[#8CB4BC] text-sm mt-1">Foundational Angel Rounds & Asset Deployments</p>
        </div>
        <button 
          onClick={() => toast.info('El flujo de onboarding institucional está en desarrollo para la próxima versión.')}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#D8DA00] hover:bg-[#D8DA00]/90 text-[#0D4651] font-semibold rounded-xl transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Onboard Investor
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row gap-4 border-b border-[#1A6B78]/30 pb-1">
        <button
          onClick={() => setActiveTab('SYNDICATE')}
          className={`flex items-center gap-3 px-6 py-4 rounded-t-xl transition-colors font-bold ${
            activeTab === 'SYNDICATE'
              ? 'bg-[#0E4D58] text-[#D8DA00] border-b-2 border-[#D8DA00]'
              : 'text-[#8CB4BC] hover:text-[#FFFDF0] hover:bg-[#0E4D58]/50'
          }`}
        >
          <Users className="w-5 h-5" />
          Miembros del Sindicato
        </button>
        <button
          onClick={() => setActiveTab('PROSPECTS')}
          className={`flex items-center gap-3 px-6 py-4 rounded-t-xl transition-colors font-bold ${
            activeTab === 'PROSPECTS'
              ? 'bg-[#0E4D58] text-[#D8DA00] border-b-2 border-[#D8DA00]'
              : 'text-[#8CB4BC] hover:text-[#FFFDF0] hover:bg-[#0E4D58]/50'
          }`}
        >
          <BarChart className="w-5 h-5" />
          Prospectos Digitales (Simulador)
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8CB4BC]" />
          <input
            type="text"
            placeholder={activeTab === 'SYNDICATE' ? "Search syndicate members..." : "Search captured simulations..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#0E4D58] border border-[#1A6B78]/50 rounded-xl text-[#FFFDF0] placeholder-[#8CB4BC]/50 focus:outline-none focus:border-[#D8DA00]/50 text-sm"
          />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-5">
        {activeTab === 'SYNDICATE' && filteredInvestors.map((investor) => (
          <div key={investor.id} className="bg-[#0E4D58] rounded-2xl border border-[#1A6B78]/50 overflow-hidden font-mono text-sm">
            
            {/* Card Header */}
            <div className="border-b border-[#1A6B78]/50 px-5 py-4 bg-[#0A3A43]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#D8DA00]/20 to-transparent border border-[#D8DA00]/30 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-[#D8DA00]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#FFFDF0] uppercase tracking-wider">{investor.name}</span>
                    <span className="text-[#8CB4BC] px-2 py-0.5 bg-[#1A6B78]/30 rounded text-xs">[ {investor.tier} ]</span>
                  </div>
                  <div className="text-[#8CB4BC]/70 text-xs mt-1 flex items-center gap-3">
                    <span><Mail className="w-3 h-3 inline mr-1" />{investor.email}</span>
                    <span><Phone className="w-3 h-3 inline mr-1" />{investor.phone}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[#8CB4BC] text-xs uppercase tracking-wider mb-1">Lease Status</p>
                <span className={`px-2.5 py-1 rounded text-xs font-bold ${investor.leaseContractStatus === 'ACTIVE' ? 'bg-[#D8DA00]/10 text-[#D8DA00]' : 'bg-red-500/10 text-red-400'}`}>
                  {investor.leaseContractStatus}
                </span>
              </div>
            </div>

            {/* Matrix Body */}
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Financials & Allocations */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#1A6B78]/30 pb-2">
                  <span className="text-[#8CB4BC]">Capital Placed:</span>
                  <span className="text-[#FFFDF0] font-bold text-base">{formatCurrency(investor.capitalPlaced)}</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#1A6B78]/30 pb-2">
                  <span className="text-[#8CB4BC]">Projected IRR:</span>
                  <span className="text-[#D8DA00] font-bold">{investor.projectedIrrMin}% - {investor.projectedIrrMax}%</span>
                </div>

                <div className="pt-2 space-y-3">
                  {/* CAPEX */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#8CB4BC]">70% Asset CAPEX</span>
                      <span className="text-[#FFFDF0]">{formatCurrency(investor.capexAlloc)}</span>
                    </div>
                    <div className="w-full bg-[#0A3A43] h-2 rounded overflow-hidden">
                      <div className="bg-[#D8DA00] h-full" style={{ width: '70%' }}></div>
                    </div>
                  </div>
                  {/* Real Estate */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#8CB4BC]">20% Real Estate</span>
                      <span className="text-[#FFFDF0]">{formatCurrency(investor.realEstateAlloc)}</span>
                    </div>
                    <div className="w-full bg-[#0A3A43] h-2 rounded overflow-hidden">
                      <div className="bg-blue-400 h-full" style={{ width: '20%' }}></div>
                    </div>
                  </div>
                  {/* Operations */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#8CB4BC]">10% Operations</span>
                      <span className="text-[#FFFDF0]">{formatCurrency(investor.operationsAlloc)}</span>
                    </div>
                    <div className="w-full bg-[#0A3A43] h-2 rounded overflow-hidden">
                      <div className="bg-purple-400 h-full" style={{ width: '10%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Safeguards & Associations */}
              <div className="space-y-4 bg-[#0A3A43]/50 p-4 rounded-xl border border-[#1A6B78]/30">
                <h3 className="text-[#FFFDF0] font-bold uppercase tracking-wider text-xs mb-3 border-b border-[#1A6B78]/30 pb-2">Asset Portability & Safeguards</h3>
                
                <div className="space-y-2">
                  <p className="text-[#8CB4BC] text-xs uppercase tracking-wider">Node Associations (Serialized)</p>
                  <div className="flex flex-wrap gap-2">
                    {investor.nodeAssociations.map(node => (
                      <span key={node} className="px-2 py-1 bg-[#0E4D58] border border-[#1A6B78] text-[#FFFDF0] rounded text-xs flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#D8DA00]" />
                        {node}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#1A6B78]/30">
                  <p className="text-[#8CB4BC] text-xs uppercase tracking-wider mb-2">Liquidity Vesting Clock</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border-2 border-[#D8DA00]/30 flex items-center justify-center bg-[#0A3A43]">
                      <span className="text-[#D8DA00] font-bold">{investor.liquidityMonths}</span>
                    </div>
                    <p className="text-[#FFFDF0] text-sm">Months until Year 5 Window Opens</p>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        ))}

        {activeTab === 'PROSPECTS' && mockLeads.filter(l => l.name.toLowerCase().includes(searchTerm.toLowerCase())).map((lead) => (
          <div key={lead.id} className="bg-[#0E4D58] rounded-2xl border border-[#1A6B78]/50 overflow-hidden font-mono text-sm">
            <div className="border-b border-[#1A6B78]/50 px-5 py-4 bg-[#0A3A43]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#1A6B78]/20 to-transparent border border-[#1A6B78]/50 rounded-xl flex items-center justify-center">
                  {lead.assetType === 'ELECTROLINERA' ? <Zap className="w-5 h-5 text-blue-400" /> : <Sun className="w-5 h-5 text-[#D8DA00]" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#FFFDF0] uppercase tracking-wider">{lead.name}</span>
                    <span className="text-blue-400 px-2 py-0.5 bg-blue-400/10 rounded text-[10px] font-bold">DIGITAL PROSPECT</span>
                  </div>
                  <div className="text-[#8CB4BC]/70 text-xs mt-1 flex items-center gap-3">
                    <span><Mail className="w-3 h-3 inline mr-1" />{lead.email}</span>
                    <span><Phone className="w-3 h-3 inline mr-1" />{lead.phone}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[#8CB4BC] text-xs uppercase tracking-wider mb-1">Simulated Model</p>
                <span className="font-bold text-[#FFFDF0]">{lead.assetType === 'ELECTROLINERA' ? lead.selectedTier : `${lead.unitsCount} Solar Units`}</span>
              </div>
            </div>

            <div className="p-5 bg-[#0A3A43]/20">
              <h4 className="text-[#8CB4BC] text-xs uppercase tracking-wider mb-3 font-bold border-b border-[#1A6B78]/30 pb-2">Custom Underwriting Assumptions</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(lead.customParameters).map(([key, value]) => (
                  <div key={key} className="bg-[#0E4D58] p-3 rounded-lg border border-[#1A6B78]/30">
                    <p className="text-[10px] text-[#8CB4BC] uppercase tracking-wider">{key.replace(/([A-Z])/g, ' $1')}</p>
                    <p className="font-bold text-[#D8DA00] text-sm mt-1">{value}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex justify-end gap-3">
                <button className="px-4 py-2 border border-[#1A6B78] text-[#FFFDF0] rounded-lg text-xs font-bold hover:bg-[#1A6B78]/50">
                  View Full Projection Curve
                </button>
                <button className="px-4 py-2 bg-[#D8DA00] text-[#0D4651] rounded-lg text-xs font-bold hover:bg-[#D8DA00]/90">
                  Promote to Active Syndicate
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
