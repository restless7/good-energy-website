import { 
  SimulationInput, 
  SimulationResult, 
  ScenarioDefinition, 
  MonthlyProjection 
} from '../types/simulator';

export const INFLACION_ESTIMADA_ANUAL = 0.06;

export function simulateSoloGranja(
  input: SimulationInput, 
  config: ScenarioDefinition
): SimulationResult {
  const { unidadesAComprar } = input;
  const { 
    precioComercialFarm, 
    generacionEstimadaKWh, 
    perdidaEstimada, 
    precioVentaKWh, 
    mantenimientoSeguroYAdmon 
  } = config;

  const inversionTotal = unidadesAComprar * precioComercialFarm;
  const mesesProyeccion = 120; // Defaulting to 10 years projection -> 120 months
  const proyecciones: MonthlyProjection[] = [];

  const generacionMensualKWh = (generacionEstimadaKWh / 12) * (1 - perdidaEstimada);
  const participationRatio = unidadesAComprar / config.unidadesDisponibles;

  let utilidadMensualAcumulada = 0;

  for (let m = 1; m <= mesesProyeccion; m++) {
    const year = Math.ceil(m / 12);
    const factorInflacion = Math.pow(1 + INFLACION_ESTIMADA_ANUAL, year - 1);
    
    const ingresosVentaEnergiaTotal = (generacionMensualKWh * precioVentaKWh) * factorInflacion;
    const ingresosInvestor = ingresosVentaEnergiaTotal * participationRatio;

    const costoMantenimientoTotal = (mantenimientoSeguroYAdmon / 12) * factorInflacion;
    const costoInvestor = costoMantenimientoTotal * participationRatio;

    const utilidadNetaMensual = ingresosInvestor - costoInvestor;

    proyecciones.push({
      month: m,
      year,
      generacionKWhMes: generacionMensualKWh * participationRatio,
      ingresosVentaEnergia: ingresosInvestor,
      costoMantenimiento: costoInvestor,
      costoAdministracion: 0,
      utilidadOperativa: utilidadNetaMensual,
      utilidadNeta: utilidadNetaMensual,
      rentabilidadMensual: utilidadNetaMensual / inversionTotal,
      rentabilidadAnualizada: (utilidadNetaMensual / inversionTotal) * 12
    });

    utilidadMensualAcumulada += utilidadNetaMensual;
  }

  const utilidadMensualPromedio = utilidadMensualAcumulada / mesesProyeccion;
  const utilidadAnualPromedio = utilidadMensualPromedio * 12;

  return {
    scenarioId: 'SOLO_GRANJA',
    inversionTotal,
    utilidadMensualPromedio,
    utilidadAnualPromedio,
    roiPromedio: utilidadAnualPromedio / inversionTotal,
    proyecciones
  };
}

export function simulateElectrolinera(
  input: SimulationInput, 
  config: ScenarioDefinition
): SimulationResult {
  const adjustedConfig: ScenarioDefinition = {
    ...config,
    precioVentaKWh: config.precioVentaKWhElectrolinera || 1800, 
  };

  const result = simulateSoloGranja(input, adjustedConfig);
  result.scenarioId = 'ELECTROLINERA';
  
  return result;
}

export function simulateTasaFija(
  input: SimulationInput, 
  config: ScenarioDefinition
): SimulationResult {
  const precioSeleccionado = input.precioComercialFarmSeleccionado || config.farmPricesOptions?.[0] || config.precioComercialFarm;
  const inversionTotal = input.unidadesAComprar * precioSeleccionado;
  
  // Find ROI matching the selected price
  const priceIndex = config.farmPricesOptions?.indexOf(precioSeleccionado) ?? 0;
  const roiAnual = config.roiOptions?.[priceIndex] !== undefined ? config.roiOptions[priceIndex] : 0.144; // fallback

  const utilidadAnualPromedio = inversionTotal * roiAnual;
  const utilidadMensualPromedio = utilidadAnualPromedio / 12;

  const proyecciones: MonthlyProjection[] = [];
  const mesesProyeccion = 120;

  for (let m = 1; m <= mesesProyeccion; m++) {
    proyecciones.push({
      month: m,
      year: Math.ceil(m / 12),
      generacionKWhMes: 0, // Abstracted away in Tasa Fija
      ingresosVentaEnergia: utilidadMensualPromedio, // Fixed return
      costoMantenimiento: 0,
      costoAdministracion: 0,
      utilidadOperativa: utilidadMensualPromedio,
      utilidadNeta: utilidadMensualPromedio,
      rentabilidadMensual: utilidadMensualPromedio / inversionTotal,
      rentabilidadAnualizada: roiAnual
    });
  }

  return {
    scenarioId: 'TASA_FIJA',
    inversionTotal,
    utilidadMensualPromedio,
    utilidadAnualPromedio,
    roiPromedio: roiAnual,
    proyecciones
  };
}

