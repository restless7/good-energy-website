// components/CircularText.tsx
import React from 'react';

const CircularText = () => {
  const text = "El sol nunca dejará de brillar y tu inversión tampoco • ";
  const radius = 110;
  const viewBoxSize = radius * 2 + 40;

  return (
    <div className="absolute inset-0 flex items-center justify-center animate-spin-slow pointer-events-none">
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
        {/* CAMBIO: Se reduce el tamaño de la fuente de 18px a 16px */}
        <text className="fill-current text-good-dark-green uppercase tracking-wider font-semibold" style={{ fontSize: '16px' }}>
          <textPath href="#circlePath" startOffset="50%" textAnchor="middle">
            {text}
          </textPath>
        </text>
      </svg>
    </div>
  );
};

export default CircularText;