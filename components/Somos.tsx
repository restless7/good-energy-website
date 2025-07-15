// components/Somos.tsx
'use client';
import React, { useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
];

// --- PARÁMETROS FÍSICOS MEJORADOS ---
const PHYSICS_CONFIG = {
  BASE_VELOCITY: 0.15,           // Velocidad base más rápida
  DRAG_MULTIPLIER: 0.294,        // Multiplicador de inercia del drag más fuerte
  DECELERATION: 0.96,            // Factor de desaceleración (más suave)
  MAX_VELOCITY: 2.2,             // Velocidad máxima aumentada
  MIN_VELOCITY: 0.01,            // Velocidad mínima antes de resetear
  SPRING_STIFFNESS: 400,         // Rigidez del spring
  SPRING_DAMPING: 40,            // Amortiguación del spring
  RESISTANCE: 0.88,              // Resistencia al movimiento ligeramente aumentada
  CARD_WIDTH_DESKTOP: 208,       // w-52 = 208px
  CARD_WIDTH_MOBILE: 280,        // Ancho móvil estimado
  GAP: 16,                       // gap-4 = 16px
};

const Somos = () => {
  const baseX = useMotionValue(0);
  const velocity = useRef(PHYSICS_CONFIG.BASE_VELOCITY);
  const isDragging = useRef(false);
  const isHovered = useRef(false);
  const dragStartTime = useRef(0);
  const lastDragVelocity = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useRef(false);

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      isMobile.current = window.innerWidth < 640;
    };
    
    checkMobile();
    
    // Prevenir scroll vertical en móvil durante el drag horizontal
    const preventScroll = (e: TouchEvent) => {
      if (isDragging.current) {
        e.preventDefault();
      }
    };
    
    window.addEventListener('resize', checkMobile);
    document.addEventListener('touchmove', preventScroll, { passive: false });
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      document.removeEventListener('touchmove', preventScroll);
    };
  }, []);

  // Calcular el ancho total del carrusel
  const getCarouselWidth = useCallback(() => {
    const cardWidth = isMobile.current ? PHYSICS_CONFIG.CARD_WIDTH_MOBILE : PHYSICS_CONFIG.CARD_WIDTH_DESKTOP;
    return (cardWidth + PHYSICS_CONFIG.GAP) * stats.length;
  }, []);

  // Transform con wrap mejorado
  const x = useTransform(baseX, (v) => {
    const wrapWidth = getCarouselWidth();
    return `${wrap(-wrapWidth, 0, v)}px`;
  });

  // Función de desaceleración suave
  const applyDeceleration = useCallback(() => {
    const velocityDifference = Math.abs(velocity.current - PHYSICS_CONFIG.BASE_VELOCITY);
    
    if (velocityDifference > PHYSICS_CONFIG.MIN_VELOCITY) {
      // Interpolar suavemente hacia la velocidad base
      const lerpFactor = 0.02;
      velocity.current = velocity.current * (1 - lerpFactor) + PHYSICS_CONFIG.BASE_VELOCITY * lerpFactor;
    } else {
      // Mantener velocidad base constante
      velocity.current = PHYSICS_CONFIG.BASE_VELOCITY;
    }
  }, []);

  // Función para manejar el inicio del drag
  const handleDragStart = useCallback(() => {
    isDragging.current = true;
    dragStartTime.current = Date.now();
    lastDragVelocity.current = velocity.current;
    
    // Prevenir selección de texto en móvil
    if (isMobile.current) {
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';
    }
  }, []);

  // Función para manejar el final del drag
  const handleDragEnd = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    isDragging.current = false;
    
    // Restaurar selección de texto
    if (isMobile.current) {
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
    }
    
    const adjustedVelocity = info.velocity.x * PHYSICS_CONFIG.DRAG_MULTIPLIER;
    
    // Calcular nueva velocidad basada en la inercia
    let newVelocity = velocity.current + adjustedVelocity;
    
    // Aplicar resistencia progresiva
    if (Math.abs(newVelocity) > PHYSICS_CONFIG.BASE_VELOCITY * 2) {
      newVelocity *= PHYSICS_CONFIG.RESISTANCE;
    }
    
    // Limitar velocidad máxima
    newVelocity = Math.max(-PHYSICS_CONFIG.MAX_VELOCITY, 
                          Math.min(PHYSICS_CONFIG.MAX_VELOCITY, newVelocity));
    
    velocity.current = newVelocity;
  }, []);

  // Función para manejar hover (pausar en desktop)
  const handleMouseEnter = useCallback(() => {
    if (!isMobile.current) {
      isHovered.current = true;
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!isMobile.current) {
      isHovered.current = false;
    }
  }, []);

  // Loop de animación principal
  useAnimationFrame(() => {
    if (!isDragging.current) {
      if (isHovered.current) {
        // Desaceleración gradual al hacer hover
        velocity.current *= 0.98;
        if (Math.abs(velocity.current) < 0.005) {
          velocity.current = 0;
        }
      } else {
        // Regresar suavemente a la velocidad base constante
        applyDeceleration();
      }
    }
    
    // Actualizar posición
    baseX.set(baseX.get() + velocity.current);
  });

  // Configuración de drag constraints dinámicas
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
                  {/* Renderizar múltiples copias para efecto infinito */}
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
                className="bg-good-lime text-good-dark-green px-8 py-3 font-bold uppercase tracking-wider rounded-full self-start transition-colors duration-200"
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