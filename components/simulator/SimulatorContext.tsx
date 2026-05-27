'use client';

import React, { createContext, useContext, useState, useMemo } from 'react';
import { SimulatorScenario, SimulationInput, SimulationResult } from '../../types/simulator';
import { calculateSimulation } from '../../lib/simulatorEngine';
import { SIMULATOR_SCENARIOS } from '../../lib/simulatorDataConfig';

interface SimulatorState {
  input: SimulationInput;
  setInput: React.Dispatch<React.SetStateAction<SimulationInput>>;
  result: SimulationResult;
}

const SimulatorContext = createContext<SimulatorState | undefined>(undefined);

export function SimulatorProvider({ children }: { children: React.ReactNode }) {
  const [input, setInput] = useState<SimulationInput>({
    scenario: 'SOLO_GRANJA',
    unidadesAComprar: 1,
  });

  const result = useMemo(() => {
    const config = SIMULATOR_SCENARIOS[input.scenario];
    return calculateSimulation(input, config);
  }, [input]);

  return (
    <SimulatorContext.Provider value={{ input, setInput, result }}>
      {children}
    </SimulatorContext.Provider>
  );
}

export function useSimulator() {
  const context = useContext(SimulatorContext);
  if (context === undefined) {
    throw new Error('useSimulator must be used within a SimulatorProvider');
  }
  return context;
}
