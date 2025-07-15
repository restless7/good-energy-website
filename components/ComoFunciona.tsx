// components/ComoFunciona.tsx
'use client';
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const ComoFunciona = () => {
  return (
    // [MODIFICACIÓN] Cambiamos el fondo a 'good-lime'
    <section id="como-funciona" className="bg-good-lime py-10">
      <div className="container mx-auto px-6">
        <div className="relative rounded-[40px] overflow-hidden">
          
          {/* Capa 0: Imagen de fondo con efecto de respiración */}
          <motion.div
            className="absolute inset-0 z-0"
            // [MODIFICACIÓN] Añadimos la animación de "respiración"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 8, ease: "easeInOut", repeat: Infinity }}
          >
            <Image
              src="/images/how-it-works-bg.png"
              alt="Persona sentada sobre paneles solares"
              fill // Prop moderna, reemplaza a layout="fill"
              className="object-cover" // Prop moderna, reemplaza a objectFit="cover"
              quality={85}
            />
            {/* Overlay oscuro para mejorar el contraste del texto */}
            <div className="absolute inset-0 bg-good-green/30"></div>
          </motion.div>
          
          {/* Capa 1: Contenido de texto */}
          <div className="relative z-10 flex flex-col justify-between min-h-[80vh] p-8 md:p-12 text-good-white">
            
            {/* ---- Bloque Superior Izquierdo ---- */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {/* [MODIFICACIÓN] Reemplazamos el h2 por la imagen */}
              <Image
                src="/images/como-title.png" // Asegúrate de que este es el nombre de tu nuevo PNG
                width={250} // Ajusta el ancho según sea necesario
                height={55} // Ajusta la altura según sea necesario
                alt="Cómo"
              />
              <p className="mt-4 text-3xl md:text-4xl font-bold max-w-md">
                Con una inversión de <span className="text-good-lime">$45 millones COP</span>, obtienes ingresos pasivos gracias a la venta de energía.
              </p>
            </motion.div>

            {/* ---- Bloque Inferior Derecho ---- */}
            <motion.div
              className="self-end text-right"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-lg md:text-xl max-w-sm text-white/90">
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