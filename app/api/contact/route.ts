// app/api/contact/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Inicializamos Resend con la API Key de nuestras variables de entorno
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    // Extraemos los datos del cuerpo de la petición
    const { name, phone, email, message } = await req.json();

    // Enviamos el correo usando Resend
    const { data, error } = await resend.emails.send({
      from: 'Good Energy Web <onboarding@resend.dev>', // ¡IMPORTANTE! Debe ser un dominio verificado en Resend
      to: ['hola@goodenergycol.com'], // El correo donde recibirás los leads
      subject: `Nuevo Lead de Good Energy: ${name}`,
      html: `
        <h1>Nuevo contacto desde la web de Good Energy</h1>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Teléfono:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <hr />
        <p><strong>Mensaje:</strong></p>
        <p>${message}</p>
      `,
    });

    // Si hay un error en el envío, lo devolvemos
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Si todo va bien, devolvemos una respuesta de éxito
    return NextResponse.json({ message: 'Email sent successfully!', data });

  } catch (error) {
    // Manejamos cualquier otro error
    console.error('Error en la API de contacto:', error); // <--- AÑADE ESTA LÍNEA

    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}