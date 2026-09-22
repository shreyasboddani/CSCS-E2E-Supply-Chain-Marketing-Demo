# Design system

## Philosophy

Create original enterprise operations software for a CSCS / SCOTI™ concept demonstration: precise, calm, modern, and information-rich. The primary surface is white with a cool blue undertone, reflecting the supplied visual reference. Use the supplied CSCS logo and the brand palette below to identify the demo, while keeping application screens original and distinct from the production SCOTI interface.

## CSCS / SCOTI color tokens

| Token | Value | Use |
| --- | --- | --- |
| CSCS indigo | #191446 | Corporate wordmark and deep brand anchor |
| CSCS navy | #0e1941 | Navigation and deep interface surfaces |
| SCOTI blue | #3a78ff | Primary action, active journey, and focus |
| SCOTI teal | #00b49d | Secondary accent and connected-flow signal |
| Mint | #e0f2f1 | Pale contrast color from the CSCS logo |
| Canvas | #f4f7fc | Main application background |
| Surface | #ffffff | Sidebars and primary panels |
| Elevated | #eef3ff | Inputs, cards, selected navigation |
| Primary text | #101a3d | Headings and key values |
| Muted text | #687697 | Supporting labels |
| Accent | #3a78ff | Key focus and active journey state |
| Positive | #2dc6aa | Success status |
| Warning | #deb85e | Pending status |
| Danger | #e17373 | Error status |
| Line | rgba(224,242,241,.11) | Dividers and outlines |

CSS custom properties live in src/styles/tokens.css. The CSCS logo asset is stored locally at public/brand/cscs-logo.svg and was sourced from the official [CSCS website](https://cscs.io/wp-content/uploads/2025/08/cscs-logo.svg). Keep its proportions and colors intact; use it on a light field. The palette is based on the supplied reference and public logo/site colors, not a claim that this interface is a production SCOTI design.

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

The current marketing experience implements that enhancement in `src/experience/three`: an original architectural warehouse, roads, stock racks, and delivery vehicle. Three.js is imported near visible scenes; a static SVG remains available without WebGL. `launch.css` owns the larger marketing typography and compositions; `workspace.css` applies the related operational hierarchy. White and pale blue remain dominant, with one navy interactive demonstration section.

## Accessibility

Use semantic HTML, logical headings, keyboard-operable navigation, visible focus, sufficient contrast, descriptive button names, reduced-motion support, and non-color status cues. Provide textual equivalents for future charts and immersive scenes.

## Anti-patterns

Explicitly avoid giant purple/blue gradient blobs; excessive glassmorphism; sparkles everywhere; fake AI chat panels; giant rounded cards everywhere; random chart colors; meaningless decorative KPIs; excessive floating 3D; “Live” wording for simulated data; and too many competing primary actions.


## Complete scroll journey

ConnectedJourney extends the existing page with ten chapters: demand, sourcing,
illustrative inbound transit, receiving, inventory, orders, pick/pack, dispatch,
delivery, and Control Tower. Existing sections remain available.

One sticky canvas moves between supplier, receiving dock, stock, packing bench,
road, and customer. Transport shots follow vehicles before the final overview.
Supplier pallets, crosswalks, signs, and residential details add physical context.
The moving parcel and vehicles illustrate the narrative, not live tracking.
Scrolling never executes business transitions. Metrics show current shared state.
All chapter text and links work without WebGL. Reduced motion uses static camera
views and compact text; mobile uses a smaller sticky scene. No new dependencies.


### Physical handoff choreography

Vehicles use separate receiving and outbound positions, stay on exterior routes,
and stop outside the destination. One smoothed scroll clock drives vehicles,
camera follow, and parcel ownership, including reverse scrolling. The parcel
stays at a cargo socket during transport. A worker with articulated arms and legs
carries it through the receiving aisle, staging, packing, loading, and delivery.
Loading completes before departure; unloading begins after arrival. Short reach
and set-down intervals connect stationary cargo, hands, bench, and doorstep.
The truck has an illustrative open side to keep the carried parcel visible.


## Spotlight tour over the operational demo

The existing workspace, stage cards, tables, narrative rail, and action buttons stay
in place. Guided mode adds a nonmodal spotlight: context, records to inspect, then
the existing action. Completing that action explains the recorded event and offers
the next stage. Escape or Close switches to Explore without resetting state.
The optional 3D inset uses a separate distribution-floor set with receiving rollers,
stock racks, packing bench, dispatch staging, and a worker pushing a parcel cart.
Its lane is illustrative; all status text and previews read the canonical scenario.
The tour has mobile positioning, reduced-motion compatibility, and an SVG fallback.
