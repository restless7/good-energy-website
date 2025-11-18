// components/simulator/ResultCard.tsx

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Banknote, TrendingUp, Calendar, Target } from 'lucide-react';
import { SimulationData } from './types';

interface ResultCardProps {
  data: SimulationData;
}

const ResultCard: React.FC<ResultCardProps> = ({ data }) => {
  // Format currency values
  const formatCurrency = (value: number) => {
    if (data.currency === 'COP') {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Calculate percentage growth
  const percentageGrowth = Math.round((data.totalProfit / data.principal) * 100);
  
  // Calculate monthly income (quarterly / 3)
  const monthlyIncome = Math.round(data.quarterlyIncome / 3);

  const resultItems = [
    {
      icon: Target,
      label: 'Inversión Inicial',
      value: formatCurrency(data.principal),
      description: `Capital invertido en energía solar`,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
    },
    {
      icon: Banknote,
      label: 'Valor Final',
      value: formatCurrency(data.totalReturn),
      description: `Valor total después de ${data.years} años`,
      color: 'text-good-dark-green',
      bgColor: 'bg-good-lime/20',
    },
    {
      icon: TrendingUp,
      label: 'Ganancia Total',
      value: formatCurrency(data.totalProfit),
      description: `${percentageGrowth}% de crecimiento`,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      icon: Calendar,
      label: 'Ingreso Mensual',
      value: formatCurrency(monthlyIncome),
      description: 'Promedio mensual estimado',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-good-lime/20"
    >
      <div className="text-center mb-8">
        <motion.h3
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-3xl font-bold text-good-dark-green mb-2"
        >
          🌞 Resumen de tu Inversión
        </motion.h3>
        <p className="text-gray-600">
          Proyección basada en rendimiento histórico del sector solar en Colombia
        </p>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {resultItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              className={`${item.bgColor} rounded-2xl p-6 border border-gray-200/50`}
            >
              <div className="flex items-start">
                <div className={`p-3 rounded-full ${item.bgColor} border-2 border-white/50 mr-4`}>
                  <Icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {item.label}
                  </p>
                  <p className={`text-2xl font-bold ${item.color} mb-1`}>
                    {item.value}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Key Metrics Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="bg-gradient-to-r from-good-lime/10 to-good-dark-green/10 rounded-2xl p-6 border border-good-lime/30"
      >
        <h4 className="font-bold text-good-dark-green mb-4 flex items-center">
          📊 Métricas Destacadas
        </h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="bg-white/50 rounded-xl p-4">
            <p className="text-2xl font-bold text-good-dark-green">
              {data.annualRate}%
            </p>
            <p className="text-sm text-gray-600">Rentabilidad anual</p>
          </div>
          
          <div className="bg-white/50 rounded-xl p-4">
            <p className="text-2xl font-bold text-good-dark-green">
              {Math.round(data.totalReturn / data.principal * 100) / 100}x
            </p>
            <p className="text-sm text-gray-600">Multiplicador de inversión</p>
          </div>
          
          <div className="bg-white/50 rounded-xl p-4">
            <p className="text-2xl font-bold text-good-dark-green">
              {data.years}
            </p>
            <p className="text-sm text-gray-600">
              {data.years === 1 ? 'Año' : 'Años'} de inversión
            </p>
          </div>
        </div>
      </motion.div>

      {/* Trust Indicators */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.2 }}
        className="mt-6 pt-6 border-t border-gray-200"
      >
        <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-600">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span>Basado en datos reales</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            <span>Transparencia total</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-good-lime rounded-full mr-2"></div>
            <span>Impacto ambiental</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ResultCard;