# Premium Mobility & Grid Arbitrage Architecture
## Simulator & Admin Integration Module

**Date:** June 2026  
**Status:** 🟢 Production Ready (Certified Safe)  
**Context:** This document outlines the technical specifications for the dual-path Investment Simulator and its closed-loop integration with the Good Energy administrative platform (`/admin`).

---

## 1. Architectural Overview

The platform has evolved from a legacy solar project tracker into a comprehensive **Premium Mobility & Grid Arbitrage** ecosystem. The system handles dual business logic:
1.  **Electrolineras Premium**: High-yield, asset-heavy EV fast-charging nodes (Tier 01: 60kW to Tier 03: 240kW).
2.  **Fractional Solar Farms**: Steady, unit-based yield from corporate solar arrays.

This module bridges the public simulation environment directly to the CRM and financial backtesting engines used by the commercial and operations teams.

---

## 2. Core Operational Mechanics

### A. The Commercial Pipeline Lifecycle
The flow transitions anonymous public website traffic into fully verified, analytically tracked Syndicate Investors.

1.  **Data Genesis (Public Simulator):** Users land on `/investment-simulator` and interact with real-time sliders (vehicle capacity, retail/wholesale energy prices, compounding inflation, and demand growth). 
2.  **Frictionless Capture:** Instead of an authentication wall, the `SimulationLeadForm.tsx` securely captures Name, Phone, and Email alongside the precise JSON snapshot (`customParameters`) of the 10-year useMemo projection loop.
3.  **CRM Activation (`/admin/inversionistas`):** The commercial desk receives this snapshot instantly in the "Prospectos Digitales" tab. Sales agents can review exact assumptions (e.g., aggressive inflation vs. conservative usage trends) prior to initiating contact, dramatically increasing conversion likelihood.

### B. Live Performance Backtesting (Variance Engine)
Once physical hardware goes live, the `/admin/ganancias` module acts as the "Variance Holy Grail."

*   **Underwriting Superimposition:** The Recharts `ComposedChart` renders the actual grid revenue streams as solid deep emerald Bars (`#1A6B78`), while laying the original 10-year projected Underwriting Baseline over it as a dashed neon step-line (`strokeDasharray="5 5"`, `#D8DA00`).
*   **Operational Diagnostic:** Controllers can instantly visualize variance-to-plan, determining whether a node underperformance stems from an overly optimistic initial simulation or a real-world hardware utilization issue.

### C. Compliant Financial Routing Automation
The `/admin/pagos` ledger enforces two completely distinct mathematical rulesets to eliminate accounting overlap:

```text
                  +-----------------------------------+
                  |  Node Settlement Routine Trigger  |
                  +-----------------------------------+
                                    |
                  +-----------------+-----------------+
                  |                                   |
       [ SPACE PARTNER LOGIC ]             [ ASSET OWNER LOGIC ]
  - Deduct Raw Energy Inputs          - Isolate Node Gross Volume
  - Extract 30% Platform Fee          - Deduct 10% Admin Fee
  - Route 70% Net Margin to Landlord  - Deduct 5% Payment Gateway Fee
                                      - Route Full Yield to Investor
```

---

## 3. Database Schema Mapping (Prisma)

The module introduces explicit models for Lead Tracking and Institutional Portfolios.

### `SimulatedScenario`
Stores the anonymous, frictionless lead captures.
*   `id` (UUID)
*   `assetType`: `ELECTROLINERA` | `SOLAR_FARM`
*   `customParameters`: JSON (Stores exact modeling constraints)
*   `investorProfileId`: Optional FK (For when a lead signs a contract and migrates to an active syndicate account)

### `InvestorProfile`
The hardened corporate portfolio wrapper for a signed user.
*   `tier`: `FOUNDATIONAL` | `GROWTH` | `PREMIUM`
*   `capexAllocation` / `realEstateAllocation` / `operationsAllocation`: Financial structure breakdown.
*   `leaseContractStatus`: Legal tracking (`ACTIVE` vs `RENEWAL_PENDING`).
*   `nodes`: Relational linkage to `Node` (Asset Portability Registry).

### `Node` & `RetailSession`
The physical hardware integration points.
*   `Node`: Maps serial numbers, warranty expirations, and active current load / utilization metrics.
*   `RetailSession`: Captures specific charging dispatches, parsing gross billing vs energy input costs and assigning dynamic platform/partner utility splits.

---

## 4. Frontend Component Breakdown

| Component | Path | Responsibility |
| :--- | :--- | :--- |
| `InvestmentSimulatorWorkspace` | `/app/investment-simulator/...` | Manages the primary active tab state between Electrolinera and Solar paths. |
| `ElectrolineraSimulator` | `/app/investment-simulator/...` | Recursive 10-year compounding engine calculating precise Payback Horizons and Cash Multipliers. |
| `SimulationLeadForm` | `/app/investment-simulator/...` | Sleek slide-over modal executing the `submitSimulationLeadAction` Server Action with strict Zod types. |
| `InversionistasPage` | `/app/admin/inversionistas/page.tsx` | Tabbed dashboard displaying both Active Syndicate Members and Digital Simulator Prospects. |
| `GrossMarginLedgerPage` | `/app/admin/ganancias/page.tsx` | Variance visualizer for Underwriting vs. Dispatched Yields. |
| `PagosPage` | `/app/admin/pagos/page.tsx` | Batch Settlement ledger toggling dynamically between Space Partner and Asset Owner UI columns. |

---

## 5. Security & Constraints

1.  **Client-Side Memory Limits:** The 10-year recursive math runs completely inside `useMemo` on the client. It must NEVER trigger server-side queries on every slider movement.
2.  **Server Action Guards:** The `submitSimulationLeadAction` utilizes a strict `z.object()` boundary. Malformed JSON payloads from the public simulator will reject before ever touching Prisma.
3.  **Graceful Degradation:** Admin variance charts degrade gracefully if a `Node` lacks an associated `SimulatedScenario` (i.e. historical nodes launched prior to this module). 

*End of Documentation*
