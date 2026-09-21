# CSCS / SCOTI™ End-to-End Supply Chain Demo

An intern-built, browser-only concept demo that follows one fictional TrailSip scenario from promotion demand through supplier replenishment, warehouse receipt, customer order, fulfillment, shipment, and delivery visibility.

> Intern Concept Demo · Fictional business and operational data · Original interface · Built to illustrate connected supply-chain concepts informed by CSCS’s publicly described capabilities.

This is an original concept interface. It does not reproduce production SCOTI screens or claim undocumented SCOTI functions.

## Hero scenario

TrailSip is preparing for a fictional Back-to-School promotion. The TS-600 forecast is 120 units, target ending stock is 20, and initial available inventory is 40, so the replenishment requirement is 100.

- PO-1001 brings 100 × TS-600 from fictional supplier ClearPeak Manufacturing.
- RCPT-1001 receives those units into A-03-02 at TrailSip Distribution Center.
- ORD-1001 connects fictional customer Alex Morgan to 2 × TS-600.
- SHP-1001 carries the order through fictional carrier SwiftLine Parcel in package PKG-1001.
- Inventory follows one shared equation: available = on hand − reserved.

Scenario quantities, identifiers, lifecycle states, and dates are locked in docs/PROJECT_CONTRACT.md.

## Architecture

The app is a React 19 + TypeScript + Vite SPA. React Router keeps all eight stages inside one shell. Zustand holds a session-scoped scenario snapshot. Pure selectors, transitions, and invariant checks live in src/domain. Every route reads the same deterministic JSON seed; no backend or external API is required at runtime.

Three.js / React Three Fiber is an optional future extension. The initial experience does not depend on WebGL.

## Stack

- React 19, TypeScript, Vite, React Router
- Zustand with sessionStorage persistence
- Tailwind CSS and project-owned CSS design tokens
- Motion for restrained route transitions with reduced-motion support
- Recharts dependency and chart-card extension point for future purposeful visualization
- Vitest and React Testing Library
- Python 3 only for the optional deterministic JSON generator

## Repository map

| Path | Purpose |
| --- | --- |
| docs/PROJECT_CONTRACT.md | Locked product, scenario, business rules, and definition of done |
| docs/DATA_MODEL.md | Entities, relationships, status values, invariants, and event model |
| docs/DESIGN_SYSTEM.md | Provisional theme, reusable patterns, motion, and accessibility |
| docs/DEMO_SCRIPT.md | Planned seven-minute presentation narrative |
| docs/SCOTI_RESEARCH.md | Verified public claims separated from demo interpretation and fiction |
| docs/DECISIONS.md | Framework and architecture decisions awaiting or following mentor review |
| scripts/generate_mock_data.py | Regenerates the deterministic canonical JSON seed |
| src/data/scenario.json | Canonical local scenario state |
| src/domain | Shared types, selectors, guarded transitions, and invariants |
| src/store/demoStore.ts | Zustand adapter, guided/explore preference, and reset |
| src/app | Router and shared application shell |
| src/features/stages | Eight stage starter screens |
| src/components | Reusable operational UI, narrative, and optional 3D extension points |
| src/narrative/stageCopy.ts | Shared stage purpose and presenter narrative |
| src/tests | Scenario, transition, and route behavior tests |
| .github/workflows/ci.yml | Pull request and main-branch validation |

## Requirements

- Node 22.12 or newer and npm
- Python 3 is optional and only needed for mock-data regeneration
- A current browser; the core app has no runtime network dependency

## Quick start

    npm install
    npm run dev

Then open the local URL printed by Vite. To install exactly from the committed lockfile, use npm ci.

## Development and validation

    npm run typecheck
    npm run lint
    npm run test
    npm run build

Other useful scripts:

- npm run test:watch starts Vitest in watch mode.
- npm run preview serves the production build locally.
- npm run check runs typecheck, lint, tests, and build in sequence.
- npm run data:generate runs python scripts/generate_mock_data.py and rewrites src/data/scenario.json.

Python is not part of frontend installation or runtime. If scenario data changes, update docs/PROJECT_CONTRACT.md in the same pull request and rerun the validation commands.

## Reset and persistence

The app keeps interactive scenario progress in browser sessionStorage so a refresh during a presentation can retain state. It does not use localStorage or a backend. Reset demo asks for confirmation, restores a deep clone of the exact canonical JSON seed, and returns to Introduction. Clearing the browser tab session also removes the persisted demo state.

## Guided journey and Explore mode

The default mode is Guided. The eight-stage navigation presents the intended order, the Continue links advance one stage, and the connected-thread indicator reflects scenario state. Explore is available from the top bar for free navigation. Both modes use the same data and selectors.

All stage routes currently provide read-only foundation screens. Domain transitions and store actions are ready for later interaction wiring; stage screens do not create independent business data.

## Adding a stage or component safely

1. Read the project contract, data model, and design system.
2. Put business calculations and state transitions in src/domain.
3. Add or revise shared stage narrative in src/narrative/stageCopy.ts.
4. Render shared selectors through reusable components; do not define page-local copies of inventory, orders, or statuses.
5. Add tests for meaningful state or user behavior and preserve all locked scenario values.
6. Update the project contract if the task intentionally changes an ID, quantity, relationship, lifecycle state, or business rule.
7. Run all four validation commands before opening a pull request.

## Codex and Claude Code

AGENTS.md and CLAUDE.md contain short repository rules. Read them along with the three contract documents before making changes. Use coding assistants to explain and review changes as well as implement them; understand each change before committing it.

## Team workflow

Use short-lived feature branches such as feat/demand-screen, feat/warehouse-scene, feat/order-allocation, feat/design-system, or fix/inventory-transition. Keep pull requests focused, include screenshots for UI changes, and do not commit substantial work directly to main. Coordinate edits to shared foundations such as the scenario, domain types, tokens, and shell.

## Deployment notes

This is a static Vite application and can be hosted by a static-site service after the team agrees on an approved destination. Confirm repository visibility, public-data requirements, trademark treatment, and hosting permission with mentors first. A static host under a repository subpath may need a Vite base path or SPA fallback configuration. No deployment workflow is configured because account and repository settings are unknown.

## Mentor review

Decision 001 is pending mentor confirmation because the handbook recommends Python / Streamlit while the task brief specifies React / TypeScript / Vite. Mentor review is also needed for approved branding and assets, external presentation of the fictional scenario, and public hosting. See docs/DECISIONS.md and docs/SCOTI_RESEARCH.md.

## Contributing

Keep the scenario mathematically consistent, use deterministic transitions, and treat the ActivityEvent stream as the shared source for the Control Tower timeline. Update the contract and tests with any approved business-rule change. The pull request template and CI workflow describe the review gate.
