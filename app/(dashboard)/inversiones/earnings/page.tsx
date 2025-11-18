// app/(dashboard)/inversiones/earnings/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Download,
  Filter,
  ArrowLeft,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye
} from 'lucide-react';
import EarningsChart from '../components/EarningsChart';
import { 
  generateMockEarnings, 
  formatCurrency, 
  formatDate,
  exportToCSV,
  statusConfig,
  Earning 
} from '@/lib/dashboard/utils';

const EarningsPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [filteredEarnings, setFilteredEarnings] = useState<Earning[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Load data
  useEffect(() => {
    setTimeout(() => {
      const mockEarnings = generateMockEarnings();
      setEarnings(mockEarnings);
      setFilteredEarnings(mockEarnings);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = earnings;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(e => e.status.toLowerCase() === statusFilter.toLowerCase());
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(e => e.type.toLowerCase() === typeFilter.toLowerCase());
    }

    setFilteredEarnings(filtered);
  }, [earnings, statusFilter, typeFilter]);

  // Calculate summary statistics
  const summary = {
    total: filteredEarnings.reduce((sum, e) => sum + e.netAmount, 0),
    pending: filteredEarnings.filter(e => e.status === 'Pendiente').reduce((sum, e) => sum + e.netAmount, 0),
    paid: filteredEarnings.filter(e => e.status === 'Pagado').reduce((sum, e) => sum + e.netAmount, 0),
    taxes: filteredEarnings.reduce((sum, e) => sum + e.taxWithheld, 0),
    count: filteredEarnings.length
  };

  const handleExport = () => {
    const exportData = filteredEarnings.map(earning => ({
      Fecha: earning.paymentDate ? formatDate(earning.paymentDate) : 'Pendiente',
      Tipo: earning.type,
      Estado: earning.status,
      'Monto Bruto': earning.amount,
      'Impuestos Retenidos': earning.taxWithheld,
      'Monto Neto': earning.netAmount,
      'Método de Pago': earning.paymentMethod || 'N/A'
    }));

    exportToCSV(exportData, `ganancias-${new Date().toISOString().split('T')[0]}`);
  };

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between"
      >
        <div className="mb-4 lg:mb-0">
          <div className="flex items-center space-x-3 mb-2">
            <Link
              href="/inversiones"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Ganancias y Pagos
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Historial completo de tus rendimientos solares
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleExport}
            className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Total Ganancias</h3>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.total)}</p>
          <p className="text-sm text-gray-500">{summary.count} pagos</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <AlertCircle className="w-5 h-5 text-yellow-500" />
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Pendientes</h3>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.pending)}</p>
          <p className="text-sm text-gray-500">Próximo pago: 15 Oct</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <CheckCircle className="w-5 h-5 text-blue-500" />
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Pagados</h3>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.paid)}</p>
          <p className="text-sm text-gray-500">Este año</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Impuestos</h3>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.taxes)}</p>
          <p className="text-sm text-gray-500">Retenidos</p>
        </div>
      </motion.div>

      {/* Earnings Chart */}
      <EarningsChart />

      {/* Filters and Transaction List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100"
      >
        {/* Filters */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <h2 className="text-xl font-bold text-gray-900 mb-4 lg:mb-0">
              Historial de Transacciones
            </h2>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-good-lime focus:border-transparent"
                >
                  <option value="all">Todos los estados</option>
                  <option value="pagado">Pagado</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="procesando">Procesando</option>
                </select>
              </div>
              
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-good-lime focus:border-transparent"
              >
                <option value="all">Todos los tipos</option>
                <option value="ganancia">Ganancia</option>
                <option value="reinversión">Reinversión</option>
                <option value="interés">Interés</option>
              </select>
            </div>
          </div>
        </div>

        {/* Transaction List */}
        <div className="divide-y divide-gray-100">
          {filteredEarnings.map((earning, index) => {
            const statusInfo = statusConfig.earning[earning.status as keyof typeof statusConfig.earning];
            
            return (
              <motion.div
                key={earning.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 ${statusInfo.bgColor} rounded-full flex items-center justify-center`}>
                      <span className="text-sm">{statusInfo.icon}</span>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Pago {earning.type}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>
                          {earning.paymentDate 
                            ? formatDate(earning.paymentDate)
                            : 'Fecha pendiente'
                          }
                        </span>
                        {earning.paymentMethod && (
                          <>
                            <span>•</span>
                            <span>{earning.paymentMethod}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center space-x-3">
                      <div>
                        <p className={`font-semibold ${
                          earning.status === 'Pagado' ? 'text-green-600' : 
                          earning.status === 'Pendiente' ? 'text-yellow-600' : 
                          'text-blue-600'
                        }`}>
                          {earning.status === 'Pagado' ? '+' : ''}{formatCurrency(earning.netAmount)}
                        </p>
                        {earning.taxWithheld > 0 && (
                          <p className="text-xs text-gray-500">
                            Impuestos: {formatCurrency(earning.taxWithheld)}
                          </p>
                        )}
                      </div>
                      
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Eye className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredEarnings.length === 0 && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay ganancias para mostrar
            </h3>
            <p className="text-gray-600">
              {statusFilter !== 'all' || typeFilter !== 'all' 
                ? 'Prueba ajustando los filtros'
                : 'Tus ganancias aparecerán aquí cuando se generen'
              }
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default EarningsPage;