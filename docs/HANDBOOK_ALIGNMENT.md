# Handbook alignment

The Marketing Demo Intern Project Handbook is the major product brief for this repository. It asks for a self-contained, clickable 5–10 minute supply-chain story that a first-time viewer can understand without prior context.

## Requirement mapping

| Handbook requirement | React implementation |
| --- | --- |
| One fictional company and connected hero journey | `src/data/scenario.json` contains one deterministic retail scenario and one hero SKU/order/PO/shipment chain. |
| Demand → sourcing → inbound → order → fulfillment → shipment → control tower | React Router exposes all seven story stages plus `/intro` in the shared `DemoShell`. |
| Formal data model and lifecycle values | `src/domain/types.ts`, `docs/DATA_MODEL.md`, and `docs/PROJECT_CONTRACT.md` define entities, relationships, statuses, and invariants. |
| Persistent connected mock data | `src/data/scenario.json` is the canonical seed; `scripts/generate_mock_data.py` regenerates it deterministically. Zustand session persistence keeps the walkthrough state while the browser tab is open. |
| Static end-to-end skeleton | Every route reads selectors from the same scenario state and shows the entity handoff to the next stage. |
| Interactivity and lifecycle progression | Each stage has a guided action that calls a guarded domain transition. Approval, PO confirmation, receipt, allocation, pick/pack, dispatch, and tracking advancement update downstream screens. |
| Guided narrative | The intro, stage header, journey map, connected thread, narrative rail, and “Connected next” links explain what happened, why it matters, and what to do next. |
| Marketing polish | The app uses a white workspace with CSCS blue/teal undertones, the supplied CSCS logo, responsive cards, status badges, restrained motion, and a newcomer-friendly intro. |
| AI layer | Optional and deferred. No unsupported AI capability is presented as part of the core demo. |

## Stack adaptation

The handbook describes Python + Streamlit + SQLite/JSON as its default learning stack. The task direction for this repository explicitly requires a React web app, so the equivalent implementation is React 19 + TypeScript + Vite + React Router + Zustand with JSON data. The product and narrative requirements remain the governing brief; only the UI framework is adapted.

## Boundaries

The demo is an original concept informed by public CSCS/SCOTI positioning. It does not reproduce production screens, expose real integrations, call carrier/map/AI services, or claim the simulated workflows are undocumented SCOTI features.

## Direct handbook review

The spatial redesign adds an original Three.js warehouse and transport illustration, seven selectable stage explanations, and a ten-action walkthrough on the marketing page. These read the same scenario as the operational routes. The Python generator and locked data contract are unchanged. Browser visual approval remains pending; automated integration coverage includes progression to delivery, reset, and shared state after opening Control Tower.

The handbook PDF was reviewed directly on 2026-09-21. Its product requirements remain governing: a newcomer can follow one fictional supply-chain lifecycle in 5-10 minutes; every stage reads connected persistent mock data; the narrative explains what happens and why it matters; and the result is self-contained, clickable, testable, and shareable.

The user requested React, so the handbook's Streamlit framework setup is adapted to React 19, TypeScript, Vite, React Router, Zustand, and canonical JSON. The data-generation discipline, Git workflow, verification expectations, staged journey, original-concept constraint, and optional AI-layer boundary are retained. The new story-to-sandbox journey is documented in `docs/FINAL_DEMO_FLOW.md`.
