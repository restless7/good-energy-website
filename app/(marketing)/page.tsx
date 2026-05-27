// app/page.tsx

// 1. Importamos todos los componentes de nuestras secciones
import Hero from '@/components/Hero';
import Somos from '@/components/Somos';
import ComoFunciona from '@/components/ComoFunciona';
import ComoFuncionaDiagrama from '@/components/ComoFuncionaDiagrama';
import PorQueInvertir from '@/components/PorQueInvertir';
import Financiamiento from '@/components/Financiamiento';
import Testimonio from '@/components/Testimonio';
import Contacto from '@/components/Contacto';
import BannerInversion from '@/components/BannerInversion';


export default function HomePage() {
  return (
    // El tag <main> es semánticamente correcto para el contenido principal
    <main>
      {/* [MODIFICACIÓN TEMPORAL PARA DIAGNÓSTICO] */}
      {/* Reemplazamos 'clip-hero-curve' por la clase arbitraria */}
      <div 
        id="home" 
        className="bg-good-green pb-2 md:pb-3 clip-[ellipse(120%_50%_at_50%_100%)]"
      >
        <Hero />
      </div>
      
      {/* El resto de los componentes van fuera del marco */}
      <Somos />
      <BannerInversion />
      <ComoFunciona />
      <ComoFuncionaDiagrama />
      <PorQueInvertir />
      <Financiamiento />
      <Testimonio />
      <Contacto />
    </main>
  );
}
// Forzar un nuevo despliegue en Vercel
