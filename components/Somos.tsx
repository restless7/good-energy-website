// components/Somos.tsx
'use client';
import React, { useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import StatCard from './StatCard';
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  wrap
} from 'framer-motion';
import EllipseHighlight from './EllipseHighlight';

const stats = [
  { iconSrc: '/images/icon-co2.svg', value: "+ 1M'", description: 'Toneladas de CO2 evitadas' },
  { iconSrc: '/images/icon-trees.svg', value: "50 M'", description: 'Árboles salvados' },
  { iconSrc: '/images/icon-panel.svg', value: '1.740', description: 'Paneles solares en operación' },
];

const DURATION_BASE = 25; // Duración en segundos para un ciclo completo

const Somos = () => {
  const baseX = useMotionValue(0);
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);

  const animationRef = React.useRef<ReturnType<typeof animate> | null>(null);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const startBaseAnimation = useCallback(() => {
    animationRef.current = animate(baseX, [baseX.get(), -25], {
      ease: 'linear',
      duration: DURATION_BASE * (1 - (baseX.get() / -25)),
      onComplete: () => {
        baseX.set(0); // Resetea para el siguiente bucle
        animationRef.current = animate(baseX, [0, -25], {
          ease: 'linear',
          duration: DURATION_BASE,
          repeat: Infinity,
          repeatType: 'loop',
        });
      },
    });
  }, [baseX]);

  React.useEffect(() => {
    startBaseAnimation();
    return () => {
      if (animationRef.current) animationRef.current.stop();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [startBaseAnimation]);

  const stopAllAnimations = () => {
    if (animationRef.current) animationRef.current.stop();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };
  
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
            {/* ... Elementos de la columna izquierda ... */}
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
                  onDragStart={stopAllAnimations}
                  onDragEnd={() => {
                    animationRef.current = animate(baseX, baseX.get() + baseX.getVelocity(), {
                      type: 'inertia',
                      bounceStiffness: 300,
                      bounceDamping: 40,
                      timeConstant: 250,
                      // Cuando la inercia se detiene, iniciamos el temporizador
                      onComplete: () => {
                        timeoutRef.current = setTimeout(startBaseAnimation, 3000); // 3 seg de inactividad
                      }
                    });
                  }}
                >
                  {/* Renderizamos 4 copias para un bucle infinito robusto */}
                  {[...stats, ...stats, ...stats, ...stats].map((stat, index) => (
                    <div key={index} className="flex-shrink-0 w-full sm:w-52 pointer-events-none sm:pointer-events-auto">
                       <StatCard {...stat} />
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* ... Columna derecha (sin cambios) ... */}
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