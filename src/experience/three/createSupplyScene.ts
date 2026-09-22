import * as T from "three";

export interface SceneState {
  view: "network" | "warehouse" | "transport";
  roofOpen: boolean;
  received: boolean;
  shipmentProgress: number;
  motion: boolean;
  progress?: number;
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
    box(warehouse, x, 0.55, 2.35, 1.45, 0.85, 0.18, mats.dark);
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
    for (const z of [-4.8, 3.5]) {
      box(root, x, 0.8, z, 0.055, 1.6, 0.055, mats.dark);
      box(root, x + 0.15, 1.6, z, 0.35, 0.055, 0.12);
    }
  function truck() {
    const group = new T.Group();
    box(group, 0, 0.5, 0, 1.55, 0.75, 0.66);
    box(group, 1.02, 0.38, 0, 0.52, 0.53, 0.64, mats.blue);
    box(group, 1.08, 0.62, 0, 0.32, 0.12, 0.65, mats.glass);
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
    root.add(group);
    return group;
  }
  const dockTruck = truck();
  dockTruck.rotation.y = -Math.PI / 2;
  dockTruck.position.set(-3.7, 0.12, 3.2);
  const vehicle = truck();
  const route = tube(
    [
      [-5.8, 0.12, 3.4],
      [-5.8, 0.12, 4.8],
      [0, 0.12, 4.8],
      [6.8, 0.12, 4.8],
      [7.8, 0.12, 3.8],
      [7.8, 0.12, -1.7],
      [9.4, 0.12, -2.4],
    ],
    0.035,
    mats.line,
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

  let state = initial;
  let frame = 0;
  let visible = true;
  let disposed = false;
  let azimuth = 0;
  let dragging = false;
  let lastX = 0;
  let lastTime = 0;
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
    camera.position.lerp(desiredCamera, smooth);
    const desiredTarget = new T.Vector3(state.view === "transport" ? 3 : 0, 0, close ? -0.8 : 0);
    target.lerp(desiredTarget, smooth);
    camera.lookAt(target);
    roof.position.y = T.MathUtils.lerp(
      roof.position.y,
      state.roofOpen ? 4.7 : 0,
      smooth,
    );
    roof.visible = roof.position.y < 4.65;
    halo.visible = close || state.received;
    const p = Math.max(0.015, state.shipmentProgress * 0.97);
    const vehicleTarget = route.getPointAt(p);
    vehicle.position.lerp(vehicleTarget, smooth);
    const tangent = route.getTangentAt(p);
    vehicle.rotation.y = -Math.atan2(tangent.z, tangent.x);
    renderer.render(scene, camera);
    if (
      camera.position.distanceTo(desiredCamera) > 0.005 ||
      target.distanceTo(desiredTarget) > 0.005 ||
      vehicle.position.distanceTo(vehicleTarget) > 0.005 ||
      Math.abs(roof.position.y - (state.roofOpen ? 4.7 : 0)) > 0.005
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
