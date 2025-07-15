// components/CircleHighlightIcon.tsx

import React from 'react';

// Le pasamos las props, incluyendo className para que pueda recibir clases de Tailwind
const CircleHighlightIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg 
      width="304" 
      height="100" 
      viewBox="0 0 304 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      {...props} // Pasamos todas las props (como className) al elemento svg
    >
      <path 
        d="M294.5 50C294.5 72.3218 276.101 90.5 253.5 90.5H50.5C27.8987 90.5 9.5 72.3218 9.5 50C9.5 27.6782 27.8987 9.5 50.5 9.5H253.5C276.101 9.5 294.5 27.6782 294.5 50Z" 
        // La magia está aquí: 'currentColor' le dice al SVG que tome el color
        // de la propiedad 'color' de CSS (controlada por 'text-...' en Tailwind).
        // También le damos un grosor de borde.
        stroke="currentColor" 
        strokeWidth="4" 
      />
    </svg>
  );
};

export default CircleHighlightIcon;