import * as THREE from "three";

export interface DetailedAnimalHandle {
  group: THREE.Group;
  kind: "ayam" | "domba" | "bebek";
  homeX: number;
  homeZ: number;
  phase: number;
  radius: number;
  legs: THREE.Object3D[];
  head: THREE.Object3D;
  tail?: THREE.Object3D;
  wings?: THREE.Object3D[];
}

export interface DetailedKoiHandle {
  group: THREE.Group;
  tail: THREE.Object3D;
  baseX: number;
  baseZ: number;
  phase: number;
  speed: number;
}

export interface ButterflyHandle {
  group: THREE.Group;
  leftWing: THREE.Object3D;
  rightWing: THREE.Object3D;
  homeX: number;
  homeY: number;
  homeZ: number;
  phase: number;
  radius: number;
}

const EYE_DARK = new THREE.MeshStandardMaterial({ color: "#19120e", roughness: 0.25 });
const EYE_HIGHLIGHT = new THREE.MeshBasicMaterial({ color: "#ffffff" });

function addAnimalEyes(parent: THREE.Group, dx: number, y: number, z: number, radius = 0.016) {
  [-dx, dx].forEach((ex) => {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(radius, 8, 8), EYE_DARK);
    eye.position.set(ex, y, z);
    const glint = new THREE.Mesh(new THREE.SphereGeometry(radius * 0.38, 6, 6), EYE_HIGHLIGHT);
    glint.position.set(ex + (ex > 0 ? 0.004 : -0.004), y + radius * 0.35, z + radius * 0.65);
    parent.add(eye, glint);
  });
}

export function buildDetailedSheep(
  homeX: number,
  homeZ: number,
  phase: number,
  radius = 0.72,
): DetailedAnimalHandle {
  const g = new THREE.Group();
  const woolMat = new THREE.MeshStandardMaterial({ color: "#faf5ea", roughness: 0.94 });
  const skinMat = new THREE.MeshStandardMaterial({ color: "#5d4030", roughness: 0.82 });
  const hoofMat = new THREE.MeshStandardMaterial({ color: "#2b1d15", roughness: 0.75 });
  const noseMat = new THREE.MeshStandardMaterial({ color: "#e5a6a6", roughness: 0.65 });
  const collarMat = new THREE.MeshStandardMaterial({ color: "#b64835", roughness: 0.65 });
  const bellMat = new THREE.MeshStandardMaterial({
    color: "#e2b254",
    roughness: 0.3,
    metalness: 0.7,
  });

  // Soft ground shadow
  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(0.32, 16),
    new THREE.MeshBasicMaterial({ color: 0x16241b, transparent: true, opacity: 0.22, depthWrite: false }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.015;
  g.add(shadow);

  // 4 Articulated Legs with dark hooves
  const legs: THREE.Object3D[] = [];
  const legCoords = [
    [-0.12, 0.14],
    [0.12, 0.14],
    [-0.12, -0.15],
    [0.12, -0.15],
  ];
  legCoords.forEach(([lx, lz]) => {
    const legPivot = new THREE.Group();
    legPivot.position.set(lx, 0.18, lz);
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.03, 0.14, 8), skinMat);
    leg.position.y = -0.07;
    leg.castShadow = true;
    const hoof = new THREE.Mesh(new THREE.CylinderGeometry(0.033, 0.038, 0.04, 8), hoofMat);
    hoof.position.y = -0.15;
    legPivot.add(leg, hoof);
    g.add(legPivot);
    legs.push(legPivot);
  });

  // Multi-puff sculpted wool fleece body
  const puffs = [
    { x: 0, y: 0.3, z: 0, r: 0.23, sx: 1.05, sy: 0.96, sz: 1.28 },
    { x: -0.11, y: 0.32, z: 0.08, r: 0.16, sx: 1, sy: 1, sz: 1 },
    { x: 0.11, y: 0.32, z: 0.08, r: 0.16, sx: 1, sy: 1, sz: 1 },
    { x: -0.1, y: 0.3, z: -0.12, r: 0.16, sx: 1, sy: 1, sz: 1 },
    { x: 0.1, y: 0.3, z: -0.12, r: 0.16, sx: 1, sy: 1, sz: 1 },
    { x: 0, y: 0.39, z: 0.02, r: 0.18, sx: 1.08, sy: 0.85, sz: 1.1 },
    { x: 0, y: 0.34, z: 0.18, r: 0.16, sx: 1, sy: 1, sz: 1 },
  ];
  puffs.forEach((p) => {
    const puff = new THREE.Mesh(new THREE.SphereGeometry(p.r, 12, 10), woolMat);
    puff.scale.set(p.sx, p.sy, p.sz);
    puff.position.set(p.x, p.y, p.z);
    puff.castShadow = true;
    g.add(puff);
  });

  // Fluffy wagging tail
  const tailPivot = new THREE.Group();
  tailPivot.position.set(0, 0.32, -0.28);
  const tail = new THREE.Mesh(new THREE.SphereGeometry(0.075, 8, 8), woolMat);
  tail.position.z = -0.04;
  tailPivot.add(tail);
  g.add(tailPivot);

  // Articulated Head + Snout + Drooping Ears + Wool Crest + Brass Collar Bell
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 0.37, 0.28);

  const cranium = new THREE.Mesh(new THREE.SphereGeometry(0.115, 12, 10), skinMat);
  cranium.scale.set(0.95, 0.95, 1.15);
  cranium.position.set(0, 0, 0.04);
  cranium.castShadow = true;

  const woolCap = new THREE.Mesh(new THREE.SphereGeometry(0.105, 10, 8), woolMat);
  woolCap.scale.set(1.02, 0.68, 0.95);
  woolCap.position.set(0, 0.085, 0.01);

  const snout = new THREE.Mesh(new THREE.SphereGeometry(0.068, 10, 8), skinMat);
  snout.scale.set(0.9, 0.82, 1.25);
  snout.position.set(0, -0.03, 0.14);

  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.02, 6, 6), noseMat);
  nose.position.set(0, -0.02, 0.22);

  [-1, 1].forEach((dir) => {
    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 6), skinMat);
    ear.scale.set(1.45, 0.48, 0.72);
    ear.position.set(dir * 0.115, 0.015, 0.02);
    ear.rotation.z = dir * -0.45;
    headGroup.add(ear);
  });

  addAnimalEyes(headGroup, 0.065, 0.025, 0.125, 0.017);

  // Ribbon collar & brass bell
  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.105, 0.016, 6, 16), collarMat);
  collar.rotation.x = Math.PI * 0.42;
  collar.position.set(0, -0.08, -0.04);
  const bell = new THREE.Mesh(new THREE.SphereGeometry(0.028, 8, 8), bellMat);
  bell.position.set(0, -0.14, 0.05);

  headGroup.add(cranium, woolCap, snout, nose, collar, bell);
  g.add(headGroup);

  g.position.set(homeX, 0, homeZ);
  return { group: g, kind: "domba", homeX, homeZ, phase, radius, legs, head: headGroup, tail: tailPivot };
}

