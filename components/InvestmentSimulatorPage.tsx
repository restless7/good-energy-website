// components/InvestmentSimulatorPage.tsx

'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Mail, Phone, MessageCircle } from 'lucide-react';
import InvestmentForm from './simulator/InvestmentForm';
import SimulationChart from './simulator/SimulationChart';
import ResultCard from './simulator/ResultCard';
import { SimulationInput, SimulationData, SimulationResponse } from './simulator/types';

const InvestmentSimulatorPage: React.FC = () => {
  const [simulationData, setSimulationData] = useState<SimulationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle simulation request
  const handleSimulate = useCallback(async (input: SimulationInput) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/simulator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

      const result: SimulationResponse = await response.json();

      if (result.success && result.data) {
        setSimulationData(result.data);
        // Smooth scroll to results
        setTimeout(() => {
          document.getElementById('simulation-results')?.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start',
          });
        }, 100);
      } else {
        setError(result.error || 'Error en la simulación');
      }
    } catch (err) {
      setError('Error de conexión. Intenta nuevamente.');
      console.error('Simulation error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Scroll to calculator
  const scrollToCalculator = () => {
    document.getElementById('calculator')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-good-white via-good-lime/5 to-good-white">
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-good-lime/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-good-dark-green/5 rounded-full blur-2xl"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold text-good-dark-green mb-6"
          >
            Simula tu inversión solar <span className="text-6xl">🌞</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Descubre cuánto podrías <strong className="text-good-dark-green">ganar</strong> invirtiendo 
            en energía limpia con <strong className="text-good-dark-green">Good Energy</strong>.
          </motion.p>
          
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToCalculator}
            className="bg-good-lime hover:bg-good-lime/90 text-good-dark-green font-bold py-4 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center"
          >
            Iniciar simulación
            <ArrowDown className="ml-2 w-5 h-5 animate-bounce" />
          </motion.button>
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-4xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
        >
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-good-lime/20">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-semibold text-good-dark-green mb-2">Datos Reales</h3>
            <p className="text-sm text-gray-600">Basado en rendimiento histórico solar en Colombia</p>
          </div>
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-good-lime/20">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="font-semibold text-good-dark-green mb-2">Transparencia Total</h3>
            <p className="text-sm text-gray-600">Cálculos transparentes y verificables</p>
          </div>
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-good-lime/20">
            <div className="text-3xl mb-3">🌱</div>
            <h3 className="font-semibold text-good-dark-green mb-2">Impacto Positivo</h3>
            <p className="text-sm text-gray-600">Invierte en un futuro sostenible</p>
          </div>
        </motion.div>
      </section>

      {/* Calculator Section */}
      <section id="calculator" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Investment Form */}
            <InvestmentForm 
              onSimulate={handleSimulate} 
              isLoading={isLoading} 
            />
            
            {/* Info Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gradient-to-br from-good-dark-green to-good-dark-green/80 rounded-3xl p-8 text-white relative overflow-hidden"
            >
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-good-lime/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
              
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-6">
                  ¿Por qué invertir en energía solar? ☀️
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-good-lime rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold mb-1">Rentabilidad Constante</h4>
                      <p className="text-sm text-gray-200">Genera ingresos mensuales predecibles con tecnología probada</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-good-lime rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold mb-1">Impacto Ambiental</h4>
                      <p className="text-sm text-gray-200">Contribuye a la reducción de emisiones de CO₂</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-good-lime rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold mb-1">Tecnología Confiable</h4>
                      <p className="text-sm text-gray-200">Paneles solares con garantía de 25 años</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-good-lime rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold mb-1">Mercado en Crecimiento</h4>
                      <p className="text-sm text-gray-200">Colombia lidera la transición energética en Latinoamérica</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-center"
            >
              ⚠️ {error}
            </motion.div>
          )}
        </div>
      </section>

      {/* Results Section */}
      {simulationData && (
        <section id="simulation-results" className="py-16 px-4 bg-gradient-to-b from-good-lime/5 to-transparent">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Results Cards */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <ResultCard data={simulationData} />
              <SimulationChart data={simulationData} />
            </div>
            
            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-gradient-to-r from-good-dark-green to-good-dark-green/90 rounded-3xl p-8 md:p-12 text-white text-center relative overflow-hidden"
            >
              {/* Background decoration */}
              <div className="absolute inset-0 bg-[url('/images/CIELO.png')] opacity-10 bg-cover bg-center"></div>
              <div className="absolute top-0 right-0 w-40 h-40 bg-good-lime/10 rounded-full blur-2xl"></div>
              
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  ¿Listo para invertir con confianza?
                </h2>
                <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
                  Programa una cita con nuestros expertos y comienza tu inversión en energía solar hoy mismo.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-good-lime text-good-dark-green font-semibold py-3 px-6 rounded-xl hover:bg-good-lime/90 transition-all duration-300 flex items-center justify-center"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Llamar ahora
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white/10 backdrop-blur-sm text-white font-semibold py-3 px-6 rounded-xl hover:bg-white/20 transition-all duration-300 flex items-center justify-center border border-white/20"
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    Enviar email
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white/10 backdrop-blur-sm text-white font-semibold py-3 px-6 rounded-xl hover:bg-white/20 transition-all duration-300 flex items-center justify-center border border-white/20"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Chat WhatsApp
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Final CTA Section (when no simulation) */}
      {!simulationData && (
        <section className="py-16 px-4 bg-gradient-to-b from-transparent to-good-lime/10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-good-lime/20"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-good-dark-green mb-4">
                ¿Tienes preguntas sobre tu inversión?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Nuestros expertos están aquí para ayudarte a tomar la mejor decisión.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-good-lime text-good-dark-green font-semibold py-3 px-8 rounded-xl hover:bg-good-lime/90 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Hablar con un experto
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-good-dark-green text-white font-semibold py-3 px-8 rounded-xl hover:bg-good-dark-green/90 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Ver más información
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </main>
  );
};

export default InvestmentSimulatorPage;