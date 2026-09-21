# Decision log

## Decision 001 — React + TypeScript + Vite for the demo UI

**Status:** Pending mentor confirmation
**Decision:** Implement the task’s specified React 19 / TypeScript / Vite frontend rather than the handbook’s Python / Streamlit presentation layer.
**Reason:** It supports the requested polished interactive marketing experience while keeping scenario data deterministic and local. The Python generator remains as a compatibility artifact. Confirm the framework choice with mentors before substantial stage build-out.

## Decision 002 — No backend for v1

**Status:** Proposed
**Decision:** Run the core demo entirely in-browser with deterministic scenario data and session-scoped persistence.
**Reason:** Avoids network availability and account setup during a presentation.

## Decision 003 — Canonical deterministic scenario JSON

**Status:** Accepted for foundation
**Decision:** src/data/scenario.json is the source seed; the optional Python generator recreates it without random values.
**Reason:** All screens need one shared, reviewable scenario.

## Decision 004 — Business rules isolated from React UI

**Status:** Accepted for foundation
**Decision:** Pure selectors, transitions, and invariant checks live in src/domain.
**Reason:** Prevents duplicated or divergent stage logic.

## Decision 005 — 3D is progressive enhancement

**Status:** Accepted for foundation
**Decision:** Prepare an extension point only; do not add WebGL dependencies to the foundation.
**Reason:** The story and UI must work fully without 3D.
