# Experience direction

## Creative direction

The experience is an original, light CSCS / SCOTI concept. It uses white, ice-blue, blue-gray, indigo, and restrained teal accents to make the operating story feel precise and dimensional. SCOTI is the connective thread through the story; the fictional retail scenario supplies the operational evidence.

The story uses one dominant idea per viewport, short supporting copy, generous whitespace, and purpose-built visual systems instead of repeated feature-card grids. The final sandbox intentionally changes to a denser operational grammar while retaining the same color, type, and connected-thread language.

## Reference principles

The research pass reviewed current Apple product overview pages, Framer Marketplace product templates, and CSCS public product positioning. The implementation takes principles, not layouts, assets, copy, or product interfaces:

- Apple product pages use large type, strong whitespace, a small number of visual highlights, and progressive disclosure before deep detail. [MacBook Pro overview](https://www.apple.com/macbook-pro/)
- Framer's current product templates emphasize product clarity, focused conversion paths, editorial composition, and showing how a product works rather than surrounding it with generic dashboard grids. [The Current template](https://www.framer.com/marketplace/templates/the-current/), [Framer SaaS templates](https://www.framer.com/marketplace/templates/categories/saas/)
- CSCS publicly positions SCOTI across planning, warehouse operations, transportation, integration, visibility, and real-time decisioning. The concept therefore tells one connected plan-to-delivery story without presenting its original screens as production UI. [CSCS platform](https://cscs.io/ai-supply-chain-platform/), [SCOTI platform](https://cscs.io/the-scoti-platform-intelligence-autonomy-end-to-end-supply-chain-control/)

## Story chapters

1. **Opening:** isolated planning, warehouse, transport, and visibility signals gain a connected SCOTI thread.
2. **Connected layer:** the operating areas converge around a single connective core.
3. **Planning into action:** the canonical 120 forecast, 40 available, 20 target, and 100-unit requirement appear as one decision.
4. **Warehouse execution:** a spatial, architectural warehouse representation makes RCPT-1001 and A-03-02 visible.
5. **Movement and visibility:** the same operational thread continues from East Distribution Center through SHP-1001.
6. **Orchestration:** the network resolves into a Control Tower concept and opens the real sandbox.

## Scroll and spatial behavior

Story chapters are pinned on desktop and derive their visual progress from a small `requestAnimationFrame` scroll signal. The thread draws, nodes converge, the planning decision reveals, warehouse rack A-03-02 illuminates, and the delivery route advances as scrolling progresses. Mobile replaces pinning with shorter sequential scenes.

The spatial scenes are original DOM, CSS, and SVG compositions. They provide an intentional fallback on every device, avoid a new heavy WebGL dependency, and keep all controls and operational content accessible HTML. The warehouse and route are state-aware: receipt and shipment status change their labels in the story and the sandbox continues to use the same canonical Zustand scenario.

## Marketing to sandbox transition

The Control Tower scene leads into a browser-like workspace surface. Its final CTA opens the existing React sandbox, whose guarded actions update the canonical scenario. The old direct stage URLs remain available for a presenter or tests; `/demo/intro` is the primary sandbox entry from the story.

## Responsive, performance, and reduced motion

Desktop gets the full pinned presentation at the target 1366px, 1440px, 1512px, and 1920px widths. At 800px and below, scenes become stacked narrative compositions, the marketing navigation simplifies, and the sandbox remains its responsive operational UI.

The experience has no network runtime dependency and adds no large animation or 3D package. A single passive scroll listener schedules at most one animation frame. `prefers-reduced-motion` removes pinning and transforms while preserving every story message and link.
