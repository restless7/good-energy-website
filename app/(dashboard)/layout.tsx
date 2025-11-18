// app/(dashboard)/layout.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  PieChart, 
  TrendingUp, 
  Zap, 
  History, 
  User,
  Menu,
  X,
  LogOut,
  Settings,
  Download,
  Sun
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  // Mock user data - replace with actual authentication
  useEffect(() => {
    // Simulate auth check
    setTimeout(() => {
      setUser({
        id: '1',
        name: 'Carlos Mendoza',
        email: 'carlos@example.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  const navigation = [
    {
      name: 'Panel Principal',
      href: '/inversiones',
      icon: LayoutDashboard,
      current: pathname === '/inversiones'
    },
    {
      name: 'Mis Inversiones',
      href: '/inversiones/portfolio',
      icon: PieChart,
      current: pathname === '/inversiones/portfolio'
    },
    {
      name: 'Ganancias',
      href: '/inversiones/earnings',
      icon: TrendingUp,
      current: pathname === '/inversiones/earnings'
    },
    {
      name: 'Plantas Solares',
      href: '/inversiones/plants',
      icon: Zap,
      current: pathname === '/inversiones/plants'
    },
    {
      name: 'Historial',
      href: '/inversiones/history',
      icon: History,
      current: pathname === '/inversiones/history'
    },
    {
      name: 'Perfil',
      href: '/inversiones/profile',
      icon: User,
      current: pathname === '/inversiones/profile'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-good-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-good-lime border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-good-dark-green font-medium">
            Cargando tu portal de inversiones...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-gray-600 bg-opacity-75"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="relative flex flex-col w-80 bg-white shadow-xl h-full"
            >
              <div className="flex items-center justify-between p-4 border-b">
                <Link href="/" className="flex items-center">
                  <Sun className="w-8 h-8 text-good-lime mr-2" />
                  <span className="text-xl font-bold text-good-dark-green">Good Energy</span>
                </Link>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Mobile Navigation */}
              <nav className="flex-1 px-4 py-6 space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                      item.current
                        ? 'bg-gradient-to-r from-good-lime to-good-lime/80 text-good-dark-green shadow-lg'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 ${
                        item.current ? 'text-good-dark-green' : 'text-gray-400'
                      }`}
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
              
              {/* Mobile user section */}
              <div className="border-t p-4">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-good-lime to-good-lime/80 rounded-full flex items-center justify-center">
                    <span className="text-good-dark-green font-semibold">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <button className="w-full flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                    <Settings className="w-4 h-4 mr-2" />
                    Configuración
                  </button>
                  <button className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-80 lg:fixed lg:inset-y-0 lg:z-50">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 shadow-lg">
          {/* Logo */}
          <div className="flex items-center px-6 py-6 border-b">
            <Link href="/" className="flex items-center">
              <Sun className="w-10 h-10 text-good-lime mr-3" />
              <div>
                <h1 className="text-xl font-bold text-good-dark-green">Good Energy</h1>
                <p className="text-xs text-gray-500">Portal Inversionista</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-6 py-6 space-y-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                  item.current
                    ? 'bg-gradient-to-r from-good-lime to-good-lime/80 text-good-dark-green shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 ${
                    item.current ? 'text-good-dark-green' : 'text-gray-400'
                  }`}
                />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User section */}
          <div className="border-t p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-good-lime to-good-lime/80 rounded-full flex items-center justify-center">
                <span className="text-good-dark-green font-semibold text-lg">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            <div className="space-y-2">
              <button className="w-full flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Descargar Reporte
              </button>
              <button className="w-full flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-4 h-4 mr-2" />
                Configuración
              </button>
              <button className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="lg:pl-80">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center">
            <Sun className="w-6 h-6 text-good-lime mr-2" />
            <span className="font-semibold text-good-dark-green">Good Energy</span>
          </div>
          <div className="w-8 h-8 bg-gradient-to-r from-good-lime to-good-lime/80 rounded-full flex items-center justify-center">
            <span className="text-good-dark-green font-semibold text-sm">
              {user?.name?.charAt(0) || 'U'}
            </span>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <div className="min-h-screen bg-gray-50">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;