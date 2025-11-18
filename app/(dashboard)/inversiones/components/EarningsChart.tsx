// app/(dashboard)/inversiones/components/EarningsChart.tsx

'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar
} from 'recharts';
import { TrendingUp, BarChart3, Activity, Calendar } from 'lucide-react';
import { formatCurrency, generateEarningsChartData } from '@/lib/dashboard/utils';

type ChartType = 'line' | 'area' | 'bar';
type TimePeriod = 'mensual' | 'trimestral' | 'anual';

interface EarningsChartProps {
  className?: string;
}

const EarningsChart: React.FC<EarningsChartProps> = ({ className = '' }) => {
  const [chartType, setChartType] = useState<ChartType>('area');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('mensual');

  // Generate chart data based on time period
  const chartData = useMemo(() => {
    const months = timePeriod === 'anual' ? 12 : timePeriod === 'trimestral' ? 3 : 6;
    return generateEarningsChartData(months);
  }, [timePeriod]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{
      color: string;
      dataKey: string;
      value: number;
    }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">{label}</h3>
          {payload.map((entry, index: number) => (
            <div key={index} className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-gray-600">{entry.dataKey}</span>
              </div>
              <span className="text-sm font-semibold">
                {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
          <div className="border-t pt-2 mt-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">Total:</span>
              <span className="text-sm font-bold text-good-dark-green">
                {formatCurrency(payload.reduce((sum: number, entry) => sum + entry.value, 0))}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const chartTypes = [
    { type: 'area' as ChartType, icon: Activity, label: 'Área', color: 'text-blue-600' },
    { type: 'line' as ChartType, icon: TrendingUp, label: 'Línea', color: 'text-green-600' },
    { type: 'bar' as ChartType, icon: BarChart3, label: 'Barras', color: 'text-purple-600' }
  ];

  const timePeriods = [
    { period: 'mensual' as TimePeriod, label: 'Mensual', description: '6 meses' },
    { period: 'trimestral' as TimePeriod, label: 'Trimestral', description: '3 meses' },
    { period: 'anual' as TimePeriod, label: 'Anual', description: '12 meses' }
  ];

  const colors = {
    Base: '#10b981',
    Crecimiento: '#f59e0b',
    Premium: '#8b5cf6',
    total: '#374151'
  };

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 20, right: 30, left: 20, bottom: 5 }
    };

    switch (chartType) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="colorBase" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.Base} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={colors.Base} stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorCrecimiento" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.Crecimiento} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={colors.Crecimiento} stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorPremium" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.Premium} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={colors.Premium} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="month" 
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="Base"
              stackId="1"
              stroke={colors.Base}
              fill="url(#colorBase)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="Crecimiento"
              stackId="1"
              stroke={colors.Crecimiento}
              fill="url(#colorCrecimiento)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="Premium"
              stackId="1"
              stroke={colors.Premium}
              fill="url(#colorPremium)"
              strokeWidth={2}
            />
          </AreaChart>
        );

      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="month" 
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="Base"
              stroke={colors.Base}
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="Crecimiento"
              stroke={colors.Crecimiento}
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="Premium"
              stroke={colors.Premium}
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="month" 
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="Base" fill={colors.Base} radius={[2, 2, 0, 0]} />
            <Bar dataKey="Crecimiento" fill={colors.Crecimiento} radius={[2, 2, 0, 0]} />
            <Bar dataKey="Premium" fill={colors.Premium} radius={[2, 2, 0, 0]} />
          </BarChart>
        );

      default:
        return <div />; // Fallback component
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div className="mb-4 lg:mb-0">
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            Evolución de Ganancias
          </h2>
          <p className="text-sm text-gray-600">
            Rendimiento por tipo de inversión Sol Inversor
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Time Period Selector */}
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <select
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value as TimePeriod)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-good-lime focus:border-transparent"
            >
              {timePeriods.map((period) => (
                <option key={period.period} value={period.period}>
                  {period.label} ({period.description})
                </option>
              ))}
            </select>
          </div>

          {/* Chart Type Selector */}
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            {chartTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.type}
                  onClick={() => setChartType(type.type)}
                  className={`p-2 rounded-md transition-colors ${
                    chartType === type.type
                      ? 'bg-white shadow-sm text-good-dark-green'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  title={type.label}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
        <div className="text-center">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Ganancia Promedio</h3>
          <p className="text-lg font-bold text-good-dark-green">
            {formatCurrency(
              chartData.reduce((sum, item) => sum + item.total, 0) / chartData.length
            )}
          </p>
        </div>
        <div className="text-center">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Mejor Mes</h3>
          <p className="text-lg font-bold text-good-dark-green">
            {formatCurrency(
              Math.max(...chartData.map(item => item.total))
            )}
          </p>
        </div>
        <div className="text-center">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Crecimiento</h3>
          <div className="flex items-center justify-center space-x-1">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <p className="text-lg font-bold text-green-600">+8.5%</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EarningsChart;