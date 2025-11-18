// components/simulator/InvestmentForm.tsx

'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, DollarSign } from 'lucide-react';
import { SimulationInput, ValidationState } from './types';

interface InvestmentFormProps {
  onSimulate: (input: SimulationInput) => void;
  isLoading?: boolean;
}

const InvestmentForm: React.FC<InvestmentFormProps> = ({ onSimulate, isLoading = false }) => {
  const [formData, setFormData] = useState<SimulationInput>({
    principal: 1000000, // Default 1M COP
    years: 5,
    annualRate: 12, // Default 12% annual return
    currency: 'COP',
  });

  const [touched, setTouched] = useState({
    principal: false,
    years: false,
    annualRate: false,
  });

  // Validation logic
  const validation = useMemo((): ValidationState => {
    const errors: ValidationState['errors'] = {};

    if (formData.principal <= 0) {
      errors.principal = 'El monto debe ser mayor a 0';
    } else if (formData.principal < 100000) {
      errors.principal = 'Monto mínimo: $100,000 COP';
    }

    if (formData.years <= 0 || formData.years > 30) {
      errors.years = 'Entre 1 y 30 años';
    }

    if (formData.annualRate <= 0 || formData.annualRate > 50) {
      errors.annualRate = 'Entre 1% y 50%';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }, [formData]);

  const handleInputChange = (field: keyof SimulationInput, value: number | string) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'currency' ? value : Number(value),
    }));
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched to show validation errors
    setTouched({ principal: true, years: true, annualRate: true });

    if (validation.isValid) {
      onSimulate(formData);
    }
  };

  const formatCurrency = (value: number) => {
    if (formData.currency === 'COP') {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
      }).format(value);
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-good-lime/20"
    >
      <div className="flex items-center mb-6">
        <div className="flex items-center justify-center w-12 h-12 bg-good-lime rounded-full mr-4">
          <Calculator className="w-6 h-6 text-good-dark-green" />
        </div>
        <h2 className="text-2xl font-bold text-good-dark-green">
          Calculadora de Inversión
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Currency Selection */}
        <div>
          <label className="block text-sm font-medium text-good-dark-green mb-2">
            Moneda
          </label>
          <div className="grid grid-cols-2 gap-3">
            {['COP', 'USD'].map((currency) => (
              <button
                key={currency}
                type="button"
                onClick={() => handleInputChange('currency', currency)}
                className={`p-3 rounded-xl font-medium transition-all ${
                  formData.currency === currency
                    ? 'bg-good-lime text-good-dark-green shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {currency === 'COP' ? '🇨🇴 COP' : '🇺🇸 USD'}
              </button>
            ))}
          </div>
        </div>

        {/* Investment Amount */}
        <div>
          <label htmlFor="principal" className="block text-sm font-medium text-good-dark-green mb-2">
            Monto a invertir
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="principal"
              type="number"
              min="100000"
              step="100000"
              value={formData.principal}
              onChange={(e) => handleInputChange('principal', e.target.value)}
              onBlur={() => handleBlur('principal')}
              className={`block w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-good-lime focus:border-transparent ${
                touched.principal && validation.errors.principal
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 bg-white'
              }`}
              placeholder="1,000,000"
            />
          </div>
          {touched.principal && validation.errors.principal && (
            <p className="mt-1 text-sm text-red-600">{validation.errors.principal}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Equivale a: {formatCurrency(formData.principal)}
          </p>
        </div>

        {/* Investment Duration */}
        <div>
          <label htmlFor="years" className="block text-sm font-medium text-good-dark-green mb-2">
            Duración (años)
          </label>
          <input
            id="years"
            type="number"
            min="1"
            max="30"
            value={formData.years}
            onChange={(e) => handleInputChange('years', e.target.value)}
            onBlur={() => handleBlur('years')}
            className={`block w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-good-lime focus:border-transparent ${
              touched.years && validation.errors.years
                ? 'border-red-300 bg-red-50'
                : 'border-gray-300 bg-white'
            }`}
            placeholder="5"
          />
          {touched.years && validation.errors.years && (
            <p className="mt-1 text-sm text-red-600">{validation.errors.years}</p>
          )}
        </div>

        {/* Annual Return Rate */}
        <div>
          <label htmlFor="annualRate" className="block text-sm font-medium text-good-dark-green mb-2">
            Tasa de rentabilidad anual (%)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <TrendingUp className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="annualRate"
              type="number"
              min="1"
              max="50"
              step="0.1"
              value={formData.annualRate}
              onChange={(e) => handleInputChange('annualRate', e.target.value)}
              onBlur={() => handleBlur('annualRate')}
              className={`block w-full pl-10 pr-8 py-3 border rounded-xl focus:ring-2 focus:ring-good-lime focus:border-transparent ${
                touched.annualRate && validation.errors.annualRate
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 bg-white'
              }`}
              placeholder="12.0"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-400">%</span>
            </div>
          </div>
          {touched.annualRate && validation.errors.annualRate && (
            <p className="mt-1 text-sm text-red-600">{validation.errors.annualRate}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Basado en datos históricos de energía solar en Colombia
          </p>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isLoading || !validation.isValid}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all ${
            isLoading || !validation.isValid
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-good-lime text-good-dark-green hover:bg-good-lime/90 shadow-lg hover:shadow-xl'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-good-dark-green/30 border-t-good-dark-green rounded-full animate-spin mr-2"></div>
              Calculando...
            </div>
          ) : (
            '🌞 Simular Inversión'
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default InvestmentForm;