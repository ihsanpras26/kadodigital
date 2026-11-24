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
    rightArm: THREE.Group;
    leftArm: THREE.Group;
    mentuls: THREE.Group[];
    veil?: THREE.Mesh;
  };
  groom: {
    group: THREE.Group;
    headGroup: THREE.Group;
    rightArm: THREE.Group;
    leftArm: THREE.Group;
  };
  dispose: () => void;
}

export function buildWeddingCouple(mode: DesaMode): HeroCoupleRig {
  const group = new THREE.Group();

  const batikTex = createBatikParangTexture("#4f2d1b", "#dca952", "#f2e2c2");
  const kebayaTex = createKebayaBrocadeTexture();
  const beskapTex = createBeskapTexture();
  const brideFaceTex = createWeddingFaceTexture("bride", "#f6d2b6");
  const groomFaceTex = createWeddingFaceTexture("groom", "#ebc09f");

  const batikMat = new THREE.MeshStandardMaterial({
    map: batikTex,
    roughness: 0.7,
    metalness: 0.05,
  });
  const kebayaMat = new THREE.MeshStandardMaterial({
    map: kebayaTex,
    roughness: 0.56,
    metalness: 0.06,
  });
  const beskapMat = new THREE.MeshStandardMaterial({
    map: beskapTex,
    roughness: 0.52,
    metalness: 0.08,
  });
  const goldMat = new THREE.MeshStandardMaterial({
    color: "#e2b254",
    roughness: 0.25,
    metalness: 0.78,
  });
  const skinBrideMat = new THREE.MeshStandardMaterial({
    color: "#f6d2b6",
    roughness: 0.68,
  });
  const skinGroomMat = new THREE.MeshStandardMaterial({
    color: "#ebc09f",
    roughness: 0.7,
  });
  const hairMat = new THREE.MeshStandardMaterial({
    color: "#1e1410",
    roughness: 0.65,
  });
  const jasmineMat = new THREE.MeshStandardMaterial({
    color: "#fffcf4",
    roughness: 0.45,
  });
  const shoeMat = new THREE.MeshStandardMaterial({
    color: "#221611",
    roughness: 0.42,
    metalness: 0.15,
  });

  // ========================================================
  // BRIDE — Sculpted Kebaya Brokat, Jarik Wiru, Siger & Veil
  // ========================================================
  const brideGroup = new THREE.Group();

  const brideShadow = new THREE.Mesh(
    new THREE.CircleGeometry(0.32, 22),
    new THREE.MeshBasicMaterial({
      color: 0x16241b,
      transparent: true,
      opacity: 0.24,
      depthWrite: false,
    }),
  );
  brideShadow.rotation.x = -Math.PI / 2;
  brideShadow.position.y = 0.015;
  brideGroup.add(brideShadow);

  // Selop shoes peeking beneath jarik hem
  [-0.085, 0.085].forEach((sx) => {
    const selop = new THREE.Mesh(new THREE.SphereGeometry(0.062, 12, 10), shoeMat);
    selop.scale.set(0.85, 0.55, 1.55);
    selop.position.set(sx, 0.032, 0.08);
    brideGroup.add(selop);
  });

  // Sculpted flowing Batik Jarik skirt via LatheGeometry
  const skirtPoints = [
    new THREE.Vector2(0.24, 0.04),
    new THREE.Vector2(0.21, 0.28),
    new THREE.Vector2(0.18, 0.55),
    new THREE.Vector2(0.15, 0.74),
  ];
  const skirtMesh = new THREE.Mesh(new THREE.LatheGeometry(skirtPoints, 24), batikMat);
  skirtMesh.castShadow = true;
  skirtMesh.receiveShadow = true;
  brideGroup.add(skirtMesh);

  // Front pleated Wiru vertical fold on the jarik
  const wiru = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.68, 0.045), batikMat);
  wiru.position.set(0.02, 0.39, 0.19);
  wiru.rotation.x = -0.09;
  brideGroup.add(wiru);

  // Fitted Kebaya Brocade bodice via LatheGeometry
  const bodicePoints = [
    new THREE.Vector2(0.165, 0.72),
    new THREE.Vector2(0.138, 0.88),
    new THREE.Vector2(0.175, 1.06),
    new THREE.Vector2(0.155, 1.19),
    new THREE.Vector2(0.085, 1.24),
  ];
  const bodice = new THREE.Mesh(new THREE.LatheGeometry(bodicePoints, 22), kebayaMat);
  bodice.castShadow = true;
  brideGroup.add(bodice);

  // Kutubaru front center panel & gold lace trim
  const kutubaru = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.42, 0.05), kebayaMat);
  kutubaru.position.set(0, 0.99, 0.152);
  kutubaru.rotation.x = -0.08;
  brideGroup.add(kutubaru);

  // Gold sculpted Pending belt at waist
  const waistBelt = new THREE.Mesh(
    new THREE.CylinderGeometry(0.154, 0.165, 0.055, 22),
    goldMat,
  );
  waistBelt.position.y = 0.78;
  brideGroup.add(waistBelt);

  const beltBuckle = new THREE.Mesh(new THREE.OctahedronGeometry(0.04, 0), goldMat);
  beltBuckle.scale.set(1.2, 0.9, 0.5);
  beltBuckle.position.set(0, 0.78, 0.17);
  brideGroup.add(beltBuckle);

  // Layered gold Kalung Susun necklace
  [0, 1].forEach((tier) => {
    const col = new THREE.Mesh(
      new THREE.TorusGeometry(0.105 + tier * 0.024, 0.012, 8, 22, Math.PI * 1.1),
      goldMat,
    );
    col.rotation.x = Math.PI * 0.56;
    col.rotation.z = -Math.PI * 0.05;
    col.position.set(0, 1.185 - tier * 0.032, 0.035);
    brideGroup.add(col);
  });

  // Sculpted arms holding a Bridal Hand Bouquet
  const brideLeftArm = new THREE.Group();
  brideLeftArm.position.set(-0.18, 1.15, 0.02);
  brideLeftArm.rotation.set(-0.55, 0, 0.16);
  const bUpperL = new THREE.Mesh(new THREE.CylinderGeometry(0.044, 0.038, 0.24, 12), kebayaMat);
  bUpperL.position.y = -0.12;
  bUpperL.castShadow = true;
  const bHandL = new THREE.Mesh(new THREE.SphereGeometry(0.038, 10, 10), skinBrideMat);
  bHandL.position.set(0.04, -0.25, 0.08);
  brideLeftArm.add(bUpperL, bHandL);

  const brideRightArm = new THREE.Group();
  brideRightArm.position.set(0.18, 1.15, 0.02);
  brideRightArm.rotation.set(-0.55, 0, -0.16);
  const bUpperR = new THREE.Mesh(new THREE.CylinderGeometry(0.044, 0.038, 0.24, 12), kebayaMat);
  bUpperR.position.y = -0.12;
  bUpperR.castShadow = true;
  const bHandR = new THREE.Mesh(new THREE.SphereGeometry(0.038, 10, 10), skinBrideMat);
  bHandR.position.set(-0.04, -0.25, 0.08);
  brideRightArm.add(bUpperR, bHandR);
  brideGroup.add(brideLeftArm, brideRightArm);

  // Hand Bouquet held cleanly at front waist
  const bouquet = new THREE.Group();
  bouquet.position.set(0, 0.9, 0.24);
  const wrap = new THREE.Mesh(
    new THREE.ConeGeometry(0.06, 0.14, 10),
    new THREE.MeshStandardMaterial({ color: "#e6cfa8", roughness: 0.7 }),
  );
  wrap.rotation.x = Math.PI * 0.88;
  wrap.position.y = -0.05;
  bouquet.add(wrap);

  const roseIvory = new THREE.MeshStandardMaterial({ color: "#fff8ee", roughness: 0.5 });
  const roseBlush = new THREE.MeshStandardMaterial({ color: "#f3b4bf", roughness: 0.55 });
  const leafMat = new THREE.MeshStandardMaterial({ color: "#4e7c55", roughness: 0.75 });
  for (let i = 0; i < 7; i++) {
    const a = (i / 6) * Math.PI * 2;
    const rad = i === 6 ? 0 : 0.052;
    const rose = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.034, 0),
      i % 2 === 0 ? roseIvory : roseBlush,
    );
    rose.position.set(Math.cos(a) * rad, 0.02 + (i === 6 ? 0.02 : 0), Math.sin(a) * rad);
    bouquet.add(rose);
  }
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const leaf = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.008, 0.065), leafMat);
    leaf.position.set(Math.cos(a) * 0.075, -0.005, Math.sin(a) * 0.075);
    leaf.rotation.y = -a;
    bouquet.add(leaf);
  }
  brideGroup.add(bouquet);

  // Neck + Sculpted Oval Bride Head
  const brideNeck = new THREE.Mesh(
    new THREE.CylinderGeometry(0.052, 0.062, 0.1, 12),
    skinBrideMat,
  );
  brideNeck.position.y = 1.27;
  brideGroup.add(brideNeck);

  const brideHead = new THREE.Group();
  brideHead.position.y = 1.43;
  brideGroup.add(brideHead);

  const brideFaceMat = new THREE.MeshStandardMaterial({
    map: brideFaceTex,
    roughness: 0.56,
  });
  const brideHeadMesh = new THREE.Mesh(new THREE.SphereGeometry(0.155, 28, 22), brideFaceMat);
  brideHeadMesh.scale.set(0.94, 1.08, 0.96);
  brideHeadMesh.rotation.y = -Math.PI / 2;
  brideHeadMesh.castShadow = true;
  brideHead.add(brideHeadMesh);

  // Sculpted subtle nose + pearl earrings
  const brideNose = new THREE.Mesh(new THREE.ConeGeometry(0.015, 0.034, 8), skinBrideMat);
  brideNose.rotation.x = Math.PI * 0.42;
  brideNose.position.set(0, -0.015, 0.152);
  brideHead.add(brideNose);

  [-0.145, 0.145].forEach((ex) => {
    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.026, 8, 8), skinBrideMat);
    ear.position.set(ex, -0.015, 0);
    const pearl = new THREE.Mesh(new THREE.SphereGeometry(0.015, 8, 8), jasmineMat);
    pearl.position.set(ex * 1.04, -0.042, 0.005);
    brideHead.add(ear, pearl);
  });

  // Sculpted dark hair cap + back hair & Javanese Konde / Sanggul
  const brideHairCap = new THREE.Mesh(
    new THREE.SphereGeometry(0.162, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.48),
    hairMat,
  );
  brideHairCap.scale.set(0.95, 1.05, 0.98);
  brideHairCap.rotation.x = -0.3;
  brideHead.add(brideHairCap);

  const brideHairBack = new THREE.Mesh(
    new THREE.SphereGeometry(
      0.162,
      20,
      14,
      Math.PI * 0.82,
      Math.PI * 1.36,
      Math.PI * 0.18,
      Math.PI * 0.62,
    ),
    hairMat,
  );
  brideHairBack.scale.set(0.95, 1.04, 0.98);
  brideHead.add(brideHairBack);

  const konde = new THREE.Mesh(new THREE.SphereGeometry(0.105, 16, 14), hairMat);
  konde.scale.set(1.22, 0.88, 0.72);
  konde.position.set(0, -0.01, -0.175);
  konde.castShadow = true;
  brideHead.add(konde);

  const mentuls: THREE.Group[] = [];
  let veilMesh: THREE.Mesh | undefined;

  if (mode === "wedding") {
    // Metallic Gold Siger / Mahkota Crown
    const crownBand = new THREE.Mesh(
      new THREE.TorusGeometry(0.154, 0.014, 8, 26, Math.PI * 1.25),
      goldMat,
    );
    crownBand.rotation.x = Math.PI * 0.36;
    crownBand.rotation.z = -Math.PI * 0.125;
    crownBand.position.set(0, 0.09, 0.02);
    brideHead.add(crownBand);

    const crownPeak = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.11, 4), goldMat);
    crownPeak.rotation.y = Math.PI / 4;
    crownPeak.scale.set(1.15, 1, 0.35);
    crownPeak.position.set(0, 0.155, 0.11);
    const centerGem = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.016, 0),
      new THREE.MeshStandardMaterial({ color: "#b63b4e", roughness: 0.2, metalness: 0.4 }),
    );
    centerGem.position.set(0, 0.145, 0.128);
    brideHead.add(crownPeak, centerGem);

    // 5 Swaying Golden Cunduk Mentul hairpins radiating behind the crown
    [-0.55, -0.28, 0, 0.28, 0.55].forEach((ang) => {
      const mGroup = new THREE.Group();
      mGroup.position.set(Math.sin(ang) * 0.08, 0.155, -0.07);
      mGroup.rotation.z = -ang * 0.85;
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.13, 6), goldMat);
      stem.position.y = 0.065;
      const bloom = new THREE.Mesh(new THREE.DodecahedronGeometry(0.022, 0), goldMat);
      bloom.position.y = 0.135;
      mGroup.add(stem, bloom);
      brideHead.add(mGroup);
      mentuls.push(mGroup);
    });

    // Cascading Ronce Melati jasmine pearl garland down the right shoulder
    for (let i = 0; i < 11; i++) {
      const t = i / 10;
      const pearl = new THREE.Mesh(
        new THREE.SphereGeometry(0.019 - t * 0.004, 8, 8),
        jasmineMat,
      );
      pearl.position.set(0.145 + Math.sin(t * 1.4) * 0.03, 0.06 - t * 0.28, 0.02 + t * 0.08);
      brideHead.add(pearl);
    }

    // Translucent Bridal Veil flowing from the konde down behind the skirt
    const veilGeo = new THREE.PlaneGeometry(0.54, 1.05, 8, 12);
    const veilPos = veilGeo.attributes.position;
    for (let i = 0; i < veilPos.count; i++) {
      const vy = veilPos.getY(i);
      const vx = veilPos.getX(i);
      const normDown = (0.525 - vy) / 1.05;
      veilPos.setZ(i, -normDown * normDown * 0.24 + Math.cos(vx * 6) * 0.015);
    }
    veilGeo.computeVertexNormals();
    const veilMat = new THREE.MeshStandardMaterial({
      color: "#fffcf6",
      transparent: true,
      opacity: 0.42,
      roughness: 0.4,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    veilMesh = new THREE.Mesh(veilGeo, veilMat);
    veilMesh.position.set(0, -0.44, -0.22);
    veilMesh.rotation.x = 0.16;
    brideHead.add(veilMesh);
  } else {
    // Kado mode: fragrant jasmine floral hairpiece
    for (let i = 0; i < 3; i++) {
      const f = new THREE.Mesh(new THREE.DodecahedronGeometry(0.028, 0), jasmineMat);
      f.position.set(0.115 + i * 0.015, 0.06 - i * 0.02, 0.06);
      brideHead.add(f);
    }
  }

  // ========================================================
  // GROOM — Beskap Jawa, Batik Jarik, Blangkon & Keris
  // ========================================================
  const groomGroup = new THREE.Group();

  const groomShadow = brideShadow.clone();
  groomGroup.add(groomShadow);

  // Dark polished Selop shoes & tailored dark trousers
  [-0.095, 0.095].forEach((lx) => {
    const leg = new THREE.Mesh(
      new THREE.CylinderGeometry(0.068, 0.058, 0.56, 12),
      new THREE.MeshStandardMaterial({ color: "#1d1a18", roughness: 0.8 }),
    );
    leg.position.set(lx, 0.3, 0);
    leg.castShadow = true;
    const shoe = new THREE.Mesh(new THREE.SphereGeometry(0.066, 12, 10), shoeMat);
    shoe.scale.set(0.9, 0.55, 1.65);
    shoe.position.set(lx, 0.035, 0.06);
    groomGroup.add(leg, shoe);
  });

  // Wrapped Batik Jarik waist cloth reaching mid-calf
  const groomJarik = new THREE.Mesh(
    new THREE.CylinderGeometry(0.175, 0.215, 0.44, 22, 1, false),
    batikMat,
  );
  groomJarik.position.y = 0.56;
  groomJarik.castShadow = true;
  groomGroup.add(groomJarik);

  // Sculpted broad-shouldered Beskap Jawa jacket
  const beskapPoints = [
    new THREE.Vector2(0.185, 0.74),
    new THREE.Vector2(0.175, 0.92),
    new THREE.Vector2(0.205, 1.12),
    new THREE.Vector2(0.185, 1.24),
    new THREE.Vector2(0.095, 1.29),
  ];
  const beskap = new THREE.Mesh(new THREE.LatheGeometry(beskapPoints, 22), beskapMat);
  beskap.castShadow = true;
  groomGroup.add(beskap);

  // Mandarin collar & gold piping + front Beskap buttons + watch chain
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.088, 0.096, 0.06, 18), beskapMat);
  collar.position.y = 1.28;
  const collarGold = new THREE.Mesh(new THREE.TorusGeometry(0.092, 0.008, 8, 20), goldMat);
  collarGold.rotation.x = Math.PI / 2;
  collarGold.position.y = 1.26;
  groomGroup.add(collar, collarGold);

  for (let b = 0; b < 4; b++) {
    const btn = new THREE.Mesh(new THREE.SphereGeometry(0.013, 8, 8), goldMat);
    btn.position.set(0.025, 1.17 - b * 0.085, 0.195 - b * 0.004);
    groomGroup.add(btn);
  }
  const watchChain = new THREE.Mesh(
    new THREE.TorusGeometry(0.065, 0.006, 6, 16, Math.PI * 0.85),
    goldMat,
  );
  watchChain.rotation.z = Math.PI * 1.08;
  watchChain.position.set(0.06, 1.0, 0.185);
  groomGroup.add(watchChain);

  // Javanese Keris tucked neatly behind the waist
  const kerisGroup = new THREE.Group();
  kerisGroup.position.set(-0.08, 0.8, -0.185);
  kerisGroup.rotation.z = -0.55;
  kerisGroup.rotation.x = 0.12;
  const kerisSheath = new THREE.Mesh(
    new THREE.BoxGeometry(0.045, 0.34, 0.024),
    new THREE.MeshStandardMaterial({ color: "#5c2e16", roughness: 0.5 }),
  );
  const kerisTop = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.042, 0.032), goldMat);
  kerisTop.position.y = 0.17;
  const kerisHilt = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.014, 0.075, 8), goldMat);
  kerisHilt.position.set(0.02, 0.22, 0);
  kerisHilt.rotation.z = -0.35;
  kerisGroup.add(kerisSheath, kerisTop, kerisHilt);
  groomGroup.add(kerisGroup);

  if (mode === "wedding") {
    // Fragrant Ronce Melati groom necklace garland
    const melatiGarland = new THREE.Mesh(
      new THREE.TorusGeometry(0.12, 0.02, 10, 22, Math.PI * 1.35),
      jasmineMat,
    );
    melatiGarland.rotation.x = Math.PI * 0.45;
    melatiGarland.rotation.z = -Math.PI * 0.17;
    melatiGarland.position.set(0, 1.18, 0.08);
    groomGroup.add(melatiGarland);
  }

  // Groom articulated arms
  const groomLeftArm = new THREE.Group();
  groomLeftArm.position.set(-0.22, 1.19, 0);
  groomLeftArm.rotation.set(-0.18, 0, 0.14);
  const gSleeveL = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.044, 0.34, 12), beskapMat);
  gSleeveL.position.y = -0.16;
  gSleeveL.castShadow = true;
  const gHandL = new THREE.Mesh(new THREE.SphereGeometry(0.042, 10, 10), skinGroomMat);
  gHandL.position.y = -0.35;
  groomLeftArm.add(gSleeveL, gHandL);

  const groomRightArm = new THREE.Group();
  groomRightArm.position.set(0.22, 1.19, 0);
  groomRightArm.rotation.set(-0.32, 0, -0.2);
  const gSleeveR = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.044, 0.34, 12), beskapMat);
  gSleeveR.position.y = -0.16;
  gSleeveR.castShadow = true;
  const gHandR = new THREE.Mesh(new THREE.SphereGeometry(0.042, 10, 10), skinGroomMat);
  gHandR.position.y = -0.35;
  groomRightArm.add(gSleeveR, gHandR);
  groomGroup.add(groomLeftArm, groomRightArm);

  // Groom Neck + Sculpted Oval Head
  const groomNeck = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.07, 0.1, 12),
    skinGroomMat,
  );
  groomNeck.position.y = 1.33;
  groomGroup.add(groomNeck);

  const groomHead = new THREE.Group();
  groomHead.position.y = 1.49;
  groomGroup.add(groomHead);

  const groomFaceMat = new THREE.MeshStandardMaterial({
    map: groomFaceTex,
    roughness: 0.58,
  });
  const groomHeadMesh = new THREE.Mesh(new THREE.SphereGeometry(0.16, 28, 22), groomFaceMat);
  groomHeadMesh.scale.set(0.95, 1.07, 0.96);
  groomHeadMesh.rotation.y = -Math.PI / 2;
  groomHeadMesh.castShadow = true;
  groomHead.add(groomHeadMesh);

  const groomNose = new THREE.Mesh(new THREE.ConeGeometry(0.017, 0.036, 8), skinGroomMat);
  groomNose.rotation.x = Math.PI * 0.42;
  groomNose.position.set(0, -0.015, 0.156);
  groomHead.add(groomNose);

  [-0.152, 0.152].forEach((ex) => {
    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.028, 8, 8), skinGroomMat);
    ear.position.set(ex, -0.015, 0);
    groomHead.add(ear);
  });

  if (mode === "wedding") {
    // Authentic Batik Blangkon Jawa + rear Mondolan + front gold Pin
    const blangkonCap = new THREE.Mesh(
      new THREE.SphereGeometry(0.168, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.48),
      batikMat,
    );
    blangkonCap.scale.set(0.98, 0.96, 1.01);
    blangkonCap.rotation.x = -0.14;
    blangkonCap.position.y = 0.022;
    blangkonCap.castShadow = true;

    const blangkonBand = new THREE.Mesh(
      new THREE.CylinderGeometry(0.168, 0.165, 0.055, 24, 1, true),
      batikMat,
    );
    blangkonBand.position.set(0, 0.068, 0);
    blangkonBand.rotation.x = -0.1;

    const mondolan = new THREE.Mesh(new THREE.SphereGeometry(0.07, 14, 12), batikMat);
    mondolan.position.set(0, 0.03, -0.17);

    const blangkonPin = new THREE.Mesh(new THREE.OctahedronGeometry(0.02, 0), goldMat);
    blangkonPin.scale.set(1, 1.2, 0.5);
    blangkonPin.position.set(0, 0.088, 0.168);

    groomHead.add(blangkonCap, blangkonBand, mondolan, blangkonPin);
  } else {
    // Neat parted hair for non-wedding anniversary mode
    const groomHair = new THREE.Mesh(
      new THREE.SphereGeometry(0.167, 22, 14, 0, Math.PI * 2, 0, Math.PI * 0.48),
      hairMat,
    );
    groomHair.rotation.x = -0.24;
    groomHead.add(groomHair);
  }

  // Stand Groom (left) and Bride (right) together facing +Z forward
  groomGroup.position.set(-0.42, 0.48, 0.25);
  groomGroup.rotation.y = 0.12;

  brideGroup.position.set(0.42, 0.48, 0.25);
  brideGroup.rotation.y = -0.12;

  group.add(groomGroup, brideGroup);

  const dispose = () => {
    [batikTex, kebayaTex, beskapTex, brideFaceTex, groomFaceTex].forEach((t) => t.dispose());
  };

  return {
    group,
    bride: {
      group: brideGroup,
      headGroup: brideHead,
      rightArm: brideRightArm,
      leftArm: brideLeftArm,
      mentuls,
      veil: veilMesh,
    },
    groom: {
      group: groomGroup,
      headGroup: groomHead,
      rightArm: groomRightArm,
      leftArm: groomLeftArm,
    },
    dispose,
  };
}

