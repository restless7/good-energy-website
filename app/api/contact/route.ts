// app/api/contact/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { name, phone, email, message } = await req.json();

    const { data, error } = await resend.emails.send({
      from: 'Good Energy Web <onboarding@resend.dev>', // Recuerda cambiar
      to: ['tu.correo.real@ejemplo.com'], // Recuerda cambiar
      
      // ---- CORRECCIÓN AQUÍ ----
      replyTo: email, // Se cambia de 'reply_to' a 'replyTo'

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

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Email sent successfully!', data });

  } catch (err) {
    console.error('Error en la API de contacto:', err);
    return NextResponse.json({ error: 'Something went wrong on the server' }, { status: 500 });
  }
}