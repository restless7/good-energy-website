// components/Somos.tsx

'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import StatCard from './StatCard';
// FIX 1: Importamos el tipo que necesitamos de Framer Motion
import { motion, useAnimationControls, TargetAndTransition } from 'framer-motion';
import EllipseHighlight from './EllipseHighlight';

const stats = [
  { iconSrc: '/images/icon-co2.svg', value: "+ 1M'", description: 'Toneladas de CO2 evitadas' },
  { iconSrc: '/images/icon-trees.svg', value: "50 M'", description: 'Árboles salvados' },
  { iconSrc: '/images/icon-panel.svg', value: '1.740', description: 'Paneles solares en operación' },
];

// FIX 2: Anotamos explícitamente la constante con el tipo importado
const scrollAnimation: TargetAndTransition = {
  x: ['0%', '-50%'],
  transition: {
    ease: 'linear',
    duration: 45,
    repeat: Infinity,
  },
};

const Somos = () => {
  const [isDragging, setIsDragging] = useState(false);
  const controls = useAnimationControls();

  useEffect(() => {
    if (!isDragging) {
      controls.start(scrollAnimation);
    }
  }, [isDragging, controls]);

  return (
    <section id="somos" className="relative bg-good-green text-good-white py-20 lg:py-32 overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
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
            
            <div className="relative mt-12 z-10">
              <motion.div className="overflow-hidden cursor-grab" whileTap={{ cursor: "grabbing" }}>
                <motion.div
                  className="flex gap-4"
                  drag="x"
                  dragConstraints={{ right: 0, left: -2000 }}
                  animate={controls}
                  onDragStart={() => {
                    setIsDragging(true);
                    controls.stop();
                  }}
                  onDragEnd={() => {
                    setIsDragging(false);
                  }}
                >
                  {[...stats, ...stats, ...stats, ...stats].map((stat, index) => (
                    <div key={index} className="flex-shrink-0 w-full sm:w-52 pointer-events-none sm:pointer-events-auto">
                       <StatCard {...stat} />
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

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
                style={{ rotate: -15, x: '5%', y: '-55%' }}
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