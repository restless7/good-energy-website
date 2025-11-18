// lib/dashboard/utils.ts

import { format, parseISO, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';

// Type definitions
export interface Investment {
  id: string;
  type: string;
  amount: number;
  currency: string;
  roi: number;
  actualRoi?: number;
  status: string;
  startDate: string;
  plantId?: string;
  plant?: {
    name: string;
    location: string;
    capacity: number;
    energyGenerated: number;
    status: string;
  };
}

export interface Earning {
  id: string;
  investmentId: string;
  amount: number;
  currency: string;
  type: string;
  status: string;
  paymentDate?: string | null;
  paymentMethod?: string | null;
  netAmount: number;
  taxWithheld: number;
}

// Currency formatting
export const formatCurrency = (amount: number, currency: string = 'COP'): string => {
  const formatter = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return formatter.format(amount);
};

// Compact currency formatting for large numbers
export const formatCompactCurrency = (amount: number, currency: string = 'COP'): string => {
  if (amount >= 1000000000) {
    return `${(amount / 1000000000).toFixed(1)}B ${currency}`;
  }
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M ${currency}`;
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}K ${currency}`;
  }
  return formatCurrency(amount, currency);
};

// Percentage formatting
export const formatPercentage = (percentage: number, decimals: number = 1): string => {
  return `${percentage.toFixed(decimals)}%`;
};

// Date formatting
export const formatDate = (date: string | Date, formatStr: string = 'dd MMM yyyy'): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr, { locale: es });
};

// ROI calculation
export const calculateROI = (
  principal: number,
  currentValue: number,
  timeInYears: number
): { roi: number; annualizedROI: number } => {
  const totalROI = ((currentValue - principal) / principal) * 100;
  const annualizedROI = Math.pow(currentValue / principal, 1 / timeInYears) - 1;
  
  return {
    roi: totalROI,
    annualizedROI: annualizedROI * 100
  };
};

// Generate mock investment data for development
export const generateMockInvestments = () => [
  {
    id: '1',
    type: 'Base',
    amount: 5000000,
    currency: 'COP',
    roi: 8.5,
    actualRoi: 9.2,
    status: 'Activa',
    startDate: '2024-03-15',
    plantId: 'plant-1',
    plant: {
      name: 'Planta Solar Bucaramanga I',
      location: 'Bucaramanga, Santander',
      capacity: 2500,
      energyGenerated: 1250000,
      status: 'En operación'
    }
  },
  {
    id: '2',
    type: 'Crecimiento',
    amount: 15000000,
    currency: 'COP',
    roi: 10.2,
    actualRoi: 11.8,
    status: 'Activa',
    startDate: '2024-01-20',
    plantId: 'plant-2',
    plant: {
      name: 'Planta Solar Medellín II',
      location: 'Medellín, Antioquia',
      capacity: 5000,
      energyGenerated: 2890000,
      status: 'En operación'
    }
  },
  {
    id: '3',
    type: 'Premium',
    amount: 25000000,
    currency: 'COP',
    roi: 12.0,
    actualRoi: 12.5,
    status: 'Activa',
    startDate: '2023-11-10',
    plantId: 'plant-3',
    plant: {
      name: 'Planta Solar Barranquilla III',
      location: 'Barranquilla, Atlántico',
      capacity: 8000,
      energyGenerated: 4560000,
      status: 'En operación'
    }
  }
];

// Generate mock earnings data
export const generateMockEarnings = () => [
  {
    id: '1',
    investmentId: '1',
    amount: 191667,
    currency: 'COP',
    type: 'Ganancia',
    status: 'Pagado',
    paymentDate: '2024-09-15',
    paymentMethod: 'Transferencia',
    netAmount: 176833,
    taxWithheld: 14834
  },
  {
    id: '2',
    investmentId: '2',
    amount: 612500,
    currency: 'COP',
    type: 'Ganancia',
    status: 'Pagado',
    paymentDate: '2024-09-15',
    paymentMethod: 'PayU',
    netAmount: 566500,
    taxWithheld: 46000
  },
  {
    id: '3',
    investmentId: '3',
    amount: 1041667,
    currency: 'COP',
    type: 'Ganancia',
    status: 'Pagado',
    paymentDate: '2024-09-15',
    paymentMethod: 'Transferencia',
    netAmount: 963333,
    taxWithheld: 78334
  },
  {
    id: '4',
    investmentId: '1',
    amount: 191667,
    currency: 'COP',
    type: 'Ganancia',
    status: 'Pendiente',
    paymentDate: null,
    paymentMethod: null,
    netAmount: 176833,
    taxWithheld: 14834
  }
];

