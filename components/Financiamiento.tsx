// components/Financiamiento.tsx
'use client';
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const Financiamiento = () => {
  return (
    <section id="financiamiento" className="bg-gradient-to-b from-good-white to-good-lime py-20 lg:py-24">
      <div className="container mx-auto px-6">
        
        <div className="flex justify-center">

          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] items-center gap-x-8 lg:gap-x-12 gap-y-8 text-center md:text-left">
            
            {/* ---- COLUMNA 1: ICONO ---- */}
            <motion.div 
              className="flex justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              animate={{ y: ["0%", "-5%", "0%"] }}
              transition={{
                opacity: { duration: 0.6 },
                scale: { duration: 0.6 },
                y: { duration: 3, ease: "easeInOut", repeat: Infinity }
              }}
            >
              <Image src="/images/icon-financing.svg" width={150} height={150} alt="Icono de financiamiento" />
            </motion.div>

            {/* ---- COLUMNA 2: TEXTO ---- */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {/* CAMBIO CLAVE: Se reduce el tamaño base (móvil) y se mantiene el de desktop (lg) */}
              <h2 className="text-3xl lg:text-5xl font-bold text-good-dark-green uppercase">
                Fácil <br /> Financiamiento
              </h2>
              {/* CAMBIO CLAVE: Se reduce el tamaño del subtítulo también para mantener la coherencia */}
              <p className="mt-4 text-xl lg:text-2xl text-good-dark-green/80">
                Adquiere tu participación <br /> hasta en 12 meses sin interés*
              </p>
              <p className="mt-2 text-sm text-good-dark-green/60">
                *Aplican condiciones
              </p>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Financiamiento;