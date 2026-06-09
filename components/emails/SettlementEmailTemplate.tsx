import * as React from 'react';
import { Html, Head, Preview, Body, Container, Section, Text, Hr } from '@react-email/components';

interface SettlementEmailTemplateProps {
  partnerName: string;
  classification: 'SPACE_PARTNER' | 'ASSET_OWNER';
  cycle: string;
  grossRevenue: number;
  energyCost?: number;
  platformFee: number;
  netYield: number;
  volumeDispatched?: number;
}

export default function SettlementEmailTemplate({
  partnerName,
  classification,
  cycle,
  grossRevenue,
  energyCost,
  platformFee,
  netYield,
  volumeDispatched,
}: SettlementEmailTemplateProps) {
  const fmt = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v);

  return (
    <Html>
      <Head />
      <Preview>Comprobante de Liquidación de Ingresos - Good Energy</Preview>
      <Body style={{ backgroundColor: '#052126', fontFamily: 'sans-serif', margin: '0 auto' }}>
        <Container style={{ backgroundColor: '#0A3A43', padding: '40px', borderRadius: '12px', marginTop: '40px', maxWidth: '600px', border: '1px solid #1A6B78' }}>
          
          <Section style={{ marginBottom: '20px' }}>
            <Text style={{ fontSize: '24px', fontWeight: 'bold', color: '#FFFDF0', margin: '0' }}>
              Good Energy
            </Text>
            <Text style={{ fontSize: '12px', color: '#D8DA00', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>
              Comprobante de Dispersión Automática
            </Text>
          </Section>

          <Hr style={{ borderColor: '#1A6B78', margin: '20px 0' }} />

          <Section>
            <Text style={{ color: '#FFFDF0', fontSize: '16px', lineHeight: '1.5' }}>
              Hola <strong>{partnerName}</strong>,
            </Text>
            <Text style={{ color: '#8CB4BC', fontSize: '14px', lineHeight: '1.5' }}>
              Tu liquidación correspondiente al ciclo <strong>{cycle}</strong> ha sido procesada exitosamente y enviada a tu cuenta bancaria registrada vía Wompi.
            </Text>
          </Section>

          <Section style={{ backgroundColor: '#0E4D58', padding: '24px', borderRadius: '8px', marginTop: '24px', border: '1px solid #1A6B78' }}>
            <Text style={{ color: '#D8DA00', fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '16px' }}>
              Desglose de Operación ({classification === 'SPACE_PARTNER' ? 'Modelo 30/70' : 'Propiedad de Activo'})
            </Text>

            <table style={{ width: '100%', fontSize: '14px', color: '#FFFDF0' }}>
              <tbody>
                <tr>
                  <td style={{ paddingBottom: '8px' }}>Facturación Bruta (Gross Revenue)</td>
                  <td style={{ textAlign: 'right', paddingBottom: '8px' }}>{fmt(grossRevenue)}</td>
                </tr>

                {classification === 'SPACE_PARTNER' && energyCost !== undefined && (
                  <tr>
                    <td style={{ paddingBottom: '8px', color: '#f87171' }}>Costo Energía Suministrada</td>
                    <td style={{ textAlign: 'right', paddingBottom: '8px', color: '#f87171' }}>-{fmt(energyCost)}</td>
                  </tr>
                )}

                {classification === 'ASSET_OWNER' && volumeDispatched !== undefined && (
                  <tr>
                    <td style={{ paddingBottom: '8px', color: '#8CB4BC' }}>Volumen Despachado</td>
                    <td style={{ textAlign: 'right', paddingBottom: '8px', color: '#8CB4BC' }}>{volumeDispatched.toLocaleString()} kWh</td>
                  </tr>
                )}

                <tr>
                  <td style={{ paddingBottom: '16px', color: '#f87171' }}>
                    {classification === 'SPACE_PARTNER' ? 'Fee Operacional (30%)' : 'Fee Administrativo & Pasarela (15%)'}
                  </td>
                  <td style={{ textAlign: 'right', paddingBottom: '16px', color: '#f87171' }}>-{fmt(platformFee)}</td>
                </tr>

                <tr>
                  <td colSpan={2}>
                    <Hr style={{ borderColor: '#1A6B78' }} />
                  </td>
                </tr>

                <tr>
                  <td style={{ paddingTop: '16px', fontWeight: 'bold', fontSize: '18px', color: '#D8DA00' }}>Rendimiento Neto Depositado</td>
                  <td style={{ textAlign: 'right', paddingTop: '16px', fontWeight: 'bold', fontSize: '18px', color: '#D8DA00' }}>
                    {fmt(netYield)}
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          <Text style={{ color: '#8CB4BC', fontSize: '11px', marginTop: '32px', textAlign: 'center' }}>
            Este es un documento generado de forma automática por la infraestructura de Good Energy SAS. Para soporte, consulta a tu gestor a través de la plataforma.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
