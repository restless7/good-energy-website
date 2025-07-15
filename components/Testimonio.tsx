// components/Testimonio.tsx
'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const Testimonio = () => {
  return (
    // CAMBIO: Se reemplaza 'bg-good-white' por 'bg-good-lime'
    <section className="bg-good-lime pb-20 lg:pb-32">
      <div className="container mx-auto px-6">
        {/* El gran card con la imagen de fondo */}
        <motion.div 
          className="relative rounded-[40px] overflow-hidden text-good-white text-center flex flex-col items-center justify-center p-8 md:p-16 min-h-[600px]"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          {/* Capa 0: Imagen de fondo */}
          <Image
            src="/images/cta-background.png"
            alt="Vista de la granja solar al atardecer"
            layout="fill"
            objectFit="cover"
            className="z-0"
          />
          {/* Capa 1: Overlay oscuro */}
          <div className="absolute inset-0 bg-black/50 z-10"></div>

          {/* Capa 2: Contenido */}
          <div className="relative z-20 flex flex-col items-center gap-6">
            <Image 
              src="/images/cruz.png"
              width={80}
              height={80}
              alt=""
              className="opacity-70"
            />
            <h2 className="text-4xl md:text-5xl font-bold max-w-2xl">
              Regístrate ahora y obtén bono de hasta 2 Millones COP.
            </h2>
            <p className="text-lg text-white/80 max-w-xl">
              Tu dinero trabajando para ti con ingresos pasivos asegurados y demanda energética en crecimiento.
            </p>
            <Link href="#contacto">
              <button className="bg-good-lime text-good-dark-green px-10 py-4 font-bold uppercase tracking-wider rounded-full text-lg hover:bg-yellow-400 hover:scale-105 transition-all">
                Quiero mi bono 2M&#39;
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonio;