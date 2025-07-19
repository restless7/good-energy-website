// components/ComoFunciona.tsx
'use client';
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const ComoFunciona = () => {
  return (
    // La sección mantiene el padding vertical (py-10) y el color de fondo
    <section id="como-funciona" className="bg-good-lime py-10">
      
      {/* --- INICIO DE LA MODIFICACIÓN DE ANCHO --- */}
      {/* Se ha eliminado el 'div' que contenía las clases 'container mx-auto px-0 md:px-6'. */}
      {/* Ahora, el siguiente 'div' es hijo directo de 'section' y ocupará el ancho completo. */}
      {/* --- FIN DE LA MODIFICACIÓN DE ANCHO --- */}
      
      {/* Este contenedor ahora se estira al 100% del ancho en todas las pantallas */}
      <div className="relative rounded-[40px] overflow-hidden">
        
        <motion.div
          className="absolute inset-0 z-0"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
        >
          {/* Imagen para Móvil */}
          <div className="block md:hidden">
            <Image
              src="/images/how-it-works-bg-vertical.png"
              alt="Persona sentada sobre paneles solares - vista móvil"
              fill
              className="object-cover object-bottom"
              quality={85}
              priority
            />
          </div>

          {/* Imagen para Desktop */}
          <div className="hidden md:block">
            <Image
              src="/images/how-it-works-bg.png"
              alt="Persona sentada sobre paneles solares - vista desktop"
              fill
              className="object-cover object-center"
              quality={85}
              priority
            />
          </div>

          {/* --- INICIO DE LA MODIFICACIÓN DE TINTE --- */}
          {/* Se ha eliminado la siguiente línea para quitar el tinte verde: */}
          {/* <div className="absolute inset-0 bg-good-green/30"></div> */}
          {/* --- FIN DE LA MODIFICACIÓN DE TINTE --- */}

        </motion.div>
        
        <div className="relative z-10 flex flex-col p-8 md:p-12 text-good-white lg:min-h-[80vh] lg:justify-between">
          
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
            <p className="mt-4 text-sm lg:text-4xl font-bold max-w-md">
              Con una inversión de <span className="text-good-lime">$45 millones COP</span>, obtienes ingresos pasivos gracias a la venta de energía.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="self-center text-center lg:self-end lg:text-right"
          >
            <p className="text-xs lg:text-xl max-w-sm text-white/90">
              Una inversión con demanda asegurada, riesgo controlado y retornos sostenibles en el tiempo.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ComoFunciona;