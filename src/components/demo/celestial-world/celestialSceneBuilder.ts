import * as THREE from "three";
import {
  CELESTIAL_NPCS,
  type CelestialStationId,
} from "./celestialData";
import {
  buildCelestialChibi,
  buildCelestialWeddingCouple,
  type CelestialChibiRig,
  type CelestialCoupleRig,
} from "./celestialCharacters";
import { sampleBridgeHeight } from "./celestialWalkable";

export interface CelestialWishOrb {
  group: THREE.Group;
  orbitRadius: number;
  orbitSpeed: number;
  orbitPhase: number;
  baseY: number;
  bobPhase: number;
  launching?: {
    elapsed: number;
    duration: number;
    startPos: THREE.Vector3;
    peakPos: THREE.Vector3;
  };
}

export interface CelestialDoveRig {
  group: THREE.Group;
  leftWing: THREE.Mesh;
  rightWing: THREE.Mesh;
  centerX: number;
  centerY: number;
  centerZ: number;
  rx: number;
  rz: number;
  speed: number;
  phase: number;
}

export interface CelestialNpcEntity {
  id: string;
  rig: CelestialChibiRig;
  talkIndicator: THREE.Mesh;
  basePos: THREE.Vector3;
}

export interface CelestialMistItem {
  sprite: THREE.Sprite;
  baseX: number;
  baseY: number;
  baseZ: number;
  phase: number;
}

export interface CelestialSceneHandles {
  root: THREE.Group;
  mainSanctuary: THREE.Group;
  haloRingOuter: THREE.Group;
  haloRingInner: THREE.Group;
  chandelier: THREE.Group;
  intertwinedRings: THREE.Group;
  coupleRig: CelestialCoupleRig;
  hourglass: THREE.Group;
  astrolabe: THREE.Group;
  npcEntities: CelestialNpcEntity[];
  doves: CelestialDoveRig[];
  mistSprites: CelestialMistItem[];
  skyUniforms: {
    uSkyTop: { value: THREE.Color };
    uSkyMid: { value: THREE.Color };
    uSkyBot: { value: THREE.Color };
    uAuraColor: { value: THREE.Color };
  };
  auroraUniforms: {
    uTime: { value: number };
    uOpacity: { value: number };
  };
  cloudMaterials: {
    primary: THREE.MeshStandardMaterial;
    secondary: THREE.MeshStandardMaterial;
    horizon: THREE.MeshStandardMaterial;
  };
  cloudsGroup: THREE.Group;
  moonGroup: THREE.Group;
  starPoints: THREE.Points;
  stardustPoints: THREE.Points;
  beacons: Map<CelestialStationId, THREE.Group>;
  wishOrbsGroup: THREE.Group;
  wishOrbs: CelestialWishOrb[];
  glowTexture: THREE.Texture;
}

function makeMat(
  color: number,
  opts: {
    roughness?: number;
    metalness?: number;
    emissive?: number;
    emissiveIntensity?: number;
    transparent?: boolean;
    opacity?: number;
    side?: THREE.Side;
    flatShading?: boolean;
  } = {},
): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: opts.roughness ?? 0.5,
    metalness: opts.metalness ?? 0.12,
    emissive: opts.emissive ?? 0x000000,
    emissiveIntensity: opts.emissiveIntensity ?? 0,
    transparent: opts.transparent ?? false,
    opacity: opts.opacity ?? 1,
    side: opts.side ?? THREE.FrontSide,
    flatShading: opts.flatShading ?? false,
  });
}

function buildWalkableFloatingIsland(
  radius: number,
  depth: number,
  topColor: number,
  rockColor: number,
  seed: number,
  goldMat: THREE.Material,
  crystalMat?: THREE.Material,
): THREE.Group {
  const group = new THREE.Group();

  // Faceted rocky underside starting at y = 0 downwards
  const rockGeo = new THREE.CylinderGeometry(
    radius * 0.96,
    radius * 0.14,
    depth,
    13,
    2,
  );
  const posAttr = rockGeo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < posAttr.count; i++) {
    const x = posAttr.getX(i);
    const y = posAttr.getY(i);
    const z = posAttr.getZ(i);
    const r = Math.hypot(x, z);
    if (r > 0.05) {
      const ang = Math.atan2(z, x);
      const disp = 0.88 + 0.2 * Math.sin(ang * 4 + seed * 2.1 + y * 0.65);
      posAttr.setX(i, x * disp);
      posAttr.setZ(i, z * disp);
    }
  }
  rockGeo.computeVertexNormals();

  const rockMesh = new THREE.Mesh(
    rockGeo,
    makeMat(rockColor, { roughness: 0.84, metalness: 0.08, flatShading: true }),
  );
  rockMesh.position.y = -depth * 0.5 + 0.05;
  rockMesh.castShadow = true;
  rockMesh.receiveShadow = true;
  group.add(rockMesh);

  // Clean deck cylinder flush at y = 0.45
  const capMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius * 0.94, 0.45, 24),
    makeMat(topColor, { roughness: 0.42, metalness: 0.06 }),
  );
  capMesh.position.y = 0.225;
  capMesh.castShadow = true;
  capMesh.receiveShadow = true;
  group.add(capMesh);

  const goldRim = new THREE.Mesh(
    new THREE.TorusGeometry(radius * 0.995, 0.05, 8, 36),
    goldMat,
  );
  goldRim.rotation.x = Math.PI / 2;
  goldRim.position.y = 0.43;
  group.add(goldRim);

  // Hanging glowing crystals underneath cliff
  if (crystalMat) {
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + seed;
      const cr = radius * (0.45 + (i % 2) * 0.16);
      const shard = new THREE.Mesh(
        new THREE.ConeGeometry(0.18 + (i % 2) * 0.08, 0.95 + (i % 2) * 0.45, 5),
        crystalMat,
      );
      shard.rotation.x = Math.PI;
      shard.position.set(
        Math.cos(a) * cr,
        -depth * 0.48 - (i % 2) * 0.25,
        Math.sin(a) * cr,
      );
      group.add(shard);
    }
  }

  return group;
}