export function buildDetailedChicken(
  homeX: number,
  homeZ: number,
  phase: number,
  radius = 0.68,
): DetailedAnimalHandle {
  const g = new THREE.Group();
  const featherMat = new THREE.MeshStandardMaterial({ color: "#cd6e35", roughness: 0.78 });
  const wingMat = new THREE.MeshStandardMaterial({ color: "#a55022", roughness: 0.8 });
  const tailMat = new THREE.MeshStandardMaterial({ color: "#2d4c3e", roughness: 0.7 });
  const combMat = new THREE.MeshStandardMaterial({ color: "#c7322d", roughness: 0.55 });
  const beakMat = new THREE.MeshStandardMaterial({ color: "#e8a538", roughness: 0.6 });
  const breastMat = new THREE.MeshStandardMaterial({ color: "#e8b982", roughness: 0.8 });

  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(0.2, 14),
    new THREE.MeshBasicMaterial({ color: 0x16241b, transparent: true, opacity: 0.22, depthWrite: false }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.015;
  g.add(shadow);

  // 2 Yellow Legs with 3-toed claws
  const legs: THREE.Object3D[] = [];
  [-0.055, 0.055].forEach((lx) => {
    const legPivot = new THREE.Group();
    legPivot.position.set(lx, 0.11, 0);
    const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.011, 0.095, 6), beakMat);
    shin.position.y = -0.048;
    const foot = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.012, 0.06), beakMat);
    foot.position.set(0, -0.098, 0.018);
    legPivot.add(shin, foot);
    g.add(legPivot);
    legs.push(legPivot);
  });

  // Sculpted plumed body & pale warm breast
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.135, 12, 10), featherMat);
  body.scale.set(0.88, 0.92, 1.24);
  body.position.set(0, 0.18, 0);
  body.castShadow = true;

  const breast = new THREE.Mesh(new THREE.SphereGeometry(0.105, 10, 8), breastMat);
  breast.scale.set(0.85, 0.9, 0.95);
  breast.position.set(0, 0.175, 0.065);
  g.add(body, breast);

  // Folded side wings
  const wings: THREE.Object3D[] = [];
  [-1, 1].forEach((dir) => {
    const wPivot = new THREE.Group();
    wPivot.position.set(dir * 0.105, 0.19, 0);
    const wing = new THREE.Mesh(new THREE.SphereGeometry(0.082, 10, 8), wingMat);
    wing.scale.set(0.35, 0.72, 1.28);
    wing.rotation.x = -0.15;
    wPivot.add(wing);
    g.add(wPivot);
    wings.push(wPivot);
  });

  // Layered arching tail feathers
  const tailGroup = new THREE.Group();
  tailGroup.position.set(0, 0.24, -0.14);
  [-0.22, 0, 0.22].forEach((rz, idx) => {
    const plume = new THREE.Mesh(
      new THREE.ConeGeometry(0.036, 0.16 + (idx === 1 ? 0.04 : 0), 6),
      idx === 1 ? tailMat : featherMat,
    );
    plume.position.set(rz * 0.14, 0.05, -0.04);
    plume.rotation.x = -0.68;
    plume.rotation.z = -rz;
    tailGroup.add(plume);
  });
  g.add(tailGroup);

  // Distinct neck & head + 3-lobed comb (jengger) + wattle + beak
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 0.28, 0.11);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.046, 0.065, 0.09, 10), featherMat);
  neck.position.set(0, -0.02, -0.01);
  neck.rotation.x = 0.2;

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.072, 12, 10), featherMat);
  head.position.set(0, 0.045, 0.02);
  head.castShadow = true;

  const beak = new THREE.Mesh(new THREE.ConeGeometry(0.022, 0.055, 6), beakMat);
  beak.rotation.x = Math.PI / 2;
  beak.position.set(0, 0.035, 0.102);

  // 3-lobed crimson comb
  [-0.015, 0.01, 0.032].forEach((cz, idx) => {
    const lobe = new THREE.Mesh(new THREE.SphereGeometry(0.022 - idx * 0.002, 7, 6), combMat);
    lobe.position.set(0, 0.118 - idx * 0.006, 0.025 - cz);
    headGroup.add(lobe);
  });

  // Twin crimson wattles below beak
  [-0.014, 0.014].forEach((wx) => {
    const wattle = new THREE.Mesh(new THREE.SphereGeometry(0.016, 6, 6), combMat);
    wattle.scale.set(0.8, 1.35, 0.8);
    wattle.position.set(wx, 0.0, 0.078);
    headGroup.add(wattle);
  });

  addAnimalEyes(headGroup, 0.048, 0.058, 0.065, 0.013);

  headGroup.add(neck, head, beak);
  g.add(headGroup);

  g.position.set(homeX, 0, homeZ);
  return { group: g, kind: "ayam", homeX, homeZ, phase, radius, legs, head: headGroup, tail: tailGroup, wings };
}