export function simulate100Farmers(
  input: SimulationInput, 
  config: ScenarioDefinition
): SimulationResult {
  const baseResult = simulateSoloGranja(input, config);

  const proyeccionesActualizadas = baseResult.proyecciones.map(p => {
    // Deduct 10% legal reserve and 35% taxes
    const reservaLegal = p.utilidadOperativa > 0 ? p.utilidadOperativa * 0.10 : 0;
    const baseGravable = p.utilidadOperativa - reservaLegal;
    const impuestos = baseGravable > 0 ? baseGravable * 0.35 : 0;
    
    const utilidadNeta = p.utilidadOperativa - reservaLegal - impuestos;

    return {
      ...p,
      reservaLegal,
      impuestos,
      utilidadNeta,
      rentabilidadMensual: utilidadNeta / baseResult.inversionTotal,
      rentabilidadAnualizada: (utilidadNeta / baseResult.inversionTotal) * 12
    }
  });

  const utilidadMensualTotal = proyeccionesActualizadas.reduce((acc, p) => acc + p.utilidadNeta, 0);
  const utilidadMensualPromedio = utilidadMensualTotal / baseResult.proyecciones.length;
  const utilidadAnualPromedio = utilidadMensualPromedio * 12;

  return {
    ...baseResult,
    scenarioId: '100_FARMERS',
    utilidadMensualPromedio,
    utilidadAnualPromedio,
    roiPromedio: utilidadAnualPromedio / baseResult.inversionTotal,
    proyecciones: proyeccionesActualizadas
  };
}

export function simulateEquipoComercial(
  input: SimulationInput, 
  config: ScenarioDefinition
): SimulationResult {
  const { unidadesAComprar, cuotaInicial = 0, numeroCuotas = 12 } = input;
  const inversionTotal = unidadesAComprar * config.precioComercialFarm;
  const saldoFinanciar = Math.max(0, inversionTotal - cuotaInicial);
  
  const cuotaAmortizacion = numeroCuotas > 0 ? saldoFinanciar / numeroCuotas : saldoFinanciar;

  const baseResult = simulateSoloGranja(input, config);

  const proyeccionesActualizadas = baseResult.proyecciones.map(p => {
    let saldoPendiente = Math.max(0, saldoFinanciar - (cuotaAmortizacion * p.month));
    let cuotaMes = p.month <= numeroCuotas ? cuotaAmortizacion : 0;

    return {
      ...p,
      cuotaAmortizacion: cuotaMes,
      saldoPendiente: p.month <= numeroCuotas ? saldoPendiente : 0
    };
  });

  return {
    ...baseResult,
    scenarioId: 'EQUIPO_COMERCIAL',
    proyecciones: proyeccionesActualizadas
  };
}

export function calculateSimulation(
  input: SimulationInput, 
  config: ScenarioDefinition
): SimulationResult {
  switch (input.scenario) {
    case 'SOLO_GRANJA':
      return simulateSoloGranja(input, config);
    case 'ELECTROLINERA':
      return simulateElectrolinera(input, config);
    case 'TASA_FIJA':
      return simulateTasaFija(input, config);
    case '100_FARMERS':
      return simulate100Farmers(input, config);
    case 'EQUIPO_COMERCIAL':
      return simulateEquipoComercial(input, config);
    default:
      throw new Error(`Scenario ${input.scenario} calculation logic is not implemented yet.`);
  }
}