function buildFlowerUrn(
  marbleMat: THREE.Material,
  goldMat: THREE.Material,
  flowerColors: number[],
): THREE.Group {
  const g = new THREE.Group();
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 0.45, 10), marbleMat);
  base.position.y = 0.225;
  base.castShadow = true;
  const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.18, 0.25, 10), goldMat);
  bowl.position.y = 0.56;
  g.add(base, bowl);

  const leafMat = makeMat(0x2d695b, { roughness: 0.72 });
  const bush = new THREE.Mesh(new THREE.IcosahedronGeometry(0.24, 1), leafMat);
  bush.position.y = 0.72;
  g.add(bush);

  flowerColors.forEach((col, i) => {
    const a = (i / flowerColors.length) * Math.PI * 2;
    const f = new THREE.Mesh(
      new THREE.SphereGeometry(0.085, 8, 8),
      makeMat(col, {
        roughness: 0.4,
        emissive: col,
        emissiveIntensity: 0.22,
      }),
    );
    f.position.set(Math.cos(a) * 0.16, 0.78 + (i % 2) * 0.07, Math.sin(a) * 0.16);
    g.add(f);
  });

  return g;
}

function buildOrnateBridge(
  axis: "z" | "x",
  startCoord: number,
  endCoord: number,
  fixedCoord: number,
  width: number,
  steps: number,
  marbleMat: THREE.Material,
  goldMat: THREE.Material,
  glowMat: THREE.Material,
): THREE.Group {
  const bridge = new THREE.Group();
  const minC = Math.min(startCoord, endCoord);
  const maxC = Math.max(startCoord, endCoord);
  const span = maxC - minC;
  const stepLen = span / steps;

  for (let i = 0; i < steps; i++) {
    const frac = (i + 0.5) / steps;
    const coord = minC + frac * span;
    const x = axis === "z" ? fixedCoord : coord;
    const z = axis === "z" ? coord : fixedCoord;
    const y = sampleBridgeHeight(x, z) ?? 0.45;

    const plank = new THREE.Mesh(
      axis === "z"
        ? new THREE.BoxGeometry(width, 0.12, stepLen * 0.94)
        : new THREE.BoxGeometry(stepLen * 0.94, 0.12, width),
      marbleMat,
    );
    plank.position.set(x, y - 0.06, z);
    plank.castShadow = true;
    plank.receiveShadow = true;
    bridge.add(plank);

    // Glowing gold trim strip along bridge outer edges
    for (const side of [-1, 1]) {
      const px = axis === "z" ? x + side * (width * 0.5 - 0.04) : x;
      const pz = axis === "z" ? z : z + side * (width * 0.5 - 0.04);

      const trim = new THREE.Mesh(
        axis === "z"
          ? new THREE.BoxGeometry(0.08, 0.14, stepLen * 0.96)
          : new THREE.BoxGeometry(stepLen * 0.96, 0.14, 0.08),
        goldMat,
      );
      trim.position.set(px, y - 0.04, pz);
      bridge.add(trim);

      if (i % 2 === 1) {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.48, 6), goldMat);
        post.position.set(px, y + 0.24, pz);
        const lantern = new THREE.Mesh(new THREE.OctahedronGeometry(0.11, 0), glowMat);
        lantern.position.set(px, y + 0.54, pz);
        bridge.add(post, lantern);
      }
    }
  }

  return bridge;
}

export function createWishStarOrb(
  glowTex: THREE.Texture,
  scale = 1,
): THREE.Group {
  const g = new THREE.Group();
  const core = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.18 * scale, 0),
    new THREE.MeshBasicMaterial({ color: 0xfff0ba }),
  );
  g.add(core);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.28 * scale, 0.02 * scale, 6, 18),
    new THREE.MeshBasicMaterial({
      color: 0xf7ce6e,
      transparent: true,
      opacity: 0.78,
    }),
  );
  ring.rotation.x = Math.PI / 3;
  g.add(ring);

  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: glowTex,
      color: 0xffe08a,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  sprite.scale.set(1.25 * scale, 1.25 * scale, 1);
  g.add(sprite);

  return g;
}

function buildStationBeacon(
  stationId: CelestialStationId,
  glowTex: THREE.Texture,
): THREE.Group {
  const beacon = new THREE.Group();
  beacon.userData.stationId = stationId;

  const diamond = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.32, 0),
    makeMat(0xffdf85, {
      roughness: 0.18,
      metalness: 0.72,
      emissive: 0xf0be54,
      emissiveIntensity: 0.9,
    }),
  );
  diamond.userData.stationId = stationId;
  beacon.add(diamond);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.54, 0.032, 6, 20),
    new THREE.MeshBasicMaterial({
      color: 0xf9db84,
      transparent: true,
      opacity: 0.85,
    }),
  );
  ring.rotation.x = Math.PI / 2;
  ring.userData.stationId = stationId;
  beacon.add(ring);

  const hitSphere = new THREE.Mesh(
    new THREE.SphereGeometry(1.05, 8, 8),
    new THREE.MeshBasicMaterial({ visible: false }),
  );
  hitSphere.userData.stationId = stationId;
  beacon.add(hitSphere);

  const halo = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: glowTex,
      color: 0xffdf85,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  halo.scale.set(2.0, 2.0, 1);
  halo.userData.stationId = stationId;
  beacon.add(halo);

  return beacon;
}

