// components/BannerInversion.tsx

'use client';
import React from 'react';
import { motion } from 'framer-motion';

const BannerInversion = () => {
  return (
    <section 
      className="py-20 lg:py-32 overflow-hidden"
      style={{
        background: 'linear-gradient(196deg, #005461 50%, #D8DA00 50%)'
      }}
    >
      <div className="relative flex flex-col items-center gap-8 lg:gap-12">
        
        {/* ---- BANDA SUPERIOR: BLANCA ---- */}
        <motion.div
          className="relative z-10 w-[150vw] lg:w-[120vw] bg-good-white flex justify-center"
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ rotate: 6 }}
        >
          {/* Contenedor Interior: USA W-SCREEN PARA UN CONTROL TOTAL */}
          <div className="w-screen max-w-6xl px-8 py-3 lg:py-6">
            <h2 className="text-left text-xl lg:text-5xl font-bold text-good-dark-green">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="inline-block"
              >
                Una inversión de:
              </motion.span>
            </h2>
          </div>
        </motion.div>

        {/* ---- BANDA INFERIOR: VERDE OSCURO ---- */}
        <motion.div
          className="relative z-20 w-[150vw] lg:w-[120vw] bg-good-dark-green flex justify-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.4, ease: 'easeOut', delay: 0.5 }}
          style={{ rotate: -6 }}
        >
          {/* Contenedor Interior: USA W-SCREEN PARA UN CONTROL TOTAL */}
          <div className="w-screen max-w-6xl px-8 py-3 lg:py-6">
            <h2 className="text-center text-lg lg:text-5xl font-normal text-good-white">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="inline-block"
              >
                Alto rendimiento,{' '}
                <span className="text-good-lime">bajo riesgo, impacto real</span>
              </motion.span>
            </h2>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BannerInversion;