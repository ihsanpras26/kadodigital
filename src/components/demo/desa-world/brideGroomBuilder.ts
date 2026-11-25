import * as THREE from "three";
import type { DesaMode } from "@/data/desaWorldData";
import {
  createBatikParangTexture,
  createBeskapTexture,
  createKebayaBrocadeTexture,
  createWeddingFaceTexture,
} from "./textures";

export interface HeroCoupleRig {
  group: THREE.Group;
  bride: {
    group: THREE.Group;
    headGroup: THREE.Group;
    faceMat: THREE.MeshStandardMaterial;
    openTex: THREE.CanvasTexture;
    blinkTex: THREE.CanvasTexture;
    rightArm: THREE.Group;
    rightElbow: THREE.Group;
    leftArm: THREE.Group;
    bouquet: THREE.Group;
    mentuls: THREE.Group[];
    veil?: THREE.Mesh;
  };
  groom: {
    group: THREE.Group;
    headGroup: THREE.Group;
    faceMat: THREE.MeshStandardMaterial;
    openTex: THREE.CanvasTexture;
    blinkTex: THREE.CanvasTexture;
    leftArm: THREE.Group;
    leftElbow: THREE.Group;
    rightArm: THREE.Group;
  };
  heartMotes: {
    mesh: THREE.Mesh;
    baseX: number;
    baseY: number;
    baseZ: number;
    phase: number;
  }[];
  wasBlinking: boolean;
  dispose: () => void;
}

