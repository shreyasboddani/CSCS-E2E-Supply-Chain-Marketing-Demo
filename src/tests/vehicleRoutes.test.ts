import { expect, it } from "vitest";
import { inboundPoints, outboundPoints, vehicleRoute } from "../experience/three/vehicleRoutes";

it("keeps the entire truck footprint on connected paving and outside buildings", () => {
  const paved = (x: number, z: number) =>
    (Math.abs(x) <= 10.75 && Math.abs(z - 4.8) <= 1.15) ||
    (Math.abs(Math.abs(x) - 7.8) <= 1.05 && Math.abs(z) <= 7.25) ||
    (Math.abs(x) <= 7.25 && Math.abs(z - 3.8) <= 1.35);
  for (const [points, tension] of [[inboundPoints, 0.1], [outboundPoints, 0.15]] as const) {
    const route = vehicleRoute(points, tension);
    for (let i = 0; i <= 1000; i++) {
      const p = route.getPointAt(i / 1000);
      const t = route.getTangentAt(i / 1000);
      for (const along of [-0.95, 0, 1.3]) for (const across of [-0.405, 0, 0.405]) {
        const x = p.x + t.x * along - t.z * across;
        const z = p.z + t.z * along + t.x * across;
        expect(paved(x, z), `off paving at ${i}: ${x},${z}`).toBe(true);
        expect(Math.abs(x) < 5.3 && z < 2.45 && z > -4.1).toBe(false);
      }
    }
  }
});
