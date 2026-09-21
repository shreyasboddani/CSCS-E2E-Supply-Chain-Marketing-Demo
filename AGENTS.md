# Repository instructions

Before changing code, read docs/PROJECT_CONTRACT.md, docs/DATA_MODEL.md, and docs/DESIGN_SYSTEM.md.

- Keep business rules in src/domain. Components render shared state and do not calculate or mutate business state independently.
- Use src/data/scenario.json as the canonical seed. Never make feature-local copies of products, inventory, orders, or shipment lifecycle.
- Do not change scenario IDs, quantities, dates, statuses, or relationships unless the task requires it and docs/PROJECT_CONTRACT.md is updated in the same change.
- Do not invent SCOTI capabilities or present this original concept UI as the production SCOTI interface.
- Keep transitions deterministic and guarded. Treat 3D as optional progressive enhancement.
- Prefer shared components, focused changes, and no new dependency without a concrete reason.
- Before completing code changes, run npm run typecheck, npm run lint, npm run test, and npm run build.
