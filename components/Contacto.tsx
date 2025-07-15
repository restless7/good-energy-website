// components/Contacto.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useForm, SubmitHandler } from 'react-hook-form';
import { motion } from 'framer-motion';

// Definimos la estructura de los datos del formulario
type FormInputs = {
  name: string;
  phone: string;
  email: string;
  message: string;
};

const Contacto = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormInputs>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  // Esta función se ejecuta cuando el formulario es válido y se envía
  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Error al enviar el mensaje.');
      
      setSubmitStatus('success');
      reset(); // Limpia el formulario
    } catch (error) {
      console.error(error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clases comunes para los inputs para no repetir código
  const inputStyle = "w-full bg-transparent border-2 border-good-dark-green rounded-lg px-4 py-3 placeholder:text-good-dark-green/50 focus:outline-none focus:ring-2 focus:ring-good-dark-green transition";

  return (
    <section id="contacto" className="relative bg-gradient-to-b from-good-lime to-white pt-20 pb-10 lg:pt-32 lg:pb-0 overflow-hidden">
      <Image src="/images/decor-crosses.svg" width={200} height={200} alt="" className="absolute -bottom-10 -left-10 opacity-30 z-0"/>

      <div className="container mx-auto px-6 relative z-10">
        {/* CAMBIO CLAVE: Se usa 'items-end' para alinear ambas columnas a la parte inferior, eliminando el espacio extra */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-end">
          
          {/* ---- COLUMNA IZQUIERDA: FORMULARIO ---- */}
          <motion.div
            className="pb-10 lg:pb-20"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative h-14 w-full max-w-md">
              <Image 
                src="/images/contact-title.png"
                layout="fill"
                objectFit="contain"
                objectPosition="left"
                alt="Contáctanos"
              />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-4">
              <div>
                <input type="text" placeholder="Tu nombre y apellido" {...register('name', { required: 'El nombre es obligatorio' })} className={inputStyle} />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <input type="tel" placeholder="Teléfono" {...register('phone', { required: 'El teléfono es obligatorio' })} className={inputStyle} />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
              </div>
              <div>
                <input type="email" placeholder="Correo electrónico" {...register('email', { required: 'El correo es obligatorio', pattern: { value: /^\S+@\S+$/i, message: 'Correo inválido' } })} className={inputStyle} />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <textarea placeholder="Mensaje" {...register('message')} className={`${inputStyle} h-28`}></textarea>
              </div>

              <button type="submit" disabled={isSubmitting} className="bg-good-dark-green text-good-lime px-8 py-3 font-bold uppercase tracking-wider rounded-full self-start hover:bg-opacity-90 transition-all disabled:bg-gray-500">
                {isSubmitting ? 'Enviando...' : 'Reclamar Bono'}
              </button>
              
              {submitStatus === 'success' && <p className="text-green-600 mt-4">¡Mensaje enviado con éxito! Gracias por contactarnos.</p>}
              {submitStatus === 'error' && <p className="text-red-600 mt-4">Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.</p>}
            </form>
          </motion.div>

          {/* ---- COLUMNA DERECHA: IMAGEN ---- */}
          <motion.div 
            className="relative hidden lg:block" // Se eliminó la altura fija
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* CAMBIO CLAVE: La imagen ahora ocupa su propio espacio, permitiendo que la alineación funcione */}
            <Image 
              src="/images/contact-woman.png" 
              width={480}
              height={600}
              alt="Mujer sonriendo y señalando al formulario de contacto"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contacto;