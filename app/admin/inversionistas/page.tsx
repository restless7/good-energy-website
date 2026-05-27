"use client";

import { useState } from 'react';
import { Users, Search, Plus, Filter, MoreVertical, Mail, Phone, MapPin } from 'lucide-react';
import { useRBAC } from '@/hooks/useRBAC';

// Mock data — will be replaced with Prisma queries
const mockInvestors = [
  { id: '1', name: 'Carlos Mendoza', email: 'carlos@example.com', phone: '+57 300 123 4567', country: 'Colombia', status: 'Activo', totalInvested: 150000000, investments: 3, joinedAt: '2025-03-15' },
  { id: '2', name: 'Ana López', email: 'ana@example.com', phone: '+57 310 987 6543', country: 'Colombia', status: 'Activo', totalInvested: 80000000, investments: 2, joinedAt: '2025-06-20' },
  { id: '3', name: 'Roberto Díaz', email: 'roberto@example.com', phone: '+57 320 555 1234', country: 'Colombia', status: 'Pendiente', totalInvested: 0, investments: 0, joinedAt: '2026-01-10' },
  { id: '4', name: 'María García', email: 'maria@example.com', phone: '+57 315 444 5678', country: 'Panamá', status: 'Activo', totalInvested: 200000000, investments: 4, joinedAt: '2024-11-05' },
];

export default function InversionistasPage() {
  const { isSuperAdmin } = useRBAC();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredInvestors = mockInvestors.filter(inv => {
    const matchesSearch = inv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#FFFDF0]">Inversionistas</h1>
          <p className="text-[#8CB4BC] text-sm mt-1">Gestiona los perfiles de tus inversionistas</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#D8DA00] hover:bg-[#D8DA00]/90 text-[#0D4651] font-semibold rounded-xl transition-colors text-sm">
          <Plus className="w-4 h-4" />
          Nuevo Inversionista
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8CB4BC]" />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#0E4D58] border border-[#1A6B78]/50 rounded-xl text-[#FFFDF0] placeholder-[#8CB4BC]/50 focus:outline-none focus:border-[#D8DA00]/50 text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-[#0E4D58] border border-[#1A6B78]/50 rounded-xl text-[#FFFDF0] focus:outline-none focus:border-[#D8DA00]/50 text-sm"
        >
          <option value="all">Todos los estados</option>
          <option value="Activo">Activo</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Inactivo">Inactivo</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#0E4D58] rounded-2xl border border-[#1A6B78]/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1A6B78]/30">
                <th className="text-left px-6 py-4 text-xs font-medium text-[#8CB4BC] uppercase tracking-wider">Inversionista</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-[#8CB4BC] uppercase tracking-wider">Contacto</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-[#8CB4BC] uppercase tracking-wider">Estado</th>
                <th className="text-right px-6 py-4 text-xs font-medium text-[#8CB4BC] uppercase tracking-wider">Total Invertido</th>
                <th className="text-center px-6 py-4 text-xs font-medium text-[#8CB4BC] uppercase tracking-wider">Inversiones</th>
                <th className="text-right px-6 py-4 text-xs font-medium text-[#8CB4BC] uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A6B78]/20">
              {filteredInvestors.map((investor) => (
                <tr key={investor.id} className="hover:bg-[#0A3A43]/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-[#D8DA00] to-[#D8DA00]/60 rounded-full flex items-center justify-center">
                        <span className="text-[#0D4651] text-sm font-bold">{investor.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#FFFDF0]">{investor.name}</p>
                        <p className="text-xs text-[#8CB4BC]">{investor.country}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-[#FFFDF0]/80">{investor.email}</p>
                    <p className="text-xs text-[#8CB4BC]">{investor.phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      investor.status === 'Activo' 
                        ? 'bg-[#D8DA00]/10 text-[#D8DA00]' 
                        : 'bg-orange-500/10 text-orange-400'
                    }`}>
                      {investor.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="text-sm font-medium text-[#FFFDF0]">{formatCurrency(investor.totalInvested)}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm text-[#FFFDF0]">{investor.investments}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-[#1A6B78]/30 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4 text-[#8CB4BC]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#1A6B78]/30 flex items-center justify-between">
          <p className="text-xs text-[#8CB4BC]">
            Mostrando {filteredInvestors.length} de {mockInvestors.length} inversionistas
          </p>
        </div>
      </div>
    </div>
  );
}
