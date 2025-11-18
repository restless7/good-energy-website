// app/(dashboard)/inversiones/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Plus, 
  Eye, 
  Download, 
  Bell,
  Sun,
  ChevronRight,
  Calendar,
  Award,
  Target
} from 'lucide-react';
import OverviewCards, { OverviewMetrics } from './components/OverviewCards';
import { 
  generateMockInvestments, 
  generateMockEarnings, 
  calculatePortfolioMetrics,
  formatCurrency,
  formatDate,
  investmentTypes,
  Investment,
  Earning
} from '@/lib/dashboard/utils';
const InvestmentDashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [metrics, setMetrics] = useState<OverviewMetrics | null>(null);

  // Load data
  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      const mockInvestments = generateMockInvestments();
      const mockEarnings = generateMockEarnings();
      const calculatedMetrics = calculatePortfolioMetrics(mockInvestments, mockEarnings);

      setInvestments(mockInvestments);
      setEarnings(mockEarnings);
      setMetrics(calculatedMetrics);
      setIsLoading(false);
    }, 1500);
  }, []);

  // Get recent earnings (last 3)
  const recentEarnings = earnings
    .filter(e => e.status === 'Pagado')
    .slice(0, 3);

  // Quick actions
  const quickActions = [
    {
      title: 'Nueva Inversión',
      description: 'Explora oportunidades disponibles',
      icon: Plus,
      href: '/investment-simulator',
      color: 'from-good-lime to-yellow-400',
      bgColor: 'bg-good-lime/10'
    },
    {
      title: 'Ver Portfolio',
      description: 'Detalle de todas tus inversiones',
      icon: Eye,
      href: '/inversiones/portfolio',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Descargar Reporte',
      description: 'Resumen financiero completo',
      icon: Download,
      href: '#',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8">
        {/* Header skeleton */}
        <div className="animate-pulse mb-8">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-96"></div>
        </div>

        {/* Cards skeleton */}
        <OverviewCards metrics={{
          totalInvested: 0,
          totalEarnings: 0,
          pendingEarnings: 0,
          overallROI: 0,
          totalEnergyGenerated: 0,
          co2Saved: 0
        }} isLoading={true} />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between"
      >
        <div className="mb-4 lg:mb-0">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Bienvenido de nuevo, Carlos ☀️
          </h1>
          <p className="text-lg text-gray-600">
            Tu portafolio solar está generando <strong className="text-good-dark-green">
              {formatCurrency(metrics?.totalEarnings || 0)}
            </strong> en ganancias
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-4 h-4 mr-2" />
            Notificaciones
          </button>
          <button className="flex items-center px-4 py-2 bg-good-lime text-good-dark-green font-medium rounded-lg hover:bg-good-lime/90 transition-colors">
            <Calendar className="w-4 h-4 mr-2" />
            Próximo pago: 15 Oct
          </button>
        </div>
      </motion.div>

      {/* Overview Cards */}
      <OverviewCards metrics={metrics || {
        totalInvested: 0,
        totalEarnings: 0,
        pendingEarnings: 0,
        overallROI: 0,
        totalEnergyGenerated: 0,
        co2Saved: 0
      }} isLoading={false} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Acciones Rápidas</h2>
            
            <div className="space-y-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.title}
                    href={action.href}
                    className="block group"
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center p-4 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div className={`w-12 h-12 ${action.bgColor} rounded-xl flex items-center justify-center mr-4`}>
                        <Icon className={`w-6 h-6 bg-gradient-to-r ${action.color} bg-clip-text text-transparent`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-good-dark-green">
                          {action.title}
                        </h3>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-good-dark-green transition-colors" />
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Recent Activity & Investments */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Investment Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Mis Inversiones</h2>
              <Link 
                href="/inversiones/portfolio"
                className="text-good-dark-green hover:text-good-dark-green/80 font-medium text-sm flex items-center"
              >
                Ver todas <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div className="space-y-4">
              {investments.map((investment, index) => {
                const config = investmentTypes[investment.type as keyof typeof investmentTypes];
                return (
                  <motion.div
                    key={investment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                        style={{ backgroundColor: config.bgColor }}
                      >
                        {config.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {config.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {investment.plant?.name || 'Planta en asignación'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(investment.amount)}
                      </p>
                      <p className="text-sm text-green-600">
                        ROI: {investment.actualRoi?.toFixed(1) || investment.roi.toFixed(1)}%
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Recent Earnings */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Ganancias Recientes</h2>
              <Link 
                href="/inversiones/history"
                className="text-good-dark-green hover:text-good-dark-green/80 font-medium text-sm flex items-center"
              >
                Ver historial <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div className="space-y-4">
              {recentEarnings.map((earning, index) => (
                <motion.div
                  key={earning.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center justify-between p-4 bg-green-50/50 rounded-xl"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Award className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Pago {earning.type}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {earning.paymentDate ? formatDate(earning.paymentDate) : 'Fecha pendiente'} • {earning.paymentMethod}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      +{formatCurrency(earning.netAmount)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Impuestos: {formatCurrency(earning.taxWithheld)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Achievement Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-good-lime to-yellow-400 rounded-2xl p-6 text-good-dark-green"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Target className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold">¡Felicitaciones!</h3>
              <p className="text-good-dark-green/80">
                Has superado tu meta de ROI anual del 10%. Tu portafolio está rindiendo un{' '}
                <strong>{(metrics?.overallROI || 0).toFixed(1)}%</strong>
              </p>
            </div>
          </div>
          <div className="hidden lg:flex items-center space-x-2">
            <Sun className="w-8 h-8" />
            <span className="text-2xl font-bold">☀️</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default InvestmentDashboard;