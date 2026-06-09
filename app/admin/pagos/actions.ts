"use server";

import { prisma } from '../../../lib/prisma';
import { WompiDispersalClient, SettlementInstruction } from '../../../lib/payments/wompiClient';
import { dispatchSettlementEmail } from '../../../lib/notifications/resendClient';

export async function executeSettlementBatchAction() {
  try {
    // 1. Fetch PENDING retail sessions that haven't been settled
    const pendingSessions = await prisma.retailSession.findMany({
      where: { payoutStatus: 'PENDING' },
      include: {
        node: {
          include: {
            investor: true
          }
        }
      }
    });

    if (pendingSessions.length === 0) {
      return { success: true, message: 'No pending sessions to settle.' };
    }

    const wompiClient = new WompiDispersalClient();
    const instructions: SettlementInstruction[] = [];

    // Transactional isolation block for secure calculation
    const settlementResults = await prisma.$transaction(async (tx) => {
      const updatedSessionIds: string[] = [];

      for (const session of pendingSessions) {
        if (!session.node.investor) continue;

        const profileType = session.node.investor.tier; // In production, evaluate real 'Classification' flag
        let platformFee = 0;
        let partnerUtility = 0;

        // Space Partner Logic (30/70)
        if (profileType === 'FOUNDATIONAL' || profileType === 'SPACE_PARTNER') {
          const netMargin = session.grossBilling - session.energyInputCost;
          platformFee = netMargin * 0.30;
          partnerUtility = netMargin * 0.70;
        } 
        // Asset Owner Logic (Full Yield)
        else {
          const adminFee = session.grossBilling * 0.10;
          const gatewayFee = session.grossBilling * 0.05;
          platformFee = adminFee + gatewayFee;
          partnerUtility = session.grossBilling - session.energyInputCost - platformFee;
        }

        // Add instruction to batch
        instructions.push({
          beneficiaryName: session.node.investor.userId, // Map to actual banking info
          accountNumber: '123456789',
          bankCode: '007',
          amountCOP: partnerUtility,
          referenceId: session.id,
        });

        // Mutate Ledger state
        await tx.retailSession.update({
          where: { id: session.id },
          data: {
            platformFee,
            partnerUtility,
            payoutStatus: 'PROCESSING'
          }
        });

        updatedSessionIds.push(session.id);
      }

      return updatedSessionIds;
    });

    // 2. Execute Batch via Local Rails
    const transferResults = await wompiClient.executeBatchTransfer(instructions);

    // 3. Mark as SETTLED and optionally trigger DIAN Webhook
    await prisma.$transaction(
      transferResults.map(res => 
        prisma.retailSession.update({
          where: { id: res.referenceId },
          data: { payoutStatus: 'SETTLED' }
        })
      )
    );

    // MOCK: Trigger DIAN Invoicing Webhook
    console.log('[DIAN Invoice Webhook] Initiating generation for ', transferResults.length, ' receipts.');

    // 4. Background Notification Dispatch (Non-Blocking)
    // We run this outside the transaction so failures don't roll back the financial state
    Promise.all(pendingSessions.map(async (session) => {
      try {
        if (!session.node.investor) return;
        const profileType = session.node.investor.tier;
        const isSpacePartner = profileType === 'FOUNDATIONAL' || profileType === 'SPACE_PARTNER';

        let platformFee = 0;
        let partnerUtility = 0;
        if (isSpacePartner) {
          const netMargin = session.grossBilling - session.energyInputCost;
          platformFee = netMargin * 0.30;
          partnerUtility = netMargin * 0.70;
        } else {
          const adminFee = session.grossBilling * 0.10;
          const gatewayFee = session.grossBilling * 0.05;
          platformFee = adminFee + gatewayFee;
          partnerUtility = session.grossBilling - session.energyInputCost - platformFee;
        }

        await dispatchSettlementEmail({
          to: 'partner@example.com', // Securely mapped from session.node.investor.userId in production
          partnerName: 'Socio Comercial',
          classification: isSpacePartner ? 'SPACE_PARTNER' : 'ASSET_OWNER',
          cycle: 'Junio 2026',
          grossRevenue: session.grossBilling,
          energyCost: isSpacePartner ? session.energyInputCost : undefined,
          platformFee,
          netYield: partnerUtility,
          volumeDispatched: isSpacePartner ? undefined : 14200 // Mocked volume from metrics
        });
      } catch (err) {
        console.error('[Notification Pipeline Error]: Failed to send email for session', session.id, err);
      }
    })).catch(e => console.error('Global promise catch for notifications', e));

    return { success: true, processed: transferResults.length };
  } catch (error) {
    console.error('[Settlement Batch Error]:', error);
    return { success: false, error: 'Failed to process settlement batch' };
  }
}
