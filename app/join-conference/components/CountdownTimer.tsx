// app/join-conference/components/CountdownTimer.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertTriangle } from 'lucide-react';

interface CountdownTimerProps {
  onUrgencyIncrease?: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ onUrgencyIncrease }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    // Set conference date to 7 days from now (or any specific date)
    const conferenceDate = new Date();
    conferenceDate.setDate(conferenceDate.getDate() + 7);
    conferenceDate.setHours(19, 0, 0, 0); // 7:00 PM

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = conferenceDate.getTime() - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });

        // Trigger urgency when less than 2 days remain
        if (days < 2 && !isUrgent) {
          setIsUrgent(true);
          onUrgencyIncrease?.();
        }
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [isUrgent, onUrgencyIncrease]);

  const timeUnits = [
    { label: 'Días', value: timeLeft.days, color: 'text-red-600' },
    { label: 'Horas', value: timeLeft.hours, color: 'text-orange-600' },
    { label: 'Minutos', value: timeLeft.minutes, color: 'text-yellow-600' },
    { label: 'Segundos', value: timeLeft.seconds, color: 'text-good-lime' },
  ];

  const totalMinutesLeft = timeLeft.days * 24 * 60 + timeLeft.hours * 60 + timeLeft.minutes;
  const urgencyLevel = totalMinutesLeft < 2880 ? 'high' : totalMinutesLeft < 7200 ? 'medium' : 'low'; // 2 days, 5 days

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className={`py-16 px-4 ${
        urgencyLevel === 'high'
          ? 'bg-gradient-to-r from-red-500/10 to-orange-500/10'
          : urgencyLevel === 'medium'
          ? 'bg-gradient-to-r from-orange-500/10 to-yellow-500/10'
          : 'bg-gradient-to-r from-good-lime/10 to-good-dark-green/10'
      }`}
    >
      <div className="max-w-4xl mx-auto text-center">
        
        {/* Urgency Header */}
        <motion.div
          initial={{ scale: 0.9 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          {urgencyLevel === 'high' && (
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="inline-flex items-center bg-red-500/10 border-2 border-red-500/30 text-red-700 px-6 py-3 rounded-full text-sm font-bold mb-4"
            >
              <AlertTriangle className="w-5 h-5 mr-2" />
              ⚠️ ÚLTIMAS HORAS PARA RESERVAR
            </motion.div>
          )}
          
          <h2 className="text-3xl md:text-5xl font-bold text-good-dark-green mb-4">
            {urgencyLevel === 'high' ? (
              '⏰ Las inscripciones cierran pronto'
            ) : urgencyLevel === 'medium' ? (
              '⏳ Tiempo limitado para reservar'
            ) : (
              '📅 Reserva tu lugar ahora'
            )}
          </h2>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            {urgencyLevel === 'high'
              ? 'Solo quedan pocas horas para asegurar tu lugar en la conferencia más exclusiva de inversión solar.'
              : 'Las reservas para la Conferencia Sol Inversor se cierran automáticamente cuando se complete el aforo o se agote el tiempo.'
            }
          </p>
        </motion.div>

        {/* Countdown Display */}
        <motion.div
          className={`bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border-2 ${
            urgencyLevel === 'high'
              ? 'border-red-500/30'
              : urgencyLevel === 'medium'
              ? 'border-orange-500/30'
              : 'border-good-lime/30'
          }`}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-center mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
              className={`p-3 rounded-full ${
                urgencyLevel === 'high'
                  ? 'bg-red-100 text-red-600'
                  : urgencyLevel === 'medium'
                  ? 'bg-orange-100 text-orange-600'
                  : 'bg-good-lime/20 text-good-dark-green'
              } mr-4`}
            >
              <Clock className="w-8 h-8" />
            </motion.div>
            <div>
              <h3 className="text-2xl font-bold text-good-dark-green">
                Tiempo restante para inscribirse
              </h3>
              <p className="text-gray-600">
                Conferencia Sol Inversor - {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('es-CO', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Timer Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {timeUnits.map((unit, index) => (
              <motion.div
                key={unit.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className={`relative bg-gradient-to-br ${
                  urgencyLevel === 'high'
                    ? 'from-red-50 to-red-100 border-red-200'
                    : urgencyLevel === 'medium'
                    ? 'from-orange-50 to-orange-100 border-orange-200'
                    : 'from-good-lime/20 to-good-lime/10 border-good-lime/30'
                } border-2 rounded-2xl p-6 text-center overflow-hidden`}
              >
                {/* Background pulse for urgency */}
                {urgencyLevel === 'high' && (
                  <motion.div
                    className="absolute inset-0 bg-red-500/10 rounded-2xl"
                    animate={{ opacity: [0, 0.3, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
                
                <div className="relative z-10">
                  <motion.div
                    key={unit.value}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className={`text-4xl md:text-6xl font-bold ${
                      urgencyLevel === 'high'
                        ? 'text-red-600'
                        : urgencyLevel === 'medium'
                        ? 'text-orange-600'
                        : 'text-good-dark-green'
                    } mb-2`}
                  >
                    {unit.value.toString().padStart(2, '0')}
                  </motion.div>
                  <div className="text-sm md:text-base font-medium text-gray-600 uppercase tracking-wider">
                    {unit.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Additional Urgency Messages */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="mt-8 space-y-4"
          >
            {urgencyLevel === 'high' && (
              <motion.div
                animate={{
                  x: [0, -5, 5, 0],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
                className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl"
              >
                🚨 <strong>¡ATENCIÓN!</strong> Solo quedan pocas horas y {15 - Math.floor(Math.random() * 5)} asientos disponibles
              </motion.div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center justify-center bg-gray-50 p-3 rounded-xl">
                <span className="font-medium text-gray-700">
                  📍 Modalidad: Virtual y Presencial
                </span>
              </div>
              <div className="flex items-center justify-center bg-gray-50 p-3 rounded-xl">
                <span className="font-medium text-gray-700">
                  ⏰ Duración: 90 minutos
                </span>
              </div>
              <div className="flex items-center justify-center bg-gray-50 p-3 rounded-xl">
                <span className="font-medium text-gray-700">
                  🎁 Incluye: Material exclusivo
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <p className={`text-lg font-medium mb-4 ${
            urgencyLevel === 'high'
              ? 'text-red-700'
              : urgencyLevel === 'medium'
              ? 'text-orange-700'
              : 'text-good-dark-green'
          }`}>
            {urgencyLevel === 'high'
              ? '⚡ ¡No pierdas esta oportunidad única!'
              : '🎯 Asegura tu lugar antes de que se agote el tiempo'
            }
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default CountdownTimer;