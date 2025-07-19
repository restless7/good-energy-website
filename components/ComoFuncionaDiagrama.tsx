// components/ComoFuncionaDiagrama.tsx

'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowRight } from 'lucide-react';

const ComoFuncionaDiagrama = () => {
  return (
    <section 
      id="como-funciona"
      // --- INICIO DE LA MODIFICACIÓN DEL DEGRADADO ---
      // Se ajusta la proporción para que el color lima domine el fondo
style={{ background: 'linear-gradient(to bottom, #D8DA00, #FEFDF0 99%)' }}
      // --- FIN DE LA MODIFICACIÓN DEL DEGRADADO ---
    >
      <div className="container mx-auto px-6 relative z-10 py-16">
        {/* El resto del componente permanece igual... */}
        <h2 className="text-4xl font-bold text-center mb-12 text-good-dark-green">¿Cómo funciona?</h2>
        
        <div className="
          grid grid-cols-1 lg:grid-cols-[auto_auto_auto] 
          justify-center items-center 
          gap-y-8 lg:gap-x-6 
          mb-8 text-good-dark-green"
        >
          {/* Elemento 1: Paneles */}
          <motion.div 
            className="flex flex-col items-center text-center" 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.5 }}
          >
            <Image src="/images/diagram-panels.svg" width={250} height={100} alt="Inversionistas adquieren participaciones" />
            <p className="mt-2 max-w-xs">Tú y otros inversionistas adquieren participaciones de la planta solar.</p>
          </motion.div>
          
          {/* Elemento 2: Flecha */}
          <div className="w-full flex justify-center">
            <ArrowDown className="w-8 h-8 text-good-dark-green/50 lg:hidden"/>
            <ArrowRight className="w-12 h-12 text-good-dark-green/50 hidden lg:block"/>
          </div>

          {/* Caja de comercializadoras */}
          <motion.div 
            className="bg-transparent border-2 border-good-dark-green rounded-2xl shadow-lg p-6 text-center max-w-sm mx-auto" 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="mb-4">La energía generada se vende a comercializadoras como:</p>
            <Image src="/images/diagram-logos.png" width={300} height={50} alt="Logos de comercializadoras" className="mx-auto"/>
          </motion.div>
        </div>
        
        <div className="relative flex flex-col items-center gap-8 text-good-dark-green mt-12">
          
          <motion.div 
            className="absolute top-[50%] left-[5%] md:left-[15%] lg:left-[20%] w-[300px] h-[300px] lg:w-[400px] lg:h-[400px] z-0"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 0.2 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ 
              opacity: { duration: 1 }, 
              scale: { duration: 5, ease: "easeInOut", repeat: Infinity } 
            }}
            viewport={{ once: true, amount: 0.5 }}
          >
            <Image src="/images/decor-crosses-outline.png" fill alt="" className="object-contain" />
          </motion.div>
          
          <ArrowDown className="w-8 h-8 text-good-dark-green/50"/>
          <motion.p className="bg-good-lime text-good-dark-green font-bold px-6 py-3 rounded-full shadow-md z-10" animate={{ scale: [1, 1.03, 1] }} transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}>
            Asegurando ingresos estables hasta por 21 años.
          </motion.p>
          <motion.p className="text-center max-w-xs z-10" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.4 }}>
            Con 100 participaciones disponibles y facilidad de pago
          </motion.p>
          <ArrowDown className="w-8 h-8 text-good-dark-green/50"/>
          <motion.div className="bg-good-dark-green text-good-lime rounded-2xl shadow-lg p-6 flex items-center gap-4 max-w-md z-10" animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 4, ease: "easeInOut", repeat: Infinity, delay: 0.5 }}>
            <Image src="/images/diagram-profit-icon.svg" width={60} height={60} alt="Icono de rentabilidad"/>
            <p>Cada inversionista recibe rentabilidad pasiva y contribuye al desarrollo sostenible del país.</p>
          </motion.div>
          <Link href="#contacto" className="mt-8 z-10">
            <motion.button className="bg-good-lime text-good-dark-green px-8 py-3 font-bold uppercase tracking-wider rounded-full" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Quiero invertir
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ComoFuncionaDiagrama;