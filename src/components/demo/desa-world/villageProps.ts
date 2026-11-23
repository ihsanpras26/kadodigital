import * as THREE from "three";
import type { DesaWorldPayload } from "@/data/desaWorldData";
import { buildChibiCharacter, type ChibiRig } from "./chibiBuilder";
import {
  createDirtPathTexture,
  createRadialGlowTexture,
  createRiverWaterTexture,
  createSawahTexture,
  createSignTextTexture,
  createSoftCircleTexture,
  createVillageGrassTexture,
  createWoodPlankTexture,
} from "./textures";

export interface KoiFishHandle {
  group: THREE.Group;
  baseX: number;
  baseZ: number;
  phase: number;
  speed: number;
}

export interface AnimalHandle {
  group: THREE.Group;
  kind: "ayam" | "domba" | "bebek";
  homeX: number;
  homeZ: number;
  phase: number;
  radius: number;
}

export interface SwayHandle {
  object: THREE.Object3D;
  baseRotZ: number;
  baseRotX: number;
  speed: number;
  amp: number;
  phase: number;
}

export interface BalloonHandle {
  mesh: THREE.Object3D;
  baseY: number;
  phase: number;
}

export interface VillageEnvironmentHandles {
  waterTexture: THREE.CanvasTexture;
  sawahTexture: THREE.CanvasTexture;
  gateDoors: {
    left: THREE.Group;
    right: THREE.Group;
  };
  swaying: SwayHandle[];
  koiFish: KoiFishHandle[];
  animals: AnimalHandle[];
  balloons: BalloonHandle[];
  lanternShadeMats: THREE.MeshStandardMaterial[];
  lanternGlowMeshes: THREE.Mesh[];
  petals: {
    points: THREE.Points;
    velocities: Float32Array;
  };
  fireflies: {
    points: THREE.Points;
    material: THREE.PointsMaterial;
    phases: Float32Array;
    basePositions: Float32Array;
  };
  celebrantRigs: ChibiRig[];
  stationMeshes: Record<string, THREE.Object3D>;
  disposeExtras: () => void;
}

