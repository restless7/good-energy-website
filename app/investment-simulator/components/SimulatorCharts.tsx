"use client";

import React, { useState } from 'react';
import { AreaChart, Area, ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';

interface SimulatorChartsProps {
  data: any[];
}

export function SimulatorCharts({ data }: SimulatorChartsProps) {
  const [activeChart, setActiveChart] = useState<'REVENUE' | 'BREAKEVEN'>('REVENUE');

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
    return `$${value}`;
  };

  return (
    <div className="bg-[#0E4D58]/30 p-6 rounded-2xl border border-[#1A6B78]/50">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-[#FFFDF0]">Projection Trajectories</h3>
        <div className="flex gap-2 bg-[#052126] p-1 rounded-lg border border-[#1A6B78]/50">
          <button 
            onClick={() => setActiveChart('REVENUE')}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${activeChart === 'REVENUE' ? 'bg-[#1A6B78] text-[#FFFDF0]' : 'text-[#8CB4BC] hover:text-[#FFFDF0]'}`}
          >
            Revenues & Profit
          </button>
          <button 
            onClick={() => setActiveChart('BREAKEVEN')}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${activeChart === 'BREAKEVEN' ? 'bg-[#1A6B78] text-[#FFFDF0]' : 'text-[#8CB4BC] hover:text-[#FFFDF0]'}`}
          >
            Punto de Equilibrio
          </button>
        </div>
      </div>

      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {activeChart === 'REVENUE' ? (
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorGross" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8CB4BC" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8CB4BC" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D8DA00" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#D8DA00" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1A6B78" vertical={false} />
              <XAxis dataKey="year" stroke="#8CB4BC" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis domain={['auto', 'auto']} stroke="#8CB4BC" fontSize={12} tickFormatter={formatCurrency} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#052126', borderColor: '#1A6B78', color: '#FFFDF0', borderRadius: '8px' }}
                itemStyle={{ color: '#FFFDF0' }}
                formatter={(value: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value)}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#8CB4BC' }} />
              <Area type="monotone" dataKey="grossRevenues" name="Gross Revenues" stroke="#8CB4BC" fillOpacity={1} fill="url(#colorGross)" />
              <Area type="monotone" dataKey="netProfit" name="Net Profit" stroke="#D8DA00" strokeWidth={3} fillOpacity={1} fill="url(#colorNet)" />
            </AreaChart>
          ) : (
            <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCumProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D8DA00" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#D8DA00" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1A6B78" vertical={false} />
              <XAxis dataKey="year" stroke="#8CB4BC" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis domain={['auto', 'auto']} stroke="#8CB4BC" fontSize={12} tickFormatter={formatCurrency} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#052126', borderColor: '#1A6B78', color: '#FFFDF0', borderRadius: '8px' }}
                itemStyle={{ color: '#FFFDF0' }}
                formatter={(value: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value)}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#8CB4BC' }} />
              <Line type="monotone" dataKey="capexValue" name="Inversión Inicial (CAPEX)" stroke="#E26A5A" strokeWidth={3} strokeDasharray="5 5" dot={false} activeDot={false} />
              <Area type="monotone" dataKey="cumulativeProfit" name="Utilidad Acumulada" stroke="#D8DA00" strokeWidth={3} fillOpacity={1} fill="url(#colorCumProfit)" />
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
