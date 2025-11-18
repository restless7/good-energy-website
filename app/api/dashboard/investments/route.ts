// app/api/dashboard/investments/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { generateMockInvestments } from '@/lib/dashboard/utils';

// GET /api/dashboard/investments
export async function GET() {
  try {
    // TODO: Replace with actual user authentication
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // TODO: Replace with actual database queries
    // const investments = await prisma.investment.findMany({
    //   where: { userId: session.user.id },
    //   include: {
    //     plant: true,
    //     earnings: {
    //       orderBy: { createdAt: 'desc' },
    //       take: 5
    //     }
    //   },
    //   orderBy: { createdAt: 'desc' }
    // });

    // For now, return mock data
    const investments = generateMockInvestments();
    
    return NextResponse.json({
      success: true,
      data: investments
    });
  } catch (error) {
    console.error('Error fetching investments:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/dashboard/investments (for creating new investments)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, amount, currency } = body;

    // Validation
    if (!type || !amount || !currency) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (amount < 1000000) {
      return NextResponse.json(
        { success: false, error: 'Minimum investment amount is $1,000,000 COP' },
        { status: 400 }
      );
    }

    // TODO: Replace with actual user authentication
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // TODO: Replace with actual database insertion
    // const investment = await prisma.investment.create({
    //   data: {
    //     userId: session.user.id,
    //     type,
    //     amount,
    //     currency,
    //     plantId: plantId || null,
    //     roi: getExpectedROI(type), // Helper function to get expected ROI
    //     status: 'Activa'
    //   },
    //   include: {
    //     plant: true
    //   }
    // });

    // Mock response for now
    const mockInvestment = {
      id: `inv_${Date.now()}`,
      type,
      amount,
      currency,
      roi: type === 'Base' ? 8.5 : type === 'Crecimiento' ? 10.2 : 12.0,
      status: 'Activa',
      startDate: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: mockInvestment
    });
  } catch (error) {
    console.error('Error creating investment:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}