export function animateWeddingCouple(
  couple: HeroCoupleRig,
  _dt: number,
  elapsed: number,
): void {
  // Subtle loving gaze & breathing
  couple.bride.group.position.y = 0.48 + Math.sin(elapsed * 1.9) * 0.008;
  couple.groom.group.position.y = 0.48 + Math.sin(elapsed * 1.9 + 0.5) * 0.008;

  couple.bride.headGroup.rotation.y = Math.sin(elapsed * 0.75) * 0.08 - 0.04;
  couple.bride.headGroup.rotation.z = Math.sin(elapsed * 1.2) * 0.025;

  couple.groom.headGroup.rotation.y = Math.sin(elapsed * 0.75 + 1.0) * 0.08 + 0.04;
  couple.groom.headGroup.rotation.z = Math.sin(elapsed * 1.1 + 0.4) * 0.02;

  // Welcoming right hand gesture on groom
  couple.groom.rightArm.rotation.x = -0.35 + Math.sin(elapsed * 2.1) * 0.08;
  couple.groom.rightArm.rotation.z = -0.22 + Math.sin(elapsed * 2.1) * 0.05;

  // Springy Cunduk Mentul bounce & gentle veil breeze
  couple.bride.mentuls.forEach((m, idx) => {
    m.rotation.x = Math.sin(elapsed * 3.4 + idx * 0.9) * 0.06;
  });
  if (couple.bride.veil) {
    couple.bride.veil.rotation.x = 0.16 + Math.sin(elapsed * 1.7) * 0.035;
    couple.bride.veil.rotation.z = Math.cos(elapsed * 1.3) * 0.025;
  }
}
