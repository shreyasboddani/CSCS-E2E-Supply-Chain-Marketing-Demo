# SCOTI research boundaries

Research checked 2026-09-21 against CSCS’s publicly accessible website. Public product language can change; recheck before a presentation or publication. This document summarizes public positioning and separates it from the invented TrailSip experience.

## Verified public claims

- CSCS presents SCOTI as a supply-chain platform with modules spanning Transportation Management, Warehouse Management, Yard Management, Demand & Replenishment, Integration Hub, IoT, and agentic automation. The exact grouping and names vary across CSCS pages. Sources: [SCOTI platform](https://cscs.io/the-scoti-platform-intelligence-autonomy-end-to-end-supply-chain-control/) and [CSCS platform page](https://cscs.io/ai-supply-chain-platform/).
- CSCS describes Demand Planning as using sales trends, inventory positions, and market signals for forecasts and replenishment recommendations. Source: [SCOTI platform](https://cscs.io/the-scoti-platform-intelligence-autonomy-end-to-end-supply-chain-control/).
- CSCS describes WMS concepts including inventory visibility, inbound/outbound operations, task-driven workflows, and fulfillment. Source: [CSCS platform page](https://cscs.io/ai-supply-chain-platform/).
- CSCS describes TMS functions including transportation planning, routing, carrier selection, dispatch, and tracking. Source: [Transportation Management](https://cscs.io/transportation-management/).
- CSCS describes integrations connecting operational systems and a visibility/control-tower layer. Sources: [CSCS platform page](https://cscs.io/ai-supply-chain-platform/) and [Services](https://cscs.io/services/).
- The pages reviewed describe connected order information and integration across systems. They do not establish that this demo’s invented order screen, purchasing flow, state machine, or visual design is a production SCOTI interface.

## Demo interpretation

- Demand planning, inventory, warehouse inbound/fulfillment, transportation, tracking, integration, and connected visibility are safe high-level conceptual themes for the story.
- Treat a purchase order as a connected workflow/data object. Do not claim that the demo depicts a dedicated SCOTI purchasing module or production PO screen.
- Treat ORD-1001 as connected order information flowing into execution, not as evidence of a standalone SCOTI OMS screen.
- Treat Control Tower as a connected visibility/orchestration concept; the demo timeline and interaction are invented.

## Fictional demo behavior

TrailSip, all people and organizations, product/order/PO/receipt/shipment identifiers, forecast values, inventory balances, carrier, warehouse location, statuses, timestamps, dashboard values, and all UI screens are simulated. Deterministic browser-only transitions illustrate a concept and do not claim to reproduce CSCS algorithms, integrations, screens, or operational outcomes.

## Open questions for mentors

- Is React + TypeScript approved in place of the handbook’s Python + Streamlit recommendation?
- Is a Python-generated JSON seed an acceptable compatibility artifact?
- Which CSCS/SCOTI names, trademark treatment, logos, fonts, and colors are approved for an intern concept demo?
- Should all AI/agentic references remain outside v1 UI copy?
- Is the repository or any hosted demo allowed to be public?
- Is the TrailSip scenario approved for external presentation?
- Is there an approved public product source that should replace the research links above?
