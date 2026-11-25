import * as THREE from "three";
import type { DesaTimeOfDay, DesaWorldPayload } from "@/data/desaWorldData";
import { buildChibiCharacter, type ChibiRig } from "./chibiBuilder";
import { buildWeddingCouple, type HeroCoupleRig } from "./brideGroomBuilder";
import {
  buildButterfly,
  buildDetailedChicken,
  buildDetailedDuck,
  buildDetailedKoi,
  buildDetailedSheep,
  type ButterflyHandle,
  type DetailedAnimalHandle,
  type DetailedKoiHandle,
} from "./faunaBuilder";
import {
  createBatikParangTexture,
  createDirtPathTexture,
  createGalleryBoardTexture,
  createGebyokTexture,
  createRadialGlowTexture,
  createRiverWaterTexture,
  createRoofTileTexture,
  createSawahTexture,
  createSignTextTexture,
  createSkyDomeTexture,
  createSoftCircleTexture,
  createStoneTileTexture,
  createStoryBoardTexture,
  createVillageGrassTexture,
  createWoodPlankTexture,
} from "./textures";

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

export interface CloudHandle {
  group: THREE.Group;
  baseX: number;
  speed: number;
  range: number;
}

export interface VillageEnvironmentHandles {
  waterTexture: THREE.CanvasTexture;
  sawahTexture: THREE.CanvasTexture;
  skyDomeMat: THREE.MeshBasicMaterial;
  skyTextures: Record<DesaTimeOfDay, THREE.CanvasTexture>;
  sunDisc: THREE.Mesh;
  clouds: CloudHandle[];
  waterWheel: THREE.Group;
  weddingCouple: HeroCoupleRig;
  stringLightMat: THREE.MeshStandardMaterial;
  gateDoors: {
    left: THREE.Group;
    right: THREE.Group;
  };
  swaying: SwayHandle[];
  koiFish: DetailedKoiHandle[];
  animals: DetailedAnimalHandle[];
  butterflies: ButterflyHandle[];
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

function createLimasanRoofGeometry(
  bottomW: number,
  bottomD: number,
  topW: number,
  topD: number,
  height: number,
  uScale = 0.28,
  vScale = 0.52,
): THREE.BufferGeometry {
  const bw = bottomW * 0.5;
  const bd = bottomD * 0.5;
  const tw = topW * 0.5;
  const td = topD * 0.5;

  const bFL: [number, number, number] = [-bw, 0, bd];
  const bFR: [number, number, number] = [bw, 0, bd];
  const bBR: [number, number, number] = [bw, 0, -bd];
  const bBL: [number, number, number] = [-bw, 0, -bd];

  const tFL: [number, number, number] = [-tw, height, td];
  const tFR: [number, number, number] = [tw, height, td];
  const tBR: [number, number, number] = [tw, height, -td];
  const tBL: [number, number, number] = [-tw, height, -td];

  const positions: number[] = [];
  const uvs: number[] = [];

  const pushQuad = (
    p0: [number, number, number],
    p1: [number, number, number],
    p2: [number, number, number],
    p3: [number, number, number],
    uv0: [number, number],
    uv1: [number, number],
    uv2: [number, number],
    uv3: [number, number],
  ) => {
    positions.push(...p0, ...p1, ...p2, ...p0, ...p2, ...p3);
    uvs.push(...uv0, ...uv1, ...uv2, ...uv0, ...uv2, ...uv3);
  };

  const slopeZ = Math.hypot(height, Math.max(0.01, bd - td));
  const slopeX = Math.hypot(height, Math.max(0.01, bw - tw));

  // Front slope (+Z)
  pushQuad(
    bFL,
    bFR,
    tFR,
    tFL,
    [0.5 - bw * uScale, 0],
    [0.5 + bw * uScale, 0],
    [0.5 + tw * uScale, slopeZ * vScale],
    [0.5 - tw * uScale, slopeZ * vScale],
  );
  // Right slope (+X)
  pushQuad(
    bFR,
    bBR,
    tBR,
    tFR,
    [0.5 - bd * uScale, 0],
    [0.5 + bd * uScale, 0],
    [0.5 + td * uScale, slopeX * vScale],
    [0.5 - td * uScale, slopeX * vScale],
  );
  // Back slope (-Z)
  pushQuad(
    bBR,
    bBL,
    tBL,
    tBR,
    [0.5 - bw * uScale, 0],
    [0.5 + bw * uScale, 0],
    [0.5 + tw * uScale, slopeZ * vScale],
    [0.5 - tw * uScale, slopeZ * vScale],
  );
  // Left slope (-X)
  pushQuad(
    bBL,
    bFL,
    tFL,
    tBL,
    [0.5 - bd * uScale, 0],
    [0.5 + bd * uScale, 0],
    [0.5 + td * uScale, slopeX * vScale],
    [0.5 - td * uScale, slopeX * vScale],
  );

  // Top ridge cap (+Y)
  if (topW > 0.002 && topD > 0.002) {
    pushQuad(
      tFL,
      tFR,
      tBR,
      tBL,
      [0, 0],
      [Math.max(0.1, topW * uScale), 0],
      [Math.max(0.1, topW * uScale), Math.max(0.1, topD * uScale)],
      [0, Math.max(0.1, topD * uScale)],
    );
  }

  // Bottom soffit (-Y)
  pushQuad(
    bBL,
    bBR,
    bFR,
    bFL,
    [0, 0],
    [0.2, 0],
    [0.2, 0.2],
    [0, 0.2],
  );

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geo.computeVertexNormals();
  return geo;
}

function createPalmFrondGeometry(): THREE.BufferGeometry {
  const segs = 8;
  const totalLen = 1.72;
  const positions: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i <= segs; i++) {
    const t = i / segs;
    const z = t * totalLen;
    const y = Math.sin(t * Math.PI * 0.65) * 0.32 - Math.pow(t, 2.05) * 0.86;
    const halfW = 0.014 + Math.sin(Math.pow(t, 0.72) * Math.PI) * 0.22;
    const midLift = 0.036 * (1 - t * 0.45);
    const edgeDroop = 0.042 * t;

    // Left edge, Center spine, Right edge
    positions.push(-halfW, y - edgeDroop, z);
    positions.push(0, y + midLift, z);
    positions.push(halfW, y - edgeDroop, z);
  }

