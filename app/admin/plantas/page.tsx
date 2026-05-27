"use client";

import { Sun, MapPin, Zap, Activity } from 'lucide-react';

const mockPlants = [
  { id: '1', name: 'Planta Norte', location: 'Santander, Colombia', capacity: 500, energyGenerated: 4500, status: 'En operación', investors: 8 },
  { id: '2', name: 'Planta Sur', location: 'Valle del Cauca, Colombia', capacity: 350, energyGenerated: 3200, status: 'En operación', investors: 6 },
  { id: '3', name: 'Planta Centro', location: 'Cundinamarca, Colombia', capacity: 750, energyGenerated: 4750, status: 'En construcción', investors: 10 },
];

export default function PlantasPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#FFFDF0]">Plantas Solares</h1>
        <p className="text-[#8CB4BC] text-sm mt-1">Monitoreo y gestión de infraestructura solar</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {mockPlants.map((plant) => (
          <div key={plant.id} className="bg-[#0E4D58] rounded-2xl border border-[#1A6B78]/50 hover:border-[#D8DA00]/30 transition-all duration-300 overflow-hidden">
            {/* Status banner */}
            <div className={`px-4 py-2 text-xs font-medium ${
              plant.status === 'En operación' ? 'bg-[#D8DA00]/10 text-[#D8DA00]' : 'bg-orange-500/10 text-orange-400'
            }`}>
              {plant.status}
            </div>

            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-[#FFFDF0]">{plant.name}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-[#8CB4BC]" />
                    <span className="text-xs text-[#8CB4BC]">{plant.location}</span>
                  </div>
                </div>
                <div className="w-10 h-10 bg-[#D8DA00]/10 rounded-xl flex items-center justify-center">
                  <Sun className="w-5 h-5 text-[#D8DA00]" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <p className="text-[10px] text-[#8CB4BC] uppercase">Capacidad</p>
                  <p className="text-sm font-bold text-[#FFFDF0]">{plant.capacity} kW</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#8CB4BC] uppercase">Generado</p>
                  <p className="text-sm font-bold text-[#D8DA00]">{plant.energyGenerated.toLocaleString()} kWh</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#8CB4BC] uppercase">Inversores</p>
                  <p className="text-sm font-bold text-[#FFFDF0]">{plant.investors}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
