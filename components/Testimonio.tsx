// components/Testimonio.tsx
'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const Testimonio = () => {
  return (
    <section className="bg-good-lime pb-20 lg:pb-32">
      <motion.div 
        className="relative rounded-[40px] overflow-hidden text-good-white text-center flex flex-col items-center justify-center p-8 md:p-16 min-h-[600px] bg-good-dark-green"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        
        {/* IMAGEN PARA MÓVIL */}
        <Image
          src="/images/cta-background-vertical.png"
          alt="Vista de la granja solar al atardecer"
          fill
          // 👇 AQUÍ ESTÁ EL CAMBIO CLAVE: 'object-top' se reemplaza por 'object-bottom'
          className="z-0 object-cover object-bottom scale-150 lg:scale-100 lg:hidden"
        />

        {/* IMAGEN PARA DESKTOP */}
        <Image
          src="/images/cta-background.png"
          alt="Vista de la granja solar al atardecer"
          fill
          className="z-0 object-cover object-center hidden lg:block"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
        
        <div className="relative z-20 flex flex-col items-center gap-6">
          <Image 
            src="/images/cruz.png"
            width={80}
            height={80}
            alt=""
            className="opacity-70"
          />
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold max-w-2xl">
            Regístrate ahora y obtén bono de hasta <br />
            <span className="text-good-lime">2 Millones COP.</span>
          </h2>
          <p className="text-base lg:text-lg text-white/80 max-w-xl">
            Tu dinero trabajando para ti con ingresos pasivos asegurados y demanda energética en crecimiento.
          </p>
          <Link href="#contacto">
            <button className="bg-good-lime text-good-dark-green px-10 py-4 font-bold uppercase tracking-wider rounded-full text-base lg:text-lg whitespace-nowrap hover:bg-yellow-400 hover:scale-105 transition-all">
              Quiero mi bono 2M&#39;
            </button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default Testimonio;