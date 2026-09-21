# Project contract

This document is the single source of truth for the v1 demo scenario and its business rules. The interface is an original intern-built concept and does not represent the production SCOTI product.

## Purpose and boundary

Build a self-contained, deterministic, browser-only 5–10 minute concept demonstration of one connected supply-chain story. It uses fictional operational data to illustrate connected planning and execution concepts informed by publicly described CSCS capabilities. It must not copy production screens, claim undocumented product features, or require a backend or network service at runtime.

## Technology

- React 19, TypeScript, Vite, React Router, Zustand, Tailwind CSS, Motion, Recharts
- Vitest and React Testing Library
- Node 22.12 or newer; npm
- Canonical seed: src/data/scenario.json; deterministic generator: scripts/generate_mock_data.py
- No server, database, authentication, external carrier/map/AI API, GraphQL, Next.js, Express, Firebase, Supabase, microservices, or TanStack Query in v1.
- Three.js and React Three Fiber may be added later as optional progressive enhancement. The core demo must remain useful without WebGL.

## Fictional scenario and locked identifiers

TrailSip is a fictional retailer selling reusable bottles online. It has one TrailSip Distribution Center and is preparing for a Back-to-School promotion.

| Kind | Canonical value |
| --- | --- |
| Hero product | TS-600, Everyday 600, 600 ml |
| Other products | TS-1000 Adventure 1000 (1000 ml); TS-350 Junior 350 (350 ml) |
| Hero customer/order | Alex Morgan (fictional); ORD-1001 |
| Order line | 2 × TS-600 |
| Supplier/PO | ClearPeak Manufacturing (fictional); PO-1001 |
| PO line | 100 × TS-600 |
| Receipt | RCPT-1001 |
| Warehouse/location | TrailSip Distribution Center; A-03-02 |
| Shipment/carrier/package | SHP-1001; SwiftLine Parcel (fictional); PKG-1001 |

## Quantities and inventory rules

TS-600 forecast is 120 and target ending stock is 20. Initial on-hand is 40, reserved is 0, and available is 40. Required replenishment is max(0, forecast + target ending quantity − available), therefore 120 + 20 − 40 = 100.

| Milestone | On hand | Reserved | Available |
| --- | ---: | ---: | ---: |
| Initial | 40 | 0 | 40 |
| After receipt of PO-1001 | 140 | 0 | 140 |
| After allocation of ORD-1001 | 140 | 2 | 138 |
| After dispatch of SHP-1001 | 138 | 0 | 138 |

Always enforce available = onHand − reserved, onHand ≥ 0, reserved ≥ 0, and reserved ≤ onHand. ORD-1001 represents two units within anticipated forecast demand; placing it does not reduce forecast 120 to 118.

TS-1000 has forecast 45, on-hand 60, target 10, and requirement 0. TS-350 has forecast 70, on-hand 95, target 15, and requirement 0.

## Scenario timeline

All times shown in the UI are scenario dates, not the visitor's local current date.

| Event | Scenario date |
| --- | --- |
| Demand review | 2026-08-12 |
| PO-1001 confirmed | 2026-08-13 |
| PO-1001 expected; RCPT-1001 posted | 2026-08-18 |
| ORD-1001 placed; pick and pack | 2026-08-19 |
| SHP-1001 dispatched | 2026-08-20 |
| Shipment delivered | 2026-08-22 |
| Back-to-School promotion | 2026-08-24 |

## Lifecycle states

- PurchaseOrderStatus: DRAFT, CONFIRMED, RECEIVED
- GoodsReceiptStatus: EXPECTED, POSTED
- SalesOrderStatus: NEW, ALLOCATED, PICKING, PACKED, SHIPPED, DELIVERED
- ReservationStatus: ACTIVE, RELEASED
- PickTaskStatus: NOT_STARTED, IN_PROGRESS, COMPLETE
- PackTaskStatus: WAITING, COMPLETE
- ShipmentStatus: PLANNED, DISPATCHED, IN_TRANSIT, OUT_FOR_DELIVERY, DELIVERED

## Story sequence and state transitions

Intro → Demand Planning → Sourcing / Purchase Order → Inbound / Warehouse → Order Management → Fulfillment → Shipment / Delivery → Control Tower.

The domain layer owns deterministic, guarded transitions: approve the requirement; confirm the PO; post the receipt and increase inventory once; allocate the order and reserve two units once; start and complete pick/pack once; dispatch once while decrementing on-hand and releasing the reservation; then advance shipment through transit, out-for-delivery, and delivered. ActivityEvent records are the source for the connected timeline. Repeating a completed transition is a safe no-op.

## Out of scope for v1

Backorders, partial or split shipments, returns, cancellations, damaged stock, rejected receipts, supplier bidding, billing, invoicing, payments, approval chains, multiple scenarios or warehouses, real integrations, external maps/carrier tracking, authentication, backend/database, AI assistant, advanced forecasting, and complex 3D scenes.

## Branding and disclosure

Use an original provisional visual theme. Do not describe its colors or interface as official CSCS/SCOTI branding. Display this disclosure unobtrusively in the shared shell:

> Intern Concept Demo · Fictional business and operational data · Original interface · Built to illustrate connected supply-chain concepts informed by CSCS’s publicly described capabilities.

## Design principles

Operational clarity, connected quantitative state, precise hierarchy, high information density without clutter, accessible controls, responsive desktop-first layout, restrained motion, and no requirement for 3D. See docs/DESIGN_SYSTEM.md.

## Development commands

- npm install or npm ci
- npm run dev
- npm run data:generate (optional Python 3 helper; not needed to run the app)
- npm run typecheck
- npm run lint
- npm run test
- npm run build

## Definition of done

All eight routes render in the shared shell, use the same canonical state, and provide working journey navigation and reset. Scenario math and lifecycle transitions satisfy this contract. Docs, Python generator, tests, CI, and accessible responsive starter UI are kept in sync. All four validation commands pass. Mentor approval is still needed for framework choice, brand assets/tokens, and any public deployment.

## Change rule

“Agents and developers must not change scenario quantities, IDs, relationships, lifecycle states, or business rules without updating docs/PROJECT_CONTRACT.md in the same pull request.”
