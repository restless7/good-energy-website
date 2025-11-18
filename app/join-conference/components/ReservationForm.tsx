// app/join-conference/components/ReservationForm.tsx

'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { 
  User, 
  Mail, 
  Phone, 
  Globe, 
  Users, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Sparkles,
  Gift
} from 'lucide-react';
import { useSeatCounter } from '../../../lib/useSeatCounter';

interface ReservationFormData {
  name: string;
  email: string;
  phone?: string;
  country: string;
  mode: 'virtual' | 'presencial';
}

interface ReservationFormProps {
  onSuccess?: (data: { id: string; remainingSeats: number }) => void;
}

const ReservationForm: React.FC<ReservationFormProps> = ({ onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState<{ id: string; remainingSeats: number } | null>(null);

  const { remainingSeats, isFull, updateOptimisticSeats, refreshSeats } = useSeatCounter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<ReservationFormData>();

  const countries = [
    'Colombia', 'Argentina', 'Brasil', 'Chile', 'Ecuador', 'Perú', 
    'México', 'España', 'Estados Unidos', 'Otro'
  ];

  const watchedMode = watch('mode');

  const onSubmit = useCallback(async (data: ReservationFormData) => {
    if (isFull) {
      setSubmitError('Lo sentimos, todos los asientos están ocupados.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    // Optimistically update seat count
    updateOptimisticSeats(Math.max(0, remainingSeats - 1));

    try {
      const response = await fetch('/api/conference/reserve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setSuccessData(result.data);
        setShowSuccess(true);
        reset();
        onSuccess?.(result.data);
        
        // Refresh actual seat count
        setTimeout(() => {
          refreshSeats();
        }, 1000);
      } else {
        throw new Error(result.error || 'Error al procesar la reserva');
      }
    } catch (error) {
      console.error('Reservation error:', error);
      setSubmitError(error instanceof Error ? error.message : 'Error de conexión. Intenta nuevamente.');
      // Revert optimistic update
      updateOptimisticSeats(remainingSeats);
    } finally {
      setIsSubmitting(false);
    }
  }, [isFull, remainingSeats, updateOptimisticSeats, refreshSeats, reset, onSuccess]);

  if (showSuccess && successData) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto bg-gradient-to-br from-green-50 to-good-lime/10 rounded-3xl p-8 md:p-12 text-center border-2 border-green-200 shadow-2xl"
      >
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ duration: 0.8, times: [0, 0.6, 1] }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <CheckCircle className="w-24 h-24 text-green-500 mx-auto" />
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
                scale: { duration: 2, repeat: Infinity }
              }}
              className="absolute -top-2 -right-2"
            >
              <Sparkles className="w-8 h-8 text-yellow-500" />
            </motion.div>
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl md:text-4xl font-bold text-good-dark-green mb-4"
        >
          🎉 ¡Tu asiento está reservado!
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-lg text-gray-600 mb-8 leading-relaxed"
        >
          Excelente decisión. Has asegurado tu lugar en la 
          <strong className="text-good-dark-green"> Conferencia Sol Inversor</strong>.
          Te hemos enviado todos los detalles a tu email.
        </motion.p>

        {/* Remaining Seats Alert */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
          className={`inline-flex items-center px-6 py-3 rounded-full text-sm font-medium mb-8 ${
            successData.remainingSeats <= 3
              ? 'bg-red-100 text-red-700 border-2 border-red-200'
              : successData.remainingSeats <= 7
              ? 'bg-orange-100 text-orange-700 border-2 border-orange-200'
              : 'bg-blue-100 text-blue-700 border-2 border-blue-200'
          }`}
        >
          <Users className="w-4 h-4 mr-2" />
          {successData.remainingSeats === 0 ? (
            '🔥 ¡CONFERENCIA LLENA!'
          ) : (
            `Solo quedan ${successData.remainingSeats} asientos disponibles`
          )}
        </motion.div>

        {/* Success Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="space-y-4"
        >
          <div className="bg-white/50 rounded-2xl p-6 border border-good-lime/20">
            <h3 className="font-bold text-good-dark-green mb-3 flex items-center justify-center">
              <Gift className="w-5 h-5 mr-2" />
              ¿Qué sigue ahora?
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-good-lime rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Revisa tu email para confirmar los detalles del evento</span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-good-lime rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Te enviaremos el enlace de acceso 24 horas antes</span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-good-lime rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Recibirás material exclusivo previo al evento</span>
              </div>
            </div>
          </div>

          <motion.button
            onClick={() => {
              setShowSuccess(false);
              setSuccessData(null);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-good-lime text-good-dark-green font-semibold px-8 py-3 rounded-xl hover:bg-good-lime/90 transition-colors"
          >
            Perfecto, ¡entendido!
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <section id="reservation-form" className="py-16 px-4">
      <div className="max-w-2xl mx-auto">
        
        {/* Form Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="text-5xl mr-4"
            >
              🎯
            </motion.div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-good-dark-green mb-2">
                Reserva tu asiento ahora
              </h2>
              <p className="text-lg text-gray-600">
                Solo toma 30 segundos asegurar tu lugar
              </p>
            </div>
          </div>

          {/* Real-time Seat Counter */}
          <motion.div
            animate={{ 
              scale: remainingSeats <= 5 ? [1, 1.05, 1] : [1],
              borderColor: remainingSeats <= 5 ? ['#ef4444', '#f97316', '#ef4444'] : ['#D8DA00']
            }}
            transition={{ 
              duration: remainingSeats <= 5 ? 2 : 0,
              repeat: remainingSeats <= 5 ? Infinity : 0
            }}
            className={`inline-flex items-center px-6 py-3 rounded-full border-2 ${
              isFull
                ? 'bg-red-500 text-white border-red-500'
                : remainingSeats <= 5
                ? 'bg-red-50 text-red-700 border-red-400'
                : remainingSeats <= 10
                ? 'bg-orange-50 text-orange-700 border-orange-400'
                : 'bg-good-lime/20 text-good-dark-green border-good-lime'
            }`}
          >
            <Users className="w-5 h-5 mr-2" />
            <span className="font-bold">
              {isFull ? '¡CONFERENCIA LLENA!' : `${remainingSeats}/15 asientos disponibles`}
            </span>
          </motion.div>
        </motion.div>

        {/* Reservation Form */}
        {!isFull ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-good-lime/20"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-good-dark-green mb-2">
                  Nombre completo *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('name', {
                      required: 'El nombre es obligatorio',
                      minLength: { value: 2, message: 'El nombre debe tener al menos 2 caracteres' }
                    })}
                    type="text"
                    className={`block w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-good-lime focus:border-transparent ${
                      errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                    }`}
                    placeholder="Tu nombre completo"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-good-dark-green mb-2">
                  Correo electrónico *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('email', {
                      required: 'El email es obligatorio',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Email no válido'
                      }
                    })}
                    type="email"
                    className={`block w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-good-lime focus:border-transparent ${
                      errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                    }`}
                    placeholder="tu@email.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Phone Field (Optional) */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-good-dark-green mb-2">
                  Teléfono (opcional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('phone')}
                    type="tel"
                    className="block w-full pl-10 pr-4 py-3 border border-gray-300 bg-white rounded-xl focus:ring-2 focus:ring-good-lime focus:border-transparent"
                    placeholder="+57 300 123 4567"
                  />
                </div>
              </div>

              {/* Country Field */}
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-good-dark-green mb-2">
                  País *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Globe className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    {...register('country', { required: 'Selecciona tu país' })}
                    className={`block w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-good-lime focus:border-transparent ${
                      errors.country ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                    }`}
                  >
                    <option value="">Selecciona tu país</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.country && (
                  <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
                )}
              </div>

              {/* Mode Selection */}
              <div>
                <label className="block text-sm font-medium text-good-dark-green mb-2">
                  Modalidad de asistencia *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <motion.label
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative cursor-pointer border-2 rounded-xl p-4 text-center transition-all ${
                      watchedMode === 'virtual'
                        ? 'border-good-lime bg-good-lime/10 text-good-dark-green'
                        : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    <input
                      {...register('mode', { required: 'Selecciona la modalidad' })}
                      type="radio"
                      value="virtual"
                      className="sr-only"
                    />
                    <div className="text-2xl mb-2">💻</div>
                    <div className="font-semibold">Virtual</div>
                    <div className="text-xs text-gray-500">Online via Zoom</div>
                  </motion.label>

                  <motion.label
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative cursor-pointer border-2 rounded-xl p-4 text-center transition-all ${
                      watchedMode === 'presencial'
                        ? 'border-good-lime bg-good-lime/10 text-good-dark-green'
                        : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    <input
                      {...register('mode', { required: 'Selecciona la modalidad' })}
                      type="radio"
                      value="presencial"
                      className="sr-only"
                    />
                    <div className="text-2xl mb-2">🏢</div>
                    <div className="font-semibold">Presencial</div>
                    <div className="text-xs text-gray-500">Bucaramanga Colombia</div>
                  </motion.label>
                </div>
                {errors.mode && (
                  <p className="mt-1 text-sm text-red-600">{errors.mode.message}</p>
                )}
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {submitError && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-center p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl"
                  >
                    <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                    <span className="text-sm">{submitError}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting || isFull}
                whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all ${
                  isSubmitting || isFull
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-good-lime text-good-dark-green hover:bg-good-lime/90 shadow-xl hover:shadow-2xl'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                    Reservando tu asiento...
                  </div>
                ) : (
                  '🎯 Reservar mi asiento AHORA'
                )}
              </motion.button>

              {/* Trust Indicators */}
              <div className="text-center text-sm text-gray-500 space-y-2">
                <div className="flex items-center justify-center space-x-4">
                  <span>🔐 100% seguro</span>
                  <span>📧 Confirmación inmediata</span>
                  <span>🚫 Sin spam</span>
                </div>
                <p>
                  Al reservar, aceptas recibir información sobre la conferencia.
                  <br />
                  Puedes cancelar en cualquier momento.
                </p>
              </div>
            </form>
          </motion.div>
        ) : (
          /* Conference Full State */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border-2 border-red-200 rounded-3xl p-8 text-center"
          >
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-2xl font-bold text-red-700 mb-4">
              ¡Conferencia llena!
            </h3>
            <p className="text-red-600 mb-6">
              Lamentablemente, todos los asientos han sido reservados. 
              Te notificaremos si se libera algún cupo o sobre futuras conferencias.
            </p>
            <button className="bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 transition-colors">
              Únete a la lista de espera
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ReservationForm;