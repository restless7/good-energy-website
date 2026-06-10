'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const PortafolioEcosistema = () => {
  return (
    <section className="bg-good-white py-20 lg:py-32 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-good-dark-green mb-4"
          >
            Un Ecosistema de Inversión <span className="text-good-lime">Premium</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Diversifique su capital en infraestructura energética de alto impacto. Elija el perfil de retorno que mejor se adapte a su estrategia financiera.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Card 1: Granjas Solares */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group relative bg-good-green rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-3xl"
          >
            <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-500">
              <Image 
                src="/images/solar-farm.png" 
                alt="Granja Solar" 
                fill 
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-good-dark-green via-good-green/80 to-transparent" />
            </div>
            
            <div className="relative z-10 p-10 h-full flex flex-col justify-end min-h-[400px]">
              <div className="bg-good-lime/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm border border-good-lime/30">
                <svg className="w-8 h-8 text-good-lime" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-good-white mb-3">Granjas Solares</h3>
              <p className="text-good-white/80 mb-8 max-w-sm">
                Generación a gran escala. Ingresos pasivos estables respaldados por contratos de venta de energía a largo plazo. Riesgo minimizado.
              </p>
              <ul className="space-y-3 mb-8 text-sm text-good-white/90">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-good-lime" /> Retorno Sostenido</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-good-lime" /> Activo Inmobiliario</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-good-lime" /> Escalabilidad Regional</li>
              </ul>
              <Link href="#como-funciona" className="inline-flex items-center justify-between bg-transparent border-2 border-good-lime text-good-lime px-6 py-3 rounded-full font-bold uppercase tracking-wider hover:bg-good-lime hover:text-good-dark-green transition-colors">
                <span>Conocer Modelo</span>
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </motion.div>

          {/* Card 2: Electrolineras */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group relative bg-[#0E4D58] rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-3xl"
          >
            <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0E4D58] to-[#0A3A43] z-0" />
              {/* Optional background texture or image could go here */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#052126] via-[#0E4D58]/80 to-transparent z-10" />
            </div>
            
            <div className="relative z-20 p-10 h-full flex flex-col justify-end min-h-[400px]">
              <div className="absolute top-0 right-0 p-8">
                <span className="bg-[#D8DA00] text-[#052126] text-xs font-bold px-3 py-1 rounded-full tracking-wider uppercase shadow-lg">
                  Nuevo Producto
                </span>
              </div>
              <div className="bg-[#D8DA00]/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm border border-[#D8DA00]/30">
                <svg className="w-8 h-8 text-[#D8DA00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-[#FFFDF0] mb-3">Electrolineras Premium</h3>
              <p className="text-[#8CB4BC] mb-8 max-w-sm">
                Nodos de carga ultra-rápida. Arbitraje energético de alta rentabilidad. Retorno de capital acelerado apalancado en la movilidad eléctrica.
              </p>
              <ul className="space-y-3 mb-8 text-sm text-[#FFFDF0]/90">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#D8DA00]" /> TIR Superior al 20%</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#D8DA00]" /> Recuperación de Capital Rápida</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#D8DA00]" /> Arbitraje de Margen Alto</li>
              </ul>
              <Link href="/investment-simulator" className="inline-flex items-center justify-between bg-[#D8DA00] text-[#052126] px-6 py-3 rounded-full font-bold uppercase tracking-wider hover:bg-white transition-colors shadow-[0_0_20px_rgba(216,218,0,0.3)]">
                <span>Simular Inversión</span>
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default PortafolioEcosistema;
