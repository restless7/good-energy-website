// components/PorQueInvertir.tsx
'use client';
import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import CircularText from './CircularText';

const accordionData = [
  {
    title: 'Alta demanda de energía',
    content: 'Inversión con demanda asegurada y riesgo controlado.',
  },
  {
    title: 'Ubicación estratégica',
    content: 'Inversión con demanda asegurada y riesgo controlado.',
  },
  {
    title: 'Rentabilidad asegurada',
    content: 'Inversión con demanda asegurada y riesgo controlado.',
  },
];

const PorQueInvertir = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  return (
    // 👇 AQUÍ ESTÁ EL CAMBIO: Se añade el color de fondo a la sección
    <section 
      ref={targetRef} 
      id="invertir" 
      className="relative text-good-dark-green py-10" 
      style={{ backgroundColor: '#f9f5fa' }}
    >
      <div 
        className="container mx-auto px-6 relative rounded-[40px] overflow-hidden"
        style={{ background: 'linear-gradient(to bottom, #f9f5fa 25%, #D8DA00 25%)' }}
      >
        <motion.div
          className="absolute top-16 right-[-50px] md:right-10 lg:right-20 z-10 hidden lg:block"
          animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
        >
          <Image src="/images/decor-crosses-outline.png" width={450} height={450} alt="" />
        </motion.div>
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] z-20"
             style={{ top: '25%' }}
        >
          <CircularText rotate={rotate} />
          <Image 
            src="/images/sun-plus-icon.svg"
            width={200} 
            height={200} 
            alt="Icono del sol" 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        </div>

        <div className="relative z-10 flex flex-col items-center py-24 lg:py-32">
          <div className="h-80 w-full" /> 
          
          <div className="w-full max-w-4xl flex flex-col items-center lg:items-start text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              ¿Por qué <br /> invertir ahora?
            </h2>
            <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4">
              {accordionData.map((item, index) => {
                const isOpen = openIndex === index;
                return (
                  <div key={index} className="w-full">
                    <div 
                      className={`w-full rounded-2xl transition-all duration-300 ${
                        isOpen 
                          ? 'bg-transparent border-2 border-white' 
                          : 'bg-white shadow-md'
                      }`}
                    >
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : index)}
                        className="w-full flex justify-between items-center p-4 text-left"
                      >
                        <span className="font-bold text-base lg:text-lg">{item.title}</span>
                        {isOpen ? <ChevronUp className="text-good-dark-green" /> : <ChevronDown className="text-good-lime" />}
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto', paddingBottom: '1rem' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="px-4 overflow-hidden text-left"
                          >
                            <p>{item.content}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <Link href="#contacto" className="mt-12 z-20">
            <motion.button 
              className="bg-good-dark-green text-good-lime px-8 py-3 font-bold uppercase tracking-wider rounded-full"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Quiero invertir
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PorQueInvertir;