export function buildDetailedDuck(
  homeX: number,
  homeZ: number,
  phase: number,
  radius = 0.55,
): DetailedAnimalHandle {
  const g = new THREE.Group();
  const bodyMat = new THREE.MeshStandardMaterial({ color: "#f2ead9", roughness: 0.76 });
  const wingMat = new THREE.MeshStandardMaterial({ color: "#d5c7ab", roughness: 0.8 });
  const headGreenMat = new THREE.MeshStandardMaterial({ color: "#346b53", roughness: 0.6 });
  const billMat = new THREE.MeshStandardMaterial({ color: "#eb9b34", roughness: 0.55 });

  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(0.2, 14),
    new THREE.MeshBasicMaterial({ color: 0x16241b, transparent: true, opacity: 0.22, depthWrite: false }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.015;
  g.add(shadow);

  // 2 Orange Legs with flat webbed feet
  const legs: THREE.Object3D[] = [];
  [-0.06, 0.06].forEach((lx) => {
    const legPivot = new THREE.Group();
    legPivot.position.set(lx, 0.08, -0.01);
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.011, 0.07, 6), billMat);
    leg.position.y = -0.035;
    const web = new THREE.Mesh(new THREE.ConeGeometry(0.038, 0.015, 3), billMat);
    web.position.set(0, -0.07, 0.02);
    legPivot.add(leg, web);
    g.add(legPivot);
    legs.push(legPivot);
  });

  // Boat-shaped duck body + folded wings + tail tuft
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 10), bodyMat);
  body.scale.set(0.92, 0.78, 1.38);
  body.position.set(0, 0.145, 0);
  body.castShadow = true;

  const wings: THREE.Object3D[] = [];
  [-1, 1].forEach((dir) => {
    const wPivot = new THREE.Group();
    wPivot.position.set(dir * 0.105, 0.16, -0.01);
    const wing = new THREE.Mesh(new THREE.SphereGeometry(0.078, 10, 8), wingMat);
    wing.scale.set(0.32, 0.65, 1.35);
    wPivot.add(wing);
    g.add(wPivot);
    wings.push(wPivot);
  });

  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.042, 0.11, 6), wingMat);
  tail.rotation.x = -0.95;
  tail.position.set(0, 0.18, -0.19);
  g.add(body, tail);

  // Upright curved neck + glossy head + flattened orange bill
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 0.21, 0.12);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.056, 0.12, 10), bodyMat);
  neck.position.set(0, 0.02, 0);
  neck.rotation.x = 0.12;

  const neckRing = new THREE.Mesh(new THREE.TorusGeometry(0.039, 0.008, 6, 14), bodyMat);
  neckRing.rotation.x = Math.PI / 2;
  neckRing.position.set(0, 0.065, 0.01);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.068, 12, 10), headGreenMat);
  head.position.set(0, 0.11, 0.025);
  head.castShadow = true;

  const bill = new THREE.Mesh(new THREE.BoxGeometry(0.052, 0.022, 0.075), billMat);
  bill.position.set(0, 0.095, 0.1);

  addAnimalEyes(headGroup, 0.044, 0.12, 0.068, 0.012);

  headGroup.add(neck, neckRing, head, bill);
  g.add(headGroup);

  g.position.set(homeX, 0, homeZ);
  return { group: g, kind: "bebek", homeX, homeZ, phase, radius, legs, head: headGroup, tail, wings };
}

