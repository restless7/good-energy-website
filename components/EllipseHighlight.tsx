// components/EllipseHighlight.tsx

import React from 'react';

const EllipseHighlight = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg 
      viewBox="0 0 300 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <ellipse 
        cx="150" 
        cy="50" 
        // [MODIFICACIÓN] Hacemos que el radio sea ligeramente menor que la mitad del viewBox
        // para asegurar que quepa por completo. 145 es un buen valor.
        rx="145" 
        ry="45" 
        stroke="currentColor" 
        strokeWidth="2" // Un grosor de 4 es más visible y fiel al diseño
      />
    </svg>
  );
};

export default EllipseHighlight;