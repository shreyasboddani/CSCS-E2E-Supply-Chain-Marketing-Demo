# Claude Code project guidance

Read @docs/PROJECT_CONTRACT.md, @docs/DATA_MODEL.md, and @docs/DESIGN_SYSTEM.md before changing code.

Keep business rules in src/domain and use the canonical shared scenario. Do not invent screen-local business data, change locked scenario facts without updating the contract, or imply this concept UI is the real SCOTI product. Keep transitions deterministic, guarded, and testable. Prefer reusable components and focused changes.

Before finishing code changes, run npm run typecheck, npm run lint, npm run test, and npm run build.
