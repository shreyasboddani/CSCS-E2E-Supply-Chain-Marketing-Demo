# Design system

## Philosophy

Create original, provisional enterprise operations software: precise, industrial, modern, information-rich, and calm. Supply-chain clarity and the continuity of the hero quantities matter more than decorative technology. These tokens are not official CSCS brand colors or assets.

## Provisional tokens

| Token | Value | Use |
| --- | --- | --- |
| Canvas | #071015 | Main application background |
| Surface | #0d171d | Sidebars and primary panels |
| Elevated | #132027 | Inputs, cards, selected navigation |
| Primary text | #f2f7f8 | Headings and key values |
| Muted text | #90a1a8 | Supporting labels |
| Accent | #28c6b6 | Key focus and active journey state, used sparingly |
| Positive | #54cf91 | Success status |
| Warning | #deb85e | Pending status |
| Danger | #e17373 | Error status |
| Line | rgba(255,255,255,.09) | Dividers and outlines |

CSS custom properties live in src/styles/tokens.css. Do not claim they match official brand guidelines before mentor approval.

## Typography

Use a clean sans-serif stack for prose and controls. Use a restrained monospace stack only for operational identifiers and quantities. Approximate sizes: 12 px metadata, 14 px body/table text, 16 px primary UI copy, 20–24 px section titles, 32–40 px key operational figures, and 48–64 px intro statement.

## Spacing, radius, and surfaces

Use a consistent 4 px spacing base with common steps 4, 8, 12, 16, 24, 32, 40, and 48 px. Prefer modest 8–16 px radii for operational surfaces and controls; reserve larger radii for the intro composition only. Build hierarchy with canvas, surface, and elevated layers, subtle borders, and restrained shadows. Avoid giant rounded cards.

## Components

- Buttons: one clear primary action per view, secondary actions visually quiet, keyboard focus visible.
- Status badges: pair text with shape or icon; never rely on color alone.
- KPI cards: show only story-relevant values with clear labels, units, and scenario context.
- Tables: readable headers, aligned numeric columns, responsive overflow handling.
- Charts: fixed semantic colors and textual summaries; avoid charts without a decision or story.
- Timeline: chronological event labels, timestamps, resolved entity IDs, and a clear connected-thread line.
- Dialogs, empty states, loading states, and tooltips use the same surface and focus rules.

## Motion

Use Motion for small content and progress transitions, not spectacle. Target 160–240 ms for micro-interactions and 250–450 ms for normal transitions. Larger scenario animations may be considered later, remain short, and never block controls. Respect prefers-reduced-motion.

## Connected-thread motif

Carry a single restrained line through Demand → PO → Receipt → Inventory → Order → Fulfillment → Shipment → Delivery. Completed nodes gain a clear state; future nodes remain legible. The thread should encode real scenario progress rather than decorate the page.

## 3D constraints

The experience and data must work when 3D is absent or fails to load. Future Three.js / React Three Fiber scenes belong behind lazy-loaded optional components with SVG/CSS fallbacks. Do not use WebGL for ordinary controls, tables, KPIs, charts, forms, navigation, or tooltips.

## Accessibility

Use semantic HTML, logical headings, keyboard-operable navigation, visible focus, sufficient contrast, descriptive button names, reduced-motion support, and non-color status cues. Provide textual equivalents for future charts and immersive scenes.

## Anti-patterns

Explicitly avoid giant purple/blue gradient blobs; excessive glassmorphism; sparkles everywhere; fake AI chat panels; giant rounded cards everywhere; random chart colors; meaningless decorative KPIs; excessive floating 3D; “Live” wording for simulated data; and too many competing primary actions.
