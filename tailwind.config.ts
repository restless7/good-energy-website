// tailwind.config.ts
import type { Config } from 'tailwindcss'
import tailwindClipPath from 'tailwind-clip-path'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      clipPath: {
        'hero-curve': 'ellipse(120% 65% at 50% 100%)',
      },
      colors: {
        'good-green': '#005461',
        'good-lime': '#D8DA00',
        'good-white': '#FFFDF0',
        'good-dark-green': '#0D4651',
      },
      fontFamily: {
        sans: ['var(--font-unbounded)', 'sans-serif'],
      },
      fontWeight: {
        'normal': '400',
        'semibold': '600',
        'bold': '700',
      },
      // --- INICIO DE LA MODIFICACIÓN ---
      // 1. Define los fotogramas clave de la animación de giro.
      keyframes: {
        spin: {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' },
        }
      },
      // 2. Crea la utilidad de animación 'spin-slow' que usa los keyframes.
      animation: {
        'spin-slow': 'spin 35s linear infinite', // nombre, duración, tipo, repetición
      }
      // --- FIN DE LA MODIFICACIÓN ---
    },
  },
  plugins: [
    tailwindClipPath,
    require('@tailwindcss/typography'),
  ],
}
export default config;