export function buildDetailedKoi(
  variantIdx: number,
  baseX: number,
  baseZ: number,
  phase: number,
  speed: number,
): DetailedKoiHandle {
  const g = new THREE.Group();
  const bodyHex = variantIdx % 2 === 0 ? "#f26a36" : "#fcf7ec";
  const patchHex = variantIdx % 2 === 0 ? "#fcf7ec" : "#e3542d";
  const bodyMat = new THREE.MeshStandardMaterial({ color: bodyHex, roughness: 0.42 });
  const patchMat = new THREE.MeshStandardMaterial({ color: patchHex, roughness: 0.45 });
  const finMat = new THREE.MeshStandardMaterial({
    color: "#fff8eb",
    roughness: 0.5,
    transparent: true,
    opacity: 0.88,
  });

  const body = new THREE.Mesh(new THREE.SphereGeometry(0.105, 12, 10), bodyMat);
  body.scale.set(0.62, 0.52, 1.9);

  // Calico spots + dorsal fin + pectoral fins
  const spot1 = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 6), patchMat);
  spot1.scale.set(0.85, 0.65, 1.3);
  spot1.position.set(0.01, 0.025, 0.04);

  const spot2 = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 6), patchMat);
  spot2.scale.set(0.8, 0.6, 1.1);
  spot2.position.set(-0.015, 0.022, -0.07);

  const dorsal = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.055, 0.12), finMat);
  dorsal.position.set(0, 0.06, -0.02);

  [-1, 1].forEach((dir) => {
    const pec = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.01, 0.055), finMat);
    pec.position.set(dir * 0.068, -0.01, 0.04);
    pec.rotation.y = dir * -0.4;
    g.add(pec);
  });

  // Articulated caudal tail fin
  const tailPivot = new THREE.Group();
  tailPivot.position.set(0, 0, -0.185);
  const upperTail = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.075, 0.11), finMat);
  upperTail.position.set(0, 0.022, -0.045);
  upperTail.rotation.x = 0.28;
  const lowerTail = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.065, 0.1), finMat);
  lowerTail.position.set(0, -0.02, -0.042);
  lowerTail.rotation.x = -0.28;
  tailPivot.add(upperTail, lowerTail);

  g.add(body, spot1, spot2, dorsal, tailPivot);
  g.position.set(baseX, -0.1, baseZ);

  return { group: g, tail: tailPivot, baseX, baseZ, phase, speed };
}

