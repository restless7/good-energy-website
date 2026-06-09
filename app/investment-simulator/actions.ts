"use server";

import { prisma } from '../../lib/prisma';
import { z } from 'zod';

const leadSchema = z.object({
  leadName: z.string().min(2),
  leadEmail: z.string().email(),
  leadPhone: z.string().min(6),
  assetType: z.enum(['ELECTROLINERA', 'SOLAR_FARM']),
  selectedTier: z.string().optional(),
  unitsCount: z.number().int().default(1),
  customParameters: z.record(z.string(), z.any()), // Stores the full JSON state
});

export async function submitSimulationLeadAction(payload: z.infer<typeof leadSchema>) {
  try {
    const validatedData = leadSchema.parse(payload);

    const scenario = await prisma.simulatedScenario.create({
      data: {
        leadName: validatedData.leadName,
        leadEmail: validatedData.leadEmail,
        leadPhone: validatedData.leadPhone,
        assetType: validatedData.assetType,
        selectedTier: validatedData.selectedTier,
        unitsCount: validatedData.unitsCount,
        customParameters: validatedData.customParameters,
      },
    });

    return { success: true, scenarioId: scenario.id };
  } catch (error) {
    console.error("Lead capture error:", error);
    return { success: false, error: "Failed to capture simulation lead" };
  }
}
