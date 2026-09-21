# Decision log

## Decision 001 â€” React + TypeScript + Vite for the demo UI

**Status:** Accepted for this repository
**Decision:** Implement the taskâ€™s specified React 19 / TypeScript / Vite frontend while preserving the handbookâ€™s product, narrative, collaboration, and walkthrough requirements.
**Reason:** It supports a polished interactive marketing experience while keeping scenario data deterministic and local. The Python generator remains as a compatibility artifact because the handbookâ€™s data-generation discipline still applies.

## Decision 002 â€” No backend for v1

**Status:** Proposed
**Decision:** Run the core demo entirely in-browser with deterministic scenario data and session-scoped persistence.
**Reason:** Avoids network availability and account setup during a presentation.

## Decision 003 â€” Canonical deterministic scenario JSON

**Status:** Accepted for foundation
**Decision:** src/data/scenario.json is the source seed; the optional Python generator recreates it without random values.
**Reason:** All screens need one shared, reviewable scenario.

## Decision 004 â€” Business rules isolated from React UI

**Status:** Accepted for foundation
**Decision:** Pure selectors, transitions, and invariant checks live in src/domain.
**Reason:** Prevents duplicated or divergent stage logic.

## Decision 005 â€” 3D is progressive enhancement

**Status:** Accepted for foundation
**Decision:** Prepare an extension point only; do not add WebGL dependencies to the foundation.
**Reason:** The story and UI must work fully without 3D.

## Decision 006 â€” CSCS / SCOTIâ„¢ brand direction

**Status:** Applied to concept demo
**Decision:** Use the supplied CSCS logo, a SCOTIâ„¢ product lockup, and the indigo / blue / teal palette with a generic fictional retail scenario.
**Reason:** This is a CSCS / SCOTI marketing concept demo rather than a customer-branded prototype. Screens remain original and simulated.
