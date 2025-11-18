// app/api/simulator/route.ts

import { NextRequest, NextResponse } from 'next/server';

/**
 * Investment simulation parameters
 */
interface SimulationRequest {
  principal: number;     // Initial investment amount
  years: number;        // Investment duration in years
  annualRate: number;   // Annual return rate as percentage
  currency: 'COP' | 'USD';
}

/**
 * Simulation response with projected returns
 */
interface SimulationResponse {
  success: boolean;
  data?: {
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
  };
  error?: string;
}

/**
 * Calculate compound ROI with quarterly compounding
 * @param principal - Initial investment amount
 * @param annualRate - Annual return rate as percentage
 * @param years - Investment duration in years
 */
function calculateROI(principal: number, annualRate: number, years: number) {
  const rate = annualRate / 100;
  const quarterlyRate = rate / 4; // Quarterly compounding
  const periods = years * 4;
  
  // Compound interest formula: A = P(1 + r/n)^(nt)
  const finalAmount = principal * Math.pow(1 + quarterlyRate, periods);
  
  // Generate yearly breakdown
  const yearlyData = [];
  for (let year = 1; year <= years; year++) {
    const periodsForYear = year * 4;
    const valueAtYear = principal * Math.pow(1 + quarterlyRate, periodsForYear);
    yearlyData.push({
      year,
      value: Math.round(valueAtYear),
      profit: Math.round(valueAtYear - principal),
    });
  }
  
  return {
    totalReturn: Math.round(finalAmount),
    totalProfit: Math.round(finalAmount - principal),
    yearlyData,
    quarterlyIncome: Math.round((finalAmount - principal) / (years * 4)),
  };
}

/**
 * Validate simulation request parameters
 */
function validateRequest(data: unknown): { isValid: boolean; error?: string } {
  const { principal, years, annualRate, currency } = data as { principal: number; years: number; annualRate: number; currency: string };
  
  if (!principal || typeof principal !== 'number' || principal <= 0) {
    return { isValid: false, error: 'El monto de inversión debe ser un número mayor a 0' };
  }
  
  if (principal < 100000) { // Minimum 100k COP or equivalent
    return { isValid: false, error: 'El monto mínimo de inversión es $100,000 COP' };
  }
  
  if (!years || typeof years !== 'number' || years <= 0 || years > 30) {
    return { isValid: false, error: 'Los años deben estar entre 1 y 30' };
  }
  
  if (!annualRate || typeof annualRate !== 'number' || annualRate <= 0 || annualRate > 50) {
    return { isValid: false, error: 'La tasa de rentabilidad debe estar entre 1% y 50%' };
  }
  
  if (!currency || !['COP', 'USD'].includes(currency)) {
    return { isValid: false, error: 'La moneda debe ser COP o USD' };
  }
  
  return { isValid: true };
}

export async function POST(request: NextRequest) {
  try {
    const body: SimulationRequest = await request.json();
    
    // Validate request parameters
    const validation = validateRequest(body);
    if (!validation.isValid) {
      return NextResponse.json<SimulationResponse>(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }
    
    const { principal, years, annualRate, currency } = body;
    
    // Calculate ROI
    const roi = calculateROI(principal, annualRate, years);
    
    // Log simulation for analytics (anonymized)
    console.log(`Investment simulation: ${currency} ${principal} for ${years} years at ${annualRate}%`);
    
    // Return simulation results
    const response: SimulationResponse = {
      success: true,
      data: {
        principal,
        totalReturn: roi.totalReturn,
        totalProfit: roi.totalProfit,
        annualRate,
        years,
        currency,
        quarterlyIncome: roi.quarterlyIncome,
        yearlyData: roi.yearlyData,
      },
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Simulator API error:', error);
    return NextResponse.json<SimulationResponse>(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { 
      message: 'Investment Simulator API',
      endpoints: ['POST /api/simulator'],
      version: '1.0.0'
    },
    { status: 200 }
  );
}