// app/join-conference/ConferenceFunnelPage.tsx

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import HeroSection from './components/HeroSection';
import ValueProps from './components/ValueProps';
import CountdownTimer from './components/CountdownTimer';
import ReservationForm from './components/ReservationForm';
import { useSeatCounter } from '../../lib/useSeatCounter';

const ConferenceFunnelPage: React.FC = () => {
  const [, setShowUrgencyBoost] = useState(false);
  const [reservationSuccess, setReservationSuccess] = useState(false);
  
  const { remainingSeats, isLoading } = useSeatCounter();

  // Scroll to reservation form
  const scrollToReservation = useCallback(() => {
    const element = document.getElementById('reservation-form');
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, []);

  // Handle urgency increase from countdown timer
  const handleUrgencyIncrease = useCallback(() => {
    setShowUrgencyBoost(true);
  }, []);

  // Handle successful reservation
  const handleReservationSuccess = useCallback((data: { id: string; remainingSeats: number }) => {
    setReservationSuccess(true);
    
    // Optional: trigger confetti or celebration animation
    console.log('Reservation successful:', data);
    
    // Auto-scroll to top after success
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
  }, []);

  // Add urgency-based body classes for dynamic styling
  useEffect(() => {
    if (remainingSeats <= 5) {
      document.body.classList.add('conference-urgent');
    } else {
      document.body.classList.remove('conference-urgent');
    }
    
    return () => {
      document.body.classList.remove('conference-urgent');
    };
  }, [remainingSeats]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-good-white to-good-lime/10">
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
            Verificando disponibilidad de asientos...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-good-white">
      
      {/* Hero Section with Scarcity */}
      <HeroSection
        remainingSeats={remainingSeats}
        onReserveClick={scrollToReservation}
      />

      {/* Value Proposition Section */}
      <ValueProps />

      {/* Video/Explainer Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-gray-50/50 to-good-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-good-dark-green mb-6">
              📹 Descubre cómo funciona Good Energy
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Un vistazo exclusivo a nuestra plataforma de inversión en energía solar
            </p>
            
            {/* Video Placeholder - Replace with actual video */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative bg-gradient-to-br from-good-dark-green to-good-dark-green/80 rounded-3xl p-12 text-white cursor-pointer group overflow-hidden"
            >
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-good-lime/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
              
              <div className="relative z-10">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-20 h-20 bg-good-lime rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-white group-hover:text-good-dark-green transition-colors"
                >
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </motion.div>
                
                <h3 className="text-2xl font-bold mb-3">
                  &ldquo;De la inversión tradicional a la energía del futuro&rdquo;
                </h3>
                <p className="text-gray-200 text-lg mb-6">
                  Conoce casos reales de inversionistas que ya están generando ingresos mensuales con Good Energy
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white/10 rounded-xl p-3">
                    ⏱️ <strong>90 segundos</strong> de contenido
                  </div>
                  <div className="bg-white/10 rounded-xl p-3">
                    📊 <strong>Casos reales</strong> documentados
                  </div>
                  <div className="bg-white/10 rounded-xl p-3">
                    🎯 <strong>Sin compromisos</strong>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="text-sm text-gray-500 mt-4"
            >
              💡 Acceso exclusivo para asistentes de la conferencia
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Countdown Timer Section */}
      <CountdownTimer onUrgencyIncrease={handleUrgencyIncrease} />

      {/* Reservation Form Section */}
      <ReservationForm onSuccess={handleReservationSuccess} />

      {/* Final Social Proof / Testimonials */}
      <section className="py-16 px-4 bg-gradient-to-b from-good-white to-gray-50/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-good-dark-green mb-4">
              🌟 Únete a inversionistas exitosos
            </h2>
            <p className="text-lg text-gray-600">
              Personas como tú que ya están generando ingresos con energía solar
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Luis Hernández',
                role: 'Empresario',
                location: 'Medellín',
                avatar: '👨🏽‍💼',
                quote: 'En 6 meses recuperé el 4% de mi inversión. La conferencia me dio la confianza para invertir.',
                amount: '$500K COP',
              },
              {
                name: 'Carmen Ruiz',
                role: 'Contadora',
                location: 'Bogotá',
                avatar: '👩🏻‍💼',
                quote: 'Después de la conferencia, invertí inmediatamente. Los retornos superaron mis expectativas.',
                amount: '$800K COP',
              },
              {
                name: 'Roberto Silva',
                role: 'Ingeniero',
                location: 'Cali',
                avatar: '👨🏼‍🔬',
                quote: 'La transparencia de Good Energy me convenció. Ahora tengo ingresos pasivos mensuales.',
                amount: '$1.2M COP',
              },
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-white rounded-3xl p-6 shadow-xl border border-good-lime/10 text-center"
              >
                <div className="text-4xl mb-4">{testimonial.avatar}</div>
                <blockquote className="text-gray-600 italic mb-4">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <div className="border-t border-gray-100 pt-4">
                  <p className="font-bold text-good-dark-green">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                  <p className="text-xs text-good-lime font-medium mt-2">
                    Inversión inicial: {testimonial.amount}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      {!reservationSuccess && (
        <section className="py-16 px-4 bg-gradient-to-r from-good-dark-green to-good-dark-green/90 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                {remainingSeats <= 5 ? (
                  <>⚡ ¡Últimos {remainingSeats} asientos disponibles!</>
                ) : (
                  <>🎯 ¡No pierdas tu oportunidad!</>
                )}
              </h2>
              
              <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
                La próxima conferencia será en varios meses. 
                Esta es tu oportunidad de estar entre los primeros inversionistas.
              </p>
              
              <motion.button
                onClick={scrollToReservation}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`bg-good-lime text-good-dark-green font-bold py-4 px-12 rounded-full text-xl shadow-xl hover:bg-good-lime/90 transition-all ${
                  remainingSeats <= 5 ? 'animate-pulse' : ''
                }`}
              >
                {remainingSeats <= 5 ? '🔥 Reservar AHORA' : '🌞 Reservar mi asiento'}
              </motion.button>
              
              <p className="text-sm text-gray-300 mt-6">
                ⏰ Las reservas se cierran automáticamente cuando se completa el aforo
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {/* Success Celebration */}
      {reservationSuccess && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-16 px-4 bg-gradient-to-r from-green-500 to-good-lime text-good-dark-green"
        >
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, type: 'spring' }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                🎉 ¡Bienvenido a Sol Inversor!
              </h2>
              <p className="text-xl mb-6">
                Eres parte del grupo selecto de inversionistas que están construyendo el futuro energético de Colombia
              </p>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                <p className="text-lg font-medium">
                  📧 Revisa tu email para más detalles<br />
                  📅 Recibirás recordatorios antes del evento<br />
                  🎁 Material exclusivo enviado próximamente
                </p>
              </div>
            </motion.div>
          </div>
        </motion.section>
      )}
    </main>
  );
};

export default ConferenceFunnelPage;