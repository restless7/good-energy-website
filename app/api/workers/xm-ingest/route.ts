import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// This is designed to be triggered by a Vercel Cron Job (e.g., daily at 00:00)
export async function GET(request: Request) {
  try {
    // Security check for cron trigger
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // MOCK: In production, fetch from XM API: https://servicios.xm.com.co/
    const mockXmSpotPrices = Array.from({ length: 24 }).map((_, hour) => ({
      hourlyTimestamp: new Date(new Date().setHours(hour, 0, 0, 0)),
      pricePerKWh: Math.random() * (1200 - 300) + 300, // COP/kWh random simulation
      gridRegion: 'SIN', // Sistema Interconectado Nacional
    }));

    // Upsert to ensure no duplicate hours
    const operations = mockXmSpotPrices.map((spot) => 
      prisma.energySpotPrice.upsert({
        where: {
          hourlyTimestamp_gridRegion: {
            hourlyTimestamp: spot.hourlyTimestamp,
            gridRegion: spot.gridRegion,
          }
        },
        update: {
          pricePerKWh: spot.pricePerKWh,
        },
        create: spot,
      })
    );

    await prisma.$transaction(operations);

    return NextResponse.json({ success: true, recordsProcessed: operations.length });
  } catch (error) {
    console.error('[XM Ingest Worker Error]:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