  for (let i = 0; i < segs; i++) {
    const r0 = i * 3;
    const r1 = (i + 1) * 3;
    indices.push(r0, r0 + 1, r1 + 1, r0, r1 + 1, r1);
    indices.push(r0 + 1, r0 + 2, r1 + 2, r0 + 1, r1 + 2, r1 + 1);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

function createBambooLeafGeometry(): THREE.BufferGeometry {
  // Curved slender pointed diamond blade pointing outward +Z
  const positions = new Float32Array([
    0, 0, 0,
    -0.036, 0.015, 0.14,
    0.036, 0.015, 0.14,
    0, -0.025, 0.34,
  ]);
  const indices = [0, 1, 2, 1, 3, 2];
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
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
  const roofTileTex = createRoofTileTexture("#b45338", "#7d311d");
  const roofDarkTileTex = createRoofTileTexture("#8f3b26", "#5e2214");
  const stoneTileTex = createStoneTileTexture();
  const runnerBatikTex = createBatikParangTexture("#6b2f21", "#d9a954", "#f4e5c8");
  const gebyokTex = createGebyokTexture();
  const galleryBoardTex = createGalleryBoardTexture(payload.mode);
  const storyBoardTex = createStoryBoardTexture(payload.mode);
  const glowTex = createRadialGlowTexture();
  const circleTex = createSoftCircleTexture();
  const signTex = createSignTextTexture(payload.gapuraTitle, payload.gapuraSubtitle);
  const skyTextures: Record<DesaTimeOfDay, THREE.CanvasTexture> = {
    pagi: createSkyDomeTexture("pagi"),
    sore: createSkyDomeTexture("sore"),
    malam: createSkyDomeTexture("malam"),
  };

  const grassMat = new THREE.MeshStandardMaterial({ map: grassTex, roughness: 0.92 });
  const dirtMat = new THREE.MeshStandardMaterial({ map: dirtTex, roughness: 0.92 });
  const waterMat = new THREE.MeshStandardMaterial({
    map: waterTexture,
    roughness: 0.22,
    metalness: 0.14,
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
  const terracottaMat = new THREE.MeshStandardMaterial({ map: roofTileTex, roughness: 0.75 });
  const roofDarkTileMat = new THREE.MeshStandardMaterial({ map: roofDarkTileTex, roughness: 0.78 });
  const roofDarkMat = new THREE.MeshStandardMaterial({ color: "#803421", roughness: 0.78 });
  const stoneTileMat = new THREE.MeshStandardMaterial({ map: stoneTileTex, roughness: 0.82 });
  const runnerBatikMat = new THREE.MeshStandardMaterial({ map: runnerBatikTex, roughness: 0.72 });
  const gebyokMat = new THREE.MeshStandardMaterial({ map: gebyokTex, roughness: 0.65 });
  const bundMat = new THREE.MeshStandardMaterial({ color: "#5f8c44", roughness: 0.9 });
  const barkMat = new THREE.MeshStandardMaterial({ color: "#68432b", roughness: 0.88 });
  const creamMat = new THREE.MeshStandardMaterial({ color: "#f6efe2", roughness: 0.72 });
  const ivorySilkMat = new THREE.MeshStandardMaterial({ color: "#fbf6eb", roughness: 0.6 });
  const goldMat = new THREE.MeshStandardMaterial({ color: "#dfa84d", roughness: 0.32, metalness: 0.55 });
  const stoneMat = new THREE.MeshStandardMaterial({ color: "#9ba39e", roughness: 0.85 });
  const janurMat = new THREE.MeshStandardMaterial({ color: "#e8d274", roughness: 0.68 });
  const stringLightMat = new THREE.MeshStandardMaterial({
    color: "#fff4d2",
    emissive: new THREE.Color("#ffc058"),
    emissiveIntensity: 0.9,
    roughness: 0.35,
  });

  const swaying: SwayHandle[] = [];
  const koiFish: DetailedKoiHandle[] = [];
  const animals: DetailedAnimalHandle[] = [];
  const butterflies: ButterflyHandle[] = [];
  const balloons: BalloonHandle[] = [];
  const clouds: CloudHandle[] = [];
  const lanternShadeMats: THREE.MeshStandardMaterial[] = [];
  const lanternGlowMeshes: THREE.Mesh[] = [];
  const celebrantRigs: ChibiRig[] = [];
  const stationMeshes: Record<string, THREE.Object3D> = {};

  // ==========================================================
  // 0. SKY DOME, CELESTIAL DISC & DRIFTING STYLIZED CLOUDS
  // ==========================================================
  const skyDomeMat = new THREE.MeshBasicMaterial({
    map: skyTextures.sore,
    side: THREE.BackSide,
    fog: false,
    depthWrite: false,
  });
  const skyDome = new THREE.Mesh(new THREE.SphereGeometry(85, 24, 16), skyDomeMat);
  worldGroup.add(skyDome);

  const sunDisc = new THREE.Mesh(
    new THREE.SphereGeometry(2.6, 18, 16),
    new THREE.MeshBasicMaterial({ color: "#ffe7b5", fog: false }),
  );
  sunDisc.position.set(24, 21, -34);
  worldGroup.add(sunDisc);

  const cloudMat = new THREE.MeshStandardMaterial({
    color: "#fffcf5",
    roughness: 0.95,
    metalness: 0,
    transparent: true,
    opacity: 0.88,
  });
  const cloudConfigs = [
    { x: -18, y: 14.5, z: -22, s: 1.35, speed: 0.22 },
    { x: -4, y: 16.0, z: -25, s: 1.55, speed: 0.16 },
    { x: 14, y: 14.0, z: -20, s: 1.25, speed: 0.2 },
    { x: -24, y: 15.0, z: -4, s: 1.15, speed: 0.18 },
    { x: 20, y: 16.5, z: 2, s: 1.3, speed: 0.14 },
    { x: -12, y: 17.2, z: 16, s: 1.1, speed: 0.24 },
    { x: 8, y: 15.5, z: 18, s: 1.2, speed: 0.19 },
    { x: 24, y: 13.8, z: -12, s: 1.1, speed: 0.21 },
    { x: -20, y: 13.6, z: 10, s: 1.0, speed: 0.17 },
  ];
  cloudConfigs.forEach((cfg) => {
    const cg = new THREE.Group();
    const puffs = [
      { dx: 0, dy: 0, dz: 0, r: 1.2 },
      { dx: -1.1, dy: -0.25, dz: 0.15, r: 0.9 },
      { dx: 1.15, dy: -0.2, dz: -0.1, r: 0.95 },
      { dx: 0.35, dy: 0.35, dz: 0.25, r: 0.85 },
    ];
    puffs.forEach((p) => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(p.r, 12, 10), cloudMat);
      m.position.set(p.dx, p.dy, p.dz);
      m.scale.set(1.25, 0.72, 0.9);
      cg.add(m);
    });
    cg.scale.setScalar(cfg.s);
    cg.position.set(cfg.x, cfg.y, cfg.z);
    worldGroup.add(cg);
    clouds.push({ group: cg, baseX: cfg.x, speed: cfg.speed, range: 6.5 });
  });

  // ==========================================================
  // 1. TERRAIN & RIVER STREAM (center at x=-5.4)
  // ==========================================================
  const plinth = new THREE.Mesh(
    new THREE.BoxGeometry(38, 1.5, 36),
    new THREE.MeshStandardMaterial({ color: "#523a28", roughness: 0.95 }),
  );
  plinth.position.set(0, -0.83, 0);
  worldGroup.add(plinth);

  const leftBank = new THREE.Mesh(new THREE.BoxGeometry(12.5, 0.24, 36), grassMat);
  leftBank.position.set(-12.75, -0.12, 0);
  leftBank.receiveShadow = true;
  worldGroup.add(leftBank);

  const rightMeadow = new THREE.Mesh(new THREE.BoxGeometry(23.3, 0.24, 36), grassMat);
  rightMeadow.position.set(7.35, -0.12, 0);
  rightMeadow.receiveShadow = true;
  worldGroup.add(rightMeadow);

  const riverBed = new THREE.Mesh(
    new THREE.PlaneGeometry(2.6, 36),
    new THREE.MeshStandardMaterial({ color: "#1d3d3b", roughness: 0.95 }),
  );
  riverBed.rotation.x = -Math.PI / 2;
  riverBed.position.set(-5.4, -0.22, 0);
  worldGroup.add(riverBed);

  const riverSurface = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 36), waterMat);
  riverSurface.rotation.x = -Math.PI / 2;
  riverSurface.position.set(-5.4, -0.07, 0);
  riverSurface.receiveShadow = true;
  worldGroup.add(riverSurface);

  // Riverbank boulders, lotus pads, flowers & InstancedMesh water reeds
  const lilyMat = new THREE.MeshStandardMaterial({ color: "#3d854b", roughness: 0.72 });
  const lotusMat = new THREE.MeshStandardMaterial({ color: "#f6a9bf", roughness: 0.55 });
  const mossyStoneMat = new THREE.MeshStandardMaterial({ color: "#768378", roughness: 0.9 });
  const reedPositions: { x: number; z: number; h: number; r: number }[] = [];

