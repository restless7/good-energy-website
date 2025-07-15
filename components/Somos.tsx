// components/Somos.tsx

'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import StatCard from './StatCard'; // Ahora se usa
import { motion } from 'framer-motion';
import { ArrowLeftCircle, ArrowRightCircle } from 'lucide-react'; // Ahora se usan
import EllipseHighlight from './EllipseHighlight';

// Ahora se usa
const stats = [
  { iconSrc: '/images/icon-co2.svg', value: "+ 1M'", description: 'Toneladas de CO2 evitadas' },
  { iconSrc: '/images/icon-trees.svg', value: "50 M'", description: 'Árboles salvados' },
  { iconSrc: '/images/icon-panel.svg', value: '1.740', description: 'Paneles solares en operación' },
];

const Somos = () => {
  return (
    <section id="somos" className="relative bg-good-green text-good-white py-20 lg:py-32">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* ---- COLUMNA IZQUIERDA (CÓDIGO RESTAURADO) ---- */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <motion.div
              className="absolute top-64 left-100 opacity-100 z-0"
              animate={{ scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image src="/images/decor-crosses.png" width={300} height={300} alt="" />
            </motion.div>
            
            <Image src="/images/somos-title.png" width={350} height={70} alt="Somos" className="mb-4"/>
            
            <h3 className="relative text-4xl lg:text-5xl font-bold leading-tight z-10">
              La planta de energía solar <br />
              <span className="text-good-lime">más grande de Santander</span>
            </h3>
            
            <div className="mt-12">
              <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
                <motion.div
                  className="flex gap-4"
                  animate={{ x: ['0%', '-50%'] }}
                  transition={{ ease: 'linear', duration: 45, repeat: Infinity }}
                >
                  {[...stats, ...stats].map((stat, index) => (
                    <div key={index} className="flex-shrink-0 w-full sm:w-52">
                       <StatCard {...stat} />
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-4 opacity-50">
              <ArrowLeftCircle className="w-10 h-10 text-white"/>
              <ArrowRightCircle className="w-10 h-10 text-white"/>
            </div>
          </motion.div>
 {/* ---- COLUMNA DERECHA (CON POSICIONAMIENTO CORREGIDO) ---- */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col gap-8"
          >
            <Image src="/images/solar-farm.png" width={600} height={450} alt="Vista aérea de la granja solar Good Energy" className="rounded-3xl w-full" />
            
            <div className="relative self-end">
              
              <motion.div
                className="absolute top-1/2 right-0 -translate-y-1/2 z-0 w-[360px] h-[150px]"
                animate={{ scale: [1, 1.03, 1] }}
                // [MODIFICACIÓN CLAVE] Añadimos 'y' para el ajuste vertical
                style={{ 
                  rotate: -15,
                  x: '5%',     // Un pequeño empujón a la derecha
                  y: '-55%'    // Un pequeño empujón hacia ARRIBA
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <EllipseHighlight className="w-full h-full text-good-lime" />
              </motion.div>
              
              <h4 className="relative text-3xl font-bold z-10 text-right pr-8">
                Haga parte de <br /> Good Energy
              </h4>
            </div>


            <p className="text-white/80">
              <span className="font-bold">Únicamente 100 socios que crean</span>, como nosotros, en dejar una huella positiva en la tierra y en la historia energética de Colombia.
            </p>
            <Link href="#invertir">
              <motion.button 
                whileHover={{ scale: 1.05, backgroundColor: '#E0FF29' }}
                whileTap={{ scale: 0.95 }}
                className="bg-good-lime text-good-dark-green px-8 py-3 font-bold uppercase tracking-wider rounded-full self-start"
              >
                Conocer más
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Somos;