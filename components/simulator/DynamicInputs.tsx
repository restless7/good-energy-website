'use client';

import React from 'react';
import { useSimulator } from './SimulatorContext';
import { SIMULATOR_SCENARIOS } from '../../lib/simulatorDataConfig';

export function DynamicInputs() {
  const { input, setInput } = useSimulator();
  const config = SIMULATOR_SCENARIOS[input.scenario];

  const handleUnitsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value) || 1;
    // Input validation: Cannot exceed available stock
    if (val > config.unidadesDisponibles) return;
    if (val < 1) return;
    setInput(prev => ({ ...prev, unidadesAComprar: val }));
  };

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="w-full bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800 space-y-6">
      <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">Parámetros de Inversión</h3>
      
      {/* Universal Base Inputs */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex justify-between">
          <span>Unidades a Comprar</span>
          <span className="text-emerald-600 dark:text-emerald-400">{config.unidadesDisponibles} disponibles</span>
        </label>
        <input 
          type="number"
          min={1}
          max={config.unidadesDisponibles}
          value={input.unidadesAComprar}
          onChange={handleUnitsChange}
          className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-emerald-500 outline-none"
        />
      </div>

      {/* TASA FIJA Specific: Interest Options */}
      {input.scenario === 'TASA_FIJA' && config.farmPricesOptions && (
        <div className="space-y-2 relative">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Nivel de Rentabilidad / Fracción
          </label>
          <select 
            value={input.precioComercialFarmSeleccionado || config.farmPricesOptions[0]}
            onChange={(e) => setInput(prev => ({ ...prev, precioComercialFarmSeleccionado: Number(e.target.value) }))}
            className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-emerald-500 outline-none appearance-none"
          >
            {config.farmPricesOptions.map((price, idx) => (
              <option key={price} value={price}>
                {formatCOP(price)} {'->'} {(config.roiOptions![idx] * 100).toFixed(1)}% EA
              </option>
            ))}
          </select>
        </div>
      )}

      {/* EQUIPO COMERCIAL Specific: Amortization Plan */}
      {input.scenario === 'EQUIPO_COMERCIAL' && (
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Cuota Inicial Pagada
            </label>
            <input 
              type="number"
              min={0}
              max={input.unidadesAComprar * config.precioComercialFarm}
              value={input.cuotaInicial || 0}
              onChange={(e) => setInput(prev => ({ ...prev, cuotaInicial: Number(e.target.value) }))}
              className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Número de Cuotas
            </label>
            <input 
              type="number"
              min={1}
              max={120}
              value={input.numeroCuotas || 12}
              onChange={(e) => setInput(prev => ({ ...prev, numeroCuotas: Number(e.target.value) }))}
              className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
        </>
      )}
    </div>
  );
}