export function buildButterfly(
  colorHex: string,
  homeX: number,
  homeY: number,
  homeZ: number,
  phase: number,
  radius = 0.75,
): ButterflyHandle {
  const g = new THREE.Group();
  const bodyMat = new THREE.MeshStandardMaterial({ color: "#3d2d24", roughness: 0.7 });
  const wingMat = new THREE.MeshStandardMaterial({
    color: colorHex,
    roughness: 0.45,
    side: THREE.DoubleSide,
  });

  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.07, 6), bodyMat);
  body.rotation.x = Math.PI / 2;
  g.add(body);

  const makeWing = (dir: -1 | 1) => {
    const pivot = new THREE.Group();
    const upper = new THREE.Mesh(new THREE.CircleGeometry(0.048, 8), wingMat);
    upper.rotation.x = -Math.PI / 2;
    upper.position.set(dir * 0.04, 0, 0.015);
    const lower = new THREE.Mesh(new THREE.CircleGeometry(0.032, 8), wingMat);
    lower.rotation.x = -Math.PI / 2;
    lower.position.set(dir * 0.03, 0, -0.028);
    pivot.add(upper, lower);
    return pivot;
  };

  const leftWing = makeWing(-1);
  const rightWing = makeWing(1);
  g.add(leftWing, rightWing);
  g.position.set(homeX, homeY, homeZ);

  return { group: g, leftWing, rightWing, homeX, homeY, homeZ, phase, radius };
}

export function animateDetailedAnimals(animals: DetailedAnimalHandle[], elapsed: number): void {
  for (const a of animals) {
    const angle = elapsed * 0.42 + a.phase;
    const nx = a.homeX + Math.cos(angle) * a.radius;
    const nz = a.homeZ + Math.sin(angle * 0.85) * a.radius;
    const dx = nx - a.group.position.x;
    const dz = nz - a.group.position.z;
    a.group.position.x = nx;
    a.group.position.z = nz;
    if (Math.hypot(dx, dz) > 0.0005) {
      a.group.rotation.y = Math.atan2(dx, dz);
    }

    const stride = elapsed * (a.kind === "domba" ? 5.5 : 7.5) + a.phase;
    a.legs.forEach((leg, idx) => {
      const sign = idx % 2 === 0 ? 1 : -1;
      leg.rotation.x = Math.sin(stride) * 0.42 * sign;
    });

    if (a.kind === "domba") {
      a.group.position.y = Math.abs(Math.sin(stride)) * 0.018;
      a.head.rotation.x = Math.sin(elapsed * 1.6 + a.phase) * 0.14;
      if (a.tail) a.tail.rotation.y = Math.sin(elapsed * 7 + a.phase) * 0.35;
    } else if (a.kind === "ayam") {
      a.group.position.y = Math.abs(Math.sin(stride)) * 0.028;
      a.head.rotation.x = Math.sin(elapsed * 5.2 + a.phase) * 0.16;
      a.wings?.forEach((w, idx) => {
        w.rotation.z = (idx === 0 ? -1 : 1) * (0.06 + Math.abs(Math.sin(stride)) * 0.12);
      });
    } else {
      // Duck waddle roll
      a.group.position.y = Math.abs(Math.sin(stride)) * 0.022;
      a.group.rotation.z = Math.sin(stride) * 0.08;
      a.head.rotation.x = Math.sin(elapsed * 3.4 + a.phase) * 0.1;
    }
  }
}

export function animateDetailedKoi(koiFish: DetailedKoiHandle[], elapsed: number): void {
  for (const fish of koiFish) {
    const loopZ = ((fish.baseZ + elapsed * fish.speed + 10) % 20) - 10;
    const wiggleX = Math.sin(elapsed * 3.5 + fish.phase) * 0.14;
    fish.group.position.x = fish.baseX + wiggleX;
    fish.group.position.z = loopZ;
    fish.group.rotation.y = Math.sin(elapsed * 4.5 + fish.phase) * 0.22;
    fish.tail.rotation.y = Math.sin(elapsed * 9.0 + fish.phase) * 0.48;
  }
}

export function animateButterflies(butterflies: ButterflyHandle[], elapsed: number): void {
  for (const b of butterflies) {
    const t = elapsed * 1.15 + b.phase;
    const nx = b.homeX + Math.sin(t) * b.radius;
    const nz = b.homeZ + Math.sin(t * 2) * b.radius * 0.55;
    const dx = nx - b.group.position.x;
    const dz = nz - b.group.position.z;
    b.group.position.set(nx, b.homeY + Math.sin(elapsed * 2.8 + b.phase) * 0.16, nz);
    if (Math.hypot(dx, dz) > 0.0005) {
      b.group.rotation.y = Math.atan2(dx, dz);
    }
    const flap = Math.sin(elapsed * 16 + b.phase) * 0.72;
    b.leftWing.rotation.z = flap;
    b.rightWing.rotation.z = -flap;
  }
}
