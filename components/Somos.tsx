// components/Somos.tsx
'use client';
import React, { useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
// Se elimina 'Link' y se importa 'useRouter' para navegación programática
import { useRouter } from 'next/navigation';
import StatCard from './StatCard';
import {
  motion,
  useMotionValue,
  useTransform,
  wrap,
  useAnimationFrame,
  PanInfo
} from 'framer-motion';
import EllipseHighlight from './EllipseHighlight';

const stats = [
  { iconSrc: '/images/icon-co2.svg', value: "+ 1M'", description: 'Toneladas de CO2 evitadas' },
  { iconSrc: '/images/icon-trees.svg', value: "50 M'", description: 'Árboles salvados' },
  { iconSrc: '/images/icon-panel.svg', value: '1.740', description: 'Paneles solares en operación' },
  { iconSrc: '/images/icon-home.svg', value: '2.500+', description: 'Hogares abastecidos' }
];

const PHYSICS_CONFIG = {
  BASE_VELOCITY: 0.15,
  DRAG_MULTIPLIER: 0.494,
  DECELERATION: 0.96,
  MAX_VELOCITY: 2.2,
  MIN_VELOCITY: 0.01,
  SPRING_STIFFNESS: 400,
  SPRING_DAMPING: 40,
  RESISTANCE: 0.88,
  CARD_WIDTH_DESKTOP: 208,
  CARD_WIDTH_MOBILE: 280,
  GAP: 16,
};

const Somos = () => {
  // Se instancia el router para poder navegar al hacer clic en el botón
  const router = useRouter();
  
  const baseX = useMotionValue(0);
  const velocity = useRef(PHYSICS_CONFIG.BASE_VELOCITY);
  const isDragging = useRef(false);
  const isHovered = useRef(false);
  const dragStartTime = useRef(0);
  const lastDragVelocity = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useRef(false);

  useEffect(() => {
    const checkMobile = () => {
      isMobile.current = window.innerWidth < 640;
    };
    checkMobile();
    const preventScroll = (e: TouchEvent) => {
      if (isDragging.current) e.preventDefault();
    };
    window.addEventListener('resize', checkMobile);
    document.addEventListener('touchmove', preventScroll, { passive: false });
    return () => {
      window.removeEventListener('resize', checkMobile);
      document.removeEventListener('touchmove', preventScroll);
    };
  }, []);

  const getCarouselWidth = useCallback(() => {
    const cardWidth = isMobile.current ? PHYSICS_CONFIG.CARD_WIDTH_MOBILE : PHYSICS_CONFIG.CARD_WIDTH_DESKTOP;
    return (cardWidth + PHYSICS_CONFIG.GAP) * stats.length;
  }, []);

  const x = useTransform(baseX, (v) => {
    const wrapWidth = getCarouselWidth();
    return `${wrap(-wrapWidth, 0, v)}px`;
  });

  const applyDeceleration = useCallback(() => {
    const velocityDifference = Math.abs(velocity.current - PHYSICS_CONFIG.BASE_VELOCITY);
    if (velocityDifference > PHYSICS_CONFIG.MIN_VELOCITY) {
      const lerpFactor = 0.02;
      velocity.current = velocity.current * (1 - lerpFactor) + PHYSICS_CONFIG.BASE_VELOCITY * lerpFactor;
    } else {
      velocity.current = PHYSICS_CONFIG.BASE_VELOCITY;
    }
  }, []);

  const handleDragStart = useCallback(() => {
    isDragging.current = true;
    dragStartTime.current = Date.now();
    lastDragVelocity.current = velocity.current;
    if (isMobile.current) {
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';
    }
  }, []);

  const handleDragEnd = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    isDragging.current = false;
    if (isMobile.current) {
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
    }
    const adjustedVelocity = info.velocity.x * PHYSICS_CONFIG.DRAG_MULTIPLIER;
    let newVelocity = velocity.current + adjustedVelocity;
    if (Math.abs(newVelocity) > PHYSICS_CONFIG.BASE_VELOCITY * 2) {
      newVelocity *= PHYSICS_CONFIG.RESISTANCE;
    }
    newVelocity = Math.max(-PHYSICS_CONFIG.MAX_VELOCITY, Math.min(PHYSICS_CONFIG.MAX_VELOCITY, newVelocity));
    velocity.current = newVelocity;
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (!isMobile.current) isHovered.current = true;
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!isMobile.current) isHovered.current = false;
  }, []);

  useAnimationFrame(() => {
    if (!isDragging.current) {
      if (isHovered.current) {
        velocity.current *= 0.98;
        if (Math.abs(velocity.current) < 0.005) velocity.current = 0;
      } else {
        applyDeceleration();
      }
    }
    baseX.set(baseX.get() + velocity.current);
  });

  const dragConstraints = {
    left: -getCarouselWidth() * 3,
    right: getCarouselWidth() * 1.5
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
            <Image src="/images/somos-title.png" width={350} height={70} alt="Somos" className="mb-4"/>
            <h3 className="relative text-4xl lg:text-5xl font-bold leading-tight z-10">
              La planta de energía solar <br />
              <span className="text-good-lime">más grande de Santander</span>
            </h3>
            
            <div className="relative mt-12 z-10">
              <motion.div 
                ref={containerRef}
                className="overflow-hidden cursor-grab select-none touch-pan-x"
                style={{ touchAction: 'pan-x' }}
                whileTap={{ cursor: "grabbing" }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <motion.div
                  className="flex gap-4"
                  style={{ x }}
                  drag="x"
                  dragConstraints={dragConstraints}
                  dragElastic={0.2}
                  dragMomentum={false}
                  dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  whileDrag={{ 
                    scale: 0.98,
                    transition: { duration: 0.1 }
                  }}
                >
                  {Array.from({ length: 8 }, (_, setIndex) => 
                    stats.map((stat, index) => (
                      <div 
                        key={`${setIndex}-${index}`} 
                        className="flex-shrink-0 w-full sm:w-52 pointer-events-auto touch-manipulation"
                        style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
                      >
                        <StatCard {...stat} />
                      </div>
                    ))
                  )}
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
            <Image 
              src="/images/solar-farm.png" 
              width={600} 
              height={450} 
              alt="Vista aérea de la granja solar Good Energy" 
              className="rounded-3xl w-full"
            />
            
           {/* CAMBIO 1: El contenedor del título se centra en móvil */}
            <div className="relative self-center lg:self-end">
              <motion.div
                className="absolute top-1/2 right-0 -translate-y-1/2 z-0 w-[360px] h-[150px]"
                animate={{ scale: [1, 1.03, 1] }}
                style={{ rotate: -15, x: '5%', y: '-55%' }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <EllipseHighlight className="w-full h-full text-good-lime" />
              </motion.div>
              {/* CAMBIO 2: El texto del título se centra en móvil y se quita el padding */}
              <h4 className="relative text-3xl font-bold z-10 text-center lg:text-right lg:pr-8">
                Haga parte de <br /> Good Energy
              </h4>
            </div>

            {/* CAMBIO 3: El párrafo se centra en móvil */}
            <p className="text-white/80 text-center lg:text-left">
              <span className="font-bold">Únicamente 100 socios que crean</span>, como nosotros, en dejar una huella positiva en la tierra y en la historia energética de Colombia.
            </p>
            
            <div className="flex justify-center lg:justify-start">
              <motion.button 
                onClick={() => router.push('#invertir')}
                whileHover={{ scale: 1.05, backgroundColor: '#E0FF29' }}
                whileTap={{ scale: 0.95 }}
                className="bg-good-lime text-good-dark-green px-8 py-3 font-bold uppercase tracking-wider rounded-full transition-colors duration-200"
              >
                Conocer más
              </motion.button>
            </div>
            
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Somos;