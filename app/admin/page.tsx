"use client";

import { useState, useEffect } from 'react';
import {
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  Sun,
  Zap,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Building2,
  PenSquare,
  UserCog,
  Settings,
} from 'lucide-react';
import Link from 'next/link';
import { useRBAC } from '@/hooks/useRBAC';
import { Suspense } from 'react';
import WelcomeToast from '@/components/WelcomeToast';

// ===========================
// STAT CARD COMPONENT
// ===========================

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
  subtitle,
}: {
  title: string;
  value: string | number;
  icon: any;
  trend?: string;
  trendUp?: boolean;
  subtitle?: string;
}) => (
  <div className="bg-[#0E4D58] p-6 rounded-2xl border border-[#1A6B78]/50 hover:border-[#D8DA00]/30 transition-all duration-300 group">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-[#8CB4BC] text-sm">{title}</p>
        <p className="text-3xl font-bold text-[#FFFDF0] mt-2 transition-all duration-300">
          {value}
        </p>
        {trend && (
          <div className="flex items-center gap-1 mt-2">
            {trendUp !== undefined && (
              trendUp 
                ? <ArrowUpRight className="w-3 h-3 text-[#D8DA00]" />
                : <ArrowDownRight className="w-3 h-3 text-red-400" />
            )}
            <span className={`text-xs ${trendUp ? 'text-[#D8DA00]' : 'text-red-400'}`}>
              {trend}
            </span>
          </div>
        )}
        {subtitle && (
          <p className="text-xs text-[#8CB4BC]/60 mt-1">{subtitle}</p>
        )}
      </div>
      <div className="w-12 h-12 bg-[#D8DA00]/10 rounded-xl flex items-center justify-center group-hover:bg-[#D8DA00]/20 transition-colors">
        <Icon className="h-6 w-6 text-[#D8DA00]" />
      </div>
    </div>
  </div>
);

// ===========================
// QUICK ACTION COMPONENT
// ===========================

const QuickAction = ({
  title,
  description,
  href,
  icon: Icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: any;
}) => (
  <Link
    href={href}
    className="bg-[#0E4D58] p-5 rounded-2xl border border-[#1A6B78]/50 hover:border-[#D8DA00]/40 transition-all duration-300 group"
  >
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 bg-[#D8DA00]/10 rounded-xl flex items-center justify-center group-hover:bg-[#D8DA00]/20 group-hover:scale-110 transition-all duration-300">
        <Icon className="h-5 w-5 text-[#D8DA00]" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-[#FFFDF0] group-hover:text-[#D8DA00] transition-colors text-sm">
          {title}
        </h3>
        <p className="text-xs text-[#8CB4BC] mt-1">{description}</p>
      </div>
      <ArrowUpRight className="w-4 h-4 text-[#1A6B78] group-hover:text-[#D8DA00] transition-colors" />
    </div>
  </Link>
);

// ===========================
// MAIN DASHBOARD
// ===========================

export default function AdminDashboard() {
  const { user, isSuperAdmin } = useRBAC();
  const [loading, setLoading] = useState(true);

  // Mock stats — will be replaced with real API calls
  const [stats, setStats] = useState({
    totalInvestors: 0,
    totalCapital: 0,
    activeInvestments: 0,
    avgROI: 0,
    totalPlants: 0,
    totalEnergy: 0,
    monthlyEarnings: 0,
    pendingPayments: 0,
  });

  useEffect(() => {
    // Simulate loading dashboard data
    const timer = setTimeout(() => {
      setStats({
        totalInvestors: 24,
        totalCapital: 850000000,
        activeInvestments: 38,
        avgROI: 14.2,
        totalPlants: 3,
        totalEnergy: 12450,
        monthlyEarnings: 42500000,
        pendingPayments: 5,
      });
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full border-4 border-[#1A6B78]"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#D8DA00] animate-spin"></div>
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-8">
      <Suspense fallback={null}>
        <WelcomeToast />
      </Suspense>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#FFFDF0] mb-2">
          Panel de Administración
        </h1>
        <p className="text-[#8CB4BC]">
          Bienvenido{user ? `, ${user.username}` : ''}. Gestiona las operaciones de Good Energy.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Inversionistas"
          value={stats.totalInvestors}
          icon={Users}
          trend="+3 este mes"
          trendUp={true}
        />
        <StatCard
          title="Capital Administrado"
          value={formatCurrency(stats.totalCapital)}
          icon={DollarSign}
          trend="+12% vs mes anterior"
          trendUp={true}
        />
        <StatCard
          title="Inversiones Activas"
          value={stats.activeInvestments}
          icon={TrendingUp}
          trend="+5 nuevas"
          trendUp={true}
        />
        <StatCard
          title="ROI Promedio"
          value={`${stats.avgROI}%`}
          icon={Activity}
          trend="Anual estimado"
          subtitle="Rendimiento promedio de plataforma"
        />
      </div>

      {/* Operations Overview — SUPER_ADMIN only */}
      {isSuperAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <StatCard
            title="Plantas Solares"
            value={stats.totalPlants}
            icon={Sun}
            subtitle="Activas en operación"
          />
          <StatCard
            title="Energía Generada"
            value={`${stats.totalEnergy.toLocaleString()} kWh`}
            icon={Zap}
            trend="+8% este mes"
            trendUp={true}
          />
          <StatCard
            title="Ganancias Mensuales"
            value={formatCurrency(stats.monthlyEarnings)}
            icon={Wallet}
            trend={`${stats.pendingPayments} pagos pendientes`}
          />
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-[#FFFDF0] mb-4">
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickAction
            title="Gestionar Inversionistas"
            description="Ver y administrar perfiles de inversores"
            href="/admin/inversionistas"
            icon={Users}
          />
          <QuickAction
            title="Registrar Inversión"
            description="Crear una nueva inversión para un inversionista"
            href="/admin/inversiones"
            icon={DollarSign}
          />
          <QuickAction
            title="Procesar Ganancias"
            description="Distribuir rendimientos mensuales"
            href="/admin/ganancias"
            icon={TrendingUp}
          />
          {isSuperAdmin && (
            <>
              <QuickAction
                title="Plantas Solares"
                description="Monitorear producción energética"
                href="/admin/plantas"
                icon={Sun}
              />
              <QuickAction
                title="Publicar Contenido"
                description="Crear artículos y actualizaciones"
                href="/admin/blog"
                icon={PenSquare}
              />
              <QuickAction
                title="Ver Analytics"
                description="Estadísticas de la plataforma"
                href="/admin/analytics"
                icon={BarChart3}
              />
            </>
          )}
        </div>
      </div>

      {/* Activity & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-[#0E4D58] p-6 rounded-2xl border border-[#1A6B78]/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#FFFDF0]">
              Actividad Reciente
            </h3>
            <Activity className="h-5 w-5 text-[#D8DA00] animate-pulse" />
          </div>
          <div className="space-y-3">
            {[
              { type: 'investment', message: 'Nueva inversión registrada — Carlos M.', time: 'Hace 2h' },
              { type: 'payment', message: 'Ganancias distribuidas — Planta Norte', time: 'Hace 5h' },
              { type: 'user', message: 'Nuevo inversionista registrado — Ana L.', time: 'Hace 1d' },
              { type: 'system', message: 'Reporte mensual generado', time: 'Hace 2d' },
            ].map((activity, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 bg-[#0A3A43]/50 rounded-xl"
              >
                <div className={`
                  w-2 h-2 rounded-full mt-2 flex-shrink-0
                  ${activity.type === 'investment' ? 'bg-[#D8DA00]' :
                    activity.type === 'payment' ? 'bg-green-400' :
                    activity.type === 'user' ? 'bg-blue-400' : 'bg-[#8CB4BC]'}
                `} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#FFFDF0]/90">{activity.message}</p>
                  <p className="text-xs text-[#8CB4BC]/60 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="bg-[#0E4D58] p-6 rounded-2xl border border-[#1A6B78]/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#FFFDF0]">
              Estado del Sistema
            </h3>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#D8DA00] animate-pulse" />
              <span className="text-xs text-[#8CB4BC]">Operativo</span>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { name: 'Base de Datos', status: true },
              { name: 'Autenticación (Clerk)', status: true },
              { name: 'Portal Inversionistas', status: true },
              { name: 'Procesador de Pagos', status: false },
              { name: 'Email Service', status: true },
            ].map((service, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-[#0A3A43]/50 rounded-xl">
                <span className="text-sm text-[#8CB4BC]">{service.name}</span>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${service.status ? 'bg-[#D8DA00]' : 'bg-red-400'}`} />
                  <span className={`text-xs ${service.status ? 'text-[#D8DA00]' : 'text-red-400'}`}>
                    {service.status ? 'Operativo' : 'Pendiente'}
                  </span>
                </div>
              </div>
            ))}

            <div className="mt-4 pt-4 border-t border-[#1A6B78]/30">
              <div className="flex items-center justify-between text-xs text-[#8CB4BC]/60">
                <span>Última verificación:</span>
                <span>{new Date().toLocaleTimeString('es-CO')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
