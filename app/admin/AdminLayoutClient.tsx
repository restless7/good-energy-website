"use client";



import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Settings,
  Users,
  Shield,
  Menu,
  X,
  Home,
  TrendingUp,
  Zap,
  LogOut,
  ChevronDown,
  Sun,
  Wallet,
  Building2,
  DollarSign,
  PenSquare,
  Activity,
  UserCog,
  Briefcase,
  ClipboardList,
} from 'lucide-react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { useRBAC } from '@/hooks/useRBAC';

interface AdminLayoutProps {
  children: React.ReactNode;
}

// ===========================
// NAVIGATION CONFIGURATION
// ===========================

const navigation = [
  { 
    name: 'Dashboard', 
    href: '/admin', 
    icon: Home, 
    roles: ['SUPER_ADMIN', 'PARTNER'] 
  },
  { 
    name: 'Inversionistas', 
    href: '/admin/inversionistas', 
    icon: Users, 
    roles: ['SUPER_ADMIN', 'PARTNER'] 
  },
  {
    name: 'Gestión Financiera',
    icon: Wallet,
    group: 'finance',
    roles: ['SUPER_ADMIN', 'PARTNER'],
    subItems: [
      { name: 'Inversiones', href: '/admin/inversiones' },
      { name: 'Ganancias', href: '/admin/ganancias' },
      { name: 'Pagos', href: '/admin/pagos' },
    ]
  },
  {
    name: 'Operaciones',
    icon: Building2,
    group: 'ops',
    roles: ['SUPER_ADMIN', 'PARTNER'],
    subItems: [
      { name: 'Plantas Solares', href: '/admin/plantas' },
      { name: 'Producción Energía', href: '/admin/produccion' },
    ]
  },
  { 
    name: 'Analytics', 
    href: '/admin/analytics', 
    icon: BarChart3, 
    roles: ['SUPER_ADMIN', 'PARTNER'] 
  },
  { 
    name: 'Blog / Contenido', 
    href: '/admin/blog', 
    icon: PenSquare, 
    roles: ['SUPER_ADMIN', 'PARTNER'] 
  },
  { 
    name: 'Operaciones Partners', 
    href: '/admin/partners', 
    icon: Briefcase, 
    roles: ['SUPER_ADMIN', 'PARTNER'] 
  },
  { 
    name: 'Mi Gestión', 
    href: '/admin/mi-gestion', 
    icon: ClipboardList, 
    roles: ['SUPER_ADMIN', 'PARTNER'] 
  },
  { 
    name: 'Gestión de Usuarios', 
    href: '/admin/usuarios', 
    icon: UserCog, 
    roles: ['SUPER_ADMIN', 'PARTNER'] 
  },
  { 
    name: 'Configuración', 
    href: '/admin/configuracion', 
    icon: Settings, 
    roles: ['SUPER_ADMIN', 'PARTNER'] 
  },
];

// ===========================
// ADMIN LAYOUT CONTENT
// ===========================