// Generate chart data for earnings over time
export const generateEarningsChartData = (months: number = 12) => {
  const data = [];
  const baseEarnings = {
    Base: 191667,
    Crecimiento: 612500,
    Premium: 1041667
  };

  for (let i = months - 1; i >= 0; i--) {
    const date = subMonths(new Date(), i);
    const month = format(date, 'MMM yyyy', { locale: es });
    
    // Add some variation to make data more realistic
    const variation = 0.8 + Math.random() * 0.4; // 80% to 120% of base
    
    data.push({
      month,
      date: format(date, 'yyyy-MM-dd'),
      Base: Math.round(baseEarnings.Base * variation),
      Crecimiento: Math.round(baseEarnings.Crecimiento * variation),
      Premium: Math.round(baseEarnings.Premium * variation),
      total: Math.round((baseEarnings.Base + baseEarnings.Crecimiento + baseEarnings.Premium) * variation)
    });
  }

  return data;
};

// Calculate portfolio metrics
export const calculatePortfolioMetrics = (investments: Investment[], earnings: Earning[]) => {
  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalEarnings = earnings.reduce((sum, earning) => sum + earning.netAmount, 0);
  const pendingEarnings = earnings
    .filter(e => e.status === 'Pendiente')
    .reduce((sum, earning) => sum + earning.netAmount, 0);
  
  const totalValue = totalInvested + totalEarnings;
  const overallROI = totalInvested > 0 ? ((totalValue - totalInvested) / totalInvested) * 100 : 0;
  
  // Calculate total energy generated
  const totalEnergyGenerated = investments.reduce((sum, inv) => {
    return sum + (inv.plant?.energyGenerated || 0);
  }, 0);

  // Calculate CO2 saved (approximately 0.45 kg CO2 per kWh)
  const co2Saved = (totalEnergyGenerated / 1000) * 0.45; // Convert to tons

  return {
    totalInvested,
    totalEarnings,
    pendingEarnings,
    totalValue,
    overallROI,
    totalEnergyGenerated,
    co2Saved
  };
};

// Investment type configurations
export const investmentTypes = {
  Base: {
    name: 'Sol Inversor Base',
    color: '#10b981', // emerald-500
    bgColor: '#d1fae5', // emerald-100
    icon: '🌱',
    description: 'Entrada ideal al mundo solar',
    minAmount: 1000000,
    expectedROI: '8-10%'
  },
  Crecimiento: {
    name: 'Sol Inversor Crecimiento',
    color: '#f59e0b', // amber-500
    bgColor: '#fef3c7', // amber-100
    icon: '🌞',
    description: 'Equilibrio perfecto de rentabilidad',
    minAmount: 5000000,
    expectedROI: '10-12%'
  },
  Premium: {
    name: 'Sol Inversor Premium',
    color: '#8b5cf6', // violet-500
    bgColor: '#ede9fe', // violet-100
    icon: '⚡',
    description: 'Máximo potencial de ganancias',
    minAmount: 20000000,
    expectedROI: '12-15%'
  }
};

// Status configurations
export const statusConfig = {
  investment: {
    'Activa': { color: 'text-green-600', bgColor: 'bg-green-100', icon: '🟢' },
    'Completada': { color: 'text-blue-600', bgColor: 'bg-blue-100', icon: '✅' },
    'Cancelada': { color: 'text-red-600', bgColor: 'bg-red-100', icon: '❌' }
  },
  earning: {
    'Pagado': { color: 'text-green-600', bgColor: 'bg-green-100', icon: '✅' },
    'Pendiente': { color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: '⏳' },
    'Procesando': { color: 'text-blue-600', bgColor: 'bg-blue-100', icon: '🔄' }
  },
  plant: {
    'En construcción': { color: 'text-orange-600', bgColor: 'bg-orange-100', icon: '🚧' },
    'En operación': { color: 'text-green-600', bgColor: 'bg-green-100', icon: '⚡' },
    'Mantenimiento': { color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: '🔧' }
  }
};

// Utility to convert energy to homes powered
export const energyToHomesPowered = (kWh: number): number => {
  // Average Colombian household consumes ~200 kWh per month
  return Math.floor(kWh / 200);
};

// Export data to CSV
export const exportToCSV = (data: Record<string, unknown>[], filename: string) => {
  if (!data.length) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape commas and quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};