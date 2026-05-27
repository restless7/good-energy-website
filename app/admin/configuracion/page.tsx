"use client";

import { Settings, Shield, Bell, Globe, Database, Key } from 'lucide-react';

export default function ConfiguracionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#FFFDF0]">Configuración</h1>
        <p className="text-[#8CB4BC] text-sm mt-1">Ajustes generales del sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[
          { icon: Shield, title: 'Seguridad', desc: 'Clerk auth, roles y permisos', status: 'Configurado' },
          { icon: Bell, title: 'Notificaciones', desc: 'Emails, alertas y webhooks', status: 'Pendiente' },
          { icon: Globe, title: 'Dominio', desc: 'DNS, SSL y configuración web', status: 'Configurado' },
          { icon: Database, title: 'Base de Datos', desc: 'Conexión, backups y migraciones', status: 'Operativo' },
          { icon: Key, title: 'API Keys', desc: 'Claves de integración externas', status: 'Pendiente' },
          { icon: Settings, title: 'General', desc: 'Nombre, logo y preferencias', status: 'Configurado' },
        ].map((item, i) => (
          <div key={i} className="bg-[#0E4D58] p-5 rounded-2xl border border-[#1A6B78]/50 hover:border-[#D8DA00]/30 transition-all duration-300 cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-[#D8DA00]/10 rounded-xl flex items-center justify-center">
                <item.icon className="w-5 h-5 text-[#D8DA00]" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-[#FFFDF0]">{item.title}</h3>
                <p className="text-xs text-[#8CB4BC] mt-1">{item.desc}</p>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                item.status === 'Configurado' || item.status === 'Operativo'
                  ? 'bg-[#D8DA00]/10 text-[#D8DA00]'
                  : 'bg-orange-500/10 text-orange-400'
              }`}>
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
