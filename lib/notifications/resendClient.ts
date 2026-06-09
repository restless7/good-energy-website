import { Resend } from 'resend';
import * as React from 'react';
import SettlementEmailTemplate from '../../components/emails/SettlementEmailTemplate';

const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_1234');

export interface DispatchSettlementEmailParams {
  to: string;
  partnerName: string;
  classification: 'SPACE_PARTNER' | 'ASSET_OWNER';
  cycle: string;
  grossRevenue: number;
  energyCost?: number;
  platformFee: number;
  netYield: number;
  volumeDispatched?: number;
}

export async function dispatchSettlementEmail(params: DispatchSettlementEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Good Energy Finance <settlements@goodenergycol.com>',
      to: [params.to],
      subject: `Liquidación de Ingresos Confirmada - Ciclo ${params.cycle}`,
      react: React.createElement(SettlementEmailTemplate, params),
    });

    if (error) {
      console.error('[Resend Client] Failed to dispatch email:', error);
      return { success: false, error };
    }

    console.log(`[Resend Client] Successfully dispatched settlement to ${params.to}`);
    return { success: true, data };
  } catch (error) {
    console.error('[Resend Client] Critical failure:', error);
    return { success: false, error };
  }
}
