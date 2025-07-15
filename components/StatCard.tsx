// components/StatCard.tsx

import React from 'react';
import Image from 'next/image';

interface StatCardProps {
  iconSrc: string;
  value: string;
  description: string;
}

const StatCard: React.FC<StatCardProps> = ({ iconSrc, value, description }) => {
  return (
    // [AJUSTE] Cambiamos el fondo a un degradado blanco y el color del texto
    <div className="bg-gradient-to-b from-white to-white/20 backdrop-blur-sm rounded-2xl p-6 text-center flex flex-col items-center justify-start min-h-[220px] text-good-dark-green">
      <Image src={iconSrc} alt={description} width={60} height={60} />
      <p className="text-4xl font-bold mt-4">{value}</p>
      <p className="text-good-dark-green/80 mt-1 text-sm">{description}</p>
    </div>
  );
};

export default StatCard;