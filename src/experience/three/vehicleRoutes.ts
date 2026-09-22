import { CatmullRomCurve3, Vector3 } from "three";

export const outboundPoints = [[2.8, 0.03, 3.9], [5.7, 0.03, 3.9], [7.5, 0.03, 4.3], [7.8, 0.03, 3.4], [7.8, 0.03, 1.5], [7.8, 0.03, 0]];
export const inboundPoints = [[-7.8, 0.03, -3.2], [-7.8, 0.03, 1.8], [-7.5, 0.03, 4.1], [-5.8, 0.03, 3.9], [-3.8, 0.03, 3.9]];
export function vehicleRoute(points: number[][], tension = 0.15) {
  return new CatmullRomCurve3(points.map(p => new Vector3(p[0], p[1], p[2])), false, "catmullrom", tension);
}
