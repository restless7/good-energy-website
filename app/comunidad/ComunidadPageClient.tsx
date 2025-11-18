"use client";

import React from 'react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { ArrowRight, Users, BarChart, LineChart, Home, Zap, MessageCircle } from 'lucide-react';

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

const ComunidadPageClient: React.FC = () => {
  const portalLinks = [
    {
      href: '/join-conference',
      title: 'Conferencia Sol Inversor',
      description: 'Accede a nuestra conferencia exclusiva y aprende a generar ingresos pasivos.',
      icon: <Users className="w-8 h-8 text-good-lime" />,
    },
    {
      href: '/investment-simulator',
      title: 'Simulador de Inversión',
      description: 'Calcula tu rentabilidad potencial y descubre el poder de la energía solar.',
      icon: <BarChart className="w-8 h-8 text-good-lime" />,
    },
    {
      href: '/inversiones',
      title: 'Dashboard de Inversiones',
      description: 'Monitorea tus inversiones, ganancias y el impacto de tu energía limpia.',
      icon: <LineChart className="w-8 h-8 text-good-lime" />,
    },
    {
      href: '/',
      title: 'Página Principal',
      description: 'Explora más sobre Good Energy y nuestra misión de un futuro sostenible.',
      icon: <Home className="w-8 h-8 text-good-lime" />,
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-good-white to-good-lime/10 text-good-dark-green">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-block bg-good-lime/20 text-good-dark-green rounded-full px-4 py-2 mb-4">
            <Zap className="w-5 h-5 inline-block mr-2" />
            Portal de la Comunidad
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Ecosistema Good Energy
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Tu centro de acceso a todas las herramientas y recursos para maximizar tu impacto y rentabilidad.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {portalLinks.map((link, i) => (
            <motion.div
              key={link.href}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <Link href={link.href} passHref>
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 p-6 md:p-8 h-full flex flex-col group border border-transparent hover:border-good-lime">
                  <div className="flex items-start justify-between">
                    <div className="p-3 bg-good-lime/10 rounded-full mb-4">
                      {link.icon}
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-good-dark-green transition-colors transform group-hover:translate-x-1" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold mb-2">{link.title}</h2>
                  <p className="text-gray-600 flex-grow">{link.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="text-center mt-16"
        >
          <h3 className="text-2xl font-bold mb-4">Únete a la conversación</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Forma parte de nuestro grupo de difusión en WhatsApp para recibir noticias, actualizaciones y oportunidades exclusivas.
          </p>
          <Link href="https://chat.whatsapp.com/KuIIXkinew48hjFo5v7go7?mode=hqrt2" passHref>
            <motion.div
                className="inline-flex items-center bg-green-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-green-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Unirse al Grupo de WhatsApp
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </main>
  );
};

export default ComunidadPageClient;
