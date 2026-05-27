import { ScenarioDefinition } from '../types/simulator';

// Master data config replacing the Excel source for Good Energy Sims
export const SIMULATOR_SCENARIOS: Record<string, ScenarioDefinition> = {
  SOLO_GRANJA: {
    id: 'SOLO_GRANJA',
    name: 'Solo Granja',
    description: 'Venta de energía generada en la granja solar sin servicios adicionales.',
    unidadesDisponibles: 1000,
    potenciaInstaladaMw: 1, // 1MWp
    panelesInstalados: 1400,
    generacionEstimadaKWh: 1500000, // 1.5M KWh/year
    perdidaEstimada: 0.05,
    precioVentaKWh: 496.39,
    precioComercialFarm: 35000000, // 35M COP per unit
    inflacionEstimadaAnual: 0.06,
    mantenimientoSeguroYAdmon: 12000000, // Example fixed annual operational cost
  },
  ELECTROLINERA: {
    id: 'ELECTROLINERA',
    name: 'Electrolinera',
    description: 'Estación de carga para vehículos eléctricos, vendiendo energía a mayor precio.',
    unidadesDisponibles: 50,
    potenciaInstaladaMw: 0.5,
    panelesInstalados: 700,
    generacionEstimadaKWh: 750000,
    perdidaEstimada: 0.05,
    precioVentaKWh: 1800,
    precioComercialFarm: 45000000,
    inflacionEstimadaAnual: 0.06,
    mantenimientoSeguroYAdmon: 20000000,
  },
  TASA_FIJA: {
    id: 'TASA_FIJA',
    name: 'Tasa Fija',
    description: 'Inversión con rentabilidad fija pre-acordada basada en el costo de la fracción.',
    unidadesDisponibles: 500,
    potenciaInstaladaMw: 1,
    panelesInstalados: 1400,
    generacionEstimadaKWh: 1500000,
    perdidaEstimada: 0.05,
    precioVentaKWh: 496.39, // Handled abstractly via fixed ROI
    precioComercialFarm: 35000000, // default, user can select others
    inflacionEstimadaAnual: 0.06,
    mantenimientoSeguroYAdmon: 0, // Managed by operator, user gets fixed net cut
    farmPricesOptions: [35000000, 40000000, 45000000, 50000000],
    roiOptions: [0.144, 0.138, 0.133, 0.128], // maps 1-1 with farmPricesOptions (14.4% to 12.8%)
  },
  "100_FARMERS": {
    id: '100_FARMERS',
    name: '100 < Farmers',
    description: 'Modelo colaborativo con descuentos de reserva legal e impuestos corporativos.',
    unidadesDisponibles: 100,
    potenciaInstaladaMw: 2,
    panelesInstalados: 2200,
    generacionEstimadaKWh: 3000000,
    perdidaEstimada: 0.05,
    precioVentaKWh: 496.39,
    precioComercialFarm: 40000000,
    inflacionEstimadaAnual: 0.06,
    mantenimientoSeguroYAdmon: 50000000,
  },
  EQUIPO_COMERCIAL: {
    id: 'EQUIPO_COMERCIAL',
    name: 'Equipo Comercial',
    description: 'Plan de pagos financiado (amortización) para el equipo comercial internamente.',
    unidadesDisponibles: 200,
    potenciaInstaladaMw: 1,
    panelesInstalados: 1400,
    generacionEstimadaKWh: 1500000,
    perdidaEstimada: 0.05,
    precioVentaKWh: 496.39,
    precioComercialFarm: 45000000,
    inflacionEstimadaAnual: 0.06,
    mantenimientoSeguroYAdmon: 12000000,
  }
};