export function buildVillageEnvironment(
  scene: THREE.Scene,
  payload: DesaWorldPayload,
): VillageEnvironmentHandles {
  const worldGroup = new THREE.Group();
  scene.add(worldGroup);

  const grassTex = createVillageGrassTexture();
  const dirtTex = createDirtPathTexture();
  const waterTexture = createRiverWaterTexture();
  const sawahTexture = createSawahTexture();
  const woodTex = createWoodPlankTexture("#8a4f2d", "#5b2f17");
  const darkWoodTex = createWoodPlankTexture("#5c3119", "#3c1e0e");
  const bambooTex = createWoodPlankTexture("#b99652", "#8e6d32");
  const glowTex = createRadialGlowTexture();
  const circleTex = createSoftCircleTexture();
  const signTex = createSignTextTexture(payload.gapuraTitle, payload.gapuraSubtitle);

  const grassMat = new THREE.MeshStandardMaterial({ map: grassTex, roughness: 0.92 });
  const dirtMat = new THREE.MeshStandardMaterial({ map: dirtTex, roughness: 0.95 });
  const waterMat = new THREE.MeshStandardMaterial({
    map: waterTexture,
    roughness: 0.25,
    metalness: 0.12,
    transparent: true,
    opacity: 0.94,
  });
  const sawahMat = new THREE.MeshStandardMaterial({
    map: sawahTexture,
    roughness: 0.35,
    metalness: 0.1,
  });
  const woodMat = new THREE.MeshStandardMaterial({ map: woodTex, roughness: 0.78 });
  const darkWoodMat = new THREE.MeshStandardMaterial({ map: darkWoodTex, roughness: 0.8 });
  const bambooMat = new THREE.MeshStandardMaterial({ map: bambooTex, roughness: 0.76 });
  const terracottaMat = new THREE.MeshStandardMaterial({ color: "#b65439", roughness: 0.78 });
  const roofDarkMat = new THREE.MeshStandardMaterial({ color: "#8c3c27", roughness: 0.8 });
  const bundMat = new THREE.MeshStandardMaterial({ color: "#5f8c44", roughness: 0.9 });
  const barkMat = new THREE.MeshStandardMaterial({ color: "#68432b", roughness: 0.88 });
  const creamMat = new THREE.MeshStandardMaterial({ color: "#f6efe2", roughness: 0.75 });
  const goldMat = new THREE.MeshStandardMaterial({ color: "#dfa84d", roughness: 0.45, metalness: 0.18 });
  const stoneMat = new THREE.MeshStandardMaterial({ color: "#9ba39e", roughness: 0.85 });

  const swaying: SwayHandle[] = [];
  const koiFish: KoiFishHandle[] = [];
  const animals: AnimalHandle[] = [];
  const balloons: BalloonHandle[] = [];
  const lanternShadeMats: THREE.MeshStandardMaterial[] = [];
  const lanternGlowMeshes: THREE.Mesh[] = [];
  const celebrantRigs: ChibiRig[] = [];
  const stationMeshes: Record<string, THREE.Object3D> = {};

  // ==========================================================
  // 1. TERRAIN & DIAGONAL-FRAMED VILLAGE RIVER (center at x=-5.4)
  // ==========================================================
  // Outer earth plinth skirt
  const plinth = new THREE.Mesh(
    new THREE.BoxGeometry(36, 1.4, 34),
    new THREE.MeshStandardMaterial({ color: "#523a28", roughness: 0.95 }),
  );
  plinth.position.set(0, -0.78, 0);
  worldGroup.add(plinth);

  // Left bank (-18 .. -6.5) -> width 11.5, center -12.25
  const leftBank = new THREE.Mesh(new THREE.BoxGeometry(11.5, 0.24, 34), grassMat);
  leftBank.position.set(-12.25, -0.12, 0);
  leftBank.receiveShadow = true;
  worldGroup.add(leftBank);

  // Main village meadow (-4.3 .. +18) -> width 22.3, center +6.85
  const rightMeadow = new THREE.Mesh(new THREE.BoxGeometry(22.3, 0.24, 34), grassMat);
  rightMeadow.position.set(6.85, -0.12, 0);
  rightMeadow.receiveShadow = true;
  worldGroup.add(rightMeadow);

  // Riverbed & water (x in [-6.5 .. -4.3])
  const riverBed = new THREE.Mesh(
    new THREE.PlaneGeometry(2.6, 34),
    new THREE.MeshStandardMaterial({ color: "#224644", roughness: 0.95 }),
  );
  riverBed.rotation.x = -Math.PI / 2;
  riverBed.position.set(-5.4, -0.22, 0);
  worldGroup.add(riverBed);

  const riverSurface = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 34), waterMat);
  riverSurface.rotation.x = -Math.PI / 2;
  riverSurface.position.set(-5.4, -0.07, 0);
  riverSurface.receiveShadow = true;
  worldGroup.add(riverSurface);

  // Riverbank pebbles & lotus lily pads
  const lilyMat = new THREE.MeshStandardMaterial({ color: "#3d854b", roughness: 0.72 });
  const lotusMat = new THREE.MeshStandardMaterial({ color: "#f39eb6", roughness: 0.6 });
  for (let i = 0; i < 18; i++) {
    const zPos = -11 + i * 1.3;
    const bankSide = i % 2 === 0 ? -6.38 : -4.42;
    const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.16 + (i % 3) * 0.06, 0), stoneMat);
    rock.scale.set(1.2, 0.65, 1.0);
    rock.position.set(bankSide, 0.02, zPos);
    worldGroup.add(rock);

    if (Math.abs(zPos - 2.2) > 1.7 && i % 3 === 0) {
      const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.025, 14), lilyMat);
      pad.position.set(-5.4 + ((i % 5) - 2) * 0.22, -0.05, zPos);
      worldGroup.add(pad);
      if (i % 6 === 0) {
        const lotus = new THREE.Mesh(new THREE.SphereGeometry(0.11, 8, 6), lotusMat);
        lotus.scale.set(1, 0.75, 1);
        lotus.position.set(pad.position.x + 0.05, 0.0, pad.position.z);
        worldGroup.add(lotus);
      }
    }
  }

  // Swimming Koi Fish in stream
  const koiOrangeMat = new THREE.MeshStandardMaterial({ color: "#f06a38", roughness: 0.45 });
  for (let i = 0; i < 4; i++) {
    const koiGroup = new THREE.Group();
    const fishBody = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 8), koiOrangeMat);
    fishBody.scale.set(0.65, 0.5, 1.8);
    const tail = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.14, 4), creamMat);
    tail.rotation.x = -Math.PI / 2;
    tail.position.z = -0.2;
    koiGroup.add(fishBody, tail);
    const baseZ = -6 + i * 4.5;
    const baseX = -5.4 + (i % 2 === 0 ? -0.35 : 0.35);
    koiGroup.position.set(baseX, -0.1, baseZ);
    worldGroup.add(koiGroup);
    koiFish.push({ group: koiGroup, baseX, baseZ, phase: i * 1.7, speed: 0.7 + i * 0.15 });
  }

  // ==========================================================
  // 2. STEPPED SAWAH TERASERING (Green & Golden Rice Terraces)
  // ==========================================================
  const addSawahTerrace = (x: number, z: number, w: number, d: number, y: number) => {
    const terraceGroup = new THREE.Group();
    const bund = new THREE.Mesh(new THREE.BoxGeometry(w, 0.26, d), bundMat);
    bund.position.set(x, y, z);
    bund.receiveShadow = true;
    bund.castShadow = true;

    const pool = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.32, d - 0.32), sawahMat);
    pool.rotation.x = -Math.PI / 2;
    pool.position.set(x, y + 0.138, z);

    terraceGroup.add(bund, pool);

    // Lush rows of rice stalks
    const cols = Math.max(4, Math.floor(w / 0.85));
    const rows = Math.max(3, Math.floor(d / 0.85));
    const stalkMat = new THREE.MeshStandardMaterial({
      color: y > 0.45 ? "#7ab849" : "#65a344",
      roughness: 0.85,
    });
    const tipMat = new THREE.MeshStandardMaterial({
      color: "#d4b44a",
      roughness: 0.78,
    });

    for (let cx = 0; cx < cols; cx++) {
      for (let cz = 0; cz < rows; cz++) {
        if ((cx + cz) % 2 !== 0) continue;
        const sx = x - (w - 0.7) / 2 + cx * ((w - 0.7) / Math.max(1, cols - 1));
        const sz = z - (d - 0.7) / 2 + cz * ((d - 0.7) / Math.max(1, rows - 1));
        const stalk = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.38, 5), stalkMat);
        stalk.position.set(sx, y + 0.3, sz);
        const tip = new THREE.Mesh(new THREE.SphereGeometry(0.055, 6, 5), tipMat);
        tip.position.set(sx, y + 0.48, sz);
        terraceGroup.add(stalk, tip);
      }
    }

    worldGroup.add(terraceGroup);
  };

  // Back hillside stepped sawah behind Cerita & Pendopo (z < -6)
  addSawahTerrace(-1.5, -7.8, 9.5, 2.8, 0.14);
  addSawahTerrace(-1.0, -10.5, 11.2, 2.7, 0.42);
  addSawahTerrace(0.2, -13.1, 13.0, 2.6, 0.72);
  // Left hillside sawah beyond entry path
  addSawahTerrace(-11.4, -4.5, 6.2, 7.2, 0.14);
  addSawahTerrace(-13.8, -4.5, 3.6, 8.8, 0.44);

  // Far misty mountain silhouettes on outer horizon for depth
  const mtnMat = new THREE.MeshStandardMaterial({ color: "#5e8772", roughness: 0.95 });
  const mtnCoords = [
    { x: -13, z: -18, r: 6.5, h: 6.8 },
    { x: -2, z: -20, r: 8.2, h: 8.4 },
    { x: 11, z: -18.5, r: 7.0, h: 6.2 },
  ];
  mtnCoords.forEach((m) => {
    const peak = new THREE.Mesh(new THREE.ConeGeometry(m.r, m.h, 7), mtnMat);
    peak.position.set(m.x, m.h * 0.42, m.z);
    worldGroup.add(peak);
  });

  // ==========================================================
  // 3. VILLAGE FOOTPATHS & KAMBOJA PETAL HEART
  // ==========================================================
  const addPathRect = (x: number, z: number, w: number, d: number, rotY = 0) => {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, d), dirtMat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.rotation.z = rotY;
    mesh.position.set(x, 0.012, z);
    mesh.receiveShadow = true;
    worldGroup.add(mesh);
  };

  // Entry path (left bank -> gate -> bridge)
  addPathRect(-9.2, 2.2, 6.0, 1.85);
  // Central main walkway from bridge eastward past plaza toward Galeri
  addPathRect(1.5, 2.2, 11.8, 1.9);
  // Cross walkway northward past Kado & Pendopo
  addPathRect(2.1, -0.6, 1.75, 6.8);
  // Branch to Pendopo Acara
  addPathRect(4.5, -3.5, 5.2, 1.75);
  // Branch to Cerita & Bale Ucapan
  addPathRect(-2.4, -0.5, 1.5, 5.4);

  // Kamboja & Melati Heart Petal Inlay in village plaza
  const petalPinkMat = new THREE.MeshStandardMaterial({ color: "#e88a93", roughness: 0.75 });
  const petalWhiteMat = new THREE.MeshStandardMaterial({ color: "#fff8ec", roughness: 0.7 });
  const heartCenter = { x: 1.65, z: 1.1 };
  for (let i = 0; i < 20; i++) {
    const t = (i / 20) * Math.PI * 2;
    const hx = 0.045 * 16 * Math.pow(Math.sin(t), 3);
    const hz =
      -0.045 *
      (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    const petal = new THREE.Mesh(
      new THREE.CylinderGeometry(0.085, 0.085, 0.02, 7),
      i % 2 === 0 ? petalPinkMat : petalWhiteMat,
    );
    petal.position.set(heartCenter.x + hx, 0.02, heartCenter.z + hz);
    worldGroup.add(petal);
  }

  // ==========================================================
  // 4. BAMBOO & TEAK ARCHED BRIDGE (at x=-5.4, z=2.2)
  // ==========================================================
  const bridgeGroup = new THREE.Group();
  bridgeGroup.position.set(-5.4, 0, 2.2);
  worldGroup.add(bridgeGroup);

  const plankCount = 13;
  for (let i = 0; i < plankCount; i++) {
    const frac = i / (plankCount - 1); // 0 .. 1
    const bx = -1.5 + frac * 3.0;
    const archY = Math.sin(frac * Math.PI) * 0.28 + 0.04;
    const plank = new THREE.Mesh(new THREE.BoxGeometry(0.21, 0.09, 1.75), woodMat);
    plank.position.set(bx, archY, 0);
    plank.castShadow = true;
    plank.receiveShadow = true;
    bridgeGroup.add(plank);
  }

  // Bamboo handrails on both sides of bridge
  [-0.86, 0.86].forEach((rz) => {
    [-1.4, 0, 1.4].forEach((px, idx) => {
      const py = idx === 1 ? 0.56 : 0.34;
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.06, 0.62, 8), bambooMat);
      post.position.set(px, py, rz);
      post.castShadow = true;
      bridgeGroup.add(post);

      if (idx !== 1) {
        const cap = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), creamMat);
        cap.position.set(px, py + 0.33, rz);
        bridgeGroup.add(cap);
      }
    });
    const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 3.0, 8), bambooMat);
    rail.rotation.z = Math.PI / 2;
    rail.position.set(0, 0.68, rz);
    bridgeGroup.add(rail);
  });

  // ==========================================================
  // 5. GAPURA DESA NUSANTARA + SWINGING WOODEN DOORS (-7.3, 2.2)
  // ==========================================================
  const gapuraGroup = new THREE.Group();
  gapuraGroup.position.set(-7.3, 0, 2.2);
  worldGroup.add(gapuraGroup);

  // Two carved teak pillars
  [-1.08, 1.08].forEach((pz) => {
    const stoneBase = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.25, 0.42), stoneMat);
    stoneBase.position.set(0, 0.12, pz);
    const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.24, 2.35, 0.24), darkWoodMat);
    pillar.position.set(0, 1.28, pz);
    pillar.castShadow = true;
    gapuraGroup.add(stoneBase, pillar);
  });

  // Crossbeam & tiered terracotta Javanese roof
  const beam = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.24, 2.65), woodMat);
  beam.position.set(0, 2.35, 0);
  beam.castShadow = true;
  gapuraGroup.add(beam);

  const roofLower = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.22, 3.1), terracottaMat);
  roofLower.position.set(0, 2.62, 0);
  roofLower.castShadow = true;
  const roofUpper = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.9, 0.56, 4), roofDarkMat);
  roofUpper.rotation.y = Math.PI / 4;
  roofUpper.scale.set(0.75, 1, 2.15);
  roofUpper.position.set(0, 2.98, 0);
  roofUpper.castShadow = true;
  gapuraGroup.add(roofLower, roofUpper);

  // Janur & Melati garland accents
  for (let i = -4; i <= 4; i++) {
    const flower = new THREE.Mesh(
      new THREE.SphereGeometry(0.075, 8, 8),
      i % 2 === 0 ? creamMat : goldMat,
    );
    flower.position.set(-0.22, 2.24 - Math.cos(i * 0.35) * 0.1, i * 0.24);
    gapuraGroup.add(flower);
  }

  // Hanging Nameplate on Gapura facing incoming camera
  const signMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.56, 1.56),
    new THREE.MeshStandardMaterial({ map: signTex, roughness: 0.65 }),
  );
  signMesh.rotation.y = -Math.PI / 2; // make texture legible when approached
  signMesh.position.set(-0.26, 2.02, 0);
  // Wait: BoxGeometry faces: +/-X use signTex! So don't rotate Y, orient flat face toward -X!
  signMesh.rotation.y = 0;
  gapuraGroup.add(signMesh);

  // Double Hinged Doors
  const makeGateDoor = (hingeZ: number, leafDir: number) => {
    const pivot = new THREE.Group();
    pivot.position.set(0, 0, hingeZ);
    const frame = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.35, 0.86), terracottaMat);
    frame.position.set(0, 0.72, leafDir * 0.44);
    frame.castShadow = true;
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.14, 0.76), bambooMat);
    bar.position.set(0, 0.95, leafDir * 0.44);
    pivot.add(frame, bar);
    gapuraGroup.add(pivot);
    return pivot;
  };
  const leftGateDoor = makeGateDoor(-0.92, 1);
  const rightGateDoor = makeGateDoor(0.92, -1);

  // ==========================================================
  // 6. NEAT BAMBOO FENCES ALONG RIVERBANK & GARDEN
  // ==========================================================
  const addBambooFence = (x1: number, z1: number, x2: number, z2: number) => {
    const dx = x2 - x1;
    const dz = z2 - z1;
    const len = Math.hypot(dx, dz);
    const angle = Math.atan2(dx, dz);
    const fence = new THREE.Group();
    fence.position.set((x1 + x2) / 2, 0, (z1 + z2) / 2);
    fence.rotation.y = angle;

    const posts = Math.max(2, Math.round(len / 0.85) + 1);
    for (let i = 0; i < posts; i++) {
      const pz = -len / 2 + (i / (posts - 1)) * len;
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.054, 0.62, 7), bambooMat);
      post.position.set(0, 0.31, pz);
      post.castShadow = true;
      fence.add(post);
    }
    [0.24, 0.48].forEach((ry) => {
      const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, len, 6), bambooMat);
      rail.rotation.x = Math.PI / 2;
      rail.position.y = ry;
      fence.add(rail);
    });
    worldGroup.add(fence);
  };

  addBambooFence(-6.6, -5.8, -6.6, 0.9);
  addBambooFence(-6.6, 3.5, -6.6, 8.6);
  addBambooFence(-4.2, -5.8, -4.2, 0.9);
  addBambooFence(-4.2, 3.5, -4.2, 8.6);
  addBambooFence(-4.2, -5.8, 8.8, -5.8);
  addBambooFence(-4.2, 8.6, 8.8, 8.6);

  // ==========================================================
  // 7. TROPICAL INDONESIAN FLORA (Palms, Banyan, Banana, Bamboo)
  // ==========================================================
  const foliageDarkMat = new THREE.MeshStandardMaterial({ color: "#346c3e", roughness: 0.82 });
  const foliageMidMat = new THREE.MeshStandardMaterial({ color: "#4c8e4b", roughness: 0.8 });
  const foliageBrightMat = new THREE.MeshStandardMaterial({ color: "#72b04d", roughness: 0.78 });
  const palmLeafMat = new THREE.MeshStandardMaterial({ color: "#529847", roughness: 0.76 });

  const addCoconutPalm = (x: number, z: number, height = 3.4, lean = 0.14) => {
    const palm = new THREE.Group();
    palm.position.set(x, 0, z);

    const segs = 6;
    for (let s = 0; s < segs; s++) {
      const y = (s + 0.5) * (height / segs);
      const xOff = Math.pow(s / segs, 1.5) * lean * 2.2;
      const seg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.13 - s * 0.01, 0.16 - s * 0.01, height / segs + 0.06, 8),
        barkMat,
      );
      seg.position.set(xOff, y, 0);
      seg.rotation.z = -lean * (s / segs);
      seg.castShadow = true;
      palm.add(seg);
    }

    const crown = new THREE.Group();
    crown.position.set(lean * 2.2, height + 0.05, 0);
    for (let f = 0; f < 6; f++) {
      const frondGroup = new THREE.Group();
      frondGroup.rotation.y = (f / 6) * Math.PI * 2;
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.06, 1.55), palmLeafMat);
      blade.position.set(0, -0.08, 0.78);
      blade.rotation.x = 0.34;
      blade.castShadow = true;
      frondGroup.add(blade);
      crown.add(frondGroup);
    }
    for (let c = 0; c < 3; c++) {
      const nut = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 8, 8),
        new THREE.MeshStandardMaterial({ color: "#7a5329", roughness: 0.75 }),
      );
      nut.position.set(Math.cos(c * 2.1) * 0.14, -0.14, Math.sin(c * 2.1) * 0.14);
      crown.add(nut);
    }
    palm.add(crown);
    worldGroup.add(palm);

    swaying.push({
      object: crown,
      baseRotZ: 0,
      baseRotX: 0,
      speed: 1.4,
      amp: 0.055,
      phase: x * 0.7 + z * 0.5,
    });
  };

  const addTropicalTree = (x: number, z: number, scale = 1.0) => {
    const tree = new THREE.Group();
    tree.position.set(x, 0, z);
    tree.scale.setScalar(scale);

    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.24, 1.15, 8), barkMat);
    trunk.position.y = 0.55;
    trunk.castShadow = true;
    tree.add(trunk);

    const canopy1 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.86, 1), foliageDarkMat);
    canopy1.position.set(0, 1.45, 0);
    canopy1.castShadow = true;
    const canopy2 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.68, 1), foliageMidMat);
    canopy2.position.set(0.28, 1.85, 0.16);
    canopy2.castShadow = true;
    const canopy3 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.56, 1), foliageBrightMat);
    canopy3.position.set(-0.24, 2.02, -0.12);
    canopy3.castShadow = true;

    tree.add(canopy1, canopy2, canopy3);
    worldGroup.add(tree);

    swaying.push({
      object: tree,
      baseRotZ: 0,
      baseRotX: 0,
      speed: 1.1,
      amp: 0.025,
      phase: x + z,
    });
  };

  const addBambooCluster = (x: number, z: number) => {
    const clump = new THREE.Group();
    clump.position.set(x, 0, z);
    const stalkGreen = new THREE.MeshStandardMaterial({ color: "#79a84d", roughness: 0.72 });
    const offsets = [
      { dx: -0.15, dz: -0.1, h: 2.4, r: 0.08 },
      { dx: 0.14, dz: 0.08, h: 2.8, r: -0.07 },
      { dx: 0.02, dz: -0.18, h: 2.1, r: 0.04 },
    ];
    offsets.forEach((o) => {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.065, o.h, 7), stalkGreen);
      pole.position.set(o.dx, o.h / 2, o.dz);
      pole.rotation.z = o.r;
      pole.castShadow = true;
      const tuft = new THREE.Mesh(new THREE.DodecahedronGeometry(0.32, 0), foliageBrightMat);
      tuft.scale.set(1.2, 0.65, 1.2);
      tuft.position.set(o.dx - o.r * 1.1, o.h, o.dz);
      clump.add(pole, tuft);
    });
    worldGroup.add(clump);
  };

  const addFlowerShrub = (x: number, z: number, bloomColor: string) => {
    const bush = new THREE.Group();
    bush.position.set(x, 0, z);
    const leaves = new THREE.Mesh(new THREE.DodecahedronGeometry(0.32, 0), foliageMidMat);
    leaves.scale.set(1.2, 0.75, 1.2);
    leaves.position.y = 0.2;
    bush.add(leaves);
    const bMat = new THREE.MeshStandardMaterial({ color: bloomColor, roughness: 0.6 });
    for (let i = 0; i < 4; i++) {
      const f = new THREE.Mesh(new THREE.SphereGeometry(0.07, 7, 6), bMat);
      f.position.set(Math.cos(i * 1.6) * 0.22, 0.32 + (i % 2) * 0.06, Math.sin(i * 1.6) * 0.22);
      bush.add(f);
    }
    worldGroup.add(bush);
  };

  // Perimeter palms & trees around river, gate & village edges
  addCoconutPalm(-8.6, 5.4, 3.2, 0.15);
  addCoconutPalm(-7.8, -1.5, 3.5, -0.12);
  addCoconutPalm(8.4, -4.4, 3.6, -0.15);
  addCoconutPalm(9.2, 1.2, 3.4, 0.14);
  addCoconutPalm(5.6, 7.6, 3.3, -0.1);
  addCoconutPalm(-1.2, 7.8, 3.1, 0.12);

  addTropicalTree(-9.6, 7.4, 1.05);
  addTropicalTree(-3.4, 7.4, 0.95);
  addTropicalTree(0.4, 7.2, 1.05);
  addTropicalTree(8.5, 6.2, 1.1);
  addTropicalTree(9.6, -1.2, 1.0);
  addTropicalTree(-8.4, -7.8, 1.15);
  addTropicalTree(6.8, -7.6, 1.12);

  addBambooCluster(-7.8, 4.1);
  addBambooCluster(-3.8, -4.8);
  addBambooCluster(8.9, 3.8);
  addBambooCluster(9.0, -5.2);

  addFlowerShrub(-6.2, 1.0, "#f28c9c");
  addFlowerShrub(-6.2, 3.4, "#fff6dd");
  addFlowerShrub(2.5, 3.1, "#e96e8a");
  addFlowerShrub(4.6, -2.0, "#fff5db");
  addFlowerShrub(-0.9, -3.1, "#f4978e");

  // ==========================================================
  // 8. WARM VILLAGE LANTERNS (Emissive Glass + Additive Ground Pools)
  // ==========================================================
  const addLanternPost = (x: number, z: number) => {
    const postGroup = new THREE.Group();
    postGroup.position.set(x, 0, z);

    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.07, 1.28, 7), darkWoodMat);
    pole.position.y = 0.64;
    pole.castShadow = true;
    postGroup.add(pole);

    const shadeMat = new THREE.MeshStandardMaterial({
      color: "#fff2c9",
      emissive: new THREE.Color("#ffb852"),
      emissiveIntensity: 0.72,
      roughness: 0.45,
    });
    lanternShadeMats.push(shadeMat);

    const bulb = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.28, 0.24), shadeMat);
    bulb.position.y = 1.38;
    postGroup.add(bulb);

    const cap = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.16, 4), roofDarkMat);
    cap.rotation.y = Math.PI / 4;
    cap.position.y = 1.59;
    postGroup.add(cap);

    const glowMat = new THREE.MeshBasicMaterial({
      map: glowTex,
      transparent: true,
      opacity: 0.48,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const glowPool = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 2.35), glowMat);
    glowPool.rotation.x = -Math.PI / 2;
    glowPool.position.y = 0.025;
    lanternGlowMeshes.push(glowPool);
    postGroup.add(glowPool);

    worldGroup.add(postGroup);
  };

  [
    { x: -6.9, z: 0.9 },
    { x: -6.9, z: 3.5 },
    { x: -3.9, z: 0.9 },
    { x: -3.9, z: 3.5 },
    { x: 0.4, z: 3.3 },
    { x: 4.5, z: 3.3 },
    { x: 3.1, z: -0.9 },
    { x: 4.9, z: -4.6 },
    { x: -1.4, z: -1.8 },
  ].forEach((p) => addLanternPost(p.x, p.z));

  // ==========================================================
  // 9. SIX INTERACTIVE 3D STATIONS (EXACT COORDINATE SYNC)
  // ==========================================================

  // Station 1: SURAT (x: 3.4, z: 2.2) — Carved Teak Mailbox + Protruding Cream Letter
  {
    const st = new THREE.Group();
    st.position.set(3.4, 0, 2.2);
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.82, 8), darkWoodMat);
    post.position.y = 0.41;
    const box = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.42, 0.72), terracottaMat);
    box.position.y = 0.96;
    box.castShadow = true;
    const boxRoof = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.76, 10, 1, false, 0, Math.PI), roofDarkMat);
    boxRoof.rotation.z = Math.PI / 2;
    boxRoof.rotation.y = Math.PI / 2;
    boxRoof.position.y = 1.15;
    const envelope = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.04, 0.24), creamMat);
    envelope.position.set(0, 0.96, 0.39);
    envelope.rotation.x = 0.15;
    const wax = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.02, 10), goldMat);
    wax.position.set(0, 0.99, 0.42);
    st.add(post, box, boxRoof, envelope, wax);
    worldGroup.add(st);
    stationMeshes.surat = st;
  }

  // Station 2: ACARA / PENDOPO UTAMA (x: 6.2, z: -3.6) — Teak Joglo Pendopo + Floral Arch + Celebrants
  {
    const pendopo = new THREE.Group();
    pendopo.position.set(6.2, 0, -3.6);

    // Raised stone & teak deck
    const stoneBase = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.26, 3.6), stoneMat);
    stoneBase.position.y = 0.13;
    stoneBase.receiveShadow = true;
    const woodDeck = new THREE.Mesh(new THREE.BoxGeometry(3.9, 0.08, 3.3), woodMat);
    woodDeck.position.y = 0.28;
    woodDeck.receiveShadow = true;
    pendopo.add(stoneBase, woodDeck);

    // Woven tikar runner & 4 carved joglo pillars
    const runner = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.03, 2.5), creamMat);
    runner.position.y = 0.33;
    pendopo.add(runner);

    [-1.65, 1.65].forEach((px) => {
      [-1.35, 1.35].forEach((pz) => {
        const col = new THREE.Mesh(new THREE.BoxGeometry(0.18, 2.15, 0.18), darkWoodMat);
        col.position.set(px, 1.38, pz);
        col.castShadow = true;
        pendopo.add(col);
      });
    });

    // Two-tier Javanese Joglo terracotta roof
    const jogloEaves = new THREE.Mesh(new THREE.ConeGeometry(3.25, 0.78, 4), terracottaMat);
    jogloEaves.rotation.y = Math.PI / 4;
    jogloEaves.scale.set(1.1, 1, 0.95);
    jogloEaves.position.y = 2.75;
    jogloEaves.castShadow = true;
    const jogloCrown = new THREE.Mesh(new THREE.ConeGeometry(1.35, 1.05, 4), roofDarkMat);
    jogloCrown.rotation.y = Math.PI / 4;
    jogloCrown.position.y = 3.45;
    jogloCrown.castShadow = true;
    pendopo.add(jogloEaves, jogloCrown);

    // Celebratory side table with golden Tumpeng / Celebration Cake
    const table = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.36, 0.48, 12), darkWoodMat);
    table.position.set(-1.05, 0.56, 0.2);
    const cakeTier = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 0.16, 14), creamMat);
    cakeTier.position.set(-1.05, 0.88, 0.2);
    const tumpengCone = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.34, 14), goldMat);
    tumpengCone.position.set(-1.05, 1.12, 0.2);
    pendopo.add(table, cakeTier, tumpengCone);

    // Two happy chibi celebrants standing inside the Pendopo facing guests
    const bride = buildChibiCharacter({
      gender: "cewek",
      outfitColor: "#f3e8da",
      accentColor: "#d99e4c",
      hatType: "floral",
    });
    bride.baseY = 0.32;
    bride.group.position.set(0.45, 0.32, 0.1);
    bride.group.rotation.y = -0.35;

    const groom = buildChibiCharacter({
      gender: "cowok",
      outfitColor: "#2d6a4f",
      accentColor: "#e6c17a",
      hatType: "none",
    });
    groom.baseY = 0.32;
    groom.group.position.set(-0.22, 0.32, -0.05);
    groom.group.rotation.y = -0.25;

    celebrantRigs.push(bride, groom);
    pendopo.add(bride.group, groom.group);

    worldGroup.add(pendopo);
    stationMeshes.acara = pendopo;
  }

  // Station 3: UCAPAN & RSVP / BALE KUIS (x: -2.0, z: 1.5) — Woven Mat + Writing Desk + Greeter
  {
    const deskArea = new THREE.Group();
    deskArea.position.set(-2.0, 0, 1.5);

    const rug = new THREE.Mesh(
      new THREE.CylinderGeometry(1.15, 1.15, 0.03, 18),
      new THREE.MeshStandardMaterial({ color: "#e8d3ae", roughness: 0.9 }),
    );
    rug.position.y = 0.02;
    deskArea.add(rug);

    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.12, 0.72), woodMat);
    deskTop.position.y = 0.62;
    deskTop.castShadow = true;
    deskArea.add(deskTop);

    [-0.52, 0.52].forEach((lx) => {
      [-0.28, 0.28].forEach((lz) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.04, 0.6, 6), darkWoodMat);
        leg.position.set(lx, 0.3, lz);
        deskArea.add(leg);
      });
    });

    const book = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.05, 0.32), creamMat);
    book.position.set(0, 0.71, 0.04);
    deskArea.add(book);

    const greeter = buildChibiCharacter({
      gender: "cewek",
      outfitColor: "#b85d3b",
      accentColor: "#f3e5cc",
      hatType: "floral",
    });
    greeter.baseY = 0.04;
    greeter.group.position.set(0, 0.04, -0.58);
    celebrantRigs.push(greeter);
    deskArea.add(greeter.group);

    worldGroup.add(deskArea);
    stationMeshes.ucapan = deskArea;
  }

  // Station 4: KADO / MEJA HANTARAN (x: 1.8, z: -2.4) — Festive Gift Table + Floating Balloons
  {
    const giftArea = new THREE.Group();
    giftArea.position.set(1.8, 0, -2.4);

    const tableTop = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.1, 0.95), woodMat);
    tableTop.position.y = 0.58;
    tableTop.castShadow = true;
    const runner = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.11, 1.02), terracottaMat);
    runner.position.y = 0.585;
    giftArea.add(tableTop, runner);

    [-0.7, 0.7].forEach((lx) => {
      [-0.36, 0.36].forEach((lz) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.04, 0.56, 6), darkWoodMat);
        leg.position.set(lx, 0.28, lz);
        giftArea.add(leg);
      });
    });

    const boxColors = ["#2d6a4f", "#d4a359", "#c45b3a"];
    [
      { x: -0.45, y: 0.77, z: 0, s: 0.28, c: boxColors[0] },
      { x: 0.05, y: 0.82, z: -0.08, s: 0.36, c: boxColors[1] },
      { x: 0.48, y: 0.75, z: 0.08, s: 0.25, c: boxColors[2] },
    ].forEach((b) => {
      const box = new THREE.Mesh(
        new THREE.BoxGeometry(b.s, b.s, b.s),
        new THREE.MeshStandardMaterial({ color: b.c, roughness: 0.65 }),
      );
      box.position.set(b.x, b.y, b.z);
      box.castShadow = true;
      giftArea.add(box);
    });

    // Gentle floating pastel balloons tied to table corner
    const balloonColors = ["#e88a93", "#e8c07c", "#74b388"];
    balloonColors.forEach((hex, idx) => {
      const bx = 0.92 + idx * 0.18;
      const by = 1.65 + idx * 0.22;
      const bz = -0.25 + idx * 0.2;
      const balloon = new THREE.Mesh(
        new THREE.SphereGeometry(0.19, 12, 10),
        new THREE.MeshStandardMaterial({ color: hex, roughness: 0.38 }),
      );
      balloon.scale.set(1, 1.18, 1);
      balloon.position.set(bx, by, bz);
      giftArea.add(balloon);
      balloons.push({ mesh: balloon, baseY: by, phase: idx * 1.4 });
    });

    worldGroup.add(giftArea);
    stationMeshes.kado = giftArea;
  }

  // Station 5: CERITA / PAPAN CERITA (x: -3.2, z: -2.8) — Carved Wooden Storyboard
  {
    const board = new THREE.Group();
    board.position.set(-3.2, 0, -2.8);
    board.rotation.y = 0.35;

    [-0.65, 0.65].forEach((px) => {
      const p = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 1.65, 7), darkWoodMat);
      p.position.set(px, 0.82, 0);
      p.castShadow = true;
      board.add(p);
    });
    const panel = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.96, 0.1), creamMat);
    panel.position.y = 1.12;
    panel.castShadow = true;
    const roof = new THREE.Mesh(new THREE.BoxGeometry(1.62, 0.14, 0.42), terracottaMat);
    roof.position.y = 1.68;
    board.add(panel, roof);

    // Pinned mini colorful cards
    ["#e8a87c", "#74b388", "#e88a93"].forEach((hex, idx) => {
      const mini = new THREE.Mesh(
        new THREE.BoxGeometry(0.32, 0.42, 0.03),
        new THREE.MeshStandardMaterial({ color: hex, roughness: 0.7 }),
      );
      mini.position.set(-0.38 + idx * 0.38, 1.12, 0.06);
      mini.rotation.z = (idx - 1) * 0.07;
      board.add(mini);
    });

    worldGroup.add(board);
    stationMeshes.cerita = board;
  }

  // Station 6: GALERI / PIGURA GALERI (x: 6.8, z: 2.6) — Bamboo Easel Gallery Frame
  {
    const easel = new THREE.Group();
    easel.position.set(6.8, 0, 2.6);
    easel.rotation.y = -0.45;

    [-0.48, 0.48].forEach((px) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 1.5, 7), bambooMat);
      leg.position.set(px, 0.75, 0);
      leg.castShadow = true;
      easel.add(leg);
    });
    const frame = new THREE.Mesh(new THREE.BoxGeometry(1.36, 0.98, 0.1), darkWoodMat);
    frame.position.y = 1.1;
    frame.castShadow = true;
    const canvasInner = new THREE.Mesh(
      new THREE.BoxGeometry(1.16, 0.78, 0.12),
      new THREE.MeshStandardMaterial({ color: "#72a67a", roughness: 0.65 }),
    );
    canvasInner.position.y = 1.1;
    const sunDot = new THREE.Mesh(new THREE.SphereGeometry(0.11, 8, 8), goldMat);
    sunDot.position.set(0.28, 1.28, 0.06);
    easel.add(frame, canvasInner, sunDot);

    worldGroup.add(easel);
    stationMeshes.galeri = easel;
  }

  // ==========================================================
  // 10. LIVING INDONESIAN VILLAGE FAUNA (Ayam, Domba, Bebek)
  // ==========================================================
  const addAnimal = (
    kind: AnimalHandle["kind"],
    homeX: number,
    homeZ: number,
    phase: number,
    radius = 0.7,
  ) => {
    const g = new THREE.Group();
    if (kind === "domba") {
      const woolMat = new THREE.MeshStandardMaterial({ color: "#f6efe2", roughness: 0.95 });
      const body = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 10), woolMat);
      body.scale.set(1.1, 0.95, 1.35);
      body.position.y = 0.28;
      body.castShadow = true;
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.15, 10, 8), barkMat);
      head.position.set(0, 0.35, 0.32);
      g.add(body, head);
    } else if (kind === "ayam") {
      const feather = new THREE.MeshStandardMaterial({ color: "#c96f38", roughness: 0.8 });
      const body = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 8), feather);
      body.scale.set(0.9, 0.85, 1.2);
      body.position.y = 0.14;
      const comb = new THREE.Mesh(new THREE.SphereGeometry(0.045, 6, 6), terracottaMat);
      comb.position.set(0, 0.29, 0.12);
      g.add(body, comb);
    } else {
      const duckMat = new THREE.MeshStandardMaterial({ color: "#e5d5b3", roughness: 0.8 });
      const body = new THREE.Mesh(new THREE.SphereGeometry(0.15, 10, 8), duckMat);
      body.scale.set(0.9, 0.78, 1.3);
      body.position.y = 0.12;
      const bill = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.03, 0.09), goldMat);
      bill.position.set(0, 0.21, 0.22);
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), duckMat);
      head.position.set(0, 0.24, 0.14);
      g.add(body, head, bill);
    }
    g.position.set(homeX, 0, homeZ);
    worldGroup.add(g);
    animals.push({ group: g, kind, homeX, homeZ, phase, radius });
  };

  addAnimal("domba", -1.2, -4.4, 0, 0.8);
  addAnimal("domba", 0.5, -4.6, 2.2, 0.65);
  addAnimal("ayam", -8.8, 0.6, 0.5, 0.75);
  addAnimal("ayam", -8.1, -0.5, 2.4, 0.6);
  addAnimal("ayam", 4.6, 5.2, 4.1, 0.7);
  addAnimal("bebek", -3.9, 5.2, 1.0, 0.5);
  addAnimal("bebek", -3.8, -0.8, 3.2, 0.5);

  // ==========================================================
  // 11. DRIFTING KAMBOJA PETALS & TWINKLING KUNANG-KUNANG
  // ==========================================================
  const petalCount = 42;
  const petalPositions = new Float32Array(petalCount * 3);
  const petalVelocities = new Float32Array(petalCount * 3);
  for (let i = 0; i < petalCount; i++) {
    petalPositions[i * 3] = (Math.random() - 0.5) * 20;
    petalPositions[i * 3 + 1] = 0.6 + Math.random() * 6;
    petalPositions[i * 3 + 2] = (Math.random() - 0.5) * 18;
    petalVelocities[i * 3] = (Math.random() - 0.3) * 0.25;
    petalVelocities[i * 3 + 1] = -(0.22 + Math.random() * 0.22);
    petalVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
  }
  const petalGeo = new THREE.BufferGeometry();
  petalGeo.setAttribute("position", new THREE.BufferAttribute(petalPositions, 3));
  const petalMat = new THREE.PointsMaterial({
    map: circleTex,
    size: 0.22,
    color: "#fff4d9",
    transparent: true,
    opacity: 0.75,
    depthWrite: false,
  });
  const petalPoints = new THREE.Points(petalGeo, petalMat);
  worldGroup.add(petalPoints);

  const fireflyCount = 68;
  const ffPositions = new Float32Array(fireflyCount * 3);
  const ffBasePositions = new Float32Array(fireflyCount * 3);
  const ffPhases = new Float32Array(fireflyCount);
  for (let i = 0; i < fireflyCount; i++) {
    const x = -9 + Math.random() * 19;
    const y = 0.45 + Math.random() * 2.1;
    const z = -6.5 + Math.random() * 14.5;
    ffPositions[i * 3] = x;
    ffPositions[i * 3 + 1] = y;
    ffPositions[i * 3 + 2] = z;
    ffBasePositions[i * 3] = x;
    ffBasePositions[i * 3 + 1] = y;
    ffBasePositions[i * 3 + 2] = z;
    ffPhases[i] = Math.random() * Math.PI * 2;
  }
  const ffGeo = new THREE.BufferGeometry();
  ffGeo.setAttribute("position", new THREE.BufferAttribute(ffPositions, 3));
  const ffMat = new THREE.PointsMaterial({
    map: circleTex,
    size: 0.28,
    color: "#ffe474",
    transparent: true,
    opacity: 0.55,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const ffPoints = new THREE.Points(ffGeo, ffMat);
  worldGroup.add(ffPoints);

  const disposeExtras = () => {
    [
      grassTex,
      dirtTex,
      waterTexture,
      sawahTexture,
      woodTex,
      darkWoodTex,
      bambooTex,
      glowTex,
      circleTex,
      signTex,
    ].forEach((t) => t.dispose());
  };

  return {
    waterTexture,
    sawahTexture,
    gateDoors: { left: leftGateDoor, right: rightGateDoor },
    swaying,
    koiFish,
    animals,
    balloons,
    lanternShadeMats,
    lanternGlowMeshes,
    petals: { points: petalPoints, velocities: petalVelocities },
    fireflies: {
      points: ffPoints,
      material: ffMat,
      phases: ffPhases,
      basePositions: ffBasePositions,
    },
    celebrantRigs,
    stationMeshes,
    disposeExtras,
  };
}
