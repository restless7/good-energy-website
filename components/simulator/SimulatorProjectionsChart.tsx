'use client';

import React, { useMemo } from 'react';
import { useSimulator } from './SimulatorContext';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

export function SimulatorProjectionsChart() {
  const { result } = useSimulator();

  // Aggregate monthly projections into yearly nodes for cleaner chart representation
  const yearlyData = useMemo(() => {
    const yearsMap = new Map<number, any>();
    
    result.proyecciones.forEach(p => {
      if (!yearsMap.has(p.year)) {
        yearsMap.set(p.year, { 
          year: `Año ${p.year}`, 
          ingresosVendidos: 0, 
          utilidadNeta: 0, 
          costoOperativo: 0 
        });
      }
      const data = yearsMap.get(p.year);
      data.ingresosVendidos += p.ingresosVentaEnergia;
      data.utilidadNeta += p.utilidadNeta;
      data.costoOperativo += (p.costoMantenimiento + p.costoAdministracion);
    });

    return Array.from(yearsMap.values());
  }, [result.proyecciones]);

  const formatCOP = (val: number) => {
    if (val >= 1000000) {
      return `$${(val / 1000000).toFixed(0)}M`;
    }
    return `$${(val / 1000).toFixed(0)}K`;
  };

  return (
    <div className="w-full h-[400px] bg-white dark:bg-zinc-900 rounded-xl p-4 md:p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
      <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-6">Proyección de Ingresos (10 Años)</h3>
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={yearlyData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorUtilidad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorIngreso" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#52525b" opacity={0.2} />
            <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 12}} dy={10} />
            <YAxis tickFormatter={formatCOP} axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 12}} dx={-10} width={60} />
            <Tooltip 
              formatter={(value: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value)}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: 'var(--tw-bg-opacity, #ffffff)' }}
              labelStyle={{ color: '#71717a', fontWeight: 'bold', marginBottom: '4px' }}
            />
            <Legend verticalAlign="top" height={36} wrapperStyle={{ paddingBottom: '20px' }} />
            <Area type="monotone" dataKey="ingresosVendidos" name="Ingresos Brutos" stroke="#3b82f6" fillOpacity={1} fill="url(#colorIngreso)" />
            <Area type="monotone" dataKey="utilidadNeta" name="Utilidad Neta (Bolsillo)" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorUtilidad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
