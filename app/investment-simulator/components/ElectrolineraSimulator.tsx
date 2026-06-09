"use client";

import React, { useState, useMemo } from 'react';
import { SimulatorCharts } from './SimulatorCharts';
import { SimulationLeadForm } from './SimulationLeadForm';

const TIERS = {
  TIER_01: { name: 'Tier 01 (60kW Fast)', capex: 120000000, baseDemand: 90 },
  TIER_02: { name: 'Tier 02 (120kW Super Fast)', capex: 180000000, baseDemand: 240 },
  TIER_03: { name: 'Tier 03 (240kW Ultra Fast)', capex: 250000000, baseDemand: 450 },
};

export function ElectrolineraSimulator() {
  const [tier, setTier] = useState<keyof typeof TIERS>('TIER_02');
  const [vehicleCapacity, setVehicleCapacity] = useState(50);
  const [retailPrice, setRetailPrice] = useState(1900);
  const [wholesaleCost, setWholesaleCost] = useState(1000);
  const [inflationRate, setInflationRate] = useState(6);
  const [demandGrowth, setDemandGrowth] = useState(10);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);

  const projections = useMemo(() => {
    const data = [];
    let cumulativeProfits = 0;
    let breakEvenMonth = -1;

    const capex = TIERS[tier].capex;
    const baseDemand = TIERS[tier].baseDemand;

    for (let year = 1; year <= 10; year++) {
      const inflationMultiplier = Math.pow(1 + inflationRate / 100, year - 1);
      const growthMultiplier = Math.pow(1 + demandGrowth / 100, year - 1);

      const currentRetailPrice = retailPrice * inflationMultiplier;
      const currentWholesaleCost = wholesaleCost * inflationMultiplier;
      const monthlyCharges = baseDemand * growthMultiplier;
      const monthlyKwhSold = monthlyCharges * vehicleCapacity;

      const monthlyGrossRev = monthlyKwhSold * currentRetailPrice;
      const monthlyEnergyCost = monthlyKwhSold * currentWholesaleCost;
      const monthlyGatewayFee = monthlyGrossRev * 0.05;
      const monthlyAdminFee = monthlyGrossRev * 0.10;

      const netMonthlyProfit = monthlyGrossRev - monthlyEnergyCost - monthlyGatewayFee - monthlyAdminFee;
      const netAnnualProfit = netMonthlyProfit * 12;
      const annualRoi = (netAnnualProfit / capex) * 100;

      cumulativeProfits += netAnnualProfit;
      const cashMultiplier = cumulativeProfits / capex;

      if (breakEvenMonth === -1 && cumulativeProfits >= capex) {
        // Estimate the exact fractional month in this year
        const previousCumulative = cumulativeProfits - netAnnualProfit;
        const remainingToBreakeven = capex - previousCumulative;
        const fractionalMonthsInYear = (remainingToBreakeven / netAnnualProfit) * 12;
        breakEvenMonth = Math.round(((year - 1) * 12 + fractionalMonthsInYear) * 10) / 10;
      }

      data.push({
        year: `Año ${year}`,
        grossRevenues: Math.round(monthlyGrossRev * 12),
        netProfit: Math.round(netAnnualProfit),
        cashMultiplier: Math.round(cashMultiplier * 100) / 100,
        monthlyKwhSold: Math.round(monthlyKwhSold),
        monthlyGrossRev: Math.round(monthlyGrossRev),
        monthlyEnergyCost: Math.round(monthlyEnergyCost),
        netMonthlyProfit: Math.round(netMonthlyProfit),
        annualRoi: Math.round(annualRoi * 100) / 100
      });
    }

    return { data, capex, breakEvenMonth };
  }, [tier, vehicleCapacity, retailPrice, wholesaleCost, inflationRate, demandGrowth]);

  const { data, capex, breakEvenMonth } = projections;
  const year1MonthlyIncome = data[0].netMonthlyProfit;
  const avgRoi = data.reduce((acc, curr) => acc + curr.annualRoi, 0) / 10;
  const finalMultiplier = data[9].cashMultiplier;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* High-Impact Performance Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0E4D58] p-5 rounded-xl border border-[#1A6B78]/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <svg className="w-12 h-12 text-[#D8DA00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <p className="text-xs text-[#8CB4BC] uppercase tracking-wider font-semibold mb-1">Total Initial Investment</p>
          <p className="text-2xl font-bold text-[#FFFDF0]">{formatCurrency(capex)}</p>
          <p className="text-xs text-[#8CB4BC] mt-1">CAPEX for {TIERS[tier].name}</p>
        </div>

        <div className="bg-[#0A3A43] p-5 rounded-xl border border-[#D8DA00]/30 relative overflow-hidden border-l-4 border-l-[#D8DA00]">
          <p className="text-xs text-[#D8DA00] uppercase tracking-wider font-bold mb-1">Yr 1 Estimated Monthly</p>
          <p className="text-2xl font-bold text-[#FFFDF0]">{formatCurrency(year1MonthlyIncome)}</p>
          <p className="text-xs text-[#8CB4BC] mt-1">Net Retained Profit</p>
        </div>

        <div className="bg-[#0E4D58] p-5 rounded-xl border border-[#1A6B78]/50">
          <p className="text-xs text-[#8CB4BC] uppercase tracking-wider font-semibold mb-1">Average 10Y ROI</p>
          <p className="text-2xl font-bold text-[#FFFDF0]">{avgRoi.toFixed(1)}%</p>
          <p className="text-xs text-[#8CB4BC] mt-1">Cash Multiplier: {finalMultiplier.toFixed(2)}x</p>
        </div>

        <div className="bg-[#0E4D58] p-5 rounded-xl border border-[#1A6B78]/50">
          <p className="text-xs text-[#8CB4BC] uppercase tracking-wider font-semibold mb-1">Break-even Horizon</p>
          <p className="text-2xl font-bold text-[#FFFDF0]">{breakEvenMonth !== -1 ? `${breakEvenMonth} Meses` : '> 120 Meses'}</p>
          <p className="text-xs text-[#8CB4BC] mt-1">Initial CAPEX recovered</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-6 bg-[#0E4D58]/50 p-6 rounded-2xl border border-[#1A6B78]/30">
          
          <div>
            <label className="text-sm font-semibold text-[#FFFDF0] uppercase tracking-wider">Operational Tier</label>
            <div className="mt-3 space-y-2">
              {(Object.keys(TIERS) as Array<keyof typeof TIERS>).map((t) => (
                <button
                  key={t}
                  onClick={() => setTier(t)}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                    tier === t 
                      ? 'bg-[#0A3A43] border-[#D8DA00]/50 text-[#D8DA00]' 
                      : 'bg-[#052126] border-[#1A6B78]/30 text-[#8CB4BC] hover:border-[#1A6B78]'
                  }`}
                >
                  <div className="font-bold text-sm">{TIERS[t].name}</div>
                  <div className="text-xs opacity-80">{formatCurrency(TIERS[t].capex)}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-5 pt-4 border-t border-[#1A6B78]/30">
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-xs font-semibold text-[#8CB4BC] uppercase">Vehicle Charge Capacity</label>
                <span className="text-xs font-bold text-[#FFFDF0]">{vehicleCapacity} kWh</span>
              </div>
              <input type="range" min="30" max="100" step="5" value={vehicleCapacity} onChange={(e) => setVehicleCapacity(Number(e.target.value))} className="w-full accent-[#D8DA00]" />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-xs font-semibold text-[#8CB4BC] uppercase">Retail Price (COP/kWh)</label>
                <span className="text-xs font-bold text-[#FFFDF0]">{formatCurrency(retailPrice)}</span>
              </div>
              <input type="range" min="1500" max="3000" step="50" value={retailPrice} onChange={(e) => setRetailPrice(Number(e.target.value))} className="w-full accent-[#D8DA00]" />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-xs font-semibold text-[#8CB4BC] uppercase">Wholesale Input Cost</label>
                <span className="text-xs font-bold text-[#FFFDF0]">{formatCurrency(wholesaleCost)}</span>
              </div>
              <input type="range" min="500" max="1500" step="50" value={wholesaleCost} onChange={(e) => setWholesaleCost(Number(e.target.value))} className="w-full accent-[#D8DA00]" />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-xs font-semibold text-[#8CB4BC] uppercase">Annual Inflation Rate</label>
                <span className="text-xs font-bold text-[#FFFDF0]">{inflationRate}%</span>
              </div>
              <input type="range" min="0" max="15" step="1" value={inflationRate} onChange={(e) => setInflationRate(Number(e.target.value))} className="w-full accent-[#D8DA00]" />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-xs font-semibold text-[#8CB4BC] uppercase">Annual Demand Growth</label>
                <span className="text-xs font-bold text-[#FFFDF0]">{demandGrowth}%</span>
              </div>
              <input type="range" min="0" max="30" step="1" value={demandGrowth} onChange={(e) => setDemandGrowth(Number(e.target.value))} className="w-full accent-[#D8DA00]" />
            </div>
          </div>
          <button 
            onClick={() => setIsFormOpen(true)}
            className="w-full mt-4 flex justify-center items-center gap-2 px-4 py-3 bg-[#D8DA00] hover:bg-[#D8DA00]/90 text-[#0D4651] font-bold rounded-xl transition-all shadow-lg"
          >
            Solicitar Propuesta Comercial
          </button>
        </div>

        {/* Charts & Data */}
        <div className="lg:col-span-2 space-y-6">
          <SimulatorCharts data={data} />
          
          <div className="bg-[#0E4D58] rounded-xl border border-[#1A6B78]/50 overflow-hidden font-mono">
            <div className="bg-[#0A3A43]/60 px-4 py-3 border-b border-[#1A6B78]/30">
              <h3 className="text-sm font-bold text-[#FFFDF0] uppercase">10-Year Financial Ledger</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#0A3A43]/30 border-b border-[#1A6B78]/30 text-[#8CB4BC] uppercase">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Year</th>
                    <th className="px-4 py-3 font-semibold text-right">kWh Dispensed</th>
                    <th className="px-4 py-3 font-semibold text-right">Gross Rev</th>
                    <th className="px-4 py-3 font-semibold text-right">Net Profit</th>
                    <th className="px-4 py-3 font-semibold text-right">Annual ROI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A6B78]/20 text-[#FFFDF0]">
                  {data.map((row) => (
                    <tr key={row.year} className="hover:bg-[#0A3A43]/40 transition-colors">
                      <td className="px-4 py-3 font-bold">{row.year}</td>
                      <td className="px-4 py-3 text-right">{(row.monthlyKwhSold * 12).toLocaleString(undefined, {maximumFractionDigits: 0})} kWh</td>
                      <td className="px-4 py-3 text-right">{formatCurrency(row.grossRevenues)}</td>
                      <td className="px-4 py-3 text-right text-[#D8DA00] font-bold">{formatCurrency(row.netProfit)}</td>
                      <td className="px-4 py-3 text-right">{row.annualRoi.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <SimulationLeadForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        simulationPayload={{
          assetType: 'ELECTROLINERA',
          selectedTier: tier,
          customParameters: { vehicleCapacity, retailPrice, wholesaleCost, inflationRate, demandGrowth }
        }} 
      />
    </div>
  );
}
