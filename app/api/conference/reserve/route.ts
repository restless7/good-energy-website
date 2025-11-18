// app/api/conference/reserve/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const MAX_SEATS = 15;

/**
 * Conference reservation request interface
 */
interface ReservationRequest {
  name: string;
  email: string;
  phone?: string;
  country: string;
  mode: 'virtual' | 'presencial';
}

/**
 * API response interface
 */
interface ReservationResponse {
  success: boolean;
  data?: {
    id: string;
    remainingSeats: number;
    totalReservations: number;
  };
  error?: string;
}

/**
 * Validate reservation request data
 */
function validateReservationData(data: unknown): { isValid: boolean; error?: string } {
  const { name, email, country, mode } = data as ReservationRequest;
  
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return { isValid: false, error: 'El nombre debe tener al menos 2 caracteres' };
  }
  
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return { isValid: false, error: 'Por favor ingresa un email válido' };
  }
  
  if (!country || typeof country !== 'string' || country.trim().length < 2) {
    return { isValid: false, error: 'Por favor selecciona tu país' };
  }
  
  if (!mode || !['virtual', 'presencial'].includes(mode)) {
    return { isValid: false, error: 'Por favor selecciona la modalidad de asistencia' };
  }
  
  return { isValid: true };
}

/**
 * Send confirmation email to user
 */
async function sendConfirmationEmail(reservation: ReservationRequest): Promise<boolean> {
  try {
    if (!resend || !process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not configured, skipping email');
      return true; // Don't fail the reservation if email isn't configured
    }

    await resend.emails.send({
      from: 'Good Energy <noreply@goodenergy.com>',
      to: [reservation.email],
      subject: '✅ Reserva confirmada - Conferencia Sol Inversor',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #D8DA00, #005461); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">🌞 ¡Tu asiento está reservado!</h1>
          </div>
          
          <div style="padding: 30px; background: #FFFDF0;">
            <h2 style="color: #005461; margin-top: 0;">Hola ${reservation.name},</h2>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              ¡Excelente! Has reservado tu lugar en la <strong>Conferencia Exclusiva Sol Inversor</strong>.
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #005461; margin-top: 0;">Detalles de tu reserva:</h3>
              <ul style="list-style: none; padding: 0;">
                <li><strong>📧 Email:</strong> ${reservation.email}</li>
                <li><strong>🌍 País:</strong> ${reservation.country}</li>
                <li><strong>📍 Modalidad:</strong> ${reservation.mode === 'virtual' ? 'Virtual' : 'Presencial'}</li>
                <li><strong>📅 Fecha:</strong> Por confirmar (recibirás más detalles pronto)</li>
              </ul>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Te enviaremos todos los detalles del evento (fecha, horario y enlace) en los próximos días.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://goodenergy.com/investment-simulator" 
                 style="background: #D8DA00; color: #005461; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                🌞 Simula tu Inversión
              </a>
            </div>
          </div>
          
          <div style="background: #005461; color: white; padding: 20px; text-align: center; font-size: 14px;">
            <p>Good Energy - Invierte en energía solar, invierte en el futuro</p>
          </div>
        </div>
      `,
    });
    
    return true;
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return false; // Don't fail the reservation if email fails
  }
}

/**
 * Send admin notification email
 */
async function sendAdminNotification(reservation: ReservationRequest, remainingSeats: number): Promise<void> {
  try {
    if (!resend || !process.env.RESEND_API_KEY || !process.env.ADMIN_EMAIL) {
      return;
    }

    await resend.emails.send({
      from: 'Good Energy System <system@goodenergy.com>',
      to: [process.env.ADMIN_EMAIL],
      subject: `🎯 Nueva reserva conferencia - ${remainingSeats} asientos restantes`,
      html: `
        <h2>Nueva reserva recibida</h2>
        <p><strong>Nombre:</strong> ${reservation.name}</p>
        <p><strong>Email:</strong> ${reservation.email}</p>
        <p><strong>Teléfono:</strong> ${reservation.phone || 'No proporcionado'}</p>
        <p><strong>País:</strong> ${reservation.country}</p>
        <p><strong>Modalidad:</strong> ${reservation.mode}</p>
        <p><strong>Asientos restantes:</strong> ${remainingSeats}/${MAX_SEATS}</p>
        ${remainingSeats === 0 ? '<p style="color: red;"><strong>⚠️ CONFERENCIA LLENA</strong></p>' : ''}
      `,
    });
  } catch (error) {
    console.error('Error sending admin notification:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: ReservationRequest = await request.json();
    
    // Validate request data
    const validation = validateReservationData(body);
    if (!validation.isValid) {
      return NextResponse.json<ReservationResponse>(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    // Check current seat availability
    const currentReservations = await prisma.conferenceReservation.count();
    if (currentReservations >= MAX_SEATS) {
      return NextResponse.json<ReservationResponse>(
        { success: false, error: 'Lo sentimos, todos los asientos están ocupados. Te avisaremos si se libera algún cupo.' },
        { status: 409 }
      );
    }

    // Check if email already exists
    const existingReservation = await prisma.conferenceReservation.findUnique({
      where: { email: body.email }
    });

    if (existingReservation) {
      return NextResponse.json<ReservationResponse>(
        { success: false, error: 'Ya tienes una reserva con este email. Revisa tu bandeja de entrada.' },
        { status: 409 }
      );
    }

    // Create reservation
    const reservation = await prisma.conferenceReservation.create({
      data: {
        name: body.name.trim(),
        email: body.email.toLowerCase().trim(),
        phone: body.phone?.trim(),
        country: body.country.trim(),
        mode: body.mode,
      },
    });

    // Get updated count
    const newReservationCount = await prisma.conferenceReservation.count();
    const remainingSeats = MAX_SEATS - newReservationCount;

    // Send confirmation email (don't fail if this fails)
    await sendConfirmationEmail(body);
    
    // Send admin notification
    await sendAdminNotification(body, remainingSeats);

    // Log successful reservation
    console.log(`Conference reservation created: ${body.email} (${remainingSeats} seats remaining)`);

    return NextResponse.json<ReservationResponse>({
      success: true,
      data: {
        id: reservation.id,
        remainingSeats,
        totalReservations: newReservationCount,
      },
    });

  } catch (error) {
    console.error('Conference reservation error:', error);
    return NextResponse.json<ReservationResponse>(
      { success: false, error: 'Error interno del servidor. Intenta nuevamente.' },
      { status: 500 }
    );
  }
}

/**
 * Get current seat availability
 */
export async function GET() {
  try {
    const totalReservations = await prisma.conferenceReservation.count();
    const remainingSeats = MAX_SEATS - totalReservations;

    return NextResponse.json({
      success: true,
      data: {
        totalSeats: MAX_SEATS,
        reservedSeats: totalReservations,
        remainingSeats: Math.max(0, remainingSeats),
        isFull: totalReservations >= MAX_SEATS,
      },
    });
  } catch (error) {
    console.error('Error fetching seat availability:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}