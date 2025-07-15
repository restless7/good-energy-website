// components/Somos.tsx
'use client';
import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import StatCard from './StatCard';
import {
  motion,
  useMotionValue,
  useTransform,
  wrap,
  useAnimationFrame
} from 'framer-motion';
import EllipseHighlight from './EllipseHighlight';

const stats = [
  { iconSrc: '/images/icon-co2.svg', value: "+ 1M'", description: 'Toneladas de CO2 evitadas' },
  { iconSrc: '/images/icon-trees.svg', value: "50 M'", description: 'Árboles salvados' },
  { iconSrc: '/images/icon-panel.svg', value: '1.740', description: 'Paneles solares en operación' },
];

// --- PARÁMETROS DE NUESTRO MOTOR FÍSICO REFINADO ---
const BASE_VELOCITY = 0.05; 
const DRAG_SENSITIVITY = 0.005; 
const LERP_FACTOR = 0.03; 
const MAX_VELOCITY = 2; 

const Somos = () => {
  const baseX = useMotionValue(0);
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);

  const velocity = useRef(BASE_VELOCITY);
  const isDragging = useRef(false);

  useAnimationFrame(() => {
    if (!isDragging.current) {
      velocity.current = velocity.current * (1 - LERP_FACTOR) + BASE_VELOCITY * LERP_FACTOR;
    }
    baseX.set(baseX.get() + velocity.current);
  });

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
            <Image src="/images/somos-title.png" width={350} height={70} alt="Somos" className="mb-4"/>
            <h3 className="relative text-4xl lg:text-5xl font-bold leading-tight z-10">
              La planta de energía solar <br />
              <span className="text-good-lime">más grande de Santander</span>
            </h3>
            
            <div className="relative mt-12 z-10">
              <motion.div className="overflow-hidden cursor-grab" whileTap={{ cursor: "grabbing" }}>
                <motion.div
                  className="flex gap-4"
                  style={{ x }}
                  drag="x"
                  dragConstraints={{ right: 0, left: -4000 }}
                  onDragStart={() => {
                    isDragging.current = true;
                  }}
                  onDragEnd={(event, info) => {
                    isDragging.current = false;
                    let newVelocity = velocity.current + info.velocity.x * DRAG_SENSITIVITY;
                    
                    if (Math.abs(newVelocity) > MAX_VELOCITY) {
                      newVelocity = Math.sign(newVelocity) * MAX_VELOCITY;
                    }
                    velocity.current = newVelocity;
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
                // --- CORRECCIÓN AQUÍ ---
                // Se ha corregido la sintaxis de la comilla simple.
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