function AdminLayoutContent({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [financeOpen, setFinanceOpen] = useState(false);
  const [opsOpen, setOpsOpen] = useState(false);
  const pathname = usePathname();
  const { user, loading, isSuperAdmin, isPartner, isAdminAreaUser } = useRBAC();
  const { logout } = useAuth();

  // ── Loading State ──
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D4651] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-[#1A6B78]"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#D8DA00] animate-spin"></div>
            <Sun className="absolute inset-0 m-auto w-6 h-6 text-[#D8DA00]" />
          </div>
          <p className="text-[#8CB4BC]">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // ── Access Denied ──
  if (user && !isAdminAreaUser) {
    return (
      <div className="min-h-screen bg-[#0D4651] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#0E4D58] rounded-2xl shadow-2xl border border-[#1A6B78] p-8 text-center">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="h-10 w-10 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-[#FFFDF0] mb-2">Acceso Denegado</h2>
          <p className="text-[#8CB4BC] mb-8">
            No tienes permisos suficientes para acceder al panel de administración. 
            Si crees que esto es un error, contacta al equipo de Good Energy.
          </p>
          <div className="space-y-4">
            <Link 
              href="/"
              className="block w-full py-3 px-4 bg-[#005461] hover:bg-[#0D4651] text-[#FFFDF0] font-medium rounded-lg transition-colors"
            >
              Volver al Inicio
            </Link>
            <button
              onClick={logout}
              className="w-full py-3 px-4 bg-[#1A6B78]/30 hover:bg-[#1A6B78]/50 text-[#FFFDF0] font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D4651]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[#0A3A43] transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#1A6B78]/50">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#D8DA00] rounded-xl flex items-center justify-center">
              <Sun className="h-5 w-5 text-[#0D4651]" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#FFFDF0]">Good Energy</h1>
              <p className="text-[10px] text-[#8CB4BC] uppercase tracking-wider">Admin Panel</p>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-[#8CB4BC] hover:text-[#FFFDF0]"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3 h-[calc(100vh-220px)] overflow-y-auto scrollbar-thin">
          {navigation.map((item) => {
            // RBAC visibility
            const canView = isSuperAdmin 
              ? true 
              : (isPartner && item.roles.includes('PARTNER'));
            if (!canView) return null;

            // Collapsible groups
            if (item.subItems) {
              const isChildActive = item.subItems.some(sub => pathname.startsWith(sub.href));
              const groupKey = (item as any).group || 'finance';
              const isGroupOpen = groupKey === 'finance' ? financeOpen : opsOpen;
              const toggleGroup = () => groupKey === 'finance' 
                ? setFinanceOpen(!financeOpen) 
                : setOpsOpen(!opsOpen);
              
              return (
                <div key={item.name} className="mb-1">
                  <button
                    onClick={toggleGroup}
                    className={`
                      w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200
                      ${isChildActive 
                        ? 'text-[#FFFDF0]' 
                        : 'text-[#8CB4BC] hover:bg-[#0E4D58] hover:text-[#FFFDF0]'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={`h-5 w-5 ${isChildActive ? 'text-[#D8DA00]' : ''}`} />
                      <span className={`text-sm ${isChildActive ? 'font-medium' : ''}`}>{item.name}</span>
                    </div>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isGroupOpen || isChildActive ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {(isGroupOpen || isChildActive) && (
                    <div className="mt-1 space-y-1">
                      {item.subItems.map(subItem => {
                        const isSubActive = pathname === subItem.href || pathname.startsWith(subItem.href + '/');
                        return (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            onClick={() => setSidebarOpen(false)}
                            className={`
                              flex items-center pl-12 pr-4 py-2.5 text-sm rounded-xl transition-all duration-200
                              ${isSubActive
                                ? 'bg-[#D8DA00]/10 text-[#D8DA00] font-medium'
                                : 'text-[#8CB4BC] hover:bg-[#0E4D58]/50 hover:text-[#FFFDF0]'
                              }
                            `}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full mr-3 ${isSubActive ? 'bg-[#D8DA00]' : 'bg-[#1A6B78]'}`} />
                            {subItem.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            // Regular nav item
            const isActive = item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href!);
              
            return (
              <Link
                key={item.name}
                href={item.href!}
                className={`
                  flex items-center gap-3 px-4 py-3 mb-1 rounded-xl transition-all duration-200
                  ${isActive
                    ? 'bg-[#D8DA00] text-[#0D4651] font-semibold shadow-lg shadow-[#D8DA00]/20'
                    : 'text-[#8CB4BC] hover:bg-[#0E4D58] hover:text-[#FFFDF0]'
                  }
                `}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile Section */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-[#1A6B78]/50">
          {user && (
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-gradient-to-br from-[#D8DA00] to-[#D8DA00]/60 rounded-full flex items-center justify-center">
                  <span className="text-[#0D4651] text-sm font-bold">
                    {user.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#FFFDF0] truncate">{user.username}</p>
                  <p className="text-xs text-[#8CB4BC] capitalize">{user.role.replace('_', ' ').toLowerCase()}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-3 py-2 text-[#8CB4BC] hover:bg-[#0E4D58] hover:text-[#FFFDF0] rounded-lg transition-colors text-sm"
              >
                <LogOut className="h-4 w-4" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          )}
          <div className="px-4 py-3 border-t border-[#1A6B78]/30">
            <div className="flex items-center justify-between text-[10px] text-[#1A6B78]">
              <span>Good Energy Admin v1.0</span>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D8DA00] animate-pulse" />
                <span className="text-[#8CB4BC]">Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content Area ── */}
      <div className="lg:pl-72">
        {/* Top Bar */}
        <div className="bg-[#0A3A43]/80 backdrop-blur-sm border-b border-[#1A6B78]/30 px-6 py-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-[#8CB4BC] hover:text-[#FFFDF0]"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex items-center gap-4 ml-auto">
              <div className="text-sm text-[#8CB4BC]">
                {new Date().toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              {user && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#0E4D58] rounded-full border border-[#1A6B78]/30">
                  <div className="w-2 h-2 rounded-full bg-[#D8DA00]" />
                  <span className="text-xs text-[#8CB4BC]">{user.username}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayoutClient({ children }: AdminLayoutProps) {
  return (
    <AuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AuthProvider>
  );
}
