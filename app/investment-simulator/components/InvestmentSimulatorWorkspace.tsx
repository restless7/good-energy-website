"use client";

import React, { useState } from 'react';
import { ElectrolineraSimulator } from './ElectrolineraSimulator';
import { SolarFarmSimulator } from './SolarFarmSimulator';
import { Zap, Sun } from 'lucide-react';

export function InvestmentSimulatorWorkspace() {
  const [activeTab, setActiveTab] = useState<'ELECTROLINERA' | 'SOLAR_FARM'>('ELECTROLINERA');

  return (
    <div className="space-y-8">
      {/* Tabs */}
      <div className="flex flex-col sm:flex-row gap-4 border-b border-[#1A6B78]/30 pb-1">
        <button
          onClick={() => setActiveTab('ELECTROLINERA')}
          className={`flex items-center gap-3 px-6 py-4 rounded-t-xl transition-colors font-bold ${
            activeTab === 'ELECTROLINERA'
              ? 'bg-[#0E4D58] text-[#D8DA00] border-b-2 border-[#D8DA00]'
              : 'text-[#8CB4BC] hover:text-[#FFFDF0] hover:bg-[#0E4D58]/50'
          }`}
        >
          <Zap className="w-5 h-5" />
          PILAR 1: Electrolineras Premium
        </button>
        <button
          onClick={() => setActiveTab('SOLAR_FARM')}
          className={`flex items-center gap-3 px-6 py-4 rounded-t-xl transition-colors font-bold ${
            activeTab === 'SOLAR_FARM'
              ? 'bg-[#0E4D58] text-[#D8DA00] border-b-2 border-[#D8DA00]'
              : 'text-[#8CB4BC] hover:text-[#FFFDF0] hover:bg-[#0E4D58]/50'
          }`}
        >
          <Sun className="w-5 h-5" />
          PILAR 2: Granjas Solares Fraccionadas
        </button>
      </div>

      {/* Active Workspace */}
      <div className="min-h-[600px]">
        {activeTab === 'ELECTROLINERA' && <ElectrolineraSimulator />}
        {activeTab === 'SOLAR_FARM' && <SolarFarmSimulator />}
      </div>
    </div>
  );
}
