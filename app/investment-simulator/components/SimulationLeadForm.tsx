"use client";

import React, { useState } from 'react';
import { X, Send, CheckCircle2 } from 'lucide-react';
import { submitSimulationLeadAction } from '../actions';

interface SimulationLeadFormProps {
  isOpen: boolean;
  onClose: () => void;
  simulationPayload: {
    assetType: 'ELECTROLINERA' | 'SOLAR_FARM';
    selectedTier?: string;
    unitsCount?: number;
    customParameters: Record<string, any>;
  };
}

export function SimulationLeadForm({ isOpen, onClose, simulationPayload }: SimulationLeadFormProps) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('LOADING');

    const result = await submitSimulationLeadAction({
      leadName: formData.name,
      leadEmail: formData.email,
      leadPhone: formData.phone,
      assetType: simulationPayload.assetType,
      selectedTier: simulationPayload.selectedTier,
      unitsCount: simulationPayload.unitsCount ?? 1,
      customParameters: simulationPayload.customParameters,
    });

    if (result.success) {
      setStatus('SUCCESS');
      setTimeout(() => {
        onClose();
        setStatus('IDLE');
      }, 3000);
    } else {
      setStatus('ERROR');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#052126] w-full max-w-md rounded-2xl border border-[#1A6B78]/50 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="bg-[#0A3A43] px-6 py-4 flex justify-between items-center border-b border-[#1A6B78]/50">
          <h2 className="text-lg font-bold text-[#FFFDF0]">Solicitar Propuesta Comercial</h2>
          <button onClick={onClose} className="text-[#8CB4BC] hover:text-[#FFFDF0] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {status === 'SUCCESS' ? (
            <div className="text-center py-8 space-y-4">
              <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto" />
              <h3 className="text-xl font-bold text-[#FFFDF0]">¡Simulación Capturada!</h3>
              <p className="text-[#8CB4BC] text-sm">
                Nuestro equipo comercial se contactará pronto con una propuesta personalizada basada en tu simulación.
              </p>
            </div>
          ) : (
            <>
              <p className="text-[#8CB4BC] text-sm mb-6">
                Guarda esta configuración y recibe un análisis detallado directo a tu correo por parte de nuestro equipo de operaciones.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#8CB4BC] uppercase mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0E4D58] border border-[#1A6B78]/50 rounded-xl text-[#FFFDF0] placeholder-[#8CB4BC]/50 focus:outline-none focus:border-[#D8DA00]/50"
                    placeholder="Ej. Carlos Mendoza"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#8CB4BC] uppercase mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0E4D58] border border-[#1A6B78]/50 rounded-xl text-[#FFFDF0] placeholder-[#8CB4BC]/50 focus:outline-none focus:border-[#D8DA00]/50"
                    placeholder="carlos@empresa.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#8CB4BC] uppercase mb-1">Teléfono Móvil</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0E4D58] border border-[#1A6B78]/50 rounded-xl text-[#FFFDF0] placeholder-[#8CB4BC]/50 focus:outline-none focus:border-[#D8DA00]/50"
                    placeholder="+57 300 000 0000"
                  />
                </div>

                {status === 'ERROR' && (
                  <p className="text-red-400 text-sm font-semibold">Hubo un error al guardar la simulación. Intenta de nuevo.</p>
                )}

                <button
                  type="submit"
                  disabled={status === 'LOADING'}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 mt-6 bg-[#D8DA00] hover:bg-[#D8DA00]/90 text-[#0D4651] font-bold rounded-xl transition-all disabled:opacity-50"
                >
                  {status === 'LOADING' ? 'Procesando...' : (
                    <>
                      Enviar Simulación <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
