# SCOTI spatial marketing experience

## Art direction

White editorial surfaces, ink typography, restrained CSCS blue, and a detailed architectural supply-chain model. The opening pairs a large short statement with the 3D operation. A product explorer, pinned narrative, planning evidence, stage index, and interactive operation give the page different compositions and pacing.

The model is original illustrative geometry, not a digital twin of a real customer facility. Product quantities and status labels come from the canonical scenario. Geometric racks, trees, and buildings provide visual context rather than representing actual counts or geography.

## Story and interactions

1. **See the whole. Move as one.** Architectural supply-chain hero with shared inventory and shipment labels.
2. **Look closer.** Keyboard-accessible Network, Warehouse, and Transport tabs move the camera and open the roof. Drag or use rotation buttons to explore.
3. **Planning.** A scroll-linked product surface shows the current forecast, target, available stock, and derived replenishment requirement.
4. **Warehouse to delivery.** A pinned model changes camera angle with scroll, lifts the roof during the fulfillment beat, and pulls back for transport. Scroll changes the presentation only; it never executes business actions.
5. **Every handoff.** Seven selectable stages explain the operational purpose and link to the actual workspace.
6. **Your turn.** A console executes the next guarded domain action. Stock, shipment position, status, and the activity message reflect the same state across story and sandbox.
7. **Continue exploring.** Enter the full demo or open the official CSCS platform page.

## Shared architecture

- `src/domain/presentation.ts`: shared presentation selectors and next-action descriptions.
- `src/experience/StoryExperience.tsx`: marketing composition.
- `src/experience/WarehouseJourney.tsx`: scroll-controlled warehouse sequence.
- `src/experience/SupplyWorld.tsx`: lazy Three.js setup and SVG fallback.
- `src/experience/three/createSupplyScene.ts`: authored geometry, camera, materials, rendering, and cleanup.
- `src/experience/JourneyConsole.tsx`: accessible next-action console used on the story and Control Tower.
- Existing domain transitions and canonical JSON remain authoritative. No scenario IDs, quantities, lifecycle values, or dates changed.

## Performance and accessibility

The Three.js chunk is dynamically imported only near a visible scene. Pixel ratio is capped at 1.6; textures and downloaded models are unnecessary. Geometry and materials are reused. Render frames run for camera, roof, or shipment changes and stop when settled, offscreen, or in a hidden tab. Resize and visibility observers are cleaned up with GPU resources on unmount. WebGL failure or context loss leaves an intentional SVG model and all DOM controls.

Mobile layouts stack the story and console, remove pinned travel, and preserve vertical touch scrolling. Reduced motion disables camera interpolation and long pinned sequences while preserving the three narrative beats. Model controls are keyboard buttons, the explorer has arrow-key tabs, status changes are announced, reset uses a focus-contained confirmation dialog, and content has semantic headings and a skip link.

## Research principles

The original research used [Apple product storytelling](https://www.apple.com/macbook-pro/) for clear hierarchy and progressive detail, [Framer product examples](https://www.framer.com/marketplace/templates/the-current/) for composition and product clarity, and [CSCS platform positioning](https://cscs.io/ai-supply-chain-platform/) for supported language. No external template or Apple visual asset is used. Figma Community was blocked during research and was not visually inspected. Three.js APIs were checked against the [official documentation](https://threejs.org/docs/).

## Review status

Automated coverage verifies lifecycle progression, canonical quantities, reset, cross-route state continuity, and keyboard exploration. Browser screenshot review is still pending: the requested Browser plugin returned no available browser. Passing build and DOM tests is not a substitute for final visual approval of desktop, mobile, WebGL lighting, or animation pacing.
