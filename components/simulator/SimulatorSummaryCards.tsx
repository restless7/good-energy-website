'use client';

import React from 'react';
import { useSimulator } from './SimulatorContext';

export function SimulatorSummaryCards() {
  const { result } = useSimulator();

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
  };
  
  const formatPercentage = (val: number) => {
    return (val * 100).toFixed(2) + '%';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      <div className="bg-white dark:bg-zinc-900 rounded-xl p-5 shadow-sm border border-zinc-200 dark:border-zinc-800 flex flex-col justify-center transition-all hover:shadow-md">
        <h4 className="text-zinc-500 dark:text-zinc-400 text-sm font-medium mb-1">Inversión Total</h4>
        <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{formatCOP(result.inversionTotal)}</span>
      </div>
      
      <div className="bg-white dark:bg-zinc-900 rounded-xl p-5 shadow-sm border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/50 dark:bg-emerald-900/10 flex flex-col justify-center transition-all hover:shadow-md">
        <h4 className="text-emerald-700 dark:text-emerald-400 text-sm font-medium mb-1">Utilidad Anual Promedio</h4>
        <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{formatCOP(result.utilidadAnualPromedio)}</span>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl p-5 shadow-sm border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/50 dark:bg-emerald-900/10 flex flex-col justify-center transition-all hover:shadow-md">
        <h4 className="text-emerald-700 dark:text-emerald-400 text-sm font-medium mb-1">Utilidad Mensual Promedio</h4>
        <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{formatCOP(result.utilidadMensualPromedio)}</span>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl p-5 shadow-sm border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/10 flex flex-col justify-center transition-all hover:shadow-md">
        <h4 className="text-blue-700 dark:text-blue-400 text-sm font-medium mb-1">ROI (Tasa Efectiva Anual)</h4>
        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{formatPercentage(result.roiPromedio)} EA</span>
      </div>
    </div>
  );
}
