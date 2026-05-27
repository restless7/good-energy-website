import React from 'react';
import { SimulatorProvider } from '../../components/simulator/SimulatorContext';
import { ScenarioSelector } from '../../components/simulator/ScenarioSelector';
import { DynamicInputs } from '../../components/simulator/DynamicInputs';
import { SimulatorSummaryCards } from '../../components/simulator/SimulatorSummaryCards';
import { SimulatorProjectionsChart } from '../../components/simulator/SimulatorProjectionsChart';

export const metadata = {
  title: 'Simulador Financiero - Good Energy',
  description: 'Simulador dinámico de escenarios financieros para inversiones en granjas solares',
};

export default function InvestmentSimulatorPage() {
  return (
    <SimulatorProvider>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 md:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              Simulador Financiero <span className="text-emerald-500">Oro Miel</span>
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">
              Proyecta tus retornos, compara modelos de negocio y descubre la viabilidad energética de tu inversión solar a 10 años.
            </p>
          </div>

          <ScenarioSelector />

          <SimulatorSummaryCards />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <DynamicInputs />
            </div>
            <div className="lg:col-span-2">
              <SimulatorProjectionsChart />
            </div>
          </div>

        </div>
      </div>
    </SimulatorProvider>
  );
}