export function buildWeddingCouple(mode: DesaMode): HeroCoupleRig {
  const group = new THREE.Group();

  const batikTex = createBatikParangTexture("#4f2d1b", "#dca952", "#f2e2c2");
  const kebayaTex = createKebayaBrocadeTexture();
  const beskapTex = createBeskapTexture();
  const brideOpenTex = createWeddingFaceTexture("bride", "#f7d4b8", "open");
  const brideBlinkTex = createWeddingFaceTexture("bride", "#f7d4b8", "blink");
  const groomOpenTex = createWeddingFaceTexture("groom", "#edc3a1", "open");
  const groomBlinkTex = createWeddingFaceTexture("groom", "#edc3a1", "blink");

  const batikMat = new THREE.MeshStandardMaterial({
    map: batikTex,
    roughness: 0.72,
    metalness: 0.04,
  });
  const kebayaMat = new THREE.MeshStandardMaterial({
    map: kebayaTex,
    roughness: 0.56,
    metalness: 0.06,
  });
  const beskapMat = new THREE.MeshStandardMaterial({
    map: beskapTex,
    roughness: 0.54,
    metalness: 0.08,
  });
  const goldMat = new THREE.MeshStandardMaterial({
    color: "#e6b85c",
    roughness: 0.28,
    metalness: 0.72,
  });
  const skinBrideMat = new THREE.MeshStandardMaterial({
    color: "#f7d4b8",
    roughness: 0.64,
    emissive: new THREE.Color("#2a150b"),
    emissiveIntensity: 0.06,
  });
  const skinGroomMat = new THREE.MeshStandardMaterial({
    color: "#edc3a1",
    roughness: 0.66,
    emissive: new THREE.Color("#261309"),
    emissiveIntensity: 0.06,
  });
  const hairMat = new THREE.MeshStandardMaterial({
    color: "#221611",
    roughness: 0.68,
  });
  const jasmineMat = new THREE.MeshStandardMaterial({
    color: "#fffcf4",
    roughness: 0.45,
  });
  const shoeMat = new THREE.MeshStandardMaterial({
    color: "#241712",
    roughness: 0.42,
    metalness: 0.15,
  });

  // ========================================================
  // BRIDE (NADYA) — Stylized Storybook Proportions & Hand Bouquet
  // ========================================================
  const brideGroup = new THREE.Group();

  const shadowMat = new THREE.MeshBasicMaterial({
    color: 0x16241b,
    transparent: true,
    opacity: 0.24,
    depthWrite: false,
  });
  const brideShadow = new THREE.Mesh(new THREE.CircleGeometry(0.32, 22), shadowMat);
  brideShadow.rotation.x = -Math.PI / 2;
  brideShadow.position.y = 0.015;
  brideGroup.add(brideShadow);

  // Pearl-studded selop shoes
  [-0.085, 0.085].forEach((sx) => {
    const selop = new THREE.Mesh(new THREE.SphereGeometry(0.062, 12, 10), shoeMat);
    selop.scale.set(0.88, 0.56, 1.5);
    selop.position.set(sx, 0.032, 0.07);
    brideGroup.add(selop);
  });

  // Graceful A-line Batik Parang Jarik skirt (y: 0.04..0.62)
  const skirtPoints = [
    new THREE.Vector2(0.25, 0.04),
    new THREE.Vector2(0.225, 0.24),
    new THREE.Vector2(0.195, 0.45),
    new THREE.Vector2(0.16, 0.62),
  ];
  const skirtMesh = new THREE.Mesh(new THREE.LatheGeometry(skirtPoints, 24), batikMat);
  skirtMesh.castShadow = true;
  skirtMesh.receiveShadow = true;
  brideGroup.add(skirtMesh);

  // Center Wiru pleat fold
  const wiru = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.56, 0.045), batikMat);
  wiru.position.set(0.01, 0.33, 0.195);
  wiru.rotation.x = -0.09;
  brideGroup.add(wiru);

  // Fitted Kebaya Kutubaru Brokat bodice + gentle peplum flare (y: 0.59..1.03)
  const bodicePoints = [
    new THREE.Vector2(0.195, 0.59),
    new THREE.Vector2(0.15, 0.68),
    new THREE.Vector2(0.148, 0.78),
    new THREE.Vector2(0.185, 0.92),
    new THREE.Vector2(0.16, 1.01),
    new THREE.Vector2(0.09, 1.05),
  ];
  const bodice = new THREE.Mesh(new THREE.LatheGeometry(bodicePoints, 22), kebayaMat);
  bodice.castShadow = true;
  brideGroup.add(bodice);

  // Kutubaru front center panel + draped shoulder selendang
  const kutubaru = new THREE.Mesh(new THREE.BoxGeometry(0.115, 0.34, 0.048), kebayaMat);
  kutubaru.position.set(0, 0.85, 0.16);
  kutubaru.rotation.x = -0.07;
  const selendang = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.42, 0.03),
    new THREE.MeshStandardMaterial({ color: "#d6a456", roughness: 0.52, metalness: 0.12 }),
  );
  selendang.position.set(0.12, 0.84, 0.13);
  selendang.rotation.z = -0.22;
  selendang.rotation.y = 0.25;
  brideGroup.add(kutubaru, selendang);

  // Sculpted Gold Pending Belt & Buckle
  const waistBelt = new THREE.Mesh(
    new THREE.CylinderGeometry(0.156, 0.164, 0.05, 22),
    goldMat,
  );
  waistBelt.position.y = 0.69;
  const beltBuckle = new THREE.Mesh(new THREE.OctahedronGeometry(0.038, 0), goldMat);
  beltBuckle.scale.set(1.2, 0.9, 0.5);
  beltBuckle.position.set(0, 0.69, 0.172);
  brideGroup.add(waistBelt, beltBuckle);

  // Layered Gold Kalung Susun necklace
  [0, 1].forEach((tier) => {
    const col = new THREE.Mesh(
      new THREE.TorusGeometry(0.112 + tier * 0.024, 0.011, 8, 22, Math.PI * 1.12),
      goldMat,
    );
    col.rotation.x = Math.PI * 0.54;
    col.rotation.z = -Math.PI * 0.06;
    col.position.set(0, 1.005 - tier * 0.028, 0.04);
    brideGroup.add(col);
  });

  // Bride Inner Left Arm reaching inward to hold Groom's right hand
  const brideLeftArm = new THREE.Group();
  brideLeftArm.position.set(-0.185, 0.98, 0.02);
  brideLeftArm.rotation.set(-0.34, 0, -0.34);
  const bUpperL = new THREE.Mesh(new THREE.CylinderGeometry(0.046, 0.04, 0.24, 12), kebayaMat);
  bUpperL.position.y = -0.11;
  bUpperL.castShadow = true;
  const bPuffL = new THREE.Mesh(new THREE.SphereGeometry(0.056, 10, 10), kebayaMat);
  const bHandL = new THREE.Mesh(new THREE.SphereGeometry(0.042, 10, 10), skinBrideMat);
  bHandL.position.y = -0.25;
  brideLeftArm.add(bPuffL, bUpperL, bHandL);

  // Bride Outer Right Articulated Arm cradling Hand Bouquet
  const brideRightArm = new THREE.Group();
  brideRightArm.position.set(0.185, 0.98, 0.02);
  brideRightArm.rotation.set(-0.18, 0, -0.18);
  const bPuffR = new THREE.Mesh(new THREE.SphereGeometry(0.056, 10, 10), kebayaMat);
  const bUpperR = new THREE.Mesh(new THREE.CylinderGeometry(0.046, 0.04, 0.18, 12), kebayaMat);
  bUpperR.position.y = -0.09;
  bUpperR.castShadow = true;

  const brideRightElbow = new THREE.Group();
  brideRightElbow.position.set(0, -0.17, 0);
  brideRightElbow.rotation.set(-0.98, 0, -0.45);
  const bForeR = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.033, 0.16, 10), kebayaMat);
  bForeR.position.y = -0.07;
  const bHandR = new THREE.Mesh(new THREE.SphereGeometry(0.04, 10, 10), skinBrideMat);
  bHandR.position.y = -0.16;

  // Lush Bridal Hand Bouquet nestled warmly in her right hand
  const bouquet = new THREE.Group();
  bouquet.position.set(0.01, -0.16, 0.04);
  bouquet.rotation.x = 0.82;
  const wrap = new THREE.Mesh(
    new THREE.ConeGeometry(0.065, 0.15, 10),
    new THREE.MeshStandardMaterial({ color: "#e8d2ab", roughness: 0.7 }),
  );
  wrap.rotation.x = Math.PI * 0.9;
  wrap.position.y = -0.05;
  bouquet.add(wrap);

  const roseIvory = new THREE.MeshStandardMaterial({ color: "#fffaf0", roughness: 0.48 });
  const roseBlush = new THREE.MeshStandardMaterial({ color: "#f3aab9", roughness: 0.52 });
  const leafMat = new THREE.MeshStandardMaterial({ color: "#4e7c55", roughness: 0.72 });
  for (let i = 0; i < 7; i++) {
    const a = (i / 6) * Math.PI * 2;
    const rad = i === 6 ? 0 : 0.056;
    const rose = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.036, 1),
      i % 2 === 0 ? roseIvory : roseBlush,
    );
    rose.position.set(Math.cos(a) * rad, 0.025 + (i === 6 ? 0.022 : 0), Math.sin(a) * rad);
    bouquet.add(rose);
  }
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const leaf = new THREE.Mesh(new THREE.BoxGeometry(0.034, 0.009, 0.07), leafMat);
    leaf.position.set(Math.cos(a) * 0.08, -0.005, Math.sin(a) * 0.08);
    leaf.rotation.y = -a;
    bouquet.add(leaf);
  }

  brideRightElbow.add(bForeR, bHandR, bouquet);
  brideRightArm.add(bPuffR, bUpperR, brideRightElbow);
  brideGroup.add(brideLeftArm, brideRightArm);

  // Bride Neck + Expressive Stylized Head (radius 0.258)
  const brideNeck = new THREE.Mesh(
    new THREE.CylinderGeometry(0.058, 0.068, 0.09, 12),
    skinBrideMat,
  );
  brideNeck.position.y = 1.07;
  brideGroup.add(brideNeck);

  const brideHead = new THREE.Group();
  brideHead.position.y = 1.32;
  brideGroup.add(brideHead);

  const brideFaceMat = new THREE.MeshStandardMaterial({
    map: brideOpenTex,
    roughness: 0.58,
    emissive: new THREE.Color("#2b150b"),
    emissiveIntensity: 0.08,
  });
  const brideHeadMesh = new THREE.Mesh(new THREE.SphereGeometry(0.258, 30, 24), brideFaceMat);
  brideHeadMesh.scale.set(1.02, 0.99, 0.96);
  brideHeadMesh.rotation.y = -Math.PI / 2;
  brideHeadMesh.castShadow = true;
  brideHead.add(brideHeadMesh);

  // Ears + gleaming pearl drop earrings
  [-0.255, 0.255].forEach((ex) => {
    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.042, 10, 10), skinBrideMat);
    ear.position.set(ex, -0.02, 0);
    const pearl = new THREE.Mesh(new THREE.SphereGeometry(0.022, 8, 8), jasmineMat);
    pearl.position.set(ex * 1.04, -0.065, 0.01);
    brideHead.add(ear, pearl);
  });

  // Volumetric Sculpted Hair Cap + Cheek-framing Side Waves + Konde
  const brideHairTop = new THREE.Mesh(
    new THREE.SphereGeometry(0.27, 26, 18, 0, Math.PI * 2, 0, Math.PI * 0.44),
    hairMat,
  );
  brideHairTop.scale.set(1.02, 1.01, 0.98);
  brideHairTop.rotation.x = -0.34;
  brideHead.add(brideHairTop);

  const brideHairBack = new THREE.Mesh(
    new THREE.SphereGeometry(
      0.27,
      22,
      16,
      Math.PI * 0.84,
      Math.PI * 1.32,
      Math.PI * 0.18,
      Math.PI * 0.62,
    ),
    hairMat,
  );
  brideHairBack.scale.set(1.02, 1.0, 0.98);
  brideHead.add(brideHairBack);

  [-0.215, 0.215].forEach((sx) => {
    const wave = new THREE.Mesh(new THREE.SphereGeometry(0.085, 12, 10), hairMat);
    wave.scale.set(0.75, 1.4, 0.85);
    wave.position.set(sx, 0.05, 0.125);
    brideHead.add(wave);
  });

  const konde = new THREE.Mesh(new THREE.SphereGeometry(0.145, 16, 14), hairMat);
  konde.scale.set(1.22, 0.9, 0.72);
  konde.position.set(0, -0.01, -0.255);
  konde.castShadow = true;
  brideHead.add(konde);

  const mentuls: THREE.Group[] = [];
  let veilMesh: THREE.Mesh | undefined;

  if (mode === "wedding") {
    // Layered Metallic Gold Siger Crown + Ruby Centerpiece
    const crownBand = new THREE.Mesh(
      new THREE.TorusGeometry(0.242, 0.02, 8, 28, Math.PI * 1.25),
      goldMat,
    );
    crownBand.rotation.x = Math.PI * 0.36;
    crownBand.rotation.z = -Math.PI * 0.125;
    crownBand.position.set(0, 0.14, 0.04);
    brideHead.add(crownBand);

    // Sculpted 5-peak ExtrudeGeometry Gold Siger Diadem curved to hug the crown band
    const sigerShape = new THREE.Shape();
    sigerShape.moveTo(-0.185, 0);
    sigerShape.quadraticCurveTo(-0.175, 0.05, -0.15, 0.068);
    sigerShape.quadraticCurveTo(-0.125, 0.045, -0.105, 0.048);
    sigerShape.quadraticCurveTo(-0.088, 0.082, -0.072, 0.102);
    sigerShape.quadraticCurveTo(-0.048, 0.076, -0.032, 0.082);
    sigerShape.quadraticCurveTo(-0.014, 0.128, 0, 0.152);
    sigerShape.quadraticCurveTo(0.014, 0.128, 0.032, 0.082);
    sigerShape.quadraticCurveTo(0.048, 0.076, 0.072, 0.102);
    sigerShape.quadraticCurveTo(0.088, 0.082, 0.105, 0.048);
    sigerShape.quadraticCurveTo(0.125, 0.045, 0.15, 0.068);
    sigerShape.quadraticCurveTo(0.175, 0.05, 0.185, 0);
    sigerShape.quadraticCurveTo(0, 0.014, -0.185, 0);

    const sigerGeo = new THREE.ExtrudeGeometry(sigerShape, {
      depth: 0.016,
      bevelEnabled: true,
      bevelThickness: 0.004,
      bevelSize: 0.0035,
      bevelSegments: 2,
      curveSegments: 8,
    });
    const sigerPos = sigerGeo.attributes.position;
    for (let i = 0; i < sigerPos.count; i++) {
      const vx = sigerPos.getX(i);
      const vz = sigerPos.getZ(i);
      sigerPos.setZ(i, vz - vx * vx * 2.15);
    }
    sigerGeo.computeVertexNormals();

    const sigerCrown = new THREE.Mesh(sigerGeo, goldMat);
    sigerCrown.position.set(0, 0.175, 0.21);
    sigerCrown.rotation.x = -0.22;
    sigerCrown.castShadow = true;

    const centerGem = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.022, 0),
      new THREE.MeshStandardMaterial({ color: "#b63b4e", roughness: 0.2, metalness: 0.4 }),
    );
    centerGem.scale.set(0.85, 1.2, 0.55);
    centerGem.position.set(0, 0.245, 0.214);
    brideHead.add(sigerCrown, centerGem);

    // 5 Swaying Golden Cunduk Mentul hairpins radiating behind the crown
    [-0.56, -0.28, 0, 0.28, 0.56].forEach((ang) => {
      const mGroup = new THREE.Group();
      mGroup.position.set(Math.sin(ang) * 0.11, 0.23, -0.09);
      mGroup.rotation.z = -ang * 0.82;
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.17, 6), goldMat);
      stem.position.y = 0.085;
      const bloom = new THREE.Mesh(new THREE.IcosahedronGeometry(0.032, 1), goldMat);
      bloom.position.y = 0.175;
      mGroup.add(stem, bloom);
      brideHead.add(mGroup);
      mentuls.push(mGroup);
    });

    // Cascading Ronce Melati jasmine pearl garland down her shoulder
    for (let i = 0; i < 11; i++) {
      const t = i / 10;
      const pearl = new THREE.Mesh(
        new THREE.SphereGeometry(0.026 - t * 0.005, 8, 8),
        jasmineMat,
      );
      pearl.position.set(0.21 + Math.sin(t * 1.4) * 0.04, 0.08 - t * 0.36, 0.03 + t * 0.08);
      brideHead.add(pearl);
    }

    // Translucent Ivory Veil cascading behind konde
    const veilGeo = new THREE.PlaneGeometry(0.68, 1.15, 8, 12);
    const veilPos = veilGeo.attributes.position;
    for (let i = 0; i < veilPos.count; i++) {
      const vy = veilPos.getY(i);
      const vx = veilPos.getX(i);
      const normDown = (0.575 - vy) / 1.15;
      veilPos.setZ(i, -normDown * normDown * 0.26 + Math.cos(vx * 5) * 0.02);
    }
    veilGeo.computeVertexNormals();
    const veilMat = new THREE.MeshStandardMaterial({
      color: "#fffdf8",
      transparent: true,
      opacity: 0.44,
      roughness: 0.4,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    veilMesh = new THREE.Mesh(veilGeo, veilMat);
    veilMesh.position.set(0, -0.52, -0.29);
    veilMesh.rotation.x = 0.16;
    brideHead.add(veilMesh);
  } else {
    for (let i = 0; i < 3; i++) {
      const f = new THREE.Mesh(new THREE.IcosahedronGeometry(0.04, 1), jasmineMat);
      f.position.set(0.18 + i * 0.02, 0.12 - i * 0.035, 0.09);
      brideHead.add(f);
    }
  }

  // ========================================================
  // GROOM (RAKA) — Expressive Stylized Proportions, Blangkon & Articulated Wave
  // ========================================================
  const groomGroup = new THREE.Group();
  const groomShadow = new THREE.Mesh(new THREE.CircleGeometry(0.32, 22), shadowMat);
  groomShadow.rotation.x = -Math.PI / 2;
  groomShadow.position.y = 0.015;
  groomGroup.add(groomShadow);

  // Dark tailored trousers & glossy selop shoes
  [-0.092, 0.092].forEach((lx) => {
    const leg = new THREE.Mesh(
      new THREE.CylinderGeometry(0.072, 0.062, 0.42, 12),
      new THREE.MeshStandardMaterial({ color: "#1d1a18", roughness: 0.8 }),
    );
    leg.position.set(lx, 0.23, 0);
    leg.castShadow = true;
    const shoe = new THREE.Mesh(new THREE.SphereGeometry(0.068, 12, 10), shoeMat);
    shoe.scale.set(0.92, 0.56, 1.58);
    shoe.position.set(lx, 0.035, 0.06);
    groomGroup.add(leg, shoe);
  });

  // Wrapped Batik Jarik waist cloth (y: 0.34..0.68)
  const groomJarik = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.22, 0.36, 22, 1, false),
    batikMat,
  );
  groomJarik.position.y = 0.49;
  groomJarik.castShadow = true;
  groomGroup.add(groomJarik);

  // Regal Emerald Velvet Beskap Jawa jacket (y: 0.63..1.07)
  const beskapPoints = [
    new THREE.Vector2(0.195, 0.63),
    new THREE.Vector2(0.182, 0.78),
    new THREE.Vector2(0.215, 0.94),
    new THREE.Vector2(0.195, 1.04),
    new THREE.Vector2(0.105, 1.09),
  ];
  const beskap = new THREE.Mesh(new THREE.LatheGeometry(beskapPoints, 22), beskapMat);
  beskap.castShadow = true;
  groomGroup.add(beskap);

  // Mandarin collar, gold piping, buttons & watch chain
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.102, 0.055, 18), beskapMat);
  collar.position.y = 1.09;
  const collarGold = new THREE.Mesh(new THREE.TorusGeometry(0.098, 0.008, 8, 20), goldMat);
  collarGold.rotation.x = Math.PI / 2;
  collarGold.position.y = 1.07;
  groomGroup.add(collar, collarGold);

  for (let b = 0; b < 4; b++) {
    const btn = new THREE.Mesh(new THREE.SphereGeometry(0.014, 8, 8), goldMat);
    btn.position.set(0.025, 0.98 - b * 0.072, 0.205 - b * 0.004);
    groomGroup.add(btn);
  }
  const watchChain = new THREE.Mesh(
    new THREE.TorusGeometry(0.068, 0.007, 6, 16, Math.PI * 0.85),
    goldMat,
  );
  watchChain.rotation.z = Math.PI * 1.08;
  watchChain.position.set(0.065, 0.84, 0.195);
  groomGroup.add(watchChain);

  // Ornate Javanese Keris tucked behind waist
  const kerisGroup = new THREE.Group();
  kerisGroup.position.set(-0.08, 0.68, -0.19);
  kerisGroup.rotation.z = -0.55;
  kerisGroup.rotation.x = 0.12;
  const kerisSheath = new THREE.Mesh(
    new THREE.BoxGeometry(0.048, 0.34, 0.024),
    new THREE.MeshStandardMaterial({ color: "#5c2e16", roughness: 0.5 }),
  );
  const kerisTop = new THREE.Mesh(new THREE.BoxGeometry(0.115, 0.042, 0.032), goldMat);
  kerisTop.position.y = 0.17;
  const kerisHilt = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.014, 0.075, 8), goldMat);
  kerisHilt.position.set(0.02, 0.22, 0);
  kerisHilt.rotation.z = -0.35;
  kerisGroup.add(kerisSheath, kerisTop, kerisHilt);
  groomGroup.add(kerisGroup);

  if (mode === "wedding") {
    const melatiGarland = new THREE.Mesh(
      new THREE.TorusGeometry(0.132, 0.022, 10, 22, Math.PI * 1.35),
      jasmineMat,
    );
    melatiGarland.rotation.x = Math.PI * 0.44;
    melatiGarland.rotation.z = -Math.PI * 0.17;
    melatiGarland.position.set(0, 1.01, 0.085);
    groomGroup.add(melatiGarland);
  }

  // Groom Inner Right Arm reaching inward to hold Bride's left hand
  const groomRightArm = new THREE.Group();
  groomRightArm.position.set(0.205, 1.0, 0.02);
  groomRightArm.rotation.set(-0.34, 0, 0.34);
  const gPuffR = new THREE.Mesh(new THREE.SphereGeometry(0.058, 10, 10), beskapMat);
  const gSleeveR = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.044, 0.25, 12), beskapMat);
  gSleeveR.position.y = -0.115;
  gSleeveR.castShadow = true;
  const gHandR = new THREE.Mesh(new THREE.SphereGeometry(0.044, 10, 10), skinGroomMat);
  gHandR.position.y = -0.26;
  groomRightArm.add(gPuffR, gSleeveR, gHandR);

  // Groom Outer Left 2-Joint Articulated Waving Arm
  const groomLeftArm = new THREE.Group();
  groomLeftArm.position.set(-0.205, 1.0, 0.02);
  groomLeftArm.rotation.set(-0.15, 0, 0.22);
  const gPuffL = new THREE.Mesh(new THREE.SphereGeometry(0.058, 10, 10), beskapMat);
  const gUpperL = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.044, 0.18, 12), beskapMat);
  gUpperL.position.y = -0.09;
  gUpperL.castShadow = true;

  const groomLeftElbow = new THREE.Group();
  groomLeftElbow.position.set(0, -0.17, 0);
  groomLeftElbow.rotation.set(-0.95, 0, 0.25);
  const gForeL = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.036, 0.17, 10), beskapMat);
  gForeL.position.y = -0.075;
  const gHandL = new THREE.Mesh(new THREE.SphereGeometry(0.044, 10, 10), skinGroomMat);
  gHandL.position.y = -0.17;
  groomLeftElbow.add(gForeL, gHandL);
  groomLeftArm.add(gPuffL, gUpperL, groomLeftElbow);
  groomGroup.add(groomLeftArm, groomRightArm);

  // Groom Neck + Expressive Stylized Head (radius 0.262)
  const groomNeck = new THREE.Mesh(
    new THREE.CylinderGeometry(0.064, 0.074, 0.09, 12),
    skinGroomMat,
  );
  groomNeck.position.y = 1.12;
  groomGroup.add(groomNeck);

  const groomHead = new THREE.Group();
  groomHead.position.y = 1.36;
  groomGroup.add(groomHead);

  const groomFaceMat = new THREE.MeshStandardMaterial({
    map: groomOpenTex,
    roughness: 0.6,
    emissive: new THREE.Color("#261309"),
    emissiveIntensity: 0.08,
  });
  const groomHeadMesh = new THREE.Mesh(new THREE.SphereGeometry(0.262, 30, 24), groomFaceMat);
  groomHeadMesh.scale.set(1.02, 0.99, 0.96);
  groomHeadMesh.rotation.y = -Math.PI / 2;
  groomHeadMesh.castShadow = true;
  groomHead.add(groomHeadMesh);

  [-0.258, 0.258].forEach((ex) => {
    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.044, 10, 10), skinGroomMat);
    ear.position.set(ex, -0.02, 0);
    groomHead.add(ear);
  });

  if (mode === "wedding") {
    // Authentic Batik Blangkon Jawa + front Gold Brooch + rear Mondolan + temple sideburns
    [-0.225, 0.225].forEach((sx) => {
      const sideburn = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.09, 0.065), hairMat);
      sideburn.position.set(sx, 0.04, 0.075);
      groomHead.add(sideburn);
    });

    const blangkonCap = new THREE.Mesh(
      new THREE.SphereGeometry(0.272, 26, 18, 0, Math.PI * 2, 0, Math.PI * 0.45),
      batikMat,
    );
    blangkonCap.scale.set(1.01, 0.95, 1.0);
    blangkonCap.rotation.x = -0.18;
    blangkonCap.position.y = 0.04;
    blangkonCap.castShadow = true;

    const blangkonBand = new THREE.Mesh(
      new THREE.CylinderGeometry(0.266, 0.262, 0.075, 26, 1, true),
      batikMat,
    );
    blangkonBand.position.set(0, 0.115, -0.005);
    blangkonBand.rotation.x = -0.14;

    const mondolan = new THREE.Mesh(new THREE.SphereGeometry(0.098, 14, 12), batikMat);
    mondolan.position.set(0, 0.055, -0.265);

    const blangkonPin = new THREE.Mesh(new THREE.OctahedronGeometry(0.026, 0), goldMat);
    blangkonPin.scale.set(1, 1.25, 0.5);
    blangkonPin.position.set(0, 0.145, 0.258);

    groomHead.add(blangkonCap, blangkonBand, mondolan, blangkonPin);
  } else {
    const groomHair = new THREE.Mesh(
      new THREE.SphereGeometry(0.272, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.46),
      hairMat,
    );
    groomHair.rotation.x = -0.28;
    const groomHairBack = new THREE.Mesh(
      new THREE.SphereGeometry(
        0.27,
        20,
        14,
        Math.PI * 0.85,
        Math.PI * 1.3,
        Math.PI * 0.18,
        Math.PI * 0.6,
      ),
      hairMat,
    );
    const frontQuiff = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 10), hairMat);
    frontQuiff.scale.set(1.4, 0.46, 0.65);
    frontQuiff.position.set(0, 0.21, 0.17);
    groomHead.add(groomHair, groomHairBack, frontQuiff);
  }

  // Stand Groom & Bride shoulder-to-shoulder angled toward each other holding hands
  groomGroup.position.set(-0.34, 0.48, 0.34);
  groomGroup.rotation.y = 0.15;

  brideGroup.position.set(0.34, 0.48, 0.34);
  brideGroup.rotation.y = -0.15;

  // Warm rose-gold floating affection motes around the Pelaminan couple
  const heartMotes: HeroCoupleRig["heartMotes"] = [];
  const moteRoseMat = new THREE.MeshBasicMaterial({
    color: "#f497a9",
    transparent: true,
    opacity: 0.75,
  });
  const moteGoldMat = new THREE.MeshBasicMaterial({
    color: "#ffd984",
    transparent: true,
    opacity: 0.78,
  });
  for (let i = 0; i < 6; i++) {
    const ang = (i / 6) * Math.PI * 2;
    const bx = Math.cos(ang) * 0.56;
    const by = 2.02 + (i % 2) * 0.16;
    const bz = 0.34 + Math.sin(ang) * 0.26;
    const mote = new THREE.Mesh(
      new THREE.SphereGeometry(0.026, 8, 8),
      i % 2 === 0 ? moteRoseMat : moteGoldMat,
    );
    mote.position.set(bx, by, bz);
    group.add(mote);
    heartMotes.push({ mesh: mote, baseX: bx, baseY: by, baseZ: bz, phase: i * 1.15 });
  }

  group.add(groomGroup, brideGroup);

  const dispose = () => {
    [
      batikTex,
      kebayaTex,
      beskapTex,
      brideOpenTex,
      brideBlinkTex,
      groomOpenTex,
      groomBlinkTex,
    ].forEach((t) => t.dispose());
  };

  return {
    group,
    bride: {
      group: brideGroup,
      headGroup: brideHead,
      faceMat: brideFaceMat,
      openTex: brideOpenTex,
      blinkTex: brideBlinkTex,
      rightArm: brideRightArm,
      rightElbow: brideRightElbow,
      leftArm: brideLeftArm,
      bouquet,
      mentuls,
      veil: veilMesh,
    },
    groom: {
      group: groomGroup,
      headGroup: groomHead,
      faceMat: groomFaceMat,
      openTex: groomOpenTex,
      blinkTex: groomBlinkTex,
      leftArm: groomLeftArm,
      leftElbow: groomLeftElbow,
      rightArm: groomRightArm,
    },
    heartMotes,
    wasBlinking: false,
    dispose,
  };
}

export function animateWeddingCouple(
  couple: HeroCoupleRig,
  _dt: number,
  elapsed: number,
  guestCloseness01 = 0,
): void {
  const boost = 1 + guestCloseness01 * 0.7;

  // 1. Soft breathing synced gently together while holding hands
  couple.bride.group.position.y = 0.48 + Math.sin(elapsed * 2.0) * 0.008;
  couple.groom.group.position.y = 0.48 + Math.sin(elapsed * 2.0 + 0.35) * 0.008;

  // 2. Loving glance cycle: periodically turn heads affectionately toward each other
  const glancePhase = (elapsed % 7.8) / 7.8;
  const glancing = glancePhase > 0.68 && glancePhase < 0.92;
  const glanceAmt = glancing
    ? Math.sin(((glancePhase - 0.68) / 0.24) * Math.PI)
    : 0;

  couple.bride.headGroup.rotation.y =
    -0.22 * glanceAmt + Math.sin(elapsed * 0.8) * 0.05;
  couple.bride.headGroup.rotation.z =
    0.05 * glanceAmt + Math.sin(elapsed * 1.2) * 0.02;

  couple.groom.headGroup.rotation.y =
    0.24 * glanceAmt + Math.sin(elapsed * 0.8 + 0.7) * 0.05;
  couple.groom.headGroup.rotation.z =
    -0.04 * glanceAmt + Math.sin(elapsed * 1.15) * 0.02;

  // 3. Natural blinking every 3.8s + happy curved eyes during affectionate gaze
  const blinkCycle = elapsed % 3.8;
  const isBlinking = blinkCycle > 3.64 || glanceAmt > 0.45;
  if (isBlinking !== couple.wasBlinking) {
    couple.wasBlinking = isBlinking;
    couple.bride.faceMat.map = isBlinking
      ? couple.bride.blinkTex
      : couple.bride.openTex;
    couple.bride.faceMat.needsUpdate = true;
    couple.groom.faceMat.map = isBlinking
      ? couple.groom.blinkTex
      : couple.groom.openTex;
    couple.groom.faceMat.needsUpdate = true;
  }

  // 4. Lively 2-joint waving arm on Groom & graceful bouquet lift on Bride
  couple.groom.leftArm.rotation.z = 0.22 + Math.sin(elapsed * 2.6 * boost) * 0.06;
  couple.groom.leftElbow.rotation.x =
    -1.05 - guestCloseness01 * 0.18 + Math.sin(elapsed * 4.2 * boost) * 0.16;
  couple.groom.leftElbow.rotation.z =
    0.28 + Math.sin(elapsed * 4.2 * boost) * (0.14 + guestCloseness01 * 0.12);

  couple.bride.rightElbow.rotation.x =
    -0.98 - guestCloseness01 * 0.08 + Math.sin(elapsed * 2.1) * 0.04;
  couple.bride.bouquet.rotation.z = Math.sin(elapsed * 1.9) * 0.05;

  // 5. Springy Cunduk Mentul hairpins & gentle veil breeze
  couple.bride.mentuls.forEach((m, idx) => {
    m.rotation.x = Math.sin(elapsed * 3.4 + idx * 0.9) * 0.075;
  });
  if (couple.bride.veil) {
    couple.bride.veil.rotation.x = 0.16 + Math.sin(elapsed * 1.7) * 0.04;
    couple.bride.veil.rotation.z = Math.cos(elapsed * 1.3) * 0.03;
  }

  // 6. Floating heart-blossom shimmer motes rise and brighten when guests approach
  couple.heartMotes.forEach((hm, idx) => {
    const rise = ((elapsed * (0.18 + guestCloseness01 * 0.14) + hm.phase) % 1) * 0.36;
    hm.mesh.position.set(
      hm.baseX + Math.sin(elapsed * 1.4 + hm.phase) * 0.06,
      hm.baseY + rise,
      hm.baseZ + Math.cos(elapsed * 1.1 + hm.phase) * 0.05,
    );
    const scale = (0.75 + guestCloseness01 * 0.5) * Math.sin((rise / 0.36) * Math.PI);
    hm.mesh.scale.setScalar(Math.max(0.1, scale));
    if (idx === 0) {
      const mat = hm.mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.38 + guestCloseness01 * 0.55;
    }
  });
}