  for (let i = 0; i < 24; i++) {
    const zPos = -12 + i * 1.15;
    const bankSide = i % 2 === 0 ? -6.36 : -4.44;
    const rock = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.18 + (i % 4) * 0.06, 0),
      i % 3 === 0 ? mossyStoneMat : stoneMat,
    );
    rock.scale.set(1.25, 0.65, 1.05);
    rock.rotation.y = i * 0.7;
    rock.position.set(bankSide, 0.02, zPos);
    rock.castShadow = true;
    worldGroup.add(rock);

    if (Math.abs(zPos - 2.2) > 1.8) {
      if (i % 2 === 0) {
        reedPositions.push({ x: bankSide + (i % 4 === 0 ? 0.16 : -0.16), z: zPos + 0.15, h: 0.55 + (i % 3) * 0.14, r: i * 0.4 });
        reedPositions.push({ x: bankSide + (i % 4 === 0 ? 0.22 : -0.22), z: zPos - 0.1, h: 0.45 + (i % 2) * 0.12, r: i * 0.9 });
      }
      if (i % 3 === 0) {
        const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.025, 14), lilyMat);
        pad.position.set(-5.4 + ((i % 5) - 2) * 0.22, -0.05, zPos);
        worldGroup.add(pad);
        if (i % 6 === 0) {
          const lotus = new THREE.Group();
          lotus.position.set(pad.position.x + 0.04, 0.0, pad.position.z);
          for (let p = 0; p < 5; p++) {
            const ang = (p / 5) * Math.PI * 2;
            const petal = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.11, 5), lotusMat);
            petal.rotation.z = -0.55;
            petal.rotation.y = ang;
            petal.position.set(Math.cos(ang) * 0.04, 0.02, Math.sin(ang) * 0.04);
            lotus.add(petal);
          }
          worldGroup.add(lotus);
        }
      }
    }
  }

  if (reedPositions.length > 0) {
    const reedGeo = new THREE.ConeGeometry(0.025, 1, 5);
    const reedMat = new THREE.MeshStandardMaterial({ color: "#588c42", roughness: 0.85 });
    const reedInst = new THREE.InstancedMesh(reedGeo, reedMat, reedPositions.length);
    const dummy = new THREE.Object3D();
    reedPositions.forEach((rp, idx) => {
      dummy.position.set(rp.x, rp.h * 0.42, rp.z);
      dummy.scale.set(1, rp.h, 1);
      dummy.rotation.set(Math.sin(rp.r) * 0.14, rp.r, Math.cos(rp.r) * 0.14);
      dummy.updateMatrix();
      reedInst.setMatrixAt(idx, dummy.matrix);
    });
    reedInst.instanceMatrix.needsUpdate = true;
    worldGroup.add(reedInst);
  }

  // Rotating Bamboo Waterwheel (Kincir Air) upstream at (-4.45, 0.35, -4.8)
  const waterWheel = new THREE.Group();
  waterWheel.position.set(-4.45, 0.42, -4.8);
  {
    const rimMat = bambooMat;
    const wheelRim1 = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.045, 8, 20), rimMat);
    wheelRim1.rotation.y = Math.PI / 2;
    wheelRim1.position.x = -0.18;
    const wheelRim2 = wheelRim1.clone();
    wheelRim2.position.x = 0.18;
    const axle = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.72, 8), darkWoodMat);
    axle.rotation.z = Math.PI / 2;
    waterWheel.add(wheelRim1, wheelRim2, axle);

    for (let s = 0; s < 8; s++) {
      const ang = (s / 8) * Math.PI * 2;
      const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.24, 0.04), darkWoodMat);
      spoke.rotation.x = ang;
      spoke.position.x = -0.18;
      const spoke2 = spoke.clone();
      spoke2.position.x = 0.18;

      const paddle = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.12, 0.03), woodMat);
      paddle.position.set(0, Math.sin(ang) * 0.62, Math.cos(ang) * 0.62);
      paddle.rotation.x = -ang;
      waterWheel.add(spoke, spoke2, paddle);
    }

    // Support A-frame posts standing on riverbank
    [-0.45, 0.45].forEach((sz) => {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.86, 7), darkWoodMat);
      post.position.set(-4.12, 0.32, -4.8 + sz);
      post.rotation.z = 0.18;
      worldGroup.add(post);
    });
  }
  worldGroup.add(waterWheel);

  // Swimming Detailed Koi Fish in stream
  for (let i = 0; i < 4; i++) {
    const baseZ = -6 + i * 4.5;
    const baseX = -5.4 + (i % 2 === 0 ? -0.35 : 0.35);
    const koi = buildDetailedKoi(i, baseX, baseZ, i * 1.7, 0.7 + i * 0.15);
    worldGroup.add(koi.group);
    koiFish.push(koi);
  }

  // ==========================================================
  // 2. STEPPED SAWAH TERASERING (InstancedMesh Rice Tufts + Gubuk Sawah)
  // ==========================================================
  const riceInstances: { x: number; y: number; z: number; s: number; rot: number }[] = [];

  const addSawahTerrace = (x: number, z: number, w: number, d: number, y: number) => {
    const terraceGroup = new THREE.Group();
    const bund = new THREE.Mesh(new THREE.BoxGeometry(w, 0.28, d), bundMat);
    bund.position.set(x, y, z);
    bund.receiveShadow = true;
    bund.castShadow = true;

    const pool = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.34, d - 0.34), sawahMat);
    pool.rotation.x = -Math.PI / 2;
    pool.position.set(x, y + 0.145, z);

    terraceGroup.add(bund, pool);

    const cols = Math.max(6, Math.floor(w / 0.52));
    const rows = Math.max(4, Math.floor(d / 0.52));
    for (let cx = 0; cx < cols; cx++) {
      for (let cz = 0; cz < rows; cz++) {
        const sx = x - (w - 0.65) / 2 + cx * ((w - 0.65) / Math.max(1, cols - 1));
        const sz = z - (d - 0.65) / 2 + cz * ((d - 0.65) / Math.max(1, rows - 1));
        riceInstances.push({
          x: sx + ((cx * 7 + cz * 3) % 3 - 1) * 0.04,
          y: y + 0.15,
          z: sz + ((cx * 5 + cz * 11) % 3 - 1) * 0.04,
          s: 0.85 + ((cx + cz) % 4) * 0.1,
          rot: (cx * 1.3 + cz * 0.7) % (Math.PI * 2),
        });
      }
    }

    worldGroup.add(terraceGroup);
  };

  addSawahTerrace(-1.5, -8.2, 10.6, 2.8, 0.14);
  addSawahTerrace(-0.8, -10.9, 12.4, 2.7, 0.44);
  addSawahTerrace(0.4, -13.5, 14.2, 2.6, 0.76);
  addSawahTerrace(-11.6, -4.5, 6.4, 7.6, 0.14);
  addSawahTerrace(-14.2, -4.5, 3.8, 9.2, 0.46);

  if (riceInstances.length > 0) {
    const tuftGeo = new THREE.ConeGeometry(0.11, 0.4, 5);
    const tuftMat = new THREE.MeshStandardMaterial({ color: "#76b249", roughness: 0.84 });
    const tipGeo = new THREE.SphereGeometry(0.052, 6, 5);
    const tipMat = new THREE.MeshStandardMaterial({ color: "#dcb84e", roughness: 0.75 });

    const tuftMesh = new THREE.InstancedMesh(tuftGeo, tuftMat, riceInstances.length);
    const tipMesh = new THREE.InstancedMesh(tipGeo, tipMat, riceInstances.length);
    const dummy = new THREE.Object3D();

    riceInstances.forEach((r, idx) => {
      dummy.position.set(r.x, r.y + 0.18 * r.s, r.z);
      dummy.scale.set(r.s, r.s, r.s);
      dummy.rotation.set(0.05, r.rot, 0.04);
      dummy.updateMatrix();
      tuftMesh.setMatrixAt(idx, dummy.matrix);

      dummy.position.set(r.x, r.y + 0.36 * r.s, r.z);
      dummy.updateMatrix();
      tipMesh.setMatrixAt(idx, dummy.matrix);
    });
    tuftMesh.instanceMatrix.needsUpdate = true;
    tipMesh.instanceMatrix.needsUpdate = true;
    worldGroup.add(tuftMesh, tipMesh);
  }

  // Charming background Gubuk Sawah on northern hillside (-5.5, 0.56, -10.8)
  {
    const gubuk = new THREE.Group();
    gubuk.position.set(-5.5, 0.58, -10.8);
    gubuk.rotation.y = 0.25;
    [-0.55, 0.55].forEach((gx) => {
      [-0.55, 0.55].forEach((gz) => {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 1.35, 6), bambooMat);
        post.position.set(gx, 0.65, gz);
        gubuk.add(post);
      });
    });
    const floor = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.08, 1.35), woodMat);
    floor.position.y = 0.32;
    const roof = new THREE.Mesh(
      createLimasanRoofGeometry(1.82, 1.82, 0.08, 0.36, 0.72),
      terracottaMat,
    );
    roof.position.y = 1.28;
    const gubukRidge = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 0.42, 8),
      roofDarkMat,
    );
    gubukRidge.rotation.x = Math.PI / 2;
    gubukRidge.position.y = 2.01;
    gubuk.add(floor, roof, gubukRidge);
    worldGroup.add(gubuk);
  }

  // Layered distant hillside & volcanic mountain ranges
  const mtnBackMat = new THREE.MeshStandardMaterial({ color: "#4d7463", roughness: 0.96 });
  const mtnMidMat = new THREE.MeshStandardMaterial({ color: "#618b74", roughness: 0.94 });
  const mtnCoords = [
    { x: -16, z: -22, r: 8.5, h: 9.2, back: true },
    { x: -3, z: -25, r: 10.5, h: 11.4, back: true },
    { x: 13, z: -22, r: 9.0, h: 8.8, back: true },
    { x: -22, z: -12, r: 7.5, h: 7.2, back: true },
    { x: -10, z: -18, r: 5.8, h: 5.4, back: false },
    { x: 3, z: -19, r: 6.4, h: 6.0, back: false },
    { x: 16, z: -17, r: 5.6, h: 5.0, back: false },
    { x: -20, z: 2, r: 6.2, h: 5.2, back: false },
  ];
  mtnCoords.forEach((m) => {
    const peak = new THREE.Mesh(
      new THREE.ConeGeometry(m.r, m.h, 8),
      m.back ? mtnBackMat : mtnMidMat,
    );
    peak.position.set(m.x, m.h * 0.4, m.z);
    peak.rotation.y = m.x * 0.2;
    worldGroup.add(peak);
  });

  // ==========================================================
  // 3. SANDSTONE PATHWAYS, STONE CURBS & WEDDING AISLE
  // ==========================================================
  const addPathRect = (x: number, z: number, w: number, d: number, rotY = 0) => {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, d), dirtMat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.rotation.z = rotY;
    mesh.position.set(x, 0.012, z);
    mesh.receiveShadow = true;
    worldGroup.add(mesh);
  };

  // Entry path -> Bridge -> Central courtyard
  addPathRect(-9.2, 2.2, 6.2, 1.95);
  addPathRect(1.6, 2.2, 12.2, 2.1);
  // Courtyard cross path & branch to story/kado
  addPathRect(1.2, -0.4, 1.75, 5.2);
  addPathRect(-2.1, -0.8, 1.55, 5.6);

  // Diagonal ceremonial sandstone aisle leading straight into rotated Pendopo front steps!
  // From central plaza (1.8, 1.2) -> Pendopo step front (4.65, -2.05)
  const aisleDx = 4.65 - 1.8;
  const aisleDz = -2.05 - 1.2;
  const aisleLen = Math.hypot(aisleDx, aisleDz);
  const aisleAngle = Math.atan2(aisleDx, aisleDz);
  const weddingAisle = new THREE.Mesh(
    new THREE.PlaneGeometry(2.15, aisleLen + 0.6),
    stoneTileMat,
  );
  weddingAisle.rotation.x = -Math.PI / 2;
  weddingAisle.rotation.z = aisleAngle;
  weddingAisle.position.set((1.8 + 4.65) / 2, 0.016, (1.2 - 2.05) / 2);
  weddingAisle.receiveShadow = true;
  worldGroup.add(weddingAisle);

  // Scattered flower petals along the ceremonial aisle & heart inlay in central plaza
  const petalPinkMat = new THREE.MeshStandardMaterial({ color: "#eda3b0", roughness: 0.7 });
  const petalWhiteMat = new THREE.MeshStandardMaterial({ color: "#fffaf0", roughness: 0.65 });
  for (let i = 0; i < 24; i++) {
    const frac = i / 23;
    const ax = 1.8 + aisleDx * frac;
    const az = 1.2 + aisleDz * frac;
    const side = i % 2 === 0 ? -0.78 : 0.78;
    const perpX = Math.cos(aisleAngle) * side;
    const perpZ = -Math.sin(aisleAngle) * side;
    const p = new THREE.Mesh(
      new THREE.CylinderGeometry(0.065, 0.065, 0.018, 6),
      i % 2 === 0 ? petalWhiteMat : petalPinkMat,
    );
    p.position.set(ax + perpX, 0.022, az + perpZ);
    worldGroup.add(p);
  }

  // Heart floral inlay in central plaza
  const heartCenter = { x: 1.45, z: 1.35 };
  for (let i = 0; i < 20; i++) {
    const t = (i / 20) * Math.PI * 2;
    const hx = 0.042 * 16 * Math.pow(Math.sin(t), 3);
    const hz =
      -0.042 *
      (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    const petal = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.02, 7),
      i % 2 === 0 ? petalPinkMat : petalWhiteMat,
    );
    petal.position.set(heartCenter.x + hx, 0.022, heartCenter.z + hz);
    worldGroup.add(petal);
  }

  // ==========================================================
  // 4. ARCHED TEAK & BAMBOO BRIDGE (at x=-5.4, z=2.2)
  // ==========================================================
  const bridgeGroup = new THREE.Group();
  bridgeGroup.position.set(-5.4, 0, 2.2);
  worldGroup.add(bridgeGroup);

  // Stone bridge abutments on both banks
  [-1.6, 1.6].forEach((bx) => {
    const abut = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.34, 2.25), stoneTileMat);
    abut.position.set(bx, 0.02, 0);
    abut.receiveShadow = true;
    bridgeGroup.add(abut);
  });

  const plankCount = 15;
  for (let i = 0; i < plankCount; i++) {
    const frac = i / (plankCount - 1);
    const bx = -1.55 + frac * 3.1;
    const archY = Math.sin(frac * Math.PI) * 0.28 + 0.04;
    const plank = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.09, 1.85), woodMat);
    plank.position.set(bx, archY, 0);
    plank.castShadow = true;
    plank.receiveShadow = true;
    bridgeGroup.add(plank);
  }

  [-0.9, 0.9].forEach((rz) => {
    // Under-stringer curved beam
    const stringer = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.11, 0.1), darkWoodMat);
    stringer.position.set(0, 0.14, rz);
    bridgeGroup.add(stringer);

    [-1.45, 0, 1.45].forEach((px, idx) => {
      const py = idx === 1 ? 0.56 : 0.36;
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.065, 0.72, 8), darkWoodMat);
      post.position.set(px, py, rz);
      post.castShadow = true;
      bridgeGroup.add(post);

      if (idx !== 1) {
        const capMat = new THREE.MeshStandardMaterial({
          color: "#fff3cc",
          emissive: new THREE.Color("#ffb64d"),
          emissiveIntensity: 0.75,
          roughness: 0.4,
        });
        lanternShadeMats.push(capMat);
        const lanternTop = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.2, 0.16), capMat);
        lanternTop.position.set(px, py + 0.44, rz);
        const lanternHat = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.11, 4), roofDarkMat);
        lanternHat.rotation.y = Math.PI / 4;
        lanternHat.position.set(px, py + 0.59, rz);
        bridgeGroup.add(lanternTop, lanternHat);
      }
    });
    const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.042, 3.05, 8), bambooMat);
    rail.rotation.z = Math.PI / 2;
    rail.position.set(0, 0.72, rz);
    bridgeGroup.add(rail);
  });

  // ==========================================================
  // 5. GRAND WEDDING GAPURA + PENJOR ARCHES (-7.3, 0, 2.2)
  // ==========================================================
  const gapuraGroup = new THREE.Group();
  gapuraGroup.position.set(-7.3, 0, 2.2);
  worldGroup.add(gapuraGroup);

  [-1.12, 1.12].forEach((pz) => {
    const stonePlinth = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.32, 0.56), stoneTileMat);
    stonePlinth.position.set(0, 0.16, pz);
    const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.26, 2.45, 0.26), darkWoodMat);
    pillar.position.set(0, 1.38, pz);
    pillar.castShadow = true;
    const goldBand = new THREE.Mesh(new THREE.BoxGeometry(0.29, 0.08, 0.29), goldMat);
    goldBand.position.set(0, 2.15, pz);
    gapuraGroup.add(stonePlinth, pillar, goldBand);
  });

  const beam = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.26, 2.8), woodMat);
  beam.position.set(0, 2.48, 0);
  beam.castShadow = true;
  gapuraGroup.add(beam);

  // Carved diagonal teak brackets (siku kayu) & transverse roof corbels
  [-0.96, 0.96].forEach((bz) => {
    const brace = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.38, 0.1), darkWoodMat);
    brace.position.set(0, 2.26, bz);
    brace.rotation.x = bz > 0 ? -0.68 : 0.68;
    brace.castShadow = true;
    gapuraGroup.add(brace);
  });
  [-1.12, 1.12].forEach((pz) => {
    const corbel = new THREE.Mesh(new THREE.BoxGeometry(1.22, 0.1, 0.14), woodMat);
    corbel.position.set(0, 2.55, pz);
    corbel.castShadow = true;
    gapuraGroup.add(corbel);
  });

  // Two-tier Javanese Gapura Limasan roof with carved eaves fascia & ridge finials
  const gapuraFascia = new THREE.Mesh(new THREE.BoxGeometry(1.62, 0.09, 3.48), darkWoodMat);
  gapuraFascia.position.set(0, 2.66, 0);
  gapuraFascia.castShadow = true;
  const gapuraTrim = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.03, 3.51), goldMat);
  gapuraTrim.position.set(0, 2.62, 0);

  const roofTier1 = new THREE.Mesh(
    createLimasanRoofGeometry(1.74, 3.62, 0.94, 2.54, 0.42),
    terracottaMat,
  );
  roofTier1.position.set(0, 2.68, 0);
  roofTier1.castShadow = true;

  const roofTier2 = new THREE.Mesh(
    createLimasanRoofGeometry(1.0, 2.6, 0.08, 1.5, 0.56),
    roofDarkTileMat,
  );
  roofTier2.position.set(0, 3.08, 0);
  roofTier2.castShadow = true;

  const gapuraRidge = new THREE.Mesh(
    new THREE.CylinderGeometry(0.062, 0.062, 1.56, 10),
    roofDarkMat,
  );
  gapuraRidge.rotation.x = Math.PI / 2;
  gapuraRidge.position.set(0, 3.65, 0);

  const ridgeFinial = new THREE.Mesh(new THREE.OctahedronGeometry(0.11, 0), goldMat);
  ridgeFinial.scale.set(0.75, 1.45, 0.75);
  ridgeFinial.position.set(0, 3.78, 0);

  [-0.76, 0.76].forEach((fz) => {
    const endFinial = new THREE.Mesh(new THREE.SphereGeometry(0.065, 10, 8), goldMat);
    endFinial.position.set(0, 3.71, fz);
    gapuraGroup.add(endFinial);
  });

  gapuraGroup.add(gapuraFascia, gapuraTrim, roofTier1, roofTier2, gapuraRidge, ridgeFinial);

  // Lush Janur & Melati floral swag across the Gapura arch
  for (let i = -5; i <= 5; i++) {
    const flower = new THREE.Mesh(
      new THREE.SphereGeometry(0.072, 8, 8),
      i % 2 === 0 ? ivorySilkMat : goldMat,
    );
    flower.position.set(-0.24, 2.34 - Math.cos(i * 0.3) * 0.11, i * 0.21);
    gapuraGroup.add(flower);
  }

  // Carved Nameplate on Gapura facing -X toward incoming guest
  const signMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.58, 1.65),
    new THREE.MeshStandardMaterial({ map: signTex, roughness: 0.6 }),
  );
  signMesh.position.set(-0.28, 2.1, 0);
  gapuraGroup.add(signMesh);

  // Double Hinged Doors
  const makeGateDoor = (hingeZ: number, leafDir: number) => {
    const pivot = new THREE.Group();
    pivot.position.set(0, 0, hingeZ);
    const frame = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.38, 0.88), darkWoodMat);
    frame.position.set(0, 0.74, leafDir * 0.45);
    frame.castShadow = true;
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.14, 0.78), goldMat);
    bar.position.set(0, 0.98, leafDir * 0.45);
    pivot.add(frame, bar);
    gapuraGroup.add(pivot);
    return pivot;
  };
  const leftGateDoor = makeGateDoor(-0.94, 1);
  const rightGateDoor = makeGateDoor(0.94, -1);

  // Helper: Tall Graceful Arching Penjor (Janur Kuning ceremonial bamboo arch)
  const addPenjor = (
    x: number,
    z: number,
    rotY: number,
    heightScale = 1.0,
    parent: THREE.Object3D = worldGroup,
  ) => {
    const penjor = new THREE.Group();
    penjor.position.set(x, 0, z);
    penjor.rotation.y = rotY;
    penjor.scale.setScalar(heightScale);

    const segs = 9;
    let curY = 0;
    let curZ = 0;
    for (let i = 0; i < segs; i++) {
      const t = i / (segs - 1);
      const tiltX = t * t * 0.95;
      const segLen = 0.42;
      const seg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.036 - t * 0.022, 0.044 - t * 0.022, segLen + 0.04, 7),
        bambooMat,
      );
      curY += Math.cos(tiltX) * segLen * 0.82;
      curZ += Math.sin(tiltX) * segLen * 0.78;
      seg.position.set(0, curY - segLen * 0.4, curZ);
      seg.rotation.x = tiltX;
      seg.castShadow = true;
      penjor.add(seg);

      if (i >= 4) {
        const frond = new THREE.Mesh(new THREE.ConeGeometry(0.085, 0.36, 4), janurMat);
        frond.position.set(0, curY - 0.18, curZ + 0.08);
        frond.rotation.x = 0.25;
        penjor.add(frond);
      }
    }

    // Hanging decorative Sampian tassel at tip
    const sampian = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.42, 6), goldMat);
    sampian.position.set(0, curY - 0.24, curZ + 0.14);
    sampian.rotation.x = Math.PI;
    penjor.add(sampian);

    parent.add(penjor);
    swaying.push({
      object: penjor,
      baseRotZ: 0,
      baseRotX: 0,
      speed: 1.25,
      amp: 0.035,
      phase: x * 0.5 + z * 0.3,
    });
  };

  addPenjor(-7.75, 0.6, Math.PI / 2, 0.96);
  addPenjor(-7.75, 3.8, Math.PI / 2, 0.96);

  // ==========================================================
  // 6. BAMBOO FENCES ALONG RIVERBANK & GARDEN
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
  addBambooFence(-4.2, -5.8, 9.2, -5.8);
  addBambooFence(-4.2, 8.6, 9.2, 8.6);

  // ==========================================================
  // 7. TROPICAL INDONESIAN FLORA (Curved Palms, Sculpted Trees, Bamboo)
  // ==========================================================
  const foliageDarkMat = new THREE.MeshStandardMaterial({ color: "#32693c", roughness: 0.82 });
  const foliageMidMat = new THREE.MeshStandardMaterial({ color: "#4b8c49", roughness: 0.8 });
  const foliageBrightMat = new THREE.MeshStandardMaterial({ color: "#72b04d", roughness: 0.78 });
  const palmLeafMat = new THREE.MeshStandardMaterial({
    color: "#4e9445",
    roughness: 0.72,
    side: THREE.DoubleSide,
  });
  const bambooLeafMat = new THREE.MeshStandardMaterial({
    color: "#69a64c",
    roughness: 0.74,
    side: THREE.DoubleSide,
  });
  const bambooNodeMat = new THREE.MeshStandardMaterial({ color: "#4b7032", roughness: 0.8 });
  const palmFrondGeo = createPalmFrondGeometry();
  const bambooLeafGeo = createBambooLeafGeometry();

  const addCoconutPalm = (x: number, z: number, height = 3.5, lean = 0.14) => {
    const palm = new THREE.Group();
    palm.position.set(x, 0, z);

    const segs = 9;
    const segH = height / segs;
    for (let s = 0; s < segs; s++) {
      const tMid = (s + 0.5) / segs;
      const y = (s + 0.5) * segH;
      const xOff = Math.pow(tMid, 1.45) * lean * 2.15;
      const rBot = 0.145 - s * 0.008;
      const rTop = rBot - 0.008;
      const seg = new THREE.Mesh(
        new THREE.CylinderGeometry(rTop, rBot, segH + 0.07, 10),
        barkMat,
      );
      seg.position.set(xOff, y, 0);
      seg.rotation.z = -lean * 1.08 * tMid;
      seg.castShadow = true;
      palm.add(seg);
    }

    const crown = new THREE.Group();
    crown.position.set(lean * 2.12, height + 0.04, 0);

    // Lower 5 arching outer fronds + 3 uplifted inner fronds using curved V-rib geometry
    for (let f = 0; f < 5; f++) {
      const frondGroup = new THREE.Group();
      frondGroup.rotation.y = (f / 5) * Math.PI * 2;
      const frond = new THREE.Mesh(palmFrondGeo, palmLeafMat);
      frond.rotation.x = 0.08;
      frond.castShadow = true;
      frondGroup.add(frond);
      crown.add(frondGroup);
    }
    for (let f = 0; f < 3; f++) {
      const frondGroup = new THREE.Group();
      frondGroup.rotation.y = ((f + 0.45) / 3) * Math.PI * 2;
      const frond = new THREE.Mesh(palmFrondGeo, foliageBrightMat);
      frond.rotation.x = -0.32;
      frond.scale.set(0.84, 0.84, 0.84);
      frond.castShadow = true;
      frondGroup.add(frond);
      crown.add(frondGroup);
    }

    for (let c = 0; c < 3; c++) {
      const nut = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 9, 8),
        new THREE.MeshStandardMaterial({ color: "#7a5329", roughness: 0.72 }),
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
      amp: 0.045,
      phase: x * 0.7 + z * 0.5,
    });
  };

  const addTropicalTree = (x: number, z: number, scale = 1.0, hasBlossoms = false) => {
    const tree = new THREE.Group();
    tree.position.set(x, 0, z);
    tree.scale.setScalar(scale);

    // Root flare + main trunk + forked branch
    const root = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.34, 0.3, 8), barkMat);
    root.position.y = 0.15;
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.22, 1.15, 8), barkMat);
    trunk.position.y = 0.72;
    trunk.castShadow = true;
    const branch = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.72, 7), barkMat);
    branch.position.set(0.24, 1.25, 0.08);
    branch.rotation.z = -0.55;
    tree.add(root, trunk, branch);

    const canopy1 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.9, 1), foliageDarkMat);
    canopy1.position.set(0, 1.55, 0);
    canopy1.castShadow = true;
    const canopy2 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.72, 1), foliageMidMat);
    canopy2.position.set(0.32, 1.92, 0.18);
    canopy2.castShadow = true;
    const canopy3 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.58, 1), foliageBrightMat);
    canopy3.position.set(-0.26, 2.08, -0.12);
    canopy3.castShadow = true;
    tree.add(canopy1, canopy2, canopy3);

    if (hasBlossoms) {
      for (let b = 0; b < 6; b++) {
        const ang = (b / 6) * Math.PI * 2;
        const blossom = new THREE.Mesh(
          new THREE.SphereGeometry(0.09, 7, 6),
          b % 2 === 0 ? ivorySilkMat : petalPinkMat,
        );
        blossom.position.set(Math.cos(ang) * 0.62, 1.75 + (b % 2) * 0.25, Math.sin(ang) * 0.62);
        tree.add(blossom);
      }
    }

    worldGroup.add(tree);

    swaying.push({
      object: tree,
      baseRotZ: 0,
      baseRotX: 0,
      speed: 1.1,
      amp: 0.022,
      phase: x + z,
    });
  };

  const addBambooCluster = (x: number, z: number) => {
    const clump = new THREE.Group();
    clump.position.set(x, 0, z);
    const stalkGreen = new THREE.MeshStandardMaterial({ color: "#79a84d", roughness: 0.7 });
    const offsets = [
      { dx: -0.18, dz: -0.12, h: 2.55, rz: 0.09, rx: -0.05, r: 0.04 },
      { dx: 0.16, dz: 0.1, h: 2.95, rz: -0.08, rx: 0.05, r: 0.044 },
      { dx: 0.02, dz: -0.2, h: 2.25, rz: 0.03, rx: -0.08, r: 0.036 },
      { dx: -0.08, dz: 0.18, h: 2.4, rz: 0.06, rx: 0.07, r: 0.038 },
      { dx: 0.14, dz: -0.08, h: 2.05, rz: -0.1, rx: -0.04, r: 0.034 },
    ];
    offsets.forEach((o) => {
      const stalkPivot = new THREE.Group();
      stalkPivot.position.set(o.dx, 0, o.dz);
      stalkPivot.rotation.set(o.rx, 0, o.rz);

      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(o.r * 0.78, o.r, o.h, 8),
        stalkGreen,
      );
      pole.position.y = o.h * 0.5;
      pole.castShadow = true;
      stalkPivot.add(pole);

      const nodeCount = Math.floor(o.h / 0.48);
      for (let n = 1; n <= nodeCount; n++) {
        const ny = n * 0.45;
        const frac = ny / o.h;
        const nr = o.r * (1 - frac * 0.2) + 0.004;
        const ring = new THREE.Mesh(new THREE.TorusGeometry(nr, 0.0055, 5, 10), bambooNodeMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = ny;
        stalkPivot.add(ring);
      }

      // Soft airy crown + fanning slender bamboo leaf sprays
      [o.h - 0.34, o.h - 0.02].forEach((ly, tierIdx) => {
        const puff = new THREE.Mesh(
          new THREE.IcosahedronGeometry(tierIdx === 1 ? 0.2 : 0.15, 1),
          tierIdx === 1 ? foliageBrightMat : foliageMidMat,
        );
        puff.scale.set(1.25, 0.56, 1.25);
        puff.position.y = ly;
        stalkPivot.add(puff);

        const sprayCount = tierIdx === 1 ? 6 : 4;
        for (let b = 0; b < sprayCount; b++) {
          const leafPivot = new THREE.Group();
          leafPivot.position.y = ly;
          leafPivot.rotation.y = (b / sprayCount) * Math.PI * 2 + tierIdx * 0.5 + o.dx * 3;
          const blade = new THREE.Mesh(bambooLeafGeo, bambooLeafMat);
          blade.rotation.x = 0.22;
          blade.scale.setScalar(tierIdx === 1 ? 1.15 : 0.92);
          leafPivot.add(blade);
          stalkPivot.add(leafPivot);
        }
      });

      clump.add(stalkPivot);
    });
    worldGroup.add(clump);

    swaying.push({
      object: clump,
      baseRotZ: 0,
      baseRotX: 0,
      speed: 1.35,
      amp: 0.025,
      phase: x * 0.6 + z * 0.4,
    });
  };

  const addFlowerShrub = (x: number, z: number, bloomColor: string) => {
    const bush = new THREE.Group();
    bush.position.set(x, 0, z);
    const leaves = new THREE.Mesh(new THREE.IcosahedronGeometry(0.3, 1), foliageMidMat);
    leaves.scale.set(1.22, 0.72, 1.22);
    leaves.position.y = 0.2;
    bush.add(leaves);
    const bMat = new THREE.MeshStandardMaterial({ color: bloomColor, roughness: 0.6 });
    for (let i = 0; i < 5; i++) {
      const f = new THREE.Mesh(new THREE.SphereGeometry(0.068, 8, 7), bMat);
      f.position.set(Math.cos(i * 1.25) * 0.22, 0.31 + (i % 2) * 0.06, Math.sin(i * 1.25) * 0.22);
      bush.add(f);
    }
    worldGroup.add(bush);
  };

  addCoconutPalm(-9.1, 5.8, 3.3, 0.14);
  addCoconutPalm(-7.8, -1.5, 3.6, -0.12);
  addCoconutPalm(9.2, -4.6, 3.8, -0.15);
  addCoconutPalm(9.5, 1.4, 3.5, 0.14);
  addCoconutPalm(5.6, 7.6, 3.4, -0.1);
  addCoconutPalm(-1.2, 7.8, 3.2, 0.12);

  addTropicalTree(-9.6, 7.4, 1.05, true);
  addTropicalTree(-3.4, 7.4, 0.95, false);
  addTropicalTree(0.4, 7.2, 1.05, true);
  addTropicalTree(8.8, 6.2, 1.12, true);
  addTropicalTree(9.8, -1.0, 1.02, false);
  addTropicalTree(-8.4, -7.8, 1.15, true);
  addTropicalTree(8.6, -7.6, 1.15, false);

  addBambooCluster(-7.8, 4.1);
  addBambooCluster(-3.8, -4.8);
  addBambooCluster(9.1, 3.8);
  addBambooCluster(9.4, -5.8);

  addFlowerShrub(-6.2, 1.0, "#f28c9c");
  addFlowerShrub(-6.2, 3.4, "#fff6dd");
  addFlowerShrub(2.2, 3.4, "#f2a2b3");
  addFlowerShrub(3.8, -1.6, "#fff5db");
  addFlowerShrub(-0.9, -3.1, "#f4978e");

  // ==========================================================
  // 8. GARDEN LANTERN POSTS & OVERHEAD FAIRY STRING LIGHTS
  // ==========================================================
  const addLanternPost = (x: number, z: number) => {
    const postGroup = new THREE.Group();
    postGroup.position.set(x, 0, z);

    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.07, 1.32, 7), darkWoodMat);
    pole.position.y = 0.66;
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
    bulb.position.y = 1.42;
    postGroup.add(bulb);

    const cap = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.16, 4), roofDarkMat);
    cap.rotation.y = Math.PI / 4;
    cap.position.y = 1.63;
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
    { x: 0.2, z: 3.4 },
    { x: 4.8, z: 3.5 },
    { x: 2.9, z: -0.9 },
    { x: 3.5, z: -3.2 },
    { x: -1.4, z: -1.8 },
  ].forEach((p) => addLanternPost(p.x, p.z));

  // Overhead Fairy String Light Festoons across courtyard & wedding aisle
  const stringAnchors: [THREE.Vector3, THREE.Vector3][] = [
    [new THREE.Vector3(-0.2, 2.65, 3.3), new THREE.Vector3(3.1, 2.65, 0.6)],
    [new THREE.Vector3(3.1, 2.65, 0.6), new THREE.Vector3(4.3, 2.9, -1.8)],
    [new THREE.Vector3(-0.2, 2.65, 3.3), new THREE.Vector3(-3.3, 2.65, 0.8)],
  ];
  const postCoords = [
    new THREE.Vector3(-0.2, 0, 3.3),
    new THREE.Vector3(3.1, 0, 0.6),
    new THREE.Vector3(4.3, 0, -1.8),
    new THREE.Vector3(-3.3, 0, 0.8),
  ];
  postCoords.forEach((pc, idx) => {
    const h = idx === 2 ? 2.95 : 2.7;
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.06, h, 7), darkWoodMat);
    pole.position.set(pc.x, h / 2, pc.z);
    pole.castShadow = true;
    worldGroup.add(pole);
  });

  const wireMat = new THREE.MeshBasicMaterial({ color: "#3d291a" });
  stringAnchors.forEach(([p1, p2]) => {
    const mid = p1.clone().add(p2).multiplyScalar(0.5);
    mid.y -= 0.42;
    const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 16, 0.012, 4, false), wireMat);
    worldGroup.add(tube);

    const bulbCount = 8;
    for (let b = 1; b < bulbCount; b++) {
      const pt = curve.getPoint(b / bulbCount);
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 6), stringLightMat);
      bulb.position.copy(pt).add(new THREE.Vector3(0, -0.05, 0));
      worldGroup.add(bulb);
    }
  });

  // ==========================================================
  // 9. SIX INTERACTIVE 3D STATIONS (EXACT COORDINATE SYNC)
  // ==========================================================

  // Station 1: SURAT / SAMBUTAN (x: 3.2, z: 2.8) — Carved Teak Podium + Wax-Sealed Letter
  {
    const st = new THREE.Group();
    st.position.set(3.2, 0, 2.8);
    const pedestal = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.14, 0.7), stoneTileMat);
    pedestal.position.y = 0.07;
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.13, 0.78, 10), darkWoodMat);
    post.position.y = 0.5;
    post.castShadow = true;
    const desk = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.09, 0.52), woodMat);
    desk.position.y = 0.92;
    desk.rotation.x = 0.18;
    desk.castShadow = true;
    const envelope = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.035, 0.26), ivorySilkMat);
    envelope.position.set(0, 0.98, 0.02);
    envelope.rotation.x = 0.18;
    const wax = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.02, 10), goldMat);
    wax.position.set(0, 1.0, 0.03);
    wax.rotation.x = 0.18;
    st.add(pedestal, post, desk, envelope, wax);
    worldGroup.add(st);
    stationMeshes.surat = st;
  }

  // Station 2: ACARA / PENDOPO PELAMINAN UTAMA (x: 6.0, z: -3.8, rotation.y = -0.68)
  // Rotated to face directly toward the central plaza & approaching character!
  const weddingCouple = buildWeddingCouple(payload.mode);
  {
    const pendopo = new THREE.Group();
    pendopo.position.set(6.0, 0, -3.8);
    pendopo.rotation.y = -0.68;

    // Tiered Stone Terrace & Wide Front Steps facing +Z
    const stoneBase = new THREE.Mesh(new THREE.BoxGeometry(5.1, 0.3, 4.4), stoneTileMat);
    stoneBase.position.y = 0.15;
    stoneBase.receiveShadow = true;
    stoneBase.castShadow = true;

    const woodDeck = new THREE.Mesh(new THREE.BoxGeometry(4.75, 0.1, 4.05), woodMat);
    woodDeck.position.y = 0.35;
    woodDeck.receiveShadow = true;

    const frontStep1 = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.14, 0.55), stoneTileMat);
    frontStep1.position.set(0, 0.07, 2.42);
    frontStep1.receiveShadow = true;
    const frontStep2 = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.14, 0.35), stoneTileMat);
    frontStep2.position.set(0, 0.21, 2.25);
    frontStep2.receiveShadow = true;

    // Raised Pelaminan Dais + Batik Carpet Runner positioned in open front stage bay
    const pelaminanDais = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.1, 1.85), darkWoodMat);
    pelaminanDais.position.set(0, 0.43, 0.45);
    pelaminanDais.receiveShadow = true;

    const batikRunner = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.025, 3.45), runnerBatikMat);
    batikRunner.position.set(0, 0.415, 0.55);
    batikRunner.receiveShadow = true;

    pendopo.add(stoneBase, woodDeck, frontStep1, frontStep2, pelaminanDais, batikRunner);

    // 4 Tall Wide-Spaced Carved Soko Guru Pillars with Stone Umpak Bases (generous headroom)
    [-2.15, 2.15].forEach((px) => {
      [-1.65, 1.25].forEach((pz) => {
        const umpak = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.21, 0.22, 8), stoneMat);
        umpak.position.set(px, 0.5, pz);
        const col = new THREE.Mesh(new THREE.BoxGeometry(0.22, 3.15, 0.22), darkWoodMat);
        col.position.set(px, 2.08, pz);
        col.castShadow = true;
        const goldCap = new THREE.Mesh(new THREE.BoxGeometry(0.27, 0.1, 0.27), goldMat);
        goldCap.position.set(px, 3.52, pz);
        pendopo.add(umpak, col, goldCap);
      });
    });

    // Tumpang Sari Stepped Ceiling Frame + Authentic 2-Tier Rectangular Joglo Jawa Roof
    const tumpang1 = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.16, 3.2), darkWoodMat);
    tumpang1.position.set(0, 3.64, -0.25);
    const tumpang2 = new THREE.Mesh(new THREE.BoxGeometry(2.65, 0.15, 2.05), woodMat);
    tumpang2.position.set(0, 3.8, -0.25);

    const jogloFascia = new THREE.Mesh(new THREE.BoxGeometry(5.52, 0.09, 4.72), darkWoodMat);
    jogloFascia.position.set(0, 3.72, -0.25);

    const jogloEaves = new THREE.Mesh(
      createLimasanRoofGeometry(5.68, 4.88, 2.58, 2.18, 0.78, 0.24, 0.48),
      terracottaMat,
    );
    jogloEaves.position.set(0, 3.75, -0.25);
    jogloEaves.castShadow = false;

    const jogloCrown = new THREE.Mesh(
      createLimasanRoofGeometry(2.68, 2.28, 0.14, 0.64, 1.24, 0.28, 0.52),
      roofDarkTileMat,
    );
    jogloCrown.position.set(0, 4.51, -0.25);
    jogloCrown.castShadow = false;

    const jogloRidge = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.07, 0.7, 10),
      roofDarkMat,
    );
    jogloRidge.rotation.x = Math.PI / 2;
    jogloRidge.position.set(0, 5.76, -0.25);

    const mustaka = new THREE.Mesh(new THREE.OctahedronGeometry(0.16, 0), goldMat);
    mustaka.scale.set(0.8, 1.55, 0.8);
    mustaka.position.set(0, 5.93, -0.25);
    pendopo.add(tumpang1, tumpang2, jogloFascia, jogloEaves, jogloCrown, jogloRidge, mustaka);

    // Glowing Brass Lampu Robyong Chandelier inside ceiling
    const robyongGroup = new THREE.Group();
    robyongGroup.position.set(0, 3.38, 0.1);
    const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.35, 6), goldMat);
    chain.position.y = 0.2;
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.025, 8, 18), goldMat);
    ring.rotation.x = Math.PI / 2;
    robyongGroup.add(chain, ring);
    for (let l = 0; l < 4; l++) {
      const a = (l / 4) * Math.PI * 2;
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), stringLightMat);
      bulb.position.set(Math.cos(a) * 0.25, -0.04, Math.sin(a) * 0.25);
      robyongGroup.add(bulb);
    }
    pendopo.add(robyongGroup);

    // Ornate Carved Gebyok Backdrop + Bridal Floral Arch behind Pelaminan
    const gebyok = new THREE.Mesh(new THREE.BoxGeometry(2.95, 1.98, 0.14), gebyokMat);
    gebyok.position.set(0, 1.42, -0.55);
    gebyok.castShadow = true;
    pendopo.add(gebyok);

    // Two Carved Pelaminan Chairs flanking backdrop
    [-0.95, 0.95].forEach((cx) => {
      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.12, 0.42), ivorySilkMat);
      seat.position.set(cx, 0.65, -0.05);
      const back = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.62, 0.1), darkWoodMat);
      back.position.set(cx, 0.92, -0.23);
      const cushion = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.48, 0.06), goldMat);
      cushion.position.set(cx, 0.92, -0.17);
      pendopo.add(seat, back, cushion);
    });

    // Lush Floral Arch framing the Gebyok & Couple
    const roseBlushMat = new THREE.MeshStandardMaterial({ color: "#f2a7b5", roughness: 0.55 });
    for (let i = 0; i <= 14; i++) {
      const ang = (i / 14) * Math.PI;
      const fx = Math.cos(ang) * 1.48;
      const fy = 0.85 + Math.sin(ang) * 1.55;
      const cluster = new THREE.Group();
      cluster.position.set(fx, fy, -0.38);
      const leaf = new THREE.Mesh(new THREE.IcosahedronGeometry(0.16, 1), foliageDarkMat);
      const bloom1 = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.11, 1),
        i % 3 === 0 ? roseBlushMat : ivorySilkMat,
      );
      bloom1.position.set(0.05, 0.04, 0.08);
      const bloom2 = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.08, 1),
        i % 2 === 0 ? goldMat : roseBlushMat,
      );
      bloom2.position.set(-0.07, -0.04, 0.07);
      cluster.add(leaf, bloom1, bloom2);
      pendopo.add(cluster);
    }

    // Standing Floral Urns flanking the front steps
    [-2.05, 2.05].forEach((ux) => {
      const urn = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.14, 0.46, 12), goldMat);
      urn.position.set(ux, 0.63, 1.72);
      const flowers = new THREE.Mesh(new THREE.IcosahedronGeometry(0.27, 1), ivorySilkMat);
      flowers.position.set(ux, 0.96, 1.72);
      const roseTop = new THREE.Mesh(new THREE.IcosahedronGeometry(0.17, 1), roseBlushMat);
      roseTop.position.set(ux, 1.08, 1.74);
      pendopo.add(urn, flowers, roseTop);
    });

    // Celebratory side table with Wedding Cake / Tumpeng inside left wing
    const sideTable = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.3, 0.45, 12), darkWoodMat);
    sideTable.position.set(-1.55, 0.62, 0.45);
    const cake1 = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.28, 0.16, 14), ivorySilkMat);
    cake1.position.set(-1.55, 0.92, 0.45);
    const cake2 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.17, 0.19, 0.16, 14),
      payload.mode === "wedding" ? ivorySilkMat : goldMat,
    );
    cake2.position.set(-1.55, 1.08, 0.45);
    pendopo.add(sideTable, cake1, cake2);

    // Mount Hero Bride & Groom cleanly at open front of Pelaminan facing +Z!
    weddingCouple.group.position.set(0, 0, 0.56);
    weddingCouple.group.scale.setScalar(1.08);
    pendopo.add(weddingCouple.group);

    // Twin tall Penjor arches symmetrically flanking the Pendopo steps
    addPenjor(-2.55, 2.05, 0.25, 1.06, pendopo);
    addPenjor(2.55, 2.05, -0.25, 1.06, pendopo);

    worldGroup.add(pendopo);
    stationMeshes.acara = pendopo;
  }

  // Station 3: UCAPAN & RSVP / BUKU TAMU (x: -1.9, z: 1.6)
  {
    const deskArea = new THREE.Group();
    deskArea.position.set(-1.9, 0, 1.6);

    const rug = new THREE.Mesh(
      new THREE.CylinderGeometry(1.18, 1.18, 0.03, 20),
      new THREE.MeshStandardMaterial({ color: "#e8d6b7", roughness: 0.9 }),
    );
    rug.position.y = 0.02;
    deskArea.add(rug);

    const tableCloth = new THREE.Mesh(new THREE.BoxGeometry(1.32, 0.56, 0.78), ivorySilkMat);
    tableCloth.position.y = 0.32;
    tableCloth.castShadow = true;
    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(1.36, 0.08, 0.82), woodMat);
    deskTop.position.y = 0.62;
    deskTop.castShadow = true;
    const book = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.05, 0.34), creamMat);
    book.position.set(-0.15, 0.69, 0.06);
    const vase = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.06, 0.2, 10), goldMat);
    vase.position.set(0.36, 0.76, -0.05);
    const floral = new THREE.Mesh(new THREE.IcosahedronGeometry(0.14, 1), petalPinkMat);
    floral.position.set(0.36, 0.92, -0.05);
    deskArea.add(tableCloth, deskTop, book, vase, floral);

    const greeter = buildChibiCharacter({
      gender: "cewek",
      outfitColor: "#b85d3b",
      accentColor: "#f3e5cc",
      hatType: "floral",
    });
    greeter.baseY = 0.04;
    greeter.group.position.set(0, 0.04, -0.62);
    celebrantRigs.push(greeter);
    deskArea.add(greeter.group);

    worldGroup.add(deskArea);
    stationMeshes.ucapan = deskArea;
  }

  // Station 4: KADO / MEJA HANTARAN (x: 1.2, z: -2.2)
  {
    const giftArea = new THREE.Group();
    giftArea.position.set(1.2, 0, -2.2);

    const tableTop = new THREE.Mesh(new THREE.BoxGeometry(1.68, 0.1, 0.96), woodMat);
    tableTop.position.y = 0.58;
    tableTop.castShadow = true;
    const runner = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.11, 1.04), runnerBatikMat);
    runner.position.y = 0.585;
    giftArea.add(tableTop, runner);

    [-0.7, 0.7].forEach((lx) => {
      [-0.36, 0.36].forEach((lz) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.04, 0.56, 6), darkWoodMat);
        leg.position.set(lx, 0.28, lz);
        giftArea.add(leg);
      });
    });

    const boxColors = ["#2d6a4f", "#d4a359", "#f4ebe0"];
    [
      { x: -0.45, y: 0.77, z: 0, s: 0.28, c: boxColors[0] },
      { x: 0.05, y: 0.82, z: -0.08, s: 0.36, c: boxColors[1] },
      { x: 0.48, y: 0.75, z: 0.08, s: 0.25, c: boxColors[2] },
    ].forEach((b) => {
      const box = new THREE.Mesh(
        new THREE.BoxGeometry(b.s, b.s, b.s),
        new THREE.MeshStandardMaterial({ color: b.c, roughness: 0.6 }),
      );
      box.position.set(b.x, b.y, b.z);
      box.castShadow = true;
      const ribbon = new THREE.Mesh(new THREE.BoxGeometry(b.s + 0.02, 0.04, b.s + 0.02), goldMat);
      ribbon.position.set(b.x, b.y + b.s * 0.15, b.z);
      giftArea.add(box, ribbon);
    });

    // Floating pastel balloons only for Kado anniversary mode; floral centerpiece for Wedding mode
    if (payload.mode === "kado") {
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
    } else {
      const centerpiece = new THREE.Mesh(new THREE.IcosahedronGeometry(0.16, 1), ivorySilkMat);
      centerpiece.position.set(0.55, 0.94, -0.2);
      giftArea.add(centerpiece);
    }

    worldGroup.add(giftArea);
    stationMeshes.kado = giftArea;
  }

  // Station 5: CERITA / KISAH KAMI (x: -2.1, z: -3.65, facing +Z down western garden path)
  {
    const board = new THREE.Group();
    board.position.set(-2.1, 0, -3.65);
    board.rotation.y = 0;

    const plinthBase = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.18, 0.75), stoneTileMat);
    plinthBase.position.y = 0.09;
    plinthBase.receiveShadow = true;
    board.add(plinthBase);

    [-0.86, 0.86].forEach((px) => {
      const umpak = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.14, 0.24), stoneMat);
      umpak.position.set(px, 0.22, 0);
      const p = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.72, 0.14), darkWoodMat);
      p.position.set(px, 1.12, 0);
      p.castShadow = true;
      const brace = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.38, 0.08), woodMat);
      brace.position.set(px > 0 ? px - 0.14 : px + 0.14, 1.78, 0);
      brace.rotation.z = px > 0 ? 0.72 : -0.72;
      board.add(umpak, p, brace);
    });

    // Recessed gold-framed showcase panel with Storyboard canvas art
    const frameBack = new THREE.Mesh(new THREE.BoxGeometry(1.66, 1.18, 0.1), darkWoodMat);
    frameBack.position.set(0, 1.24, 0);
    frameBack.castShadow = true;
    const goldTrim = new THREE.Mesh(new THREE.BoxGeometry(1.56, 1.08, 0.12), goldMat);
    goldTrim.position.set(0, 1.24, 0);
    const artMat = new THREE.MeshStandardMaterial({ map: storyBoardTex, roughness: 0.55 });
    const artFront = new THREE.Mesh(new THREE.PlaneGeometry(1.46, 1.0), artMat);
    artFront.position.set(0, 1.24, 0.066);
    board.add(frameBack, goldTrim, artFront);

    // Pitched Genteng shelter canopy roof + ridge cap
    const roofLeft = new THREE.Mesh(new THREE.BoxGeometry(2.18, 0.1, 0.54), terracottaMat);
    roofLeft.position.set(0, 2.08, 0.18);
    roofLeft.rotation.x = 0.32;
    roofLeft.castShadow = true;
    const roofRight = new THREE.Mesh(new THREE.BoxGeometry(2.18, 0.1, 0.54), terracottaMat);
    roofRight.position.set(0, 2.08, -0.18);
    roofRight.rotation.x = -0.32;
    roofRight.castShadow = true;
    const ridgeCap = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 2.24, 8), roofDarkMat);
    ridgeCap.rotation.z = Math.PI / 2;
    ridgeCap.position.set(0, 2.18, 0);
    board.add(roofLeft, roofRight, ridgeCap);

    // Hanging warm mini lantern on right eave
    const lShadeMat = new THREE.MeshStandardMaterial({
      color: "#fff3cc",
      emissive: new THREE.Color("#ffb64d"),
      emissiveIntensity: 0.8,
      roughness: 0.4,
    });
    lanternShadeMats.push(lShadeMat);
    const lanternCord = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.22, 6), darkWoodMat);
    lanternCord.position.set(0.95, 1.88, 0.28);
    const lanternLamp = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.18, 0.15), lShadeMat);
    lanternLamp.position.set(0.95, 1.72, 0.28);
    board.add(lanternCord, lanternLamp);

    // Low carved planter box with blooms
    const planter = new THREE.Mesh(new THREE.BoxGeometry(1.36, 0.24, 0.26), woodMat);
    planter.position.set(0, 0.28, 0.24);
    board.add(planter);
    for (let f = -3; f <= 3; f++) {
      const bloom = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.08, 1),
        f % 2 === 0 ? petalPinkMat : ivorySilkMat,
      );
      bloom.position.set(f * 0.18, 0.44, 0.25);
      board.add(bloom);
    }

    worldGroup.add(board);
    stationMeshes.cerita = board;
  }

  // Station 6: GALERI / GALERI MOMEN (x: 6.4, z: 0.55, off road z=2.2, facing straight +Z toward main road)
  {
    const gallery = new THREE.Group();
    gallery.position.set(6.4, 0, 0.55);
    gallery.rotation.y = 0;

    // Stepped stone terrace & stepping stone pad connecting smoothly southward to the main road
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.2, 0.9), stoneTileMat);
    plinth.position.y = 0.1;
    plinth.receiveShadow = true;
    plinth.castShadow = true;
    const stepPad = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.08, 0.65), stoneTileMat);
    stepPad.position.set(0, 0.04, 0.72);
    stepPad.receiveShadow = true;
    gallery.add(plinth, stepPad);

    // Twin chamfered dark teak pergola pillars with gold collars & angled side braces
    [-0.95, 0.95].forEach((px) => {
      const umpak = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.16, 0.26), stoneMat);
      umpak.position.set(px, 0.24, 0);
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.15, 1.85, 0.15), darkWoodMat);
      leg.position.set(px, 1.22, 0);
      leg.castShadow = true;
      const collar = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.07, 0.19), goldMat);
      collar.position.set(px, 1.85, 0);
      const brace = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.42, 0.08), woodMat);
      brace.position.set(px > 0 ? px - 0.16 : px + 0.16, 1.92, 0);
      brace.rotation.z = px > 0 ? 0.75 : -0.75;
      gallery.add(umpak, leg, collar, brace);
    });

    // Double-framed teak + antique gold gallery display with high-detail Polaroid canvas art
    const frameBack = new THREE.Mesh(new THREE.BoxGeometry(1.76, 1.28, 0.11), darkWoodMat);
    frameBack.position.set(0, 1.32, 0);
    frameBack.castShadow = true;
    const frameGold = new THREE.Mesh(new THREE.BoxGeometry(1.66, 1.18, 0.13), goldMat);
    frameGold.position.set(0, 1.32, 0);
    const artMat = new THREE.MeshStandardMaterial({ map: galleryBoardTex, roughness: 0.5 });
    const artFront = new THREE.Mesh(new THREE.PlaneGeometry(1.56, 1.08), artMat);
    artFront.position.set(0, 1.32, 0.072);
    gallery.add(frameBack, frameGold, artFront);

    // Architectural pitched Genteng canopy roof + gilded crown finial
    const roofFront = new THREE.Mesh(new THREE.BoxGeometry(2.38, 0.1, 0.62), terracottaMat);
    roofFront.position.set(0, 2.24, 0.21);
    roofFront.rotation.x = 0.34;
    roofFront.castShadow = true;
    const roofBack = new THREE.Mesh(new THREE.BoxGeometry(2.38, 0.1, 0.62), terracottaMat);
    roofBack.position.set(0, 2.24, -0.21);
    roofBack.rotation.x = -0.34;
    roofBack.castShadow = true;
    const ridge = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 2.44, 8), roofDarkMat);
    ridge.rotation.z = Math.PI / 2;
    ridge.position.set(0, 2.36, 0);
    const finial = new THREE.Mesh(new THREE.OctahedronGeometry(0.11, 0), goldMat);
    finial.scale.set(0.8, 1.4, 0.8);
    finial.position.set(0, 2.48, 0);
    gallery.add(roofFront, roofBack, ridge, finial);

    // 3 Warm under-eave spotlights illuminating the gallery art
    [-0.52, 0, 0.52].forEach((bx) => {
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 6), stringLightMat);
      bulb.position.set(bx, 2.08, 0.32);
      gallery.add(bulb);
    });

    // Floral rose & greenery garland draped across the top front beam
    for (let i = -4; i <= 4; i++) {
      const leaf = new THREE.Mesh(new THREE.IcosahedronGeometry(0.09, 1), foliageDarkMat);
      leaf.position.set(i * 0.2, 2.02 - Math.cos(i * 0.35) * 0.05, 0.12);
      const bloom = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.075, 1),
        i % 2 === 0 ? petalPinkMat : ivorySilkMat,
      );
      bloom.position.set(i * 0.2, 2.03 - Math.cos(i * 0.35) * 0.05, 0.18);
      gallery.add(leaf, bloom);
    }

    // Twin Terracotta Potted Plants flanking the stone plinth
    [-1.12, 1.12].forEach((px) => {
      const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.1, 0.26, 10), roofDarkMat);
      pot.position.set(px, 0.33, 0.16);
      const shrub = new THREE.Mesh(new THREE.IcosahedronGeometry(0.19, 1), foliageMidMat);
      shrub.position.set(px, 0.55, 0.16);
      const flower = new THREE.Mesh(new THREE.IcosahedronGeometry(0.08, 1), petalPinkMat);
      flower.position.set(px, 0.68, 0.2);
      gallery.add(pot, shrub, flower);
    });

    worldGroup.add(gallery);
    stationMeshes.galeri = gallery;
  }

  // Tag every station subtree mesh with userData.stationId for raycast hover & click
  Object.entries(stationMeshes).forEach(([id, root]) => {
    root.traverse((obj) => {
      obj.userData.stationId = id;
    });
  });

  // ==========================================================
  // 10. DETAILED LIVING FAUNA (Domba, Ayam, Bebek & Kupu-kupu)
  // ==========================================================
  const faunaRoster = [
    buildDetailedSheep(-1.2, -5.0, 0, 0.75),
    buildDetailedSheep(0.5, -5.1, 2.2, 0.6),
    buildDetailedChicken(-8.8, 0.6, 0.5, 0.75),
    buildDetailedChicken(-8.1, -0.5, 2.4, 0.6),
    buildDetailedChicken(4.6, 5.4, 4.1, 0.7),
    buildDetailedDuck(-3.9, 5.2, 1.0, 0.5),
    buildDetailedDuck(-3.8, -0.8, 3.2, 0.5),
  ];
  faunaRoster.forEach((item) => {
    worldGroup.add(item.group);
    animals.push(item);
  });

  // Fluttering Garden Butterflies near floral beds & wedding aisle
  const butterflyConfigs = [
    { color: "#f6d378", x: 1.6, y: 0.95, z: 1.35, phase: 0.2 },
    { color: "#f5b0c1", x: 3.4, y: 1.05, z: -1.3, phase: 1.6 },
    { color: "#a5d8e6", x: -6.0, y: 0.95, z: 3.3, phase: 3.1 },
    { color: "#f7dfb6", x: 6.2, y: 1.1, z: 1.4, phase: 4.5 },
    { color: "#eab6e3", x: -1.4, y: 1.0, z: -2.6, phase: 5.4 },
  ];
  butterflyConfigs.forEach((bc) => {
    const bf = buildButterfly(bc.color, bc.x, bc.y, bc.z, bc.phase);
    worldGroup.add(bf.group);
    butterflies.push(bf);
  });

  // ==========================================================
  // 11. DRIFTING BLOSSOM PETALS & TWINKLING FIREFLIES
  // ==========================================================
  const petalCount = 48;
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

  const fireflyCount = 72;
  const ffPositions = new Float32Array(fireflyCount * 3);
  const ffBasePositions = new Float32Array(fireflyCount * 3);
  const ffPhases = new Float32Array(fireflyCount);
  for (let i = 0; i < fireflyCount; i++) {
    const x = -9 + Math.random() * 19;
    const y = 0.45 + Math.random() * 2.2;
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
    weddingCouple.dispose();
    palmFrondGeo.dispose();
    bambooLeafGeo.dispose();
    [
      grassTex,
      dirtTex,
      waterTexture,
      sawahTexture,
      woodTex,
      darkWoodTex,
      bambooTex,
      roofTileTex,
      roofDarkTileTex,
      stoneTileTex,
      runnerBatikTex,
      gebyokTex,
      galleryBoardTex,
      storyBoardTex,
      glowTex,
      circleTex,
      signTex,
      skyTextures.pagi,
      skyTextures.sore,
      skyTextures.malam,
    ].forEach((t) => t.dispose());
  };

  return {
    waterTexture,
    sawahTexture,
    skyDomeMat,
    skyTextures,
    sunDisc,
    clouds,
    waterWheel,
    weddingCouple,
    stringLightMat,
    gateDoors: { left: leftGateDoor, right: rightGateDoor },
    swaying,
    koiFish,
    animals,
    butterflies,
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
