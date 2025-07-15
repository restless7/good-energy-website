// components/ComoFunciona.tsx
'use client';
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const ComoFunciona = () => {
  return (
    <section id="como-funciona" className="bg-good-lime py-10">
      <div className="container mx-auto px-6">
        <div className="relative rounded-[40px] overflow-hidden">
          
          {/* Capa 0: Imagen de fondo (sin cambios) */}
          <motion.div
            className="absolute inset-0 z-0"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 8, ease: "easeInOut", repeat: Infinity }}
          >
            <Image
              src="/images/how-it-works-bg.png"
              alt="Persona sentada sobre paneles solares"
              fill
              className="object-cover"
              quality={85}
            />
            <div className="absolute inset-0 bg-good-green/30"></div>
          </motion.div>
          
          {/* Capa 1: Contenido de texto con layout responsivo */}
          <div className="relative z-10 flex flex-col p-8 md:p-12 text-good-white lg:min-h-[80vh] lg:justify-between">
            
            {/* ---- Bloque Superior ---- */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-48 lg:mb-0"
            >
              <Image
                src="/images/como-title.png"
                width={250}
                height={55}
                alt="Cómo"
              />
              {/* CAMBIO CLAVE: Texto más pequeño para móvil (text-2xl) */}
              <p className="mt-4 text-2xl md:text-4xl font-bold max-w-md">
                Con una inversión de <span className="text-good-lime">$45 millones COP</span>, obtienes ingresos pasivos gracias a la venta de energía.
              </p>
            </motion.div>

            {/* ---- Bloque Inferior ---- */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="self-center text-center lg:self-end lg:text-right"
            >
              {/* CAMBIO CLAVE: Texto más pequeño para móvil (text-base) */}
              <p className="text-base md:text-xl max-w-sm text-white/90">
                Una inversión con demanda asegurada, riesgo controlado y retornos sostenibles en el tiempo.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComoFunciona;