// app/(dashboard)/inversiones/components/OverviewCards.tsx

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  Zap, 
  Leaf, 
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Clock
} from 'lucide-react';
import { formatCurrency, formatPercentage, formatCompactCurrency } from '@/lib/dashboard/utils';

export interface OverviewMetrics {
  totalInvested: number;
  totalEarnings: number;
  pendingEarnings: number;
  overallROI: number;
  totalEnergyGenerated: number;
  co2Saved: number;
}

interface OverviewCardsProps {
  metrics: OverviewMetrics;
  isLoading?: boolean;
}

const OverviewCards: React.FC<OverviewCardsProps> = ({ metrics, isLoading = false }) => {
  const cards = [
    {
      title: 'Total Invertido',
      value: formatCurrency(metrics.totalInvested),
      compactValue: formatCompactCurrency(metrics.totalInvested),
      icon: PieChart,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      change: null,
      description: '3 inversiones activas'
    },
    {
      title: 'Ganancias Acumuladas',
      value: formatCurrency(metrics.totalEarnings),
      compactValue: formatCompactCurrency(metrics.totalEarnings),
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      change: {
        value: 8.5,
        positive: true,
        label: 'vs mes anterior'
      },
      description: 'Pagos mensuales regulares'
    },
    {
      title: 'ROI Promedio',
      value: formatPercentage(metrics.overallROI, 1),
      compactValue: formatPercentage(metrics.overallROI, 1),
      icon: TrendingUp,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      change: {
        value: 1.2,
        positive: true,
        label: 'anual'
      },
      description: 'Superando expectativas'
    },
    {
      title: 'Energía Generada',
      value: `${(metrics.totalEnergyGenerated / 1000000).toFixed(1)}M kWh`,
      compactValue: `${(metrics.totalEnergyGenerated / 1000000).toFixed(1)}M kWh`,
      icon: Zap,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50',
      change: null,
      description: `${Math.floor(metrics.totalEnergyGenerated / 200)} hogares alimentados`
    },
    {
      title: 'CO₂ Evitado',
      value: `${metrics.co2Saved.toFixed(1)} tons`,
      compactValue: `${metrics.co2Saved.toFixed(1)} tons`,
      icon: Leaf,
      color: 'from-green-600 to-emerald-600',
      bgColor: 'bg-green-50',
      change: null,
      description: 'Equivale a plantar 50 árboles'
    },
    {
      title: 'Ganancias Pendientes',
      value: formatCurrency(metrics.pendingEarnings),
      compactValue: formatCompactCurrency(metrics.pendingEarnings),
      icon: Clock,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50',
      change: null,
      description: 'Próximo pago: 15 Oct'
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                <div className="w-16 h-6 bg-gray-200 rounded"></div>
              </div>
              <div className="w-32 h-8 bg-gray-200 rounded mb-2"></div>
              <div className="w-24 h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${card.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-6 h-6 text-gray-600" />
              </div>
              
              {card.change && (
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                  card.change.positive 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {card.change.positive ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  <span>{formatPercentage(card.change.value, 1)}</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="space-y-1 mb-3">
              <h3 className="text-sm font-medium text-gray-600">{card.title}</h3>
              <div className="flex items-end space-x-2">
                <span className="text-2xl lg:text-3xl font-bold text-gray-900 hidden md:block">
                  {card.value}
                </span>
                <span className="text-2xl lg:text-3xl font-bold text-gray-900 md:hidden">
                  {card.compactValue}
                </span>
                {card.change && (
                  <span className="text-xs text-gray-500 mb-1">
                    {card.change.label}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-500">{card.description}</p>
          </motion.div>
        );
      })}
    </div>
  );
};

export default OverviewCards;