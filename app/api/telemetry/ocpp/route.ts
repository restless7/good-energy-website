import { NextResponse } from 'next/server';

export const runtime = 'edge';

// MOCK: Edge-compatible Redis client (e.g., @upstash/redis)
const mockRedisSet = async (key: string, value: any) => {
  console.log(`[Edge Cache] Wrote to Redis ${key}:`, value);
};

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    
    // Validate required OCPP 2.0.1 fields
    if (!payload.serialNumber || !payload.meterValue) {
      return NextResponse.json({ error: 'Invalid OCPP payload' }, { status: 400 });
    }

    // Isolate noisy telemetry to in-memory transient store (Redis)
    // to prevent PostgreSQL transaction pool exhaustion.
    const cacheKey = `telemetry:node:${payload.serialNumber}:latest`;
    
    await mockRedisSet(cacheKey, {
      timestamp: new Date().toISOString(),
      currentLoadKw: payload.meterValue.loadKw,
      connectorState: payload.connectorState,
      thermalLogs: payload.thermalLogs
    });

    // Broadcast to UI instantly via Supabase Realtime (Mock)
    // supabase.channel('telemetry').send({ type: 'broadcast', event: 'METER_VALUE', payload });

    return NextResponse.json({ status: 'Accepted' }, { status: 202 });
  } catch (error) {
    console.error('[OCPP Edge Telemetry Error]:', error);
    return NextResponse.json({ error: 'Edge Worker Error' }, { status: 500 });
  }
}
