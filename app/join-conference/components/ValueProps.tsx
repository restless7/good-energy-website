// app/join-conference/components/ValueProps.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Shield, Leaf, Star, ChevronLeft, ChevronRight } from 'lucide-react';

const ValueProps: React.FC = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const trustPillars = [
    {
      icon: TrendingUp,
      title: 'Rentabilidad real y sostenible',
      subtitle: '8–12% anual estimado',
      description: 'Genera ingresos pasivos mensuales con tecnología solar probada y respaldada por datos históricos del mercado energético colombiano.',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      borderColor: 'border-green-200',
    },
    {
      icon: Shield,
      title: 'Inversión respaldada por activos solares',
      subtitle: 'Activos físicos reales',
      description: 'Tu inversión está respaldada por paneles solares físicos con garantía de 25 años y ubicación geográfica específica.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      borderColor: 'border-blue-200',
    },
    {
      icon: Leaf,
      title: 'Impacto ambiental positivo',
      subtitle: 'Energía 100% limpia',
      description: 'Contribuye activamente a la reducción de emisiones de CO₂ mientras generas retornos financieros consistentes.',
      color: 'text-good-dark-green',
      bgColor: 'bg-good-lime/20',
      borderColor: 'border-good-lime/30',
    },
  ];

  const testimonials = [
    {
      name: 'María González',
      role: 'Inversionista desde 2023',
      location: 'Bogotá, Colombia',
      avatar: '👩🏽‍💼',
      quote: 'En 8 meses ya he recuperado el 6% de mi inversión inicial. Los pagos llegan puntualmente cada mes y puedo ver mi granja solar desde la app.',
      rating: 5,
    },
    {
      name: 'Carlos Rodríguez',
      role: 'Ingeniero Químico',
      location: 'Medellín, Colombia',
      avatar: '👨🏻‍🔬',
      quote: 'Como ingeniero, analicé todos los números. Good Energy superó mis expectativas de rentabilidad y transparencia. Recomendado 100%.',
      rating: 5,
    },
    {
      name: 'Ana Patricia Silva',
      role: 'Empresaria',
      location: 'Cali, Colombia',
      avatar: '👩🏼‍💼',
      quote: 'Diversifiqué mi portafolio con energía solar. Es increíble ver cómo mi dinero genera más dinero mientras cuido el planeta.',
      rating: 5,
    },
    {
      name: 'Diego Mendoza',
      role: 'Contador Público',
      location: 'Cartagena, Colombia',
      avatar: '👨🏽‍💼',
      quote: 'Los retornos son consistentes y la plataforma es muy transparente. Puedo rastrear cada kilovatio generado por mi inversión.',
      rating: 5,
    },
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-good-white to-gray-50/50">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-good-dark-green mb-6">
            ¿Por qué invertir en energía solar con 
            <span className="text-good-lime"> Good Energy</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubre las ventajas exclusivas que hacen de Good Energy la plataforma líder 
            de inversión en energía solar en Colombia.
          </p>
        </motion.div>

        {/* Trust Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {trustPillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.02,
                  y: -10,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                }}
                className={`${pillar.bgColor} ${pillar.borderColor} border rounded-3xl p-8 text-center relative overflow-hidden`}
              >
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/30 rounded-full blur-xl transform translate-x-6 -translate-y-6"></div>
                
                <div className="relative z-10">
                  <motion.div
                    className={`${pillar.color} inline-flex items-center justify-center w-16 h-16 ${pillar.bgColor} rounded-full mb-6 shadow-lg`}
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon className="w-8 h-8" />
                  </motion.div>
                  
                  <h3 className="text-xl font-bold text-good-dark-green mb-2">
                    {pillar.title}
                  </h3>
                  
                  <p className={`font-medium ${pillar.color} mb-4 text-sm`}>
                    {pillar.subtitle}
                  </p>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Testimonials Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-good-dark-green to-good-dark-green/90 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-40 h-40 bg-good-lime/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Lo que dicen nuestros inversionistas
              </h3>
              <p className="text-gray-200 text-lg">
                Testimonios reales de personas que ya están generando ingresos con Good Energy
              </p>
            </div>

            {/* Testimonial Carousel */}
            <div className="max-w-4xl mx-auto">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                {/* Stars */}
                <div className="flex justify-center mb-6">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Star className="w-6 h-6 text-yellow-400 fill-current" />
                    </motion.div>
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-xl md:text-2xl font-medium mb-8 leading-relaxed">
                  &ldquo;{testimonials[currentTestimonial].quote}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="flex items-center justify-center">
                  <div className="text-5xl mr-4">
                    {testimonials[currentTestimonial].avatar}
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-lg">
                      {testimonials[currentTestimonial].name}
                    </p>
                    <p className="text-good-lime">
                      {testimonials[currentTestimonial].role}
                    </p>
                    <p className="text-gray-300 text-sm">
                      {testimonials[currentTestimonial].location}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Navigation */}
              <div className="flex items-center justify-center mt-8 space-x-4">
                <button
                  onClick={prevTestimonial}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                {/* Dots */}
                <div className="flex space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === currentTestimonial
                          ? 'bg-good-lime'
                          : 'bg-white/30 hover:bg-white/50'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextTestimonial}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-8 text-center"
        >
          {[
            { number: '500+', label: 'Inversionistas activos', icon: '👥' },
            { number: '12MW', label: 'Capacidad instalada', icon: '⚡' },
            { number: '₡2.5B', label: 'Invertidos exitosamente', icon: '💰' },
            { number: '99.2%', label: 'Uptime de nuestras granjas', icon: '🎯' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <div className="text-3xl mb-3">{stat.icon}</div>
              <div className="text-3xl font-bold text-good-dark-green mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ValueProps;