import { prisma } from '../prisma';

export async function detectUnderutilizedAssets() {
  // 1. Fetch rolling 60 days of retail sessions
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  // Grouping by Node to calculate average utilization
  const nodeUtilization = await prisma.retailSession.groupBy({
    by: ['nodeId'],
    where: {
      createdAt: {
        gte: sixtyDaysAgo
      }
    },
    _sum: {
      durationMinutes: true
    }
  });

  const underutilizedNodes = [];

  for (const stat of nodeUtilization) {
    if (!stat._sum.durationMinutes) continue;

    // Daily utilization average = Total Minutes / 60 days / 1440 minutes per day
    const avgDailyUtilization = (stat._sum.durationMinutes / (60 * 1440)) * 100;

    // 2. The 18% Threshold Guard
    if (avgDailyUtilization < 18.0) {
      underutilizedNodes.push({
        nodeId: stat.nodeId,
        utilization: avgDailyUtilization
      });
    }
  }

  // 3. Algorithmic Relocation Matching
  const recommendations = [];

  for (const underNode of underutilizedNodes) {
    // Query SimulatedScenario to find target locations with high demand parameters
    const idealLeads = await prisma.simulatedScenario.findMany({
      where: {
        assetType: 'ELECTROLINERA'
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    });

    if (idealLeads.length > 0) {
      // Basic matching score based on simulated intent vs node capacity
      recommendations.push({
        currentNodeId: underNode.nodeId,
        currentUtilization: underNode.utilization,
        recommendedLead: idealLeads[0].id,
        matchScore: 92 // MOCK: In production, computed using node tier vs lead selected tier
      });
    }
  }

  return recommendations;
}