export function buildCelestialSanctuaryScene(options: {
  floorTexture: THREE.Texture;
  monogramTexture: THREE.Texture;
  gatePlaqueTexture: THREE.Texture;
  glowTexture: THREE.Texture;
  cloudMistTexture: THREE.Texture;
  photoUrls: string[];
}): CelestialSceneHandles {
  const root = new THREE.Group();

  const marbleMat = makeMat(0xf8f3e8, { roughness: 0.36, metalness: 0.06 });
  const creamMat = makeMat(0xefe4d0, { roughness: 0.44, metalness: 0.06 });
  const velvetCarpetMat = makeMat(0x2b1d4c, {
    roughness: 0.78,
    metalness: 0.06,
    emissive: 0x150d2b,
    emissiveIntensity: 0.25,
  });
  const goldMat = makeMat(0xefc86e, {
    roughness: 0.22,
    metalness: 0.84,
    emissive: 0x6f5018,
    emissiveIntensity: 0.28,
  });
  const warmGlowMat = makeMat(0xffe7a8, {
    roughness: 0.18,
    metalness: 0.28,
    emissive: 0xffcf70,
    emissiveIntensity: 1.25,
  });
  const crystalMat = makeMat(0x9be2ff, {
    roughness: 0.2,
    metalness: 0.3,
    emissive: 0x5fb8ff,
    emissiveIntensity: 0.65,
    flatShading: true,
  });

  // ============================================
  // 1. SKY DOME + CRESCENT MOON + AURORA + STARS
  // ============================================
  const skyUniforms = {
    uSkyTop: { value: new THREE.Color(0x05091a) },
    uSkyMid: { value: new THREE.Color(0x131d46) },
    uSkyBot: { value: new THREE.Color(0x28356b) },
    uAuraColor: { value: new THREE.Color(0x8aa8ff) },
  };

  const skyMesh = new THREE.Mesh(
    new THREE.SphereGeometry(105, 32, 20),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: skyUniforms,
      vertexShader: `
        varying vec3 vPos;
        void main() {
          vPos = normalize(position);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vPos;
        uniform vec3 uSkyTop;
        uniform vec3 uSkyMid;
        uniform vec3 uSkyBot;
        uniform vec3 uAuraColor;
        void main() {
          float h = clamp(vPos.y * 0.5 + 0.5, 0.0, 1.0);
          vec3 col = mix(uSkyBot, uSkyMid, smoothstep(0.18, 0.55, h));
          col = mix(col, uSkyTop, smoothstep(0.52, 0.92, h));
          float horizon = exp(-abs(vPos.y - 0.02) * 5.2);
          col += uAuraColor * horizon * 0.24;
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    }),
  );
  root.add(skyMesh);

  // Crescent Moon
  const moonGroup = new THREE.Group();
  moonGroup.position.set(-18, 16, -32);
  const moonSphere = new THREE.Mesh(
    new THREE.SphereGeometry(2.5, 24, 18),
    new THREE.MeshBasicMaterial({ color: 0xfff2cc }),
  );
  const moonCut = new THREE.Mesh(
    new THREE.SphereGeometry(2.38, 24, 18),
    new THREE.MeshBasicMaterial({ color: 0x0b1230 }),
  );
  moonCut.position.set(0.95, 0.45, 0.68);
  const moonHalo = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: options.glowTexture,
      color: 0xffdf99,
      transparent: true,
      opacity: 0.52,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  moonHalo.scale.set(16, 16, 1);
  moonGroup.add(moonSphere, moonCut, moonHalo);
  root.add(moonGroup);

  // 3D Aurora Curtain
  const auroraUniforms = {
    uTime: { value: 0 },
    uOpacity: { value: 0.14 },
  };
  const auroraMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(32, 36, 12, 64, 1, true, Math.PI * 0.65, Math.PI * 0.85),
    new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      uniforms: auroraUniforms,
      vertexShader: `
        varying vec2 vUv;
        uniform float uTime;
        void main() {
          vUv = uv;
          vec3 p = position;
          p.x += sin(uv.x * 10.0 + uTime * 0.45) * 1.5;
          p.z += cos(uv.x * 8.0 + uTime * 0.35) * 1.2;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform float uTime;
        uniform float uOpacity;
        void main() {
          float wave = 0.5 + 0.5 * sin(vUv.x * 18.0 + uTime * 0.65 + sin(vUv.x * 6.0 - uTime * 0.3));
          float vert = smoothstep(0.0, 0.25, vUv.y) * smoothstep(1.0, 0.28, vUv.y);
          float sideFade = smoothstep(0.0, 0.16, vUv.x) * smoothstep(1.0, 0.84, vUv.x);
          vec3 c1 = vec3(0.28, 0.92, 0.78);
          vec3 c2 = vec3(0.54, 0.52, 0.98);
          vec3 col = mix(c1, c2, vUv.y * 0.8 + wave * 0.2);
          float alpha = wave * vert * sideFade * uOpacity;
          gl_FragColor = vec4(col, alpha);
        }
      `,
    }),
  );
  auroraMesh.position.set(0, 12.5, -2);
  root.add(auroraMesh);

  // Stars & Golden Stardust
  const starCount = 850;
  const starPositions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const r = 38 + Math.random() * 48;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI * 0.68;
    starPositions[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
    starPositions[i * 3 + 1] = Math.cos(phi) * r * 0.75 + 2;
    starPositions[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * r;
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
  const starPoints = new THREE.Points(
    starGeo,
    new THREE.PointsMaterial({
      size: 0.48,
      map: options.glowTexture,
      color: 0xf4f6ff,
      transparent: true,
      opacity: 0.92,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  root.add(starPoints);

  const dustCount = 280;
  const dustPositions = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) {
    const r = 2 + Math.random() * 19;
    const a = Math.random() * Math.PI * 2;
    dustPositions[i * 3] = Math.cos(a) * r;
    dustPositions[i * 3 + 1] = -2.0 + Math.random() * 12.0;
    dustPositions[i * 3 + 2] = Math.sin(a) * r;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
  const stardustPoints = new THREE.Points(
    dustGeo,
    new THREE.PointsMaterial({
      size: 0.38,
      map: options.glowTexture,
      color: 0xffe494,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  root.add(stardustPoints);

  // ============================================
  // 2. VAST 3-TIER BILLOWING SEA OF CLOUDS (82+ CLUSTERS + 24 MIST SPRITES)
  // ============================================
  const cloudsGroup = new THREE.Group();
  const cloudMaterials = {
    primary: makeMat(0xd5dff8, {
      roughness: 0.9,
      metalness: 0.02,
      emissive: 0x3b4982,
      emissiveIntensity: 0.34,
    }),
    secondary: makeMat(0xc3cef0, {
      roughness: 0.92,
      metalness: 0.02,
      emissive: 0x2c3769,
      emissiveIntensity: 0.3,
    }),
    horizon: makeMat(0xe2e8fc, {
      roughness: 0.88,
      metalness: 0.02,
      emissive: 0x45538f,
      emissiveIntensity: 0.38,
    }),
  };

  const puffGeo = new THREE.SphereGeometry(1, 10, 8);
  const addCloudCluster = (
    x: number,
    y: number,
    z: number,
    scale: number,
    mat: THREE.Material,
    puffs = 4,
  ) => {
    const cluster = new THREE.Group();
    cluster.position.set(x, y, z);
    cluster.rotation.y = (x + z) * 0.27;
    for (let k = 0; k < puffs; k++) {
      const m = new THREE.Mesh(puffGeo, mat);
      const rScale = scale * (k === 0 ? 1.15 : 0.72 + (k % 2) * 0.18);
      m.scale.set(rScale * 1.45, rScale * 0.56, rScale * 1.12);
      const ang = (k / Math.max(1, puffs - 1)) * Math.PI * 2;
      const offset = k === 0 ? 0 : scale * 0.95;
      m.position.set(
        Math.cos(ang) * offset,
        k === 0 ? scale * 0.18 : 0,
        Math.sin(ang) * offset * 0.85,
      );
      cluster.add(m);
    }
    cloudsGroup.add(cluster);
  };

  // Tier 1: 54 dense overlapping cloud sea banks safely beneath all island decks
  for (let i = 0; i < 54; i++) {
    const ang = i * 2.39996;
    const dist = 3.5 + Math.sqrt(i / 54) * 41;
    const y = -3.6 - ((i * 7) % 5) * 0.58;
    const scale = 1.7 + (i % 4) * 0.44;
    addCloudCluster(
      Math.cos(ang) * dist,
      y,
      Math.sin(ang) * dist,
      scale,
      i % 2 === 0 ? cloudMaterials.primary : cloudMaterials.secondary,
      4,
    );
  }

  const isClearOfWalkable = (cx: number, cz: number, pad = 2.6): boolean => {
    const hubs: [number, number, number][] = [
      [0, 12.2, 4.2],
      [0, 0, 7.2],
      [-11.0, -0.8, 4.5],
      [11.0, -0.8, 4.5],
      [0, -11.2, 4.3],
    ];
    if (hubs.some(([hx, hz, hr]) => Math.hypot(cx - hx, cz - hz) < hr + pad)) {
      return false;
    }
    // Keep cross bridge corridors completely clear too
    if (Math.abs(cx) < 2.2 + pad && Math.abs(cz) < 12.2) return false;
    if (Math.abs(cz + 0.8) < 2.0 + pad && Math.abs(cx) < 11.2) return false;
    return true;
  };

  // Tier 2: 22 mid-air wispy clouds strictly outside island & bridge footprints
  for (let i = 0; i < 22; i++) {
    const ang = (i / 22) * Math.PI * 2 + 0.34;
    const dist = 16.2 + (i % 3) * 4.8;
    const cx = Math.cos(ang) * dist;
    const cz = Math.sin(ang) * dist;
    if (!isClearOfWalkable(cx, cz, 2.4)) continue;
    const y = -1.6 + (i % 4) * 0.72;
    addCloudCluster(cx, y, cz, 1.25 + (i % 3) * 0.25, cloudMaterials.primary, 3);
  }

  // Tier 3: 18 towering horizon cumulus peaks framing 360° skyline
  for (let i = 0; i < 18; i++) {
    const ang = (i / 18) * Math.PI * 2;
    const dist = 36 + (i % 3) * 7.5;
    const y = 0.6 + (i % 4) * 1.7;
    addCloudCluster(
      Math.cos(ang) * dist,
      y,
      Math.sin(ang) * dist,
      3.1 + (i % 3) * 0.75,
      cloudMaterials.horizon,
      5,
    );
  }
  root.add(cloudsGroup);

  // Tier 4: 24 soft billowing translucent cloud mist sprites kept below island decks
  const mistSprites: CelestialMistItem[] = [];
  for (let i = 0; i < 24; i++) {
    const ang = (i / 24) * Math.PI * 2;
    const dist = 6.5 + (i % 4) * 4.8;
    const mx = Math.cos(ang) * dist;
    const my = -2.4 - (i % 3) * 0.55;
    const mz = Math.sin(ang) * dist;
    const sp = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: options.cloudMistTexture,
        color: 0xeaf0ff,
        transparent: true,
        opacity: 0.42,
        depthWrite: false,
      }),
    );
    const sc = 4.6 + (i % 3) * 1.4;
    sp.scale.set(sc * 1.5, sc * 0.85, 1);
    sp.position.set(mx, my, mz);
    root.add(sp);
    mistSprites.push({
      sprite: sp,
      baseX: mx,
      baseY: my,
      baseZ: mz,
      phase: i * 0.65,
    });
  }

  // ============================================
  // 3. MAIN SANCTUARY (ISTANA KUBAH EMAS + PELAMINAN + COUPLE)
  // ============================================
  const mainSanctuary = new THREE.Group();
  const mainBase = buildWalkableFloatingIsland(
    6.05,
    4.6,
    0xf4ecdc,
    0x3b4872,
    1.7,
    goldMat,
    crystalMat,
  );
  mainSanctuary.add(mainBase);

  // Luminous golden star-compass mosaic plaza inlay flush at y = 0.455
  const compassFloor = new THREE.Mesh(
    new THREE.CylinderGeometry(4.4, 4.4, 0.02, 36),
    new THREE.MeshStandardMaterial({
      map: options.floorTexture,
      roughness: 0.28,
      metalness: 0.16,
    }),
  );
  compassFloor.position.y = 0.455;
  compassFloor.receiveShadow = true;
  mainSanctuary.add(compassFloor);

  // Ceremonial Royal Carpet Runner from South Bridge to Pelaminan
  const carpet = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.022, 5.2), velvetCarpetMat);
  carpet.position.set(0, 0.465, 2.75);
  carpet.receiveShadow = true;
  const carpetTrimL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.025, 5.2), goldMat);
  carpetTrimL.position.set(-0.74, 0.466, 2.75);
  const carpetTrimR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.025, 5.2), goldMat);
  carpetTrimR.position.set(0.74, 0.466, 2.75);
  mainSanctuary.add(carpet, carpetTrimL, carpetTrimR);

  // Glowing Couple Monogram Medallion centered on carpet clear in front of Pelaminan
  const monogramFloor = new THREE.Mesh(
    new THREE.CircleGeometry(0.84, 36),
    new THREE.MeshBasicMaterial({ map: options.monogramTexture }),
  );
  monogramFloor.rotation.x = -Math.PI / 2;
  monogramFloor.position.set(0, 0.482, 1.45);
  const monogramBezel = new THREE.Mesh(
    new THREE.TorusGeometry(0.84, 0.028, 8, 36),
    goldMat,
  );
  monogramBezel.rotation.x = Math.PI / 2;
  monogramBezel.position.set(0, 0.482, 1.45);
  mainSanctuary.add(monogramFloor, monogramBezel);

  // Marble Balustrade Railings leaving clean bridge openings at 0, 90, 180, 270 deg
  const gapAngles = [0, Math.PI / 2, Math.PI, Math.PI * 1.5];
  for (let i = 0; i < 32; i++) {
    const a = (i / 32) * Math.PI * 2;
    const nearBridge = gapAngles.some((ga) => {
      const diff = Math.atan2(Math.sin(a - ga), Math.cos(a - ga));
      return Math.abs(diff) < 0.27;
    });
    if (nearBridge) continue;
    const rx = Math.cos(a) * 5.72;
    const rz = Math.sin(a) * 5.72;
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.62, 8), marbleMat);
    post.position.set(rx, 0.76, rz);
    post.castShadow = true;
    mainSanctuary.add(post);

    if (i % 2 === 0) {
      const capOrb = new THREE.Mesh(new THREE.OctahedronGeometry(0.11, 0), warmGlowMat);
      capOrb.position.set(rx, 1.14, rz);
      mainSanctuary.add(capOrb);
    }
  }

  // Twin Luminous Waterfalls cascading off Sanctuary cliff edges
  for (const side of [-1, 1]) {
    const fallMat = new THREE.MeshBasicMaterial({
      color: 0xa4ecff,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide,
    });
    const stream = new THREE.Mesh(new THREE.BoxGeometry(0.85, 3.8, 0.16), fallMat);
    stream.position.set(side * 4.15, -1.65, 3.65);
    stream.rotation.y = side * 0.68;
    mainSanctuary.add(stream);
  }

  // 8 Grand Fluted Perimeter Columns + Draped Gold Garlands + Gothic Arch Ribs
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
    const x = Math.cos(a) * 4.25;
    const z = Math.sin(a) * 4.25;

    const plinth = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.36, 0.3, 12), marbleMat);
    plinth.position.set(x, 0.6, z);
    plinth.castShadow = true;
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.25, 4.15, 12), marbleMat);
    shaft.position.set(x, 2.82, z);
    shaft.castShadow = true;
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.26, 0.26, 12), goldMat);
    collar.position.set(x, 4.98, z);
    mainSanctuary.add(plinth, shaft, collar);

    // Draped Warm Fairy-Light Garland between adjacent pillars
    const nextA = ((i + 1) / 8) * Math.PI * 2 + Math.PI / 8;
    const nx = Math.cos(nextA) * 4.25;
    const nz = Math.sin(nextA) * 4.25;
    for (let b = 1; b <= 4; b++) {
      const f = b / 5;
      const gx = x + (nx - x) * f;
      const gz = z + (nz - z) * f;
      const gy = 4.92 - Math.sin(f * Math.PI) * 0.55;
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.075, 8, 8), warmGlowMat);
      bulb.position.set(gx, gy, gz);
      mainSanctuary.add(bulb);
    }
  }

  // Upper Crown Ring + Sapphire Dome + Gold Ribs + Spire
  const crownRing = new THREE.Mesh(new THREE.TorusGeometry(4.25, 0.16, 10, 36), goldMat);
  crownRing.rotation.x = Math.PI / 2;
  crownRing.position.y = 5.14;
  mainSanctuary.add(crownRing);

  const glassDome = new THREE.Mesh(
    new THREE.SphereGeometry(4.18, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.5),
    new THREE.MeshPhysicalMaterial({
      color: 0x8cb3fa,
      roughness: 0.16,
      metalness: 0.1,
      transparent: true,
      opacity: 0.52,
      emissive: 0x3b60be,
      emissiveIntensity: 0.34,
      flatShading: true,
    }),
  );
  glassDome.position.y = 5.16;
  mainSanctuary.add(glassDome);

  for (let i = 0; i < 4; i++) {
    const rib = new THREE.Mesh(new THREE.TorusGeometry(4.22, 0.07, 8, 32, Math.PI), goldMat);
    rib.position.y = 5.16;
    rib.rotation.y = (i * Math.PI) / 4;
    mainSanctuary.add(rib);
  }

  const finial = new THREE.Mesh(new THREE.ConeGeometry(0.36, 1.45, 6), warmGlowMat);
  finial.position.y = 10.05;
  mainSanctuary.add(finial);

  // Hanging Tiered Crystal Chandelier Inside Dome
  const chandelier = new THREE.Group();
  chandelier.position.y = 5.95;
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.8, 6), goldMat);
  rod.position.y = 0.9;
  const ringTop = new THREE.Mesh(new THREE.TorusGeometry(0.92, 0.04, 8, 24), goldMat);
  ringTop.rotation.x = Math.PI / 2;
  const ringBot = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.035, 8, 20), warmGlowMat);
  ringBot.rotation.x = Math.PI / 2;
  ringBot.position.y = -0.35;
  chandelier.add(rod, ringTop, ringBot);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const drop = new THREE.Mesh(new THREE.OctahedronGeometry(0.09, 0), warmGlowMat);
    drop.position.set(Math.cos(a) * 0.92, -0.15, Math.sin(a) * 0.92);
    chandelier.add(drop);
  }
  mainSanctuary.add(chandelier);

  // Twin Counter-Rotating Orbital Wedding Rings encircling Upper Dome cleanly above Pillars
  const haloRingOuter = new THREE.Group();
  haloRingOuter.position.y = 8.15;
  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(4.85, 0.085, 10, 48), goldMat);
  ring1.rotation.set(0.22, 0, 0.14);
  haloRingOuter.add(ring1);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.18, 0), warmGlowMat);
    gem.position.set(Math.cos(a) * 4.85, 0, Math.sin(a) * 4.85).applyEuler(ring1.rotation);
    haloRingOuter.add(gem);
  }
  mainSanctuary.add(haloRingOuter);

  const haloRingInner = new THREE.Group();
  haloRingInner.position.y = 8.15;
  const ring2 = new THREE.Mesh(
    new THREE.TorusGeometry(4.15, 0.055, 8, 42),
    makeMat(0xaec6ff, {
      roughness: 0.2,
      metalness: 0.65,
      emissive: 0x628bff,
      emissiveIntensity: 0.68,
    }),
  );
  ring2.rotation.set(-0.24, 0, -0.15);
  haloRingInner.add(ring2);
  mainSanctuary.add(haloRingInner);

  // Elevated Circular Pelaminan Dais + Floral Triple-Arch Backdrop + ROYAL BRIDE & GROOM!
  const pelaminanGroup = new THREE.Group();
  pelaminanGroup.position.set(0, 0.45, -1.65);

  const dais = new THREE.Mesh(new THREE.CylinderGeometry(1.62, 1.75, 0.27, 24), marbleMat);
  dais.position.y = 0.135;
  dais.castShadow = true;
  dais.receiveShadow = true;
  const daisTrim = new THREE.Mesh(new THREE.TorusGeometry(1.62, 0.04, 8, 28), goldMat);
  daisTrim.rotation.x = Math.PI / 2;
  daisTrim.position.y = 0.27;
  pelaminanGroup.add(dais, daisTrim);

  // Triple-Arched Golden Crescent Floral Backdrop behind Couple
  const centerArch = new THREE.Mesh(
    new THREE.TorusGeometry(1.22, 0.075, 8, 24, Math.PI),
    goldMat,
  );
  centerArch.position.set(0, 1.35, -0.78);
  pelaminanGroup.add(centerArch);
  for (const side of [-1, 1]) {
    const colPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 1.38, 8), marbleMat);
    colPillar.position.set(side * 1.22, 0.68, -0.78);
    const wingArch = new THREE.Mesh(
      new THREE.TorusGeometry(0.68, 0.055, 8, 16, Math.PI),
      goldMat,
    );
    wingArch.position.set(side * 0.92, 1.1, -0.58);
    wingArch.rotation.y = side * -0.28;
    pelaminanGroup.add(colPillar, wingArch);
  }
  const backdropFlowerCols = [0xfff9f0, 0xf7bfd4, 0xa8c6ff, 0xffdf99];
  for (let i = 0; i <= 10; i++) {
    const t = i / 10;
    const ang = t * Math.PI;
    const fl = new THREE.Mesh(
      new THREE.SphereGeometry(0.14 + (i % 2) * 0.04, 8, 8),
      makeMat(backdropFlowerCols[i % backdropFlowerCols.length]!, {
        roughness: 0.4,
        emissive: backdropFlowerCols[i % backdropFlowerCols.length]!,
        emissiveIntensity: 0.2,
      }),
    );
    fl.position.set(Math.cos(ang) * 1.24, 1.36 + Math.sin(ang) * 1.24, -0.76);
    pelaminanGroup.add(fl);
  }

  // Sculpted Royal Celestial Bride & Groom standing on Pelaminan!
  const coupleRig = buildCelestialWeddingCouple();
  coupleRig.group.position.set(0, 0.27, 0.08);
  coupleRig.group.userData.npcId = "couple-altar";
  coupleRig.group.traverse((o) => {
    o.userData.npcId = "couple-altar";
  });
  const coupleHit = new THREE.Mesh(
    new THREE.BoxGeometry(1.75, 1.9, 1.15),
    new THREE.MeshBasicMaterial({ visible: false }),
  );
  coupleHit.position.set(0, 1.05, 0.08);
  coupleHit.userData.npcId = "couple-altar";
  pelaminanGroup.add(coupleRig.group, coupleHit);

  // Twin Intertwining Wedding Rings hovering directly above Couple
  const intertwinedRings = new THREE.Group();
  intertwinedRings.position.set(0, 2.38, 0.05);
  const wRingA = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.052, 10, 28), goldMat);
  wRingA.rotation.set(0.45, 0.25, 0.35);
  wRingA.position.x = -0.14;
  const wRingB = new THREE.Mesh(
    new THREE.TorusGeometry(0.32, 0.052, 10, 28),
    makeMat(0xffffff, {
      roughness: 0.14,
      metalness: 0.85,
      emissive: 0xc2d8ff,
      emissiveIntensity: 0.55,
    }),
  );
  wRingB.rotation.set(-0.45, -0.25, -0.35);
  wRingB.position.x = 0.14;
  intertwinedRings.add(wRingA, wRingB);
  pelaminanGroup.add(intertwinedRings);

  mainSanctuary.add(pelaminanGroup);

  // 6 Fluted Floral Marble Urns flanking Sanctuary & Aisle
  const urnSpots: [number, number][] = [
    [-1.45, 4.75],
    [1.45, 4.75],
    [-2.1, 1.85],
    [2.1, 1.85],
    [-2.5, -1.6],
    [2.5, -1.6],
  ];
  urnSpots.forEach(([ux, uz]) => {
    const urn = buildFlowerUrn(marbleMat, goldMat, [0xffffff, 0xf7b9d4, 0x9fc2ff]);
    urn.position.set(ux, 0.45, uz);
    mainSanctuary.add(urn);
  });

  mainSanctuary.userData.stationId = "altar";
  root.add(mainSanctuary);

  // ============================================
  // 4. 4 ORNATE WALKABLE ARCHED CLOUD BRIDGES
  // ============================================
  root.add(buildOrnateBridge("z", 5.4, 9.3, 0, 2.45, 11, marbleMat, goldMat, warmGlowMat));
  root.add(buildOrnateBridge("x", -8.1, -5.4, -0.8, 1.9, 8, marbleMat, goldMat, warmGlowMat));
  root.add(buildOrnateBridge("x", 5.4, 8.1, -0.8, 1.9, 8, marbleMat, goldMat, warmGlowMat));
  root.add(buildOrnateBridge("z", -8.3, -5.5, 0, 2.25, 9, marbleMat, goldMat, warmGlowMat));

  // ============================================
  // 5. FRONT ARRIVAL ISLAND (GERBANG BINTANG + WELCOME BANNER)
  // ============================================
  const gerbangGroup = new THREE.Group();
  const frontBase = buildWalkableFloatingIsland(
    3.25,
    3.0,
    0xf4ecdc,
    0x3a476e,
    3.2,
    goldMat,
    crystalMat,
  );
  frontBase.position.set(0, 0, 12.2);
  gerbangGroup.add(frontBase);

  const gateArch = new THREE.Group();
  gateArch.position.set(0, 0.45, 12.7);
  for (const side of [-1, 1]) {
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 2.65, 10), marbleMat);
    pillar.position.set(side * 1.65, 1.32, 0);
    pillar.castShadow = true;
    const flame = new THREE.Mesh(new THREE.OctahedronGeometry(0.22, 0), warmGlowMat);
    flame.position.set(side * 1.65, 2.85, 0);
    const urn = buildFlowerUrn(marbleMat, goldMat, [0xffffff, 0xffdf99, 0xf7b9d4]);
    urn.position.set(side * 2.25, 0, -0.35);
    gateArch.add(pillar, flame, urn);
  }
  const mainSpan = new THREE.Mesh(new THREE.TorusGeometry(1.65, 0.12, 10, 28, Math.PI), goldMat);
  mainSpan.position.y = 2.55;
  const banner = new THREE.Mesh(
    new THREE.PlaneGeometry(2.35, 0.88),
    new THREE.MeshBasicMaterial({ map: options.gatePlaqueTexture, side: THREE.DoubleSide }),
  );
  banner.position.set(0, 2.35, 0.05);
  const gateCrest = new THREE.Mesh(new THREE.OctahedronGeometry(0.28, 0), warmGlowMat);
  gateCrest.position.y = 4.42;
  gateArch.add(mainSpan, banner, gateCrest);
  gerbangGroup.add(gateArch);
  gerbangGroup.userData.stationId = "gerbang";
  root.add(gerbangGroup);

  // ============================================
  // 6. WEST STORY ISLAND (SAKURA TREES, PERGOLA & STORY BOOKS)
  // ============================================
  const westIsland = buildWalkableFloatingIsland(
    3.6,
    3.1,
    0xf1e8d8,
    0x3a476e,
    5.1,
    goldMat,
    crystalMat,
  );
  westIsland.position.set(-11.0, 0, -0.8);
  westIsland.userData.stationId = "kisah";

  const blossomMat = makeMat(0xf5c8de, {
    roughness: 0.45,
    emissive: 0xd980ab,
    emissiveIntensity: 0.36,
    flatShading: true,
  });
  const treeCoords: [number, number, number][] = [
    [-1.45, -1.35, 1.1],
    [0.85, -1.75, 0.88],
    [-1.75, 1.15, 0.82],
  ];
  for (const [tx, tz, ts] of treeCoords) {
    const tr = new THREE.Mesh(new THREE.CylinderGeometry(0.18 * ts, 0.3 * ts, 2.1 * ts, 8), goldMat);
    tr.position.set(tx, 0.45 + 1.05 * ts, tz);
    tr.castShadow = true;
    const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(1.15 * ts, 1), blossomMat);
    crown.scale.y = 0.72;
    crown.position.set(tx, 0.45 + 2.25 * ts, tz);
    westIsland.add(tr, crown);
  }

  // Golden Hourglass Monument + Open Storybook Pedestal
  const hourglass = new THREE.Group();
  hourglass.position.set(-0.2, 1.35, -0.5);
  const cTop = new THREE.Mesh(new THREE.ConeGeometry(0.36, 0.52, 8), goldMat);
  cTop.rotation.x = Math.PI;
  cTop.position.y = 0.26;
  const cBot = new THREE.Mesh(new THREE.ConeGeometry(0.36, 0.52, 8), goldMat);
  cBot.position.y = -0.26;
  const sCore = new THREE.Mesh(new THREE.OctahedronGeometry(0.2, 0), warmGlowMat);
  hourglass.add(cTop, cBot, sCore);
  westIsland.add(hourglass);

  const ped = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.45, 0.65, 8), marbleMat);
  ped.position.set(-0.2, 0.77, -0.5);
  westIsland.add(ped);
  root.add(westIsland);

  // ============================================
  // 7. EAST GALLERY ISLAND (MARBLE COLONNADE & 3 ART EASELS)
  // ============================================
  const eastIsland = buildWalkableFloatingIsland(
    3.6,
    3.1,
    0xf4ecdc,
    0x3b4870,
    7.4,
    goldMat,
    crystalMat,
  );
  eastIsland.position.set(11.0, 0, -0.8);
  eastIsland.userData.stationId = "galeri";

  const texLoader = new THREE.TextureLoader();
  const easelConfigs: [number, number, number][] = [
    [-0.25, -1.65, 0.38],
    [1.35, -0.45, -1.05],
    [0.55, 1.45, -2.35],
  ];
  easelConfigs.forEach(([ex, ez, ry], idx) => {
    const easelGroup = new THREE.Group();
    easelGroup.position.set(ex, 0.45, ez);
    easelGroup.rotation.y = ry;

    const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.16, 1.25, 8), goldMat);
    stand.position.y = 0.62;
    easelGroup.add(stand);

    const frame = new THREE.Mesh(new THREE.BoxGeometry(1.42, 1.08, 0.09), goldMat);
    frame.position.y = 1.48;
    easelGroup.add(frame);

    const url = options.photoUrls[idx];
    const photoMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    if (url) {
      texLoader.load(url, (loadedTex) => {
        loadedTex.colorSpace = THREE.SRGBColorSpace;
        photoMat.map = loadedTex;
        photoMat.needsUpdate = true;
      });
    }
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(1.24, 0.9), photoMat);
    plane.position.set(0, 1.48, 0.055);
    easelGroup.add(plane);
    eastIsland.add(easelGroup);
  });

  // Flanking Floral Urns on East Gallery
  for (const ez of [-1.7, 1.7]) {
    const urn = buildFlowerUrn(marbleMat, goldMat, [0xffffff, 0xffdf99]);
    urn.position.set(-1.35, 0.45, ez);
    eastIsland.add(urn);
  }
  root.add(eastIsland);

  // ============================================
  // 8. NORTH OBSERVATORY ISLAND (STAR FOUNTAIN, ASTROLABE & CHEST)
  // ============================================
  const northIsland = buildWalkableFloatingIsland(
    3.4,
    3.0,
    0xf4ecdc,
    0x3a476e,
    9.2,
    goldMat,
    crystalMat,
  );
  northIsland.position.set(0, 0, -11.2);
  northIsland.userData.stationId = "bintang";

  // Luminous Star Wishing Fountain Basin
  const fRim = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.12, 8, 24), marbleMat);
  fRim.rotation.x = Math.PI / 2;
  fRim.position.set(0, 0.62, -0.35);
  const fWater = new THREE.Mesh(new THREE.CylinderGeometry(1.08, 1.08, 0.14, 24), crystalMat);
  fWater.position.set(0, 0.56, -0.35);
  northIsland.add(fRim, fWater);

  // Spinning 3-Ring Brass Astrolabe above Fountain
  const astrolabe = new THREE.Group();
  astrolabe.position.set(0, 1.95, -0.35);
  const astroOuter = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.05, 8, 28), goldMat);
  const astroInner = new THREE.Mesh(new THREE.TorusGeometry(0.68, 0.04, 8, 24), warmGlowMat);
  astroInner.rotation.x = Math.PI / 2;
  const astroCore = new THREE.Mesh(new THREE.OctahedronGeometry(0.24, 0), warmGlowMat);
  astrolabe.add(astroOuter, astroInner, astroCore);
  northIsland.add(astrolabe);

  // Ornate Keepsake Treasure Chest (Amplop Digital)
  const chestDais = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.25, 0.85), marbleMat);
  chestDais.position.set(1.55, 0.57, -0.95);
  const chestBox = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.48, 0.56), goldMat);
  chestBox.position.set(1.55, 0.94, -0.95);
  northIsland.add(chestDais, chestBox);
  root.add(northIsland);

  // ============================================
  // 9. 5 INTERACTIVE CELESTIAL NPCS & 10 CELESTIAL DOVES
  // ============================================
  const npcEntities: CelestialNpcEntity[] = [];
  for (const npc of CELESTIAL_NPCS) {
    const rig = buildCelestialChibi({
      gender: npc.gender,
      outfitColor: npc.outfitColor,
      accentColor: npc.accentColor,
      hairColor: npc.hairColor,
      accessory: npc.accessory,
    });
    rig.baseY = npc.position[1];
    rig.group.position.set(...npc.position);
    rig.group.rotation.y = npc.rotationY;
    rig.group.userData.npcId = npc.id;
    rig.group.traverse((child) => {
      child.userData.npcId = npc.id;
    });

    const hitSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.8, 8, 8),
      new THREE.MeshBasicMaterial({ visible: false }),
    );
    hitSphere.position.y = 0.75;
    hitSphere.userData.npcId = npc.id;
    rig.group.add(hitSphere);

    const talkIndicator = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.11, 0),
      warmGlowMat,
    );
    talkIndicator.position.set(0, 1.56, 0);
    talkIndicator.userData.npcId = npc.id;
    rig.group.add(talkIndicator);

    root.add(rig.group);
    npcEntities.push({
      id: npc.id,
      rig,
      talkIndicator,
      basePos: new THREE.Vector3(...npc.position),
    });
  }

  // 10 Fluttering Celestial White-Gold Doves
  const doves: CelestialDoveRig[] = [];
  const doveBodyMat = makeMat(0xffffff, {
    roughness: 0.3,
    emissive: 0xffe7ad,
    emissiveIntensity: 0.35,
  });
  for (let i = 0; i < 10; i++) {
    const dg = new THREE.Group();
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.11, 8, 6), doveBodyMat);
    body.scale.set(0.8, 0.8, 1.6);
    const lWing = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.02, 0.14), doveBodyMat);
    lWing.position.x = -0.14;
    const rWing = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.02, 0.14), doveBodyMat);
    rWing.position.x = 0.14;
    dg.add(body, lWing, rWing);
    root.add(dg);
    doves.push({
      group: dg,
      leftWing: lWing,
      rightWing: rWing,
      centerX: i < 6 ? 0 : (i % 2 === 0 ? -9 : 9),
      centerY: 5.5 + (i % 4) * 1.15,
      centerZ: i < 6 ? 0 : -1,
      rx: 6.5 + (i % 3) * 2.2,
      rz: 5.8 + (i % 3) * 2.1,
      speed: 0.36 + (i % 3) * 0.08,
      phase: (i / 10) * Math.PI * 2,
    });
  }

  // ============================================
  // 10. ORBITING INITIAL WISH STARS + STATION BEACONS
  // ============================================
  const wishOrbsGroup = new THREE.Group();
  const wishOrbs: CelestialWishOrb[] = [];
  for (let i = 0; i < 5; i++) {
    const orbGroup = createWishStarOrb(options.glowTexture, 0.95);
    wishOrbsGroup.add(orbGroup);
    wishOrbs.push({
      group: orbGroup,
      orbitRadius: 6.6 + (i % 3) * 1.2,
      orbitSpeed: 0.14 + (i % 2) * 0.04,
      orbitPhase: (i / 5) * Math.PI * 2,
      baseY: 6.6 + (i % 3) * 0.85,
      bobPhase: i * 1.4,
    });
  }
  root.add(wishOrbsGroup);

  const beacons = new Map<CelestialStationId, THREE.Group>();
  const beaconSpots: [CelestialStationId, number, number, number][] = [
    ["gerbang", 0, 5.2, 12.7],
    ["altar", 0, 10.9, 0],
    ["kisah", -11.0, 4.4, -0.8],
    ["galeri", 11.0, 4.0, -0.8],
    ["bintang", 0, 4.3, -11.2],
  ];
  for (const [id, bx, by, bz] of beaconSpots) {
    const b = buildStationBeacon(id, options.glowTexture);
    b.position.set(bx, by, bz);
    root.add(b);
    beacons.set(id, b);
  }

  return {
    root,
    mainSanctuary,
    haloRingOuter,
    haloRingInner,
    chandelier,
    intertwinedRings,
    coupleRig,
    hourglass,
    astrolabe,
    npcEntities,
    doves,
    mistSprites,
    skyUniforms,
    auroraUniforms,
    cloudMaterials,
    cloudsGroup,
    moonGroup,
    starPoints,
    stardustPoints,
    beacons,
    wishOrbsGroup,
    wishOrbs,
    glowTexture: options.glowTexture,
  };
}
