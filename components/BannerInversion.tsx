// components/BannerInversion.tsx

'use client';
import React from 'react';
import { motion } from 'framer-motion';

const BannerInversion = () => {
  return (
    <section 
      className="py-24 lg:py-32 overflow-hidden"
      style={{
        background: 'linear-gradient(196deg, #005461 50%, #D8DA00 50%)'
      }}
    >
      <div className="relative flex flex-col items-center gap-8 lg:gap-12">
        
        {/* ---- BANDA SUPERIOR: BLANCA ---- */}
        <motion.div
          // [MODIFICACIÓN] Le damos un z-index más BAJO para que quede detrás
          className="relative z-10 w-[120vw] bg-good-white py-4 lg:py-6"
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ rotate: 6 }}
        >
          <h2 className="text-left text-3xl lg:text-5xl font-bold text-good-dark-green pl-[15vw]">
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
        </motion.div>

        {/* ---- BANDA INFERIOR: VERDE OSCURO ---- */}
        <motion.div
          // [MODIFICACIÓN] Le damos un z-index más ALTO para que quede delante
          className="relative z-20 w-[120vw] bg-good-dark-green py-4 lg:py-6"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.4, ease: 'easeOut', delay: 0.5 }}
          style={{ rotate: -6 }}
        >
          <h2 className="text-center text-3xl lg:text-5xl font-normal text-good-white">
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
        </motion.div>
      </div>
    </section>
  );
};

export default BannerInversion;