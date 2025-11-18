// app/join-conference/components/HeroSection.tsx

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Users, Calendar, Zap } from 'lucide-react';

interface HeroSectionProps {
  remainingSeats: number;
  onReserveClick: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ remainingSeats, onReserveClick }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-good-white via-good-lime/5 to-good-dark-green/10">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10">
        {/* Animated Solar Gradient */}
        <motion.div
          className="absolute top-20 left-1/4 w-64 h-64 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, #D8DA00 0%, #D8DA00/40 40%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        
        <motion.div
          className="absolute bottom-32 right-1/4 w-48 h-48 rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, #005461 0%, #005461/40 40%, transparent 70%)',
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />

        {/* Floating Solar Rays */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 bg-good-lime/30 origin-bottom"
            style={{
              height: `${120 + i * 20}px`,
              left: `${20 + i * 15}%`,
              top: `${30 + Math.sin(i) * 10}%`,
              transform: `rotate(${-10 + i * 5}deg)`,
            }}
            animate={{
              opacity: [0, 0.6, 0],
              scaleY: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2 + i * 0.3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.4,
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
        
        {/* Scarcity Indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <div className="inline-flex items-center bg-red-500/10 border border-red-500/30 text-red-700 px-6 py-3 rounded-full text-sm font-medium">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-3 h-3 bg-red-500 rounded-full mr-3"
            />
            <Users className="w-4 h-4 mr-2" />
            Solo quedan <strong className="mx-1">{remainingSeats}</strong> asientos de 15
          </div>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-7xl font-bold text-good-dark-green mb-6 leading-tight"
        >
          Conferencia exclusiva:
          <br />
          <span className="relative">
            <motion.span
              className="bg-gradient-to-r from-good-lime to-good-lime/80 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              Invierte en Energía Solar
            </motion.span>
            <motion.div
              className="absolute -inset-2 bg-good-lime/20 rounded-2xl -z-10"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </span>
          <br />
          y Asegura tu Futuro
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed"
        >
          <strong className="text-good-dark-green">15 cupos disponibles</strong> — descubre cómo obtener 
          <strong className="text-good-dark-green"> ingresos pasivos mensuales</strong> con energía limpia.
        </motion.p>

        {/* Value Points */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap justify-center items-center gap-6 mb-10 text-sm md:text-base"
        >
          <div className="flex items-center bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
            <Zap className="w-5 h-5 text-good-lime mr-2" />
            <span className="font-medium text-good-dark-green">12% ROI anual</span>
          </div>
          <div className="flex items-center bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
            <Calendar className="w-5 h-5 text-good-lime mr-2" />
            <span className="font-medium text-good-dark-green">Evento exclusivo</span>
          </div>
          <div className="flex items-center bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
            <Users className="w-5 h-5 text-good-lime mr-2" />
            <span className="font-medium text-good-dark-green">Máximo 15 personas</span>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-16"
        >
          <motion.button
            onClick={onReserveClick}
            whileHover={{ 
              scale: 1.05, 
              boxShadow: '0 20px 40px rgba(216, 218, 0, 0.3)' 
            }}
            whileTap={{ scale: 0.98 }}
            className="group relative bg-good-lime hover:bg-good-lime/90 text-good-dark-green font-bold py-6 px-12 rounded-full text-xl shadow-xl transition-all duration-300"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-good-lime via-yellow-300 to-good-lime opacity-0 group-hover:opacity-100 rounded-full transition-opacity duration-300"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
            <span className="relative z-10 flex items-center">
              🎯 Reserva tu asiento ahora
              <motion.div
                className="ml-3"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowDown className="w-6 h-6" />
              </motion.div>
            </span>
          </motion.button>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-sm text-gray-600 mt-4"
          >
            💯 Sin compromiso • 🔐 Información confidencial • ⚡ Acceso inmediato
          </motion.p>
        </motion.div>

        {/* Urgency Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-good-lime/20 shadow-lg"
          >
            <div className="text-3xl mb-3">⏰</div>
            <h3 className="font-bold text-good-dark-green mb-2">Tiempo Limitado</h3>
            <p className="text-sm text-gray-600">Las inscripciones cierran pronto</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-good-lime/20 shadow-lg"
          >
            <div className="text-3xl mb-3">👥</div>
            <h3 className="font-bold text-good-dark-green mb-2">Grupo Selecto</h3>
            <p className="text-sm text-gray-600">Solo 15 inversionistas elegidos</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-good-lime/20 shadow-lg"
          >
            <div className="text-3xl mb-3">🎁</div>
            <h3 className="font-bold text-good-dark-green mb-2">Acceso Exclusivo</h3>
            <p className="text-sm text-gray-600">Información no disponible públicamente</p>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-good-white to-transparent"></div>
    </section>
  );
};

export default HeroSection;