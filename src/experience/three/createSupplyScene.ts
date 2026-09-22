import * as T from "three";
import { inboundPoints, outboundPoints, vehicleRoute } from "./vehicleRoutes";

export interface SceneState {
  view: "network" | "warehouse" | "transport";
  roofOpen: boolean;
  received: boolean;
  shipmentProgress: number;
  motion: boolean;
  progress?: number;
  /** Illustrative story position, independent of operational state. */
  chapter?: number;
  operationsFocus?: number;
  operationsCompleted?: number;
}

/** Original architectural model; geometry is illustrative, quantities come from the domain. */
export function createSupplyScene(host: HTMLElement, initial: SceneState) {
  const renderer = new T.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFSoftShadowMap;
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;
  host.appendChild(renderer.domElement);
  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(34, 1, 0.1, 130);
  const root = new T.Group();
  scene.add(root);
  scene.add(new T.HemisphereLight(0xecf6ff, 0x7492ab, 2.8));
  const sun = new T.DirectionalLight(0xffffff, 4);
  sun.position.set(-7, 18, 10);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, {
    left: -18,
    right: 18,
    top: 18,
    bottom: -18,
    near: 0.5,
    far: 60,
  });
  sun.shadow.normalBias = 0.04;
  scene.add(sun);
  const rim = new T.DirectionalLight(0x8dc2ff, 2);
  rim.position.set(10, 7, -10);
  scene.add(rim);
  const mats = {
    white: new T.MeshStandardMaterial({ color: 0xf7fafc, roughness: 0.55 }),
    slab: new T.MeshStandardMaterial({ color: 0xdbe5ef, roughness: 0.8 }),
    road: new T.MeshStandardMaterial({ color: 0x94aabe, roughness: 0.9 }),
    blue: new T.MeshStandardMaterial({
      color: 0x256bea,
      roughness: 0.32,
      metalness: 0.15,
    }),
    dark: new T.MeshStandardMaterial({ color: 0x203e61, roughness: 0.7 }),
    teal: new T.MeshStandardMaterial({ color: 0x15b6a6, roughness: 0.4 }),
    glass: new T.MeshStandardMaterial({
      color: 0x84b8dc,
      roughness: 0.15,
      metalness: 0.4,
      transparent: true,
      opacity: 0.68,
    }),
    parcel: new T.MeshStandardMaterial({ color: 0xd1dfed, roughness: 0.8 }),
    vehicleWindow: new T.MeshStandardMaterial({ color: 0x527da4, roughness: 0.35, metalness: 0.1 }),
    line: new T.MeshBasicMaterial({ color: 0x3687ff }),
  };
  const geometries = new Set<T.BufferGeometry>();
  const boxGeometry = new T.BoxGeometry(1, 1, 1);
  geometries.add(boxGeometry);
  function box(
    parent: T.Object3D,
    x: number,
    y: number,
    z: number,
    w: number,
    h: number,
    d: number,
    mat: T.Material = mats.white,
  ) {
    const mesh = new T.Mesh(boxGeometry, mat);
    mesh.position.set(x, y, z);
    mesh.scale.set(w, h, d);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }
  function tube(points: number[][], radius: number, material: T.Material) {
    const curve = new T.CatmullRomCurve3(
      points.map((p) => new T.Vector3(p[0], p[1], p[2])),
      false,
      "catmullrom",
      0.15,
    );
    const geometry = new T.TubeGeometry(curve, 64, radius, 6, false);
    geometries.add(geometry);
    const mesh = new T.Mesh(geometry, material);
    root.add(mesh);
    return curve;
  }
  // Floating site plinth and a precise road network.
  box(root, 0, -0.5, 0, 22, 0.65, 15, mats.slab);
  box(root, 0, -0.12, 0, 21.7, 0.12, 14.7, mats.white);
  box(root, 0, -0.01, 4.8, 21.5, 0.035, 2.3, mats.road);
  box(root, -7.8, -0.01, 0, 2.1, 0.035, 14.5, mats.road);
  box(root, 7.8, -0.01, 0, 2.1, 0.035, 14.5, mats.road);
  for (let x = -10; x <= 10; x += 0.85)
    box(root, x, 0.02, 4.8, 0.4, 0.015, 0.035);
  for (let z = -6.6; z < 7; z += 0.85)
    for (const x of [-7.8, 7.8]) box(root, x, 0.02, z, 0.035, 0.015, 0.4);
  // Continuous paved loading apron connects both dock lanes to the ring road.
  // Its depth includes the swept vehicle body, not just each route centerline.
  box(root, 0, -0.005, 3.8, 14.5, 0.035, 2.7, mats.road);
  for (const x of [-3.8, 2.8]) {
    for (const edge of [-1.35, 1.6])
      box(root, x + edge, 0.025, 3.6, 0.035, 0.015, 1.8, mats.white);
  }
  // Central warehouse: visible framing, sawtooth roof, loading docks and interior aisles.
  const warehouse = new T.Group();
  root.add(warehouse);
  box(warehouse, 0, 0.12, -0.9, 10.6, 0.28, 6.4, mats.slab);
  box(warehouse, 0, 1.3, -4, 10.5, 2.5, 0.12);
  box(warehouse, -5.15, 1.3, -0.9, 0.12, 2.5, 6.2);
  box(warehouse, 5.15, 0.7, -0.9, 0.12, 1.2, 6.2, mats.glass);
  for (let x = -5; x <= 5; x += 2) {
    box(warehouse, x, 1.55, 2.1, 0.11, 2.85, 0.11, mats.dark);
    box(warehouse, x, 1.55, -3.9, 0.11, 2.85, 0.11, mats.dark);
    box(warehouse, x, 2.9, -0.9, 0.13, 0.15, 6.2, mats.white);
  }
  const roof = new T.Group();
  warehouse.add(roof);
  for (let x = -4.3; x < 5; x += 1.75) {
    const panel = box(roof, x, 3.1, -0.9, 1.76, 0.14, 6.4);
    panel.rotation.z = -0.08;
    box(roof, x + 0.73, 3.12, -0.9, 0.22, 0.06, 5.8, mats.glass);
    for (let z = -3.2; z < 1.5; z += 1.25)
      box(roof, x - 0.15, 3.21, z, 1.08, 0.035, 0.85, mats.blue);
  }
  const stock = new T.Group();
  warehouse.add(stock);
  for (let x = -3.8; x <= 3.8; x += 1.9)
    for (let z = -2.7; z <= 0.5; z += 1.25) {
      for (const dx of [-0.56, 0.56])
        box(stock, x + dx, 1.1, z, 0.045, 1.9, 0.65, mats.dark);
      for (let y = 0.4; y < 2.1; y += 0.65) {
        box(stock, x, y, z, 1.25, 0.055, 0.75, mats.blue);
        for (const dx of [-0.3, 0.3])
          box(
            stock,
            x + dx,
            y + 0.23,
            z,
            0.49,
            0.4,
            0.53,
            x > 1 ? mats.teal : mats.parcel,
          );
      }
    }
  for (let x = -3.8; x < 5; x += 2.2) {
    if (x > -3 && x < 2) box(warehouse, x, 0.55, 2.35, 1.45, 0.85, 0.18, mats.dark);
    box(warehouse, x, 0.12, 2.8, 1.6, 0.1, 0.8, mats.slab);
    for (const dx of [-0.8, 0.8])
      box(warehouse, x + dx, 0.32, 2.85, 0.07, 0.45, 0.07, mats.blue);
  }
  // Office / systems building, stylized destination district.
  for (let i = 0; i < 3; i++) {
    box(
      root,
      -9.6,
      0.65 + i * 0.63,
      -3.2,
      1.55,
      0.59,
      2.4,
      i % 2 ? mats.glass : mats.white,
    );
    box(
      root,
      9.6,
      0.6 + i * 0.68,
      -2.4,
      1.45,
      0.61,
      1.9,
      i % 2 ? mats.glass : mats.white,
    );
  }
  for (const z of [1, 2.6]) {
    box(root, 9.6, 0.48, z, 1.5, 0.9, 1.05);
    box(root, 9.6, 0.96, z, 1.65, 0.07, 1.18, mats.blue);
  }
  // Landscape and light poles provide human scale without textures or downloaded models.
  const treeGeometry = new T.IcosahedronGeometry(0.35, 1);
  geometries.add(treeGeometry);
  for (let x = -5.5; x < 6; x += 1.05) {
    const tree = new T.Mesh(treeGeometry, mats.teal);
    tree.position.set(x, 0.55, 6.6);
    tree.scale.y = 1.3;
    tree.castShadow = true;
    root.add(tree);
    box(root, x, 0.16, 6.6, 0.065, 0.32, 0.065, mats.dark);
  }
  for (const x of [-6.2, 6.2])
    for (const z of [-4.8, 2.8]) {
      box(root, x, 0.8, z, 0.055, 1.6, 0.055, mats.dark);
      box(root, x + 0.15, 1.6, z, 0.35, 0.055, 0.12);
    }
  function truck() {
    const group = new T.Group();
    // The cargo floor sits above the chassis; coincident top faces caused
    // the flickering triangular depth artifacts visible inside the truck.
    box(group, 0, 0.27, 0, 1.55, 0.1, 0.66);
    box(group, 0, 0.87, 0, 1.55, 0.07, 0.66);
    box(group, 0, 0.5, -0.31, 1.55, 0.65, 0.04);
    box(group, 0.72, 0.57, 0, 0.05, 0.5, 0.66);
    for (const x of [-0.74, 0.66]) box(group, x, 0.57, 0.3, 0.04, 0.5, 0.04, mats.blue);
    box(group, 1.02, 0.35, 0, 0.52, 0.46, 0.64, mats.blue);
    box(group, 1.06, 0.655, 0, 0.34, 0.12, 0.58, mats.vehicleWindow);
    box(group, 1.06, 0.745, 0, 0.4, 0.045, 0.64, mats.blue);
    box(group, 0.15, 0.16, 0, 2.2, 0.12, 0.59, mats.dark);
    for (const x of [-0.55, 0.6, 1.1])
      for (const z of [-0.36, 0.36]) {
        const geometry = new T.CylinderGeometry(0.14, 0.14, 0.09, 12);
        geometries.add(geometry);
        const wheel = new T.Mesh(geometry, mats.dark);
        wheel.rotation.x = Math.PI / 2;
        wheel.position.set(x, 0.15, z);
        group.add(wheel);
      }
    // Small interior panels retain material lighting and cast ground shadows,
    // but do not receive low-resolution self-shadows on their thin surfaces.
    group.traverse((part) => { if (part instanceof T.Mesh) part.receiveShadow = false; });
    root.add(group);
    return group;
  }
  const vehicle = truck();
  const route = tube(
    outboundPoints,
    0.035, mats.line,
  );
  tube(
    [
      [-9.4, 0.15, -3.2],
      [-7, 0.15, -4.9],
      [0, 0.15, -4.9],
      [0, 0.15, -3.9],
    ],
    0.025,
    mats.teal,
  );
  const haloGeometry = new T.TorusGeometry(0.8, 0.025, 6, 64);
  geometries.add(haloGeometry);
  const halo = new T.Mesh(haloGeometry, mats.line);
  halo.rotation.x = Math.PI / 2;
  halo.position.set(2, 2.25, -0.2);
  warehouse.add(halo);

  // A connected physical thread: supplier load, receipt, shelf, pack bench, door.
  const inboundTruck = truck();
  const inboundRoute = vehicleRoute(inboundPoints, 0.1);
  // Supplier yard, staged pallets, road markings and the destination neighborhood.
  for (let i = 0; i < 3; i++) {
    box(root, -9.6, 0.12, 0.2 + i * 0.8, 1.2, 0.15, 0.55, mats.dark);
    box(root, -9.6, 0.48, 0.2 + i * 0.8, 0.95, 0.55, 0.48, mats.parcel);
  }
  for (let i = 0; i < 6; i++) {
    box(root, 7.8, 0.035, 0.5 + i * 0.16, 1.7, 0.02, 0.07, mats.white);
    box(root, -7.8, 0.035, 2.8 + i * 0.16, 1.7, 0.02, 0.07, mats.white);
  }
  for (const z of [1, 2.6]) {
    box(root, 9.6, 0.4, z + 0.54, 0.28, 0.65, 0.04, mats.dark);
    box(root, 9.1, 0.58, z + 0.54, 0.24, 0.3, 0.04, mats.glass);
    box(root, 10.05, 0.58, z + 0.54, 0.24, 0.3, 0.04, mats.glass);
    box(root, 8.9, 0.02, z + 0.7, 1.8, 0.04, 0.22, mats.slab);
  }
  for (const x of [-6.3, 6.3]) {
    box(root, x, 0.6, 5.8, 0.06, 1.2, 0.06, mats.dark);
    box(root, x, 1.2, 5.8, 0.7, 0.4, 0.07, mats.blue);
  }
  box(warehouse, 4, 0.65, 1, 1.5, 0.15, 1, mats.dark);
  for (const x of [3.4, 4.6]) box(warehouse, x, 0.3, 1, 0.08, 0.6, 0.8, mats.blue);
  const storyParcel = box(root, 0, 0, 0, 0.28, 0.25, 0.28, mats.teal);
  // One worker with pivoted limbs and a carry socket. The package is attached
  // to this socket or the vehicle; it never travels on a separate world path.
  const worker = new T.Group();
  root.add(worker);
  const torso = new T.Group();
  torso.position.y = 0.56;
  worker.add(torso);
  box(torso, 0, 0.14, 0, 0.28, 0.36, 0.18, mats.blue);
  box(torso, 0, 0.15, -0.1, 0.25, 0.22, 0.025, mats.teal);
  box(torso, 0, 0.47, 0, 0.19, 0.22, 0.18, mats.parcel);
  box(torso, 0, 0.6, 0, 0.24, 0.06, 0.23, mats.white);
  const limbs = [-1, 1].map(side => {
    const leg = new T.Group(); leg.position.set(side * 0.09, 0.54, 0); worker.add(leg);
    box(leg, 0, -0.23, 0, 0.11, 0.46, 0.12, mats.dark);
    box(leg, 0, -0.48, -0.03, 0.13, 0.09, 0.22, mats.dark);
    const arm = new T.Group(); arm.position.set(side * 0.2, 0.25, 0); torso.add(arm);
    box(arm, 0, -0.16, 0, 0.085, 0.33, 0.1, mats.blue);
    box(arm, 0, -0.33, 0, 0.09, 0.09, 0.1, mats.parcel);
    return { leg, arm };
  });
  const hands = new T.Object3D(); hands.position.set(0, -0.01, -0.34); torso.add(hands);
  const cargo = new T.Object3D(); cargo.position.set(-0.4, 0.52, 0); vehicle.add(cargo);
  const inboundCargo = new T.Object3D(); inboundCargo.position.set(-0.4, 0.52, 0); inboundTruck.add(inboundCargo);
  // Dedicated staging pedestal, away from rack geometry and walking aisles.
  box(warehouse, 1.8, 0.42, 1.15, 0.65, 0.32, 0.5, mats.slab);
  const shelf = new T.Vector3(1.8, 0.705, 1.15);
  const bench = new T.Vector3(4, 0.85, 1);
  const doorstep = new T.Vector3(9.6, 0.19, 1.75);
  const phase = (value: number, from: number, to: number) => T.MathUtils.smoothstep(value, from, to);
  function carryAlong(points: number[][], amount: number) {
    const path = new T.CurvePath<T.Vector3>();
    for (let i = 1; i < points.length; i++) path.add(new T.LineCurve3(new T.Vector3(...points[i - 1]), new T.Vector3(...points[i])));
    const point = path.getPoint(amount);
    const tangent = path.getTangent(Math.min(0.9999, Math.max(0.0001, amount)));
    worker.position.copy(point);
    worker.rotation.y = Math.atan2(-tangent.x, -tangent.z);
    const walking = amount > 0 && amount < 1;
    limbs.forEach(({ leg, arm }, i) => {
      leg.rotation.x = walking ? Math.sin(amount * path.getLength() * 12) * 0.38 * (i ? 1 : -1) : 0;
      arm.rotation.x = 1.25;
    });
    root.updateMatrixWorld(true);
    hands.getWorldPosition(storyParcel.position);
    storyParcel.quaternion.copy(worker.quaternion);
  }
  const signal = new T.Group();
  root.add(signal);
  for (let i = 0; i < 5; i++) {
    const h = 0.6 + i * 0.4;
    box(signal, -4 + i * 0.7, h / 2 + 3.6, -1, 0.4, h, 0.4, i === 4 ? mats.teal : mats.blue);
  }
  const shots = [
    { target: [-2, 2, -1], eye: [17, 14, 21] },
    { target: [-8, 0.8, -2.5], eye: [4, 10, 15] },
    { target: [-4, 0, 2], eye: [12, 17, 24] },
    { target: [-3, 0.5, 1], eye: [10, 10, 14] },
    { target: [0, 0.8, -1], eye: [9, 13, 12] },
    { target: [8, 0.8, -2], eye: [22, 12, 15] },
    { target: [2, 0.7, 0], eye: [11, 12, 14] },
    { target: [4, 0, 3], eye: [22, 17, 22] },
    { target: [9, 0.7, -2], eye: [22, 10, 13] },
    { target: [0, 0, 0], eye: [24, 25, 30] },
  ];

  // Separate operational set: an open distribution floor for the guided demo.
  // Reuses materials and geometry, but has its own composition and camera.
  const operations = new T.Group();
  scene.add(operations);
  box(operations, 0, -0.35, 0, 15, 0.55, 9, mats.slab);
  box(operations, 0, -0.035, 0, 14.8, 0.06, 8.8, mats.white);
  box(operations, 0, 0.015, 2.2, 14.2, 0.02, 1.6, mats.slab);
  const stationX = [-5.1, -1.7, 1.7, 5.1];
  const stationMarkers = stationX.map(x => box(operations, x, 0.015, 0, 2.8, 0.03, 3.5, mats.slab));
  // Receiving roller table and incoming cartons.
  for (let i = 0; i < 7; i++) box(operations, -5.1, 0.52, -1.2 + i * 0.35, 2, 0.08, 0.12, mats.dark);
  for (const x of [-5.9, -4.3]) box(operations, x, 0.26, 0, 0.08, 0.52, 2.5, mats.blue);
  for (const z of [-0.8, 0, 0.8]) {
    box(operations, -5.1, 0.83, z, 0.7, 0.5, 0.6, mats.parcel);
    box(operations, -5.1, 1.087, z, 0.08, 0.012, 0.61, mats.blue);
  }
  // Two accessible rack bays with a central aisle.
  for (const x of [-2.6, -0.8]) {
    for (const z of [-1.3, 1.3]) box(operations, x, 1.3, z, 0.08, 2.6, 0.08, mats.blue);
    for (const y of [0.3, 1.05, 1.8]) {
      box(operations, x, y, 0, 0.8, 0.07, 2.6, mats.dark);
      for (const z of [-0.85, 0, 0.85]) box(operations, x, y + 0.28, z, 0.65, 0.48, 0.6, mats.parcel);
    }
  }
  // Pack bench, terminal, label station, and a sealed package.
  box(operations, 1.7, 0.85, 0, 2.35, 0.13, 1.6, mats.white);
  for (const x of [0.8, 2.6]) box(operations, x, 0.4, 0, 0.1, 0.8, 1.35, mats.blue);
  box(operations, 2.4, 1.27, -0.55, 0.65, 0.45, 0.07, mats.dark);
  box(operations, 2.4, 1.28, -0.5, 0.55, 0.34, 0.025, mats.vehicleWindow);
  box(operations, 1.4, 1.2, 0, 0.65, 0.55, 0.6, mats.teal);
  box(operations, 1.4, 1.482, 0, 0.22, 0.018, 0.35, mats.white);
  // Dispatch staging lanes, gate, and palletized cartons.
  for (const z of [-1, 0, 1]) {
    box(operations, 5.1, 0.12, z, 1.7, 0.2, 0.75, mats.dark);
    box(operations, 5.1, 0.58, z, 1.4, 0.7, 0.65, mats.parcel);
  }
  for (const x of [4, 6.2]) box(operations, x, 1.5, -1.65, 0.14, 3, 0.14, mats.blue);
  box(operations, 5.1, 3, -1.65, 2.35, 0.2, 0.16, mats.blue);
  // Physical lane connects the four stations through the foreground.
  for (let x = -6; x < 7; x += 0.5) box(operations, x, 0.04, 2.2, 0.22, 0.035, 0.07, mats.white);
  const operationCart = new T.Group();
  operations.add(operationCart);
  box(operationCart, 0, 0.22, 0, 0.9, 0.12, 0.7, mats.blue);
  box(operationCart, 0, 0.54, 0, 0.6, 0.5, 0.5, mats.teal);
  for (const x of [-0.3, 0.3]) for (const z of [-0.25, 0.25]) box(operationCart, x, 0.09, z, 0.14, 0.18, 0.12, mats.dark);
  const floorWorker = worker.clone(true);
  floorWorker.position.set(-0.75, 0.03, 0);
  floorWorker.rotation.y = -Math.PI / 2;
  operationCart.add(floorWorker);
  operationCart.position.set(-5.1, 0, 2.2);

  let state = initial;
  let frame = 0;
  let visible = true;
  let disposed = false;
  let azimuth = 0;
  let dragging = false;
  let lastX = 0;
  let lastTime = 0;
  let visualStory = initial.chapter ?? 0;
  let visualShipment = initial.shipmentProgress;
  const target = new T.Vector3();
  const desiredCamera = new T.Vector3();
  camera.position.set(21, 17, 24);
  function draw(now: number) {
    frame = 0;
    if (disposed || !visible || document.hidden) return;
    const dt = Math.min((now - lastTime) / 1000 || 0.016, 0.05);
    lastTime = now;
    const smooth = state.motion ? 1 - Math.exp(-dt * 7) : 1;
    const close = state.view === "warehouse";
    const angle = 0.72 + azimuth + (state.progress ?? 0) * 0.45;
    const fit = Math.max(1, 1.4 / camera.aspect);
    const distance = (close ? 17 : 30) * fit;
    desiredCamera.set(
      Math.sin(angle) * distance,
      (close ? 12 : 20) * fit,
      Math.cos(angle) * distance,
    );
    const desiredTarget = new T.Vector3(state.view === "transport" ? 3 : 0, 0, close ? -0.8 : 0);
    visualStory = T.MathUtils.lerp(visualStory, state.chapter ?? 0, smooth);
    visualShipment = T.MathUtils.lerp(visualShipment, state.shipmentProgress, smooth);
    const story = state.chapter === undefined ? undefined : visualStory;
    const step = story === undefined ? -1 : Math.min(9, Math.floor(story));
    const local = story === undefined ? 0 : story - step;
    if (story !== undefined) {
      const shot = shots[step];
      const next = shots[Math.min(9, step + 1)];
      const blend = T.MathUtils.smoothstep(local, 0.65, 1);
      desiredTarget.fromArray(shot.target).lerp(new T.Vector3().fromArray(next.target), blend);
      desiredCamera.fromArray(shot.eye).lerp(new T.Vector3().fromArray(next.eye), blend);
      desiredCamera.sub(desiredTarget).multiplyScalar(fit).add(desiredTarget);
      // Follow the vehicle through the middle of each transport shot, then
      // ease back into the next chapter's destination framing.
      if (step === 2 || step === 7) {
        const travel = step === 2 ? inboundRoute : route;
        const travelProgress = step === 2 ? phase(story, 2.05, 2.9) : phase(story, 7.3, 8.25);
        const point = travel.getPointAt(T.MathUtils.clamp(travelProgress, 0, 1));
        const follow = Math.sin(local * Math.PI) * 0.8;
        desiredTarget.lerp(point, follow);
        desiredCamera.lerp(point.clone().add(new T.Vector3(10 * fit, 8 * fit, 12 * fit)), follow);
      }
    }
    const operational = state.operationsFocus !== undefined;
    operations.visible = operational;
    root.visible = !operational;
    if (operational) {
      const focus = Math.max(0, Math.min(3, state.operationsFocus!));
      stationMarkers.forEach((marker, index) => { marker.material = index === focus ? mats.teal : mats.slab; });
      desiredTarget.set(stationX[focus] * 0.55, 0.5, 0);
      desiredCamera.set(desiredTarget.x + 11 * fit, 12 * fit, 16 * fit);
    }
    const completed = state.operationsCompleted ?? 0;
    const cartTarget = completed >= 7 ? 5.1 : completed >= 5 ? 1.7 : completed >= 3 ? -1.7 : -5.1;
    operationCart.position.x = T.MathUtils.lerp(operationCart.position.x, cartTarget, smooth);
    camera.position.lerp(desiredCamera, smooth);
    target.lerp(desiredTarget, smooth);
    camera.lookAt(target);
    roof.position.y = T.MathUtils.lerp(
      roof.position.y,
      (story === undefined ? state.roofOpen : step >= 3 && step <= 6) ? 4.7 : 0,
      smooth,
    );
    roof.visible = roof.position.y < 4.65;
    halo.visible = close || state.received;
    const outboundProgress = story === undefined ? visualShipment : phase(story, 7.3, 8.25);
    const inboundProgress = phase(story ?? 0, 2.05, 2.9);
    signal.visible = step === 0;
    inboundTruck.visible = story !== undefined;
    inboundTruck.position.copy(inboundRoute.getPointAt(inboundProgress));
    const inboundTangent = inboundRoute.getTangentAt(inboundProgress);
    inboundTruck.rotation.y = -Math.atan2(inboundTangent.z, inboundTangent.x);
    const vehicleTarget = route.getPointAt(outboundProgress);
    vehicle.position.copy(vehicleTarget);
    const tangent = route.getTangentAt(outboundProgress);
    vehicle.rotation.y = -Math.atan2(tangent.z, tangent.x);
    storyParcel.visible = story !== undefined && story >= 1;
    worker.visible = story !== undefined && ((story >= 3 && story < 4) || (story >= 6 && story < 7.3) || story >= 8.25);
    storyParcel.rotation.set(0, 0, 0);
    root.updateMatrixWorld(true);
    if (story !== undefined) {
      if (story < 3) inboundCargo.getWorldPosition(storyParcel.position);
      else if (story < 4) {
        carryAlong([[-5.05,0.03,3.9],[-5.05,0.03,3.15],[-3.8,0.26,3.15],[-3.8,0.26,1.8],[1.8,0.26,1.8]], phase(story, 3.18, 3.78));
        const carried = storyParcel.position.clone();
        inboundCargo.getWorldPosition(storyParcel.position);
        storyParcel.position.lerp(carried, phase(story, 3, 3.18)).lerp(shelf, phase(story, 3.78, 3.98));
      } else if (story < 6) storyParcel.position.copy(shelf);
      else if (story < 6.65) {
        carryAlong([[1.8,0.26,1.8],[4,0.26,1.8]], phase(story, 6.12, 6.48));
        const carried = storyParcel.position.clone();
        storyParcel.position.copy(shelf).lerp(carried, phase(story, 6, 6.12)).lerp(bench, phase(story, 6.48, 6.65));
      } else if (story < 7.3) {
        carryAlong([[4,0.26,1.8],[2.8,0.26,1.8],[2.8,0.26,3.15],[1.55,0.03,3.15],[1.55,0.03,3.9]], phase(story, 6.85, 7.18));
        const carried = storyParcel.position.clone();
        cargo.getWorldPosition(storyParcel.position);
        const loaded = storyParcel.position.clone();
        storyParcel.position.copy(bench).lerp(carried, phase(story, 6.75, 6.85)).lerp(loaded, phase(story, 7.18, 7.3));
      } else if (story < 8.25) {
        cargo.getWorldPosition(storyParcel.position);
        storyParcel.quaternion.copy(vehicle.quaternion);
      } else {
        carryAlong([[7.8,0.03,1.05],[8.5,0.03,1.75],[9.6,0.03,1.75]], phase(story, 8.4, 8.8));
        const carried = storyParcel.position.clone();
        cargo.getWorldPosition(storyParcel.position);
        storyParcel.position.lerp(carried, phase(story, 8.25, 8.4)).lerp(doorstep, phase(story, 8.8, 9));
        torso.rotation.x = -phase(story, 8.8, 9) * 0.35;
      }
      if (story < 8.8) torso.rotation.x = 0;
    }
    renderer.render(scene, camera);
    if (
      camera.position.distanceTo(desiredCamera) > 0.005 ||
      target.distanceTo(desiredTarget) > 0.005 ||
      Math.abs(visualStory - (state.chapter ?? 0)) > 0.00001 ||
      Math.abs(visualShipment - state.shipmentProgress) > 0.00001 ||
      (operational && Math.abs(operationCart.position.x - cartTarget) > 0.005) ||
      Math.abs(roof.position.y - ((story === undefined ? state.roofOpen : step >= 3 && step <= 6) ? 4.7 : 0)) > 0.005
    )
      requestDraw();
  }
  function requestDraw() {
    if (!frame && !disposed && visible && !document.hidden)
      frame = requestAnimationFrame(draw);
  }
  function resize() {
    const w = host.clientWidth;
    const h = host.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    requestDraw();
  }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  const observer = new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    if (visible) requestDraw();
    else if (frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  });
  observer.observe(host);
  function down(e: PointerEvent) {
    if (e.pointerType === "touch") return;
    dragging = true;
    lastX = e.clientX;
    renderer.domElement.setPointerCapture(e.pointerId);
  }
  function move(e: PointerEvent) {
    if (!dragging) return;
    azimuth += (e.clientX - lastX) * 0.006;
    lastX = e.clientX;
    requestDraw();
  }
  function up() {
    dragging = false;
  }
  const canvas = renderer.domElement;
  canvas.addEventListener("pointerdown", down);
  canvas.addEventListener("pointermove", move);
  canvas.addEventListener("pointerup", up);
  canvas.addEventListener("pointercancel", up);
  document.addEventListener("visibilitychange", requestDraw);
  resize();
  return {
    update(next: SceneState) {
      state = next;
      requestDraw();
    },
    rotate(direction: number) {
      azimuth += direction * 0.32;
      requestDraw();
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", requestDraw);
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
      geometries.forEach((g) => g.dispose());
      Object.values(mats).forEach((m) => m.dispose());
      renderer.dispose();
      canvas.remove();
    },
  };
}
