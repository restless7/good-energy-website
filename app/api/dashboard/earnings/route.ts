// app/api/dashboard/earnings/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { generateMockEarnings, generateEarningsChartData } from '@/lib/dashboard/utils';

// GET /api/dashboard/earnings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'mensual'; // mensual, trimestral, anual
    const format = searchParams.get('format') || 'list'; // list, chart

    // TODO: Replace with actual user authentication
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    if (format === 'chart') {
      // Return chart data
      const months = period === 'anual' ? 12 : period === 'trimestral' ? 3 : 6;
      const chartData = generateEarningsChartData(months);
      
      return NextResponse.json({
        success: true,
        data: chartData,
        meta: {
          period,
          format: 'chart',
          dataPoints: chartData.length
        }
      });
    }

    // TODO: Replace with actual database queries
    // const earnings = await prisma.earning.findMany({
    //   where: { 
    //     userId: session.user.id,
    //     createdAt: {
    //       gte: getDateRangeStart(period)
    //     }
    //   },
    //   include: {
    //     investment: {
    //       include: {
    //         plant: true
    //       }
    //     }
    //   },
    //   orderBy: { createdAt: 'desc' }
    // });

    // Return mock data for now
    const earnings = generateMockEarnings();
    
    // Filter by status if requested
    const status = searchParams.get('status');
    const filteredEarnings = status 
      ? earnings.filter(e => e.status.toLowerCase() === status.toLowerCase())
      : earnings;

    // Calculate summary
    const totalEarnings = filteredEarnings.reduce((sum, e) => sum + e.netAmount, 0);
    const pendingEarnings = filteredEarnings
      .filter(e => e.status === 'Pendiente')
      .reduce((sum, e) => sum + e.netAmount, 0);
    const paidEarnings = filteredEarnings
      .filter(e => e.status === 'Pagado')
      .reduce((sum, e) => sum + e.netAmount, 0);

    return NextResponse.json({
      success: true,
      data: filteredEarnings,
      meta: {
        period,
        format: 'list',
        total: filteredEarnings.length,
        summary: {
          totalEarnings,
          pendingEarnings,
          paidEarnings,
          averageEarning: filteredEarnings.length > 0 ? totalEarnings / filteredEarnings.length : 0
        }
      }
    });
  } catch (error) {
    console.error('Error fetching earnings:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

