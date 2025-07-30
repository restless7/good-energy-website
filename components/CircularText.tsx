// components/CircularText.tsx
import React from 'react';
// Se importa 'motion' y 'MotionValue' para recibir la animación
import { motion, MotionValue } from 'framer-motion';

// CAMBIO 1: El componente ahora acepta una prop 'rotate' de tipo MotionValue
const CircularText = ({ rotate }: { rotate: MotionValue<number> }) => {
  const text = "El sol nunca dejará de brillar y tu inversión tampoco • ";
  const radius = 110;
  const viewBoxSize = radius * 2 + 40;

  return (
    // CAMBIO 2: Se reemplaza el div por motion.div y se quita la clase de animación CSS
    <motion.div 
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      // CAMBIO 3: Se aplica la rotación recibida desde el componente padre
      style={{ rotate }}
    >
      <svg
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        className="w-full h-full"
      >
        <path
          id="circlePath"
          fill="none"
          stroke="none"
          d={`
            M ${viewBoxSize / 2}, ${viewBoxSize / 2 - radius}
            a ${radius},${radius} 0 1,1 0,${2 * radius}
            a ${radius},${radius} 0 1,1 0,-${2 * radius}
          `}
        />
        <text className="fill-current text-good-dark-green uppercase tracking-wider font-semibold" style={{ fontSize: '16px' }}>
          <textPath href="#circlePath" startOffset="50%" textAnchor="middle">
            {text}
          </textPath>
        </text>
      </svg>
    </motion.div>
  );
};

export default CircularText;