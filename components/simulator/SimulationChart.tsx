// components/simulator/SimulationChart.tsx

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { SimulationData } from './types';

interface SimulationChartProps {
  data: SimulationData;
}

const SimulationChart: React.FC<SimulationChartProps> = ({ data }) => {
  // Prepare chart data including initial investment point
  const chartData = [
    {
      year: 0,
      value: data.principal,
      profit: 0,
      label: 'Inicio',
    },
    ...data.yearlyData.map(item => ({
      ...item,
      label: `Año ${item.year}`,
    })),
  ];

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { label: string; value: number; profit: number } }>; label?: string }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-good-lime/20">
          <p className="font-semibold text-good-dark-green mb-2">{data.label}</p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Valor total:</span> {formatCurrency(data.value)}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Ganancia:</span> {formatCurrency(data.profit)}
          </p>
        </div>
      );
    }
    return null;
  };

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

  // Format Y-axis values
  const formatYAxis = (value: number) => {
    if (data.currency === 'COP') {
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
      }
      if (value >= 1000) {
        return `${(value / 1000).toFixed(0)}K`;
      }
    } else {
      if (value >= 1000000) {
        return `$${(value / 1000000).toFixed(1)}M`;
      }
      if (value >= 1000) {
        return `$${(value / 1000).toFixed(0)}K`;
      }
    }
    return value.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-good-lime/20"
    >
      <div className="flex items-center mb-6">
        <div className="flex items-center justify-center w-12 h-12 bg-good-lime rounded-full mr-4">
          <TrendingUp className="w-6 h-6 text-good-dark-green" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-good-dark-green">
            Proyección de Crecimiento
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Evolución de tu inversión durante {data.years} años
          </p>
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-80 w-full mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D8DA00" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#D8DA00" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#005461" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#005461" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#E5E7EB" 
              opacity={0.5}
            />
            
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
              tickFormatter={formatYAxis}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            {/* Total Value Area */}
            <Area
              type="monotone"
              dataKey="value"
              stroke="#D8DA00"
              strokeWidth={3}
              fill="url(#colorValue)"
              name="Valor Total"
            />
            
            {/* Profit Line */}
            <Line
              type="monotone"
              dataKey="profit"
              stroke="#005461"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: '#005461', strokeWidth: 2, r: 4 }}
              name="Ganancia"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Legend */}
      <div className="flex justify-center space-x-6 text-sm">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-good-lime rounded-sm mr-2 opacity-60"></div>
          <span className="text-gray-600">Valor Total</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-1 bg-good-dark-green rounded-sm mr-2" style={{ borderStyle: 'dashed' }}></div>
          <span className="text-gray-600">Ganancia</span>
        </div>
      </div>

      {/* Key Insights */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-semibold text-good-dark-green mb-3">📈 Puntos Clave</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center text-gray-600">
            <span className="text-good-lime mr-2">•</span>
            Crecimiento promedio anual: <strong className="text-good-dark-green ml-1">{data.annualRate}%</strong>
          </div>
          <div className="flex items-center text-gray-600">
            <span className="text-good-lime mr-2">•</span>
            ROI total: <strong className="text-good-dark-green ml-1">{Math.round((data.totalProfit / data.principal) * 100)}%</strong>
          </div>
          <div className="flex items-center text-gray-600">
            <span className="text-good-lime mr-2">•</span>
            Ingreso trimestral: <strong className="text-good-dark-green ml-1">{formatCurrency(data.quarterlyIncome)}</strong>
          </div>
          <div className="flex items-center text-gray-600">
            <span className="text-good-lime mr-2">•</span>
            Compuesto trimestralmente
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SimulationChart;