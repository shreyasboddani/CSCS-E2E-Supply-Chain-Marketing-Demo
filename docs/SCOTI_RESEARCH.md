# SCOTI research boundaries

Research checked 2026-09-21 against CSCS’s publicly accessible website and the supplied brand reference. Public product language and web assets can change; recheck before a presentation or publication. This document summarizes public positioning and separates it from the simulated retail scenario.

## Verified public claims

- CSCS presents SCOTI as a supply-chain platform with modules spanning Transportation Management, Warehouse Management, Yard Management, Demand & Replenishment, Integration Hub, IoT, and agentic automation. The exact grouping and names vary across CSCS pages. Sources: [SCOTI platform](https://cscs.io/the-scoti-platform-intelligence-autonomy-end-to-end-supply-chain-control/) and [CSCS platform page](https://cscs.io/ai-supply-chain-platform/).
- CSCS describes Demand Planning as using sales trends, inventory positions, and market signals for forecasts and replenishment recommendations. Source: [SCOTI platform](https://cscs.io/the-scoti-platform-intelligence-autonomy-end-to-end-supply-chain-control/).
- CSCS describes WMS concepts including inventory visibility, inbound/outbound operations, task-driven workflows, and fulfillment. Source: [CSCS platform page](https://cscs.io/ai-supply-chain-platform/).
- CSCS describes TMS functions including transportation planning, routing, carrier selection, dispatch, and tracking. Source: [Transportation Management](https://cscs.io/transportation-management/).
- CSCS describes integrations connecting operational systems and a visibility/control-tower layer. Sources: [CSCS platform page](https://cscs.io/ai-supply-chain-platform/) and [Services](https://cscs.io/services/).
- CSCS presents SCOTI as an operating layer across transportation, warehouse operations, planning, integrations, and real-time decisioning. Its public platform page groups capabilities into TMS, WMS, Visibility Hub, Integration Hub, and IoT Intelligence. Source: [AI Supply Chain Platform](https://cscs.io/ai-supply-chain-platform/).
- CSCS describes a connected workflow from purchase order to delivery, with event-driven integration and shared operational visibility. Source: [The SCOTI Platform](https://cscs.io/the-scoti-platform-intelligence-autonomy-end-to-end-supply-chain-control/).
- CSCS publicly describes human-in-the-loop review for high-impact agent actions. The demo therefore uses explicit viewer-controlled buttons for simulated lifecycle steps rather than autonomous actions. Source: [The SCOTI Platform](https://cscs.io/the-scoti-platform-intelligence-autonomy-end-to-end-supply-chain-control/).
- The pages reviewed describe connected order information and integration across systems. They do not establish that this demo’s invented order screen, purchasing flow, state machine, or visual design is a production SCOTI interface.
- The official CSCS website serves its logo at [cscs-logo.svg](https://cscs.io/wp-content/uploads/2025/08/cscs-logo.svg). The supplied project reference shows the CSCS and SCOTI™ lockup with indigo, blue, and teal accents. These assets and colors identify this concept demo only.

## Demo interpretation

- Demand planning, inventory, warehouse inbound/fulfillment, transportation, tracking, integration, and connected visibility are safe high-level conceptual themes for the story.
- Treat a purchase order as a connected workflow/data object. Do not claim that the demo depicts a dedicated SCOTI purchasing module or production PO screen.
- Treat ORD-1001 as connected order information flowing into execution, not as evidence of a standalone SCOTI OMS screen.
- Treat Control Tower as a connected visibility/orchestration concept; the demo timeline and interaction are invented.
- Treat the guided action bar as a presentation aid that makes the connected story walkable. It is not a claim that production SCOTI uses these exact controls or screens.

## Fictional demo behavior

The unnamed retail operation, all people and organizations, product/order/PO/receipt/shipment identifiers, forecast values, inventory balances, carrier, warehouse location, statuses, timestamps, dashboard values, and all UI screens are simulated. Deterministic browser-only transitions illustrate a concept and do not claim to reproduce CSCS algorithms, integrations, screens, or operational outcomes.

## Open questions for mentors

- Is React + TypeScript approved in place of the handbook’s Python + Streamlit recommendation?
- Is a Python-generated JSON seed an acceptable compatibility artifact?
- Should all AI/agentic references remain outside v1 UI copy?
- Is the repository or any hosted demo allowed to be public?
- Is there an approved public product source that should replace the research links above?


## Research refresh: 2026-09-22

Rechecked https://cscs.io/ai-supply-chain-platform/ and
https://cscs.io/the-scoti-platform-intelligence-autonomy-end-to-end-supply-chain-control/ .
These support the planning, task-driven warehouse execution, transportation, and
shared visibility themes used by the spotlight guide. They do not establish the
exact production interface. White/blue styling follows the user-provided reference;
the handbook requires an original interface. The /warehouse-management/ URL
redirects to an old page and should not be treated as current UI evidence.
