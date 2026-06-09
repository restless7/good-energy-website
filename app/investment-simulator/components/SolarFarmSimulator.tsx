"use client";

import React, { useState, useMemo } from 'react';
import { SimulatorCharts } from './SimulatorCharts';
import { SimulationLeadForm } from './SimulationLeadForm';

export function SolarFarmSimulator() {
  const [units, setUnits] = useState(1);
  const [inflationRate, setInflationRate] = useState(6);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);

  const UNIT_COST = 45000000;
  const DOWNPAYMENT_PER_UNIT = 15000000;
  const MONTHLY_FINANCING_PER_UNIT = 2500000; // 12 payments
  const BASE_ANNUAL_EARNINGS_PER_UNIT = 7497000;

  const totalCost = units * UNIT_COST;
  const totalDownpayment = units * DOWNPAYMENT_PER_UNIT;
  const totalMonthlyFinancing = units * MONTHLY_FINANCING_PER_UNIT;

  const projections = useMemo(() => {
    const data = [];
    let cumulativeProfits = 0;
    let breakEvenMonth = -1;

    for (let year = 1; year <= 10; year++) {
      const inflationMultiplier = Math.pow(1 + inflationRate / 100, year - 1);
      
      const annualEarnings = units * BASE_ANNUAL_EARNINGS_PER_UNIT * inflationMultiplier;
      const netAnnualProfit = annualEarnings; // For solar, earnings are net in this model
      
      cumulativeProfits += netAnnualProfit;
      const cashMultiplier = cumulativeProfits / totalCost;

      // Note: First year has financing outflow but we model based on total CAPEX for breakeven
      if (breakEvenMonth === -1 && cumulativeProfits >= totalCost) {
        const previousCumulative = cumulativeProfits - netAnnualProfit;
        const remainingToBreakeven = totalCost - previousCumulative;
        const fractionalMonthsInYear = (remainingToBreakeven / netAnnualProfit) * 12;
        breakEvenMonth = Math.round(((year - 1) * 12 + fractionalMonthsInYear) * 10) / 10;
      }

      data.push({
        year: `Año ${year}`,
        grossRevenues: Math.round(annualEarnings), 
        netProfit: Math.round(netAnnualProfit),
        cashMultiplier: Math.round(cashMultiplier * 100) / 100,
        annualRoi: Math.round((netAnnualProfit / totalCost) * 10000) / 100
      });
    }

    return { data, breakEvenMonth };
  }, [units, inflationRate, totalCost]);

  const { data, breakEvenMonth } = projections;
  const year1MonthlyIncome = data[0].netProfit / 12;
  const avgRoi = data.reduce((acc, curr) => acc + curr.annualRoi, 0) / 10;
  const finalMultiplier = data[9].cashMultiplier;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* High-Impact Performance Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0E4D58] p-5 rounded-xl border border-[#1A6B78]/50 relative overflow-hidden">
          <p className="text-xs text-[#8CB4BC] uppercase tracking-wider font-semibold mb-1">Total Project CAPEX</p>
          <p className="text-2xl font-bold text-[#FFFDF0]">{formatCurrency(totalCost)}</p>
          <p className="text-xs text-[#8CB4BC] mt-1">{units} Unit{units > 1 ? 's' : ''} Fraction</p>
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
            <div className="flex justify-between mb-1">
              <label className="text-xs font-semibold text-[#8CB4BC] uppercase">Units to Acquire</label>
              <span className="text-xs font-bold text-[#FFFDF0]">{units} Units</span>
            </div>
            <input type="range" min="1" max="50" step="1" value={units} onChange={(e) => setUnits(Number(e.target.value))} className="w-full accent-[#D8DA00]" />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="text-xs font-semibold text-[#8CB4BC] uppercase">Annual Inflation Factor</label>
              <span className="text-xs font-bold text-[#FFFDF0]">{inflationRate}%</span>
            </div>
            <input type="range" min="0" max="15" step="1" value={inflationRate} onChange={(e) => setInflationRate(Number(e.target.value))} className="w-full accent-[#D8DA00]" />
          </div>

          <div className="pt-4 border-t border-[#1A6B78]/30 space-y-3">
            <h4 className="text-sm font-bold text-[#FFFDF0] uppercase">Financing Terms</h4>
            <div className="bg-[#0A3A43] p-4 rounded-xl border border-[#1A6B78]/30 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#8CB4BC]">Initial Downpayment</span>
                <span className="font-bold text-[#FFFDF0]">{formatCurrency(totalDownpayment)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#8CB4BC]">Monthly (x12 Months)</span>
                <span className="font-bold text-[#D8DA00]">{formatCurrency(totalMonthlyFinancing)}</span>
              </div>
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
                    <th className="px-4 py-3 font-semibold text-right">Net Annual Yield</th>
                    <th className="px-4 py-3 font-semibold text-right">Cumulative</th>
                    <th className="px-4 py-3 font-semibold text-right">Annual ROI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A6B78]/20 text-[#FFFDF0]">
                  {data.reduce((acc, row, idx) => {
                    const prevCumulative = idx > 0 ? acc[idx - 1].cumulative : 0;
                    acc.push({ ...row, cumulative: prevCumulative + row.netProfit });
                    return acc;
                  }, [] as any[]).map((row) => (
                    <tr key={row.year} className="hover:bg-[#0A3A43]/40 transition-colors">
                      <td className="px-4 py-3 font-bold">{row.year}</td>
                      <td className="px-4 py-3 text-right text-[#D8DA00] font-bold">{formatCurrency(row.netProfit)}</td>
                      <td className="px-4 py-3 text-right">{formatCurrency(row.cumulative)}</td>
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
          assetType: 'SOLAR_FARM',
          unitsCount: units,
          customParameters: { inflationRate }
        }} 
      />
    </div>
  );
}
