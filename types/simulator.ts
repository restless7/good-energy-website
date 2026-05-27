export type SimulatorScenario = 
  | 'TASA_FIJA'
  | '100_FARMERS'
  | 'SOLO_GRANJA'
  | 'ELECTROLINERA'
  | 'EQUIPO_COMERCIAL';

export interface BaseSimulatorParams {
  unidadesDisponibles: number;
  potenciaInstaladaMw: number;
  panelesInstalados: number;
  generacionEstimadaKWh: number;
  perdidaEstimada: number; // percentage, e.g., 0.05 for 5%
  precioVentaKWh: number;
  precioComercialFarm: number;
  inflacionEstimadaAnual: number; // constant e.g., 0.06
  mantenimientoSeguroYAdmon: number; // fixed operational cost
}

export interface ScenarioDefinition extends BaseSimulatorParams {
  id: SimulatorScenario;
  name: string;
  description: string;
  // Scenario specifics
  precioVentaKWhElectrolinera?: number;
  farmPricesOptions?: number[]; // [35M, 40M, 45M, 50M]
  roiOptions?: number[]; // [14.4%, 13.8%, 13.3%, 12.8%]
}

export interface SimulationInput {
  scenario: SimulatorScenario;
  unidadesAComprar: number;
  
  // Specific inputs mapping
  cuotaInicial?: number; // for EQUIPO_COMERCIAL
  numeroCuotas?: number; // for EQUIPO_COMERCIAL
  precioComercialFarmSeleccionado?: number; // for TASA_FIJA
}

export interface MonthlyProjection {
  month: number;
  year: number;
  generacionKWhMes: number;
  ingresosVentaEnergia: number;
  costoMantenimiento: number;
  costoAdministracion: number;
  utilidadOperativa: number;
  
  reservaLegal?: number; // 10%
  impuestos?: number; // 35%
  utilidadNeta: number;
  
  rentabilidadMensual: number;
  rentabilidadAnualizada: number;
  
  // For EQUIPO_COMERCIAL financing
  cuotaAmortizacion?: number;
  saldoPendiente?: number; 
}

export interface SimulationResult {
  scenarioId: SimulatorScenario;
  inversionTotal: number;
  utilidadMensualPromedio: number;
  utilidadAnualPromedio: number;
  roiPromedio: number; // percentage
  proyecciones: MonthlyProjection[];
}
