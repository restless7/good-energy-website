// components/Hero.tsx

'use client';
import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import EllipseHighlight from './EllipseHighlight'; 

const Hero = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  });
  
  const yPosCross = useTransform(scrollYProgress, [0, 1], [0, -150]); 
  const scaleCross = useTransform(scrollYProgress, [0, 1], [1, 7]);

  return (
    // 👇 AQUÍ ESTÁ EL CAMBIO: Se usan las clases rounded-b-* para redondear solo abajo
    <section 
      ref={targetRef} 
      className="relative h-screen min-h-[700px] overflow-hidden rounded-b-[40px] md:rounded-b-[50px]"
    >

      {/* ---- CAPA 0: FONDO DE CIELO ---- */}
      <div className="absolute inset-0 z-0">
        <Image src="/images/CIELO.png" alt="Cielo azul despejado" fill className="object-cover" quality={85} priority />
        <div className="absolute inset-0 bg-good-green/30"></div>
      </div>

      {/* ---- CAPA 1: LA CRUZ DECORATIVA ---- */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-center z-10" 
        style={{ y: yPosCross, scale: scaleCross }}
      >
        <Image src="/images/cruz.png" alt="Elemento decorativo" width={350} height={350} className="w-[200px] h-auto md:w-[350px]" />
      </motion.div>
      
      {/* ---- CAPA 2: EL TÍTULO ---- */}
      <div className="relative z-20 flex h-full items-start justify-center md:justify-end">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl text-good-dark-green md:text-6xl font-semibold leading-tight tracking-wide text-center md:text-right mt-40 md:mt-48 md:mr-[13%]"
        >
          <span className="font-normal">Energía solar,</span> <br /> 
          energía para <br />
          <span className="font-bold relative inline-block">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, rotate: 0 }}
              animate={{ scale: 1, opacity: 1, rotate: -6 }}
              transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
              className="absolute -inset-x-6 -inset-y-4"
            >
              <EllipseHighlight className="w-full h-full text-good-white" />
            </motion.div>
            <span className="relative z-10">la vida</span>
          </span>
        </motion.h1>
      </div>

      {/* ---- CAPA 3: IMAGEN DEL TRABAJADOR (CHICO 1) ---- */}
      <div className="absolute bottom-0 left-0 w-full h-4/5 md:h-5/6 z-30 pointer-events-none">
        <Image 
          src="/images/CHICO 1.png" 
          alt="Trabajador de Good Energy con paneles solares" 
          fill
          className="object-cover object-[85%_100%] md:object-bottom"
        />
      </div>

    </section>
  );
};

export default Hero;