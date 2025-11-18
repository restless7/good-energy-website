// components/simulator/types.ts

/**
 * Investment simulation input parameters
 */
export interface SimulationInput {
  principal: number;     // Initial investment amount
  years: number;        // Investment duration in years
  annualRate: number;   // Annual return rate as percentage
  currency: 'COP' | 'USD';
}

/**
 * Simulation results data structure
 */
export interface SimulationData {
  principal: number;
  totalReturn: number;
  totalProfit: number;
  annualRate: number;
  years: number;
  currency: string;
  quarterlyIncome: number;
  yearlyData: Array<{
    year: number;
    value: number;
    profit: number;
  }>;
}

/**
 * API response structure
 */
export interface SimulationResponse {
  success: boolean;
  data?: SimulationData;
  error?: string;
}

/**
 * Form field validation state
 */
export interface ValidationState {
  isValid: boolean;
  errors: {
    principal?: string;
    years?: string;
    annualRate?: string;
  };
}