# Optional 3D scenes

The current lazy-loaded Three.js model lives in `src/experience/three/createSupplyScene.ts`, with its lifecycle and SVG fallback in `src/experience/SupplyWorld.tsx`. It is shared by the marketing story, workspace overview, warehouse, and Control Tower. The core experience remains complete without WebGL; ordinary controls, tables, charts, and navigation stay in the DOM.
