'use client';

import React from 'react';
import { useSimulator } from './SimulatorContext';
import { SIMULATOR_SCENARIOS } from '../../lib/simulatorDataConfig';
import { SimulatorScenario } from '../../types/simulator';

export function ScenarioSelector() {
  const { input, setInput } = useSimulator();

  const scenarios = Object.values(SIMULATOR_SCENARIOS);

  const handleSelect = (scenarioId: SimulatorScenario) => {
    // Reset specific inputs when changing scenario to prevent state pollution
    setInput({
      scenario: scenarioId,
      unidadesAComprar: 1, 
    });
  };

  return (
    <div className="w-full bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm border border-zinc-200 dark:border-zinc-800">
      <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-4">Modelo de Negocio</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
        {scenarios.map((s) => (
          <button
            key={s.id}
            onClick={() => handleSelect(s.id as SimulatorScenario)}
            className={`p-3 rounded-lg text-sm text-left transition-all ${
              input.scenario === s.id 
                ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-600 ring-offset-2 dark:ring-offset-zinc-900 border-none' 
                : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 border'
            }`}
          >
            <div className="font-bold">{s.name}</div>
          </button>
        ))}
      </div>
      <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
        {SIMULATOR_SCENARIOS[input.scenario].description}
      </p>
    </div>
  );
}
