import * as THREE from "three";
import {
  createChibiFaceTexture,
  createWeddingFaceTexture,
} from "../desa-world/textures";
import type { CelestialNpcAccessory } from "./celestialData";
import {
  createCelestialGownTexture,
  createRoyalTailcoatTexture,
} from "./celestialTextures";

export interface CelestialChibiOptions {
  gender: "cewek" | "cowok";
  outfitColor?: string;
  accentColor?: string;
  skinColor?: string;
  hairColor?: string;
  accessory?: CelestialNpcAccessory;
}

export interface CelestialChibiRig {
  group: THREE.Group;
  headGroup: THREE.Group;
  leftArm: THREE.Group;
  rightArm: THREE.Group;
  leftLeg: THREE.Group;
  rightLeg: THREE.Group;
  wings?: [THREE.Mesh, THREE.Mesh];
  baseY: number;
  walkPhase: number;
}

export interface CelestialCoupleRig {
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
    starPins: THREE.Group[];
    veil: THREE.Mesh;
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

export function buildCelestialChibi(
  opts: CelestialChibiOptions,
): CelestialChibiRig {
  const {
    gender,
    outfitColor = gender === "cewek" ? "#efe2cb" : "#18234a",
    accentColor = "#efc86e",
    skinColor = "#f5cfb4",
    hairColor = "#2a1a16",
    accessory = gender === "cewek" ? "tiara" : "starhat",
  } = opts;

  const group = new THREE.Group();
  const baseY = 0;

  const skinMat = new THREE.MeshStandardMaterial({
    color: skinColor,
    roughness: 0.65,
    metalness: 0.02,
  });
  const outfitMat = new THREE.MeshStandardMaterial({
    color: outfitColor,
    roughness: 0.5,
    metalness: 0.14,
  });
  const goldMat = new THREE.MeshStandardMaterial({
    color: accentColor,
    roughness: 0.25,
    metalness: 0.82,
    emissive: new THREE.Color("#684a14"),
    emissiveIntensity: 0.2,
  });
  const hairMat = new THREE.MeshStandardMaterial({
    color: hairColor,
    roughness: 0.68,
  });
  const shoeMat = new THREE.MeshStandardMaterial({
    color: "#221a2a",
    roughness: 0.45,
    metalness: 0.18,
  });

  // Soft shadow disc
  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(0.32, 20),
    new THREE.MeshBasicMaterial({
      color: 0x090d22,
      transparent: true,
      opacity: 0.34,
      depthWrite: false,
    }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.015;
  group.add(shadow);

  // Legs
  const pantsMat = new THREE.MeshStandardMaterial({
    color: gender === "cewek" ? "#faf4e8" : "#141a33",
    roughness: 0.62,
  });

  const makeLeg = (offsetX: number) => {
    const legPivot = new THREE.Group();
    legPivot.position.set(offsetX, 0.26, 0);

    const leg = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.062, 0.22, 10),
      pantsMat,
    );
    leg.position.y = -0.1;
    leg.castShadow = true;
    legPivot.add(leg);

    const shoe = new THREE.Mesh(new THREE.SphereGeometry(0.072, 10, 8), shoeMat);
    shoe.scale.set(0.95, 0.62, 1.32);
    shoe.position.set(0, -0.21, 0.024);
    shoe.castShadow = true;
    legPivot.add(shoe);

    return legPivot;
  };

  const leftLeg = makeLeg(-0.105);
  const rightLeg = makeLeg(0.105);
  group.add(leftLeg, rightLeg);

  if (gender === "cewek") {
    // Flowing Celestial Evening Gown (LatheGeometry silhouette)
    const gownPoints = [
      new THREE.Vector2(0.28, 0.04),
      new THREE.Vector2(0.25, 0.22),
      new THREE.Vector2(0.19, 0.42),
      new THREE.Vector2(0.14, 0.56),
      new THREE.Vector2(0.17, 0.68),
      new THREE.Vector2(0.11, 0.72),
    ];
    const gown = new THREE.Mesh(new THREE.LatheGeometry(gownPoints, 20), outfitMat);
    gown.castShadow = true;
    group.add(gown);

    // Gold hem & starlight waist sash
    const hemRing = new THREE.Mesh(new THREE.TorusGeometry(0.275, 0.018, 6, 20), goldMat);
    hemRing.rotation.x = Math.PI / 2;
    hemRing.position.y = 0.05;
    const sash = new THREE.Mesh(
      new THREE.CylinderGeometry(0.148, 0.16, 0.06, 16),
      goldMat,
    );
    sash.position.y = 0.54;
    group.add(hemRing, sash);
  } else {
    // Royal Navy Tailored Jacket + Lapel Gold Trim
    const jacket = new THREE.Mesh(
      new THREE.CylinderGeometry(0.185, 0.245, 0.44, 14),
      outfitMat,
    );
    jacket.position.y = 0.45;
    jacket.castShadow = true;
    group.add(jacket);

    const cravat = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.24, 0.045),
      new THREE.MeshStandardMaterial({ color: "#faf5eb", roughness: 0.45 }),
    );
    cravat.position.set(0, 0.53, 0.18);
    const sash = new THREE.Mesh(
      new THREE.CylinderGeometry(0.21, 0.22, 0.065, 14),
      goldMat,
    );
    sash.position.y = 0.34;
    group.add(cravat, sash);
  }

  // Neck
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.078, 0.1, 10), skinMat);
  neck.position.y = 0.68;
  group.add(neck);

  // Arms
  const makeArm = (offsetX: number, tiltZ: number) => {
    const armPivot = new THREE.Group();
    armPivot.position.set(offsetX, 0.6, 0);
    armPivot.rotation.z = tiltZ;

    const sleeve = new THREE.Mesh(
      new THREE.CylinderGeometry(0.064, 0.056, 0.21, 10),
      outfitMat,
    );
    sleeve.position.y = -0.095;
    sleeve.castShadow = true;
    armPivot.add(sleeve);

    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 10), skinMat);
    hand.position.y = -0.215;
    armPivot.add(hand);

    return armPivot;
  };

  const leftArm = makeArm(-0.23, 0.22);
  const rightArm = makeArm(0.23, -0.22);
  group.add(leftArm, rightArm);

  // Optional Accessory Prop on Arm (Camera for Bimo)
  if (accessory === "camera") {
    const camBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.1, 0.08),
      new THREE.MeshStandardMaterial({ color: "#222638", roughness: 0.35, metalness: 0.5 }),
    );
    camBody.position.set(0, -0.22, 0.06);
    const camLens = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.06, 10), goldMat);
    camLens.rotation.x = Math.PI / 2;
    camLens.position.set(0, -0.22, 0.11);
    rightArm.add(camBody, camLens);
  }

  // Optional Translucent Fairy Wings (Aurelia & Guests who want wings feel)
  let wings: [THREE.Mesh, THREE.Mesh] | undefined;
  if (accessory === "wings") {
    const wingMat = new THREE.MeshPhysicalMaterial({
      color: 0xd9ecff,
      roughness: 0.2,
      metalness: 0.1,
      transparent: true,
      opacity: 0.58,
      emissive: new THREE.Color("#9cc6ff"),
      emissiveIntensity: 0.35,
      side: THREE.DoubleSide,
    });
    const wGeo = new THREE.CircleGeometry(0.28, 12);
    const leftW = new THREE.Mesh(wGeo, wingMat);
    leftW.scale.set(1.25, 0.72, 1);
    leftW.position.set(-0.24, 0.58, -0.22);
    leftW.rotation.set(0.15, -0.42, 0.35);

    const rightW = new THREE.Mesh(wGeo, wingMat);
    rightW.scale.set(1.25, 0.72, 1);
    rightW.position.set(0.24, 0.58, -0.22);
    rightW.rotation.set(0.15, 0.42, -0.35);
    group.add(leftW, rightW);
    wings = [leftW, rightW];
  }

  // Head Group with expressive painted Chibi face
  const headGroup = new THREE.Group();
  headGroup.position.y = 0.96;
  group.add(headGroup);

  const faceTex = createChibiFaceTexture(gender, skinColor);
  const faceMat = new THREE.MeshStandardMaterial({
    map: faceTex,
    roughness: 0.62,
    metalness: 0.02,
  });
  const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.32, 26, 20), faceMat);
  headMesh.rotation.y = -Math.PI / 2;
  headMesh.castShadow = true;
  headGroup.add(headMesh);

  const earGeo = new THREE.SphereGeometry(0.056, 8, 8);
  const leftEar = new THREE.Mesh(earGeo, skinMat);
  leftEar.position.set(-0.31, -0.02, 0.01);
  const rightEar = new THREE.Mesh(earGeo, skinMat);
  rightEar.position.set(0.31, -0.02, 0.01);
  headGroup.add(leftEar, rightEar);

  // Hair cap leaving front +Z face cleanly open
  const hairTop = new THREE.Mesh(
    new THREE.SphereGeometry(0.336, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.42),
    hairMat,
  );
  hairTop.rotation.x = -0.18;
  hairTop.position.set(0, 0.03, -0.04);
  const hairBack = new THREE.Mesh(
    new THREE.SphereGeometry(0.335, 18, 14, Math.PI * 0.62, Math.PI * 0.76),
    hairMat,
  );
  hairBack.rotation.y = Math.PI / 2;
  headGroup.add(hairTop, hairBack);

  if (gender === "cewek") {
    const bun = new THREE.Mesh(new THREE.SphereGeometry(0.15, 14, 12), hairMat);
    bun.position.set(0, 0.18, -0.26);
    headGroup.add(bun);

    if (accessory === "floral") {
      for (let i = -2; i <= 2; i++) {
        const flower = new THREE.Mesh(
          new THREE.SphereGeometry(0.052, 8, 8),
          new THREE.MeshStandardMaterial({
            color: i % 2 === 0 ? "#ffdce8" : "#ffe099",
            emissive: new THREE.Color("#69354a"),
            emissiveIntensity: 0.25,
          }),
        );
        flower.position.set(i * 0.09, 0.31 - Math.abs(i) * 0.025, 0.05);
        headGroup.add(flower);
      }
    } else {
      // Golden Starlight Tiara Crown
      const crown = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.022, 8, 20), goldMat);
      crown.rotation.x = Math.PI / 2 - 0.18;
      crown.position.set(0, 0.31, 0.04);
      const starGem = new THREE.Mesh(new THREE.OctahedronGeometry(0.045, 0), goldMat);
      starGem.position.set(0, 0.36, 0.16);
      headGroup.add(crown, starGem);
    }
  } else if (accessory === "starhat") {
    // Stylish Royal Observatory Cap / Star Hat
    const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.34, 0.03, 18), outfitMat);
    brim.position.set(0, 0.3, -0.02);
    const domeCap = new THREE.Mesh(new THREE.ConeGeometry(0.21, 0.28, 14), outfitMat);
    domeCap.position.set(0, 0.44, -0.02);
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.02, 6, 18), goldMat);
    band.rotation.x = Math.PI / 2;
    band.position.set(0, 0.33, -0.02);
    headGroup.add(brim, domeCap, band);
  }

  return {
    group,
    headGroup,
    leftArm,
    rightArm,
    leftLeg,
    rightLeg,
    wings,
    baseY,
    walkPhase: 0,
  };
}

export function animateCelestialChibi(
  rig: CelestialChibiRig,
  moveSpeed: number,
  dt: number,
  elapsed: number,
): void {
  if (moveSpeed > 0.08) {
    rig.walkPhase += dt * Math.min(14, 6 + moveSpeed * 2.2);
    const swing = Math.sin(rig.walkPhase) * 0.6;
    rig.leftLeg.rotation.x = swing;
    rig.rightLeg.rotation.x = -swing;
    rig.leftArm.rotation.x = -swing * 0.7;
    rig.rightArm.rotation.x = swing * 0.7;
    rig.group.position.y = rig.baseY + Math.abs(Math.sin(rig.walkPhase)) * 0.06;
    rig.headGroup.rotation.z = Math.sin(rig.walkPhase) * 0.045;
  } else {
    rig.leftLeg.rotation.x *= 0.82;
    rig.rightLeg.rotation.x *= 0.82;
    rig.leftArm.rotation.x *= 0.82;
    rig.rightArm.rotation.x *= 0.82;
    rig.group.position.y = rig.baseY + Math.sin(elapsed * 2.2) * 0.015;
    rig.headGroup.rotation.z = Math.sin(elapsed * 1.4) * 0.025;
  }

  if (rig.wings) {
    const flap = Math.sin(elapsed * (moveSpeed > 0.1 ? 9.5 : 4.2)) * 0.2;
    rig.wings[0].rotation.y = -0.42 - flap;
    rig.wings[1].rotation.y = 0.42 + flap;
  }
}

export function renderCelestialPortraits(renderer: THREE.WebGLRenderer): {
  cewek: string;
  cowok: string;
} {
  const size = 256;
  const target = new THREE.WebGLRenderTarget(size, size, {
    samples: 0,
    type: THREE.UnsignedByteType,
  });

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#131d47");

  const hemi = new THREE.HemisphereLight(0xfff5de, 0x2f3b70, 1.85);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xffeacc, 1.6);
  key.position.set(1.4, 2.0, 3.6);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xa3c0ff, 0.8);
  fill.position.set(-1.6, 0.4, 3.0);
  scene.add(fill);

  const cam = new THREE.PerspectiveCamera(28, 1, 0.1, 20);
  cam.position.set(0, 0.96, 1.82);
  cam.lookAt(0, 0.91, 0);

  const offCanvas = document.createElement("canvas");
  offCanvas.width = size;
  offCanvas.height = size;
  const ctx = offCanvas.getContext("2d")!;
  const pixelBuf = new Uint8Array(size * size * 4);
  const flipped = new Uint8ClampedArray(size * size * 4);

  const captureVariant = (gender: "cewek" | "cowok"): string => {
    const rig = buildCelestialChibi({
      gender,
      accessory: gender === "cewek" ? "tiara" : "starhat",
    });
    rig.group.rotation.y = 0.08;
    scene.add(rig.group);

    const prevTarget = renderer.getRenderTarget();
    renderer.setRenderTarget(target);
    renderer.clear();
    renderer.render(scene, cam);
    renderer.readRenderTargetPixels(target, 0, 0, size, size, pixelBuf);
    renderer.setRenderTarget(prevTarget);

    for (let y = 0; y < size; y++) {
      const srcRow = (size - 1 - y) * size * 4;
      const dstRow = y * size * 4;
      flipped.set(pixelBuf.subarray(srcRow, srcRow + size * 4), dstRow);
    }
    const imgData = new ImageData(flipped, size, size);
    ctx.putImageData(imgData, 0, 0);

    scene.remove(rig.group);
    rig.group.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.geometry.dispose();
        const mats = Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material];
        mats.forEach((m) => m.dispose());
      }
    });

    return offCanvas.toDataURL("image/png");
  };

  const cewek = captureVariant("cewek");
  const cowok = captureVariant("cowok");

  target.dispose();
  return { cewek, cowok };
}

export function buildCelestialWeddingCouple(): CelestialCoupleRig {
  const group = new THREE.Group();

  const gownTex = createCelestialGownTexture();
  const tailcoatTex = createRoyalTailcoatTexture();
  const brideOpenTex = createWeddingFaceTexture("bride", "#f7d4b8", "open");
  const brideBlinkTex = createWeddingFaceTexture("bride", "#f7d4b8", "blink");
  const groomOpenTex = createWeddingFaceTexture("groom", "#edc3a1", "open");
  const groomBlinkTex = createWeddingFaceTexture("groom", "#edc3a1", "blink");

  const pearlGownMat = new THREE.MeshStandardMaterial({
    map: gownTex,
    roughness: 0.36,
    metalness: 0.1,
    emissive: new THREE.Color("#2a2038"),
    emissiveIntensity: 0.1,
  });
  const peplumMat = new THREE.MeshPhysicalMaterial({
    color: 0xfff8eb,
    roughness: 0.25,
    metalness: 0.12,
    transparent: true,
    opacity: 0.72,
    emissive: new THREE.Color("#634c20"),
    emissiveIntensity: 0.18,
  });
  const champagneMat = new THREE.MeshStandardMaterial({
    color: "#f2e2c4",
    roughness: 0.32,
    metalness: 0.2,
  });
  const tailcoatMat = new THREE.MeshStandardMaterial({
    map: tailcoatTex,
    roughness: 0.42,
    metalness: 0.14,
  });
  const navyLapelMat = new THREE.MeshStandardMaterial({
    color: "#162044",
    roughness: 0.52,
    metalness: 0.12,
  });
  const goldMat = new THREE.MeshStandardMaterial({
    color: "#efc86e",
    roughness: 0.22,
    metalness: 0.84,
    emissive: new THREE.Color("#735216"),
    emissiveIntensity: 0.28,
  });
  const sapphireGemMat = new THREE.MeshStandardMaterial({
    color: "#6ba6ff",
    roughness: 0.16,
    metalness: 0.5,
    emissive: new THREE.Color("#3b73d9"),
    emissiveIntensity: 0.55,
  });
  const pearlWhiteMat = new THREE.MeshStandardMaterial({
    color: "#fffcf4",
    roughness: 0.35,
  });
  const skinBrideMat = new THREE.MeshStandardMaterial({
    color: "#f7d4b8",
    roughness: 0.62,
    emissive: new THREE.Color("#2a150b"),
    emissiveIntensity: 0.06,
  });
  const skinGroomMat = new THREE.MeshStandardMaterial({
    color: "#edc3a1",
    roughness: 0.64,
    emissive: new THREE.Color("#261309"),
    emissiveIntensity: 0.06,
  });
  const hairMat = new THREE.MeshStandardMaterial({
    color: "#221611",
    roughness: 0.66,
  });
  const shoeMat = new THREE.MeshStandardMaterial({
    color: "#1b1628",
    roughness: 0.36,
    metalness: 0.25,
  });
  const shadowMat = new THREE.MeshBasicMaterial({
    color: 0x0d1229,
    transparent: true,
    opacity: 0.26,
    depthWrite: false,
  });

  // ============================================
  // BRIDE — Royal Celestial Princess Couture
  // ============================================
  const brideGroup = new THREE.Group();
  const brideShadow = new THREE.Mesh(new THREE.CircleGeometry(0.36, 22), shadowMat);
  brideShadow.rotation.x = -Math.PI / 2;
  brideShadow.position.y = 0.015;
  brideGroup.add(brideShadow);

  // Sculpted ivory-pearl selop shoes
  [-0.085, 0.085].forEach((sx) => {
    const selop = new THREE.Mesh(
      new THREE.SphereGeometry(0.062, 12, 10),
      pearlWhiteMat,
    );
    selop.scale.set(0.88, 0.56, 1.5);
    selop.position.set(sx, 0.032, 0.14);
    brideGroup.add(selop);
  });

  // Sculpted princess ballgown skirt + translucent peplum overskirt
  const skirtPoints = [
    new THREE.Vector2(0.4, 0.04),
    new THREE.Vector2(0.36, 0.25),
    new THREE.Vector2(0.28, 0.46),
    new THREE.Vector2(0.18, 0.66),
  ];
  const brideSkirt = new THREE.Mesh(
    new THREE.LatheGeometry(skirtPoints, 26),
    pearlGownMat,
  );
  brideSkirt.castShadow = true;
  brideSkirt.receiveShadow = true;
  brideGroup.add(brideSkirt);

  const peplumPoints = [
    new THREE.Vector2(0.32, 0.36),
    new THREE.Vector2(0.25, 0.52),
    new THREE.Vector2(0.17, 0.67),
  ];
  const peplumSkirt = new THREE.Mesh(
    new THREE.LatheGeometry(peplumPoints, 22),
    peplumMat,
  );
  brideGroup.add(peplumSkirt);

  // Fitted sweetheart corset bodice
  const bodicePoints = [
    new THREE.Vector2(0.175, 0.64),
    new THREE.Vector2(0.145, 0.72),
    new THREE.Vector2(0.185, 0.89),
    new THREE.Vector2(0.155, 0.99),
    new THREE.Vector2(0.09, 1.03),
  ];
  const bodice = new THREE.Mesh(
    new THREE.LatheGeometry(bodicePoints, 22),
    champagneMat,
  );
  bodice.castShadow = true;
  brideGroup.add(bodice);

  // Champagne-gold waist belt + diamond star buckle + 2-tier necklace
  const waistBelt = new THREE.Mesh(
    new THREE.CylinderGeometry(0.158, 0.168, 0.052, 22),
    goldMat,
  );
  waistBelt.position.y = 0.69;
  const beltBuckle = new THREE.Mesh(new THREE.OctahedronGeometry(0.04, 0), goldMat);
  beltBuckle.scale.set(1.2, 0.9, 0.5);
  beltBuckle.position.set(0, 0.69, 0.174);
  brideGroup.add(waistBelt, beltBuckle);

  [0, 1].forEach((tier) => {
    const col = new THREE.Mesh(
      new THREE.TorusGeometry(0.11 + tier * 0.024, 0.011, 8, 22, Math.PI * 1.12),
      tier === 0 ? goldMat : pearlWhiteMat,
    );
    col.rotation.x = Math.PI * 0.54;
    col.rotation.z = -Math.PI * 0.06;
    col.position.set(0, 1.005 - tier * 0.028, 0.04);
    brideGroup.add(col);
  });

  // Bride inner left arm reaching inward toward Groom's right hand
  const brideLeftArm = new THREE.Group();
  brideLeftArm.position.set(-0.185, 0.98, 0.02);
  brideLeftArm.rotation.set(-0.34, 0, -0.34);
  const bPuffL = new THREE.Mesh(new THREE.SphereGeometry(0.058, 10, 10), champagneMat);
  const bUpperL = new THREE.Mesh(new THREE.CylinderGeometry(0.046, 0.04, 0.24, 12), champagneMat);
  bUpperL.position.y = -0.11;
  bUpperL.castShadow = true;
  const bHandL = new THREE.Mesh(new THREE.SphereGeometry(0.042, 10, 10), skinBrideMat);
  bHandL.position.y = -0.25;
  brideLeftArm.add(bPuffL, bUpperL, bHandL);

  // Bride outer right articulated arm cradling lush 7-rose bridal bouquet
  const brideRightArm = new THREE.Group();
  brideRightArm.position.set(0.185, 0.98, 0.02);
  brideRightArm.rotation.set(-0.18, 0, -0.18);
  const bPuffR = new THREE.Mesh(new THREE.SphereGeometry(0.058, 10, 10), champagneMat);
  const bUpperR = new THREE.Mesh(new THREE.CylinderGeometry(0.046, 0.04, 0.18, 12), champagneMat);
  bUpperR.position.y = -0.09;
  bUpperR.castShadow = true;

  const brideRightElbow = new THREE.Group();
  brideRightElbow.position.set(0, -0.17, 0);
  brideRightElbow.rotation.set(-0.98, 0, -0.45);
  const bForeR = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.033, 0.16, 10), champagneMat);
  bForeR.position.y = -0.07;
  const bHandR = new THREE.Mesh(new THREE.SphereGeometry(0.04, 10, 10), skinBrideMat);
  bHandR.position.y = -0.16;

  const bouquet = new THREE.Group();
  bouquet.position.set(0.01, -0.16, 0.04);
  bouquet.rotation.x = 0.82;
  const wrap = new THREE.Mesh(
    new THREE.ConeGeometry(0.068, 0.15, 10),
    new THREE.MeshStandardMaterial({ color: "#f2dfbc", roughness: 0.6 }),
  );
  wrap.rotation.x = Math.PI * 0.9;
  wrap.position.y = -0.05;
  bouquet.add(wrap);

  const roseIvoryMat = new THREE.MeshStandardMaterial({ color: "#fffaf0", roughness: 0.45 });
  const roseBlushMat = new THREE.MeshStandardMaterial({ color: "#f3aab9", roughness: 0.48 });
  const leafMat = new THREE.MeshStandardMaterial({ color: "#4e7c55", roughness: 0.7 });
  for (let i = 0; i < 7; i++) {
    const a = (i / 6) * Math.PI * 2;
    const rad = i === 6 ? 0 : 0.056;
    const rose = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.036, 1),
      i % 2 === 0 ? roseIvoryMat : roseBlushMat,
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

  // Bride Neck + Expressive Head + Pearl Earrings + Sculpted Hair + Curved 5-Peak Diadem
  const brideNeck = new THREE.Mesh(
    new THREE.CylinderGeometry(0.058, 0.068, 0.09, 12),
    skinBrideMat,
  );
  brideNeck.position.y = 1.07;
  brideGroup.add(brideNeck);

  const brideHeadGroup = new THREE.Group();
  brideHeadGroup.position.y = 1.32;
  brideGroup.add(brideHeadGroup);

  const brideFaceMat = new THREE.MeshStandardMaterial({
    map: brideOpenTex,
    roughness: 0.58,
    emissive: new THREE.Color("#2b150b"),
    emissiveIntensity: 0.08,
  });
  const brideHead = new THREE.Mesh(new THREE.SphereGeometry(0.258, 30, 24), brideFaceMat);
  brideHead.scale.set(1.02, 0.99, 0.96);
  brideHead.rotation.y = -Math.PI / 2;
  brideHead.castShadow = true;
  brideHeadGroup.add(brideHead);

  [-0.255, 0.255].forEach((ex) => {
    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.042, 10, 10), skinBrideMat);
    ear.position.set(ex, -0.02, 0);
    const pearl = new THREE.Mesh(new THREE.SphereGeometry(0.022, 8, 8), pearlWhiteMat);
    pearl.position.set(ex * 1.04, -0.065, 0.01);
    brideHeadGroup.add(ear, pearl);
  });

  // Clean hairline sphere cap (matching desa-world architecture cleanly — zero z-fighting dots)
  const brideHairTop = new THREE.Mesh(
    new THREE.SphereGeometry(0.27, 26, 18, 0, Math.PI * 2, 0, Math.PI * 0.44),
    hairMat,
  );
  brideHairTop.scale.set(1.02, 1.01, 0.98);
  brideHairTop.rotation.x = -0.34;
  brideHeadGroup.add(brideHairTop);

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
  brideHeadGroup.add(brideHairBack);

  [-0.215, 0.215].forEach((sx) => {
    const wave = new THREE.Mesh(new THREE.SphereGeometry(0.085, 12, 10), hairMat);
    wave.scale.set(0.75, 1.4, 0.85);
    wave.position.set(sx, 0.05, 0.125);
    brideHeadGroup.add(wave);
  });

  const konde = new THREE.Mesh(new THREE.SphereGeometry(0.145, 16, 14), hairMat);
  konde.scale.set(1.22, 0.9, 0.72);
  konde.position.set(0, -0.01, -0.255);
  konde.castShadow = true;
  brideHeadGroup.add(konde);

  // Curved 5-peak ExtrudeGeometry Starlight Diadem Tiara + Sapphire Center Gem + 5 Star Hairpins
  const crownBand = new THREE.Mesh(
    new THREE.TorusGeometry(0.242, 0.02, 8, 28, Math.PI * 1.25),
    goldMat,
  );
  crownBand.rotation.x = Math.PI * 0.36;
  crownBand.rotation.z = -Math.PI * 0.125;
  crownBand.position.set(0, 0.14, 0.04);
  brideHeadGroup.add(crownBand);

  const tiaraShape = new THREE.Shape();
  tiaraShape.moveTo(-0.185, 0);
  tiaraShape.quadraticCurveTo(-0.175, 0.05, -0.15, 0.068);
  tiaraShape.quadraticCurveTo(-0.125, 0.045, -0.105, 0.048);
  tiaraShape.quadraticCurveTo(-0.088, 0.082, -0.072, 0.102);
  tiaraShape.quadraticCurveTo(-0.048, 0.076, -0.032, 0.082);
  tiaraShape.quadraticCurveTo(-0.014, 0.128, 0, 0.152);
  tiaraShape.quadraticCurveTo(0.014, 0.128, 0.032, 0.082);
  tiaraShape.quadraticCurveTo(0.048, 0.076, 0.072, 0.102);
  tiaraShape.quadraticCurveTo(0.088, 0.082, 0.105, 0.048);
  tiaraShape.quadraticCurveTo(0.125, 0.045, 0.15, 0.068);
  tiaraShape.quadraticCurveTo(0.175, 0.05, 0.185, 0);
  tiaraShape.quadraticCurveTo(0, 0.014, -0.185, 0);

  const tiaraGeo = new THREE.ExtrudeGeometry(tiaraShape, {
    depth: 0.016,
    bevelEnabled: true,
    bevelThickness: 0.004,
    bevelSize: 0.0035,
    bevelSegments: 2,
    curveSegments: 8,
  });
  const tiaraPos = tiaraGeo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < tiaraPos.count; i++) {
    const vx = tiaraPos.getX(i);
    const vz = tiaraPos.getZ(i);
    tiaraPos.setZ(i, vz - vx * vx * 2.15);
  }
  tiaraGeo.computeVertexNormals();

  const tiaraCrown = new THREE.Mesh(tiaraGeo, goldMat);
  tiaraCrown.position.set(0, 0.175, 0.21);
  tiaraCrown.rotation.x = -0.22;
  tiaraCrown.castShadow = true;

  const centerGem = new THREE.Mesh(new THREE.OctahedronGeometry(0.024, 0), sapphireGemMat);
  centerGem.scale.set(0.85, 1.2, 0.55);
  centerGem.position.set(0, 0.245, 0.215);
  brideHeadGroup.add(tiaraCrown, centerGem);

  const starPins: THREE.Group[] = [];
  [-0.54, -0.27, 0, 0.27, 0.54].forEach((ang) => {
    const pin = new THREE.Group();
    pin.position.set(Math.sin(ang) * 0.11, 0.23, -0.09);
    pin.rotation.z = -ang * 0.82;
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.17, 6), goldMat);
    stem.position.y = 0.085;
    const starTip = new THREE.Mesh(new THREE.OctahedronGeometry(0.03, 0), goldMat);
    starTip.position.y = 0.175;
    pin.add(stem, starTip);
    brideHeadGroup.add(pin);
    starPins.push(pin);
  });

  // Curved Translucent Starry Veil cascading behind Chignon
  const veilGeo = new THREE.PlaneGeometry(0.72, 1.2, 8, 12);
  const veilPos = veilGeo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < veilPos.count; i++) {
    const vy = veilPos.getY(i);
    const vx = veilPos.getX(i);
    const normDown = (0.6 - vy) / 1.2;
    veilPos.setZ(i, -normDown * normDown * 0.28 + Math.cos(vx * 5) * 0.02);
  }
  veilGeo.computeVertexNormals();
  const veil = new THREE.Mesh(
    veilGeo,
    new THREE.MeshStandardMaterial({
      color: "#fffdf8",
      transparent: true,
      opacity: 0.44,
      roughness: 0.4,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  );
  veil.position.set(0, -0.52, -0.29);
  veil.rotation.x = 0.16;
  brideHeadGroup.add(veil);

  // ============================================
  // GROOM — Royal Celestial Prince Couture
  // ============================================
  const groomGroup = new THREE.Group();
  const groomShadow = new THREE.Mesh(new THREE.CircleGeometry(0.32, 22), shadowMat);
  groomShadow.rotation.x = -Math.PI / 2;
  groomShadow.position.y = 0.015;
  groomGroup.add(groomShadow);

  // Tailored midnight trousers & sculpted royal shoes
  [-0.092, 0.092].forEach((lx) => {
    const leg = new THREE.Mesh(
      new THREE.CylinderGeometry(0.072, 0.062, 0.58, 12),
      navyLapelMat,
    );
    leg.position.set(lx, 0.31, 0);
    leg.castShadow = true;
    const shoe = new THREE.Mesh(new THREE.SphereGeometry(0.068, 12, 10), shoeMat);
    shoe.scale.set(0.92, 0.56, 1.58);
    shoe.position.set(lx, 0.035, 0.06);
    groomGroup.add(leg, shoe);
  });

  // Sculpted LatheGeometry royal prince tailcoat jacket
  const coatPoints = [
    new THREE.Vector2(0.195, 0.6),
    new THREE.Vector2(0.182, 0.76),
    new THREE.Vector2(0.215, 0.94),
    new THREE.Vector2(0.195, 1.04),
    new THREE.Vector2(0.105, 1.09),
  ];
  const tailcoat = new THREE.Mesh(
    new THREE.LatheGeometry(coatPoints, 22),
    tailcoatMat,
  );
  tailcoat.castShadow = true;
  groomGroup.add(tailcoat);

  // Tailcoat rear swallow-tail flap + midnight collar + gold piping + cummerbund + buttons + watch chain
  const tailFlap = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.28, 0.045), tailcoatMat);
  tailFlap.position.set(0, 0.48, -0.17);
  tailFlap.rotation.x = 0.14;
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.102, 0.055, 18), navyLapelMat);
  collar.position.y = 1.09;
  const collarGold = new THREE.Mesh(new THREE.TorusGeometry(0.098, 0.008, 8, 20), goldMat);
  collarGold.rotation.x = Math.PI / 2;
  collarGold.position.y = 1.07;
  const cummerbund = new THREE.Mesh(new THREE.CylinderGeometry(0.192, 0.198, 0.085, 18), goldMat);
  cummerbund.position.y = 0.62;
  const cravat = new THREE.Mesh(new THREE.ConeGeometry(0.095, 0.26, 4), pearlWhiteMat);
  cravat.rotation.x = Math.PI;
  cravat.rotation.y = Math.PI / 4;
  cravat.position.set(0, 0.94, 0.16);
  const bowTie = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.045, 0.04), navyLapelMat);
  bowTie.position.set(0, 1.045, 0.155);
  const cravatGem = new THREE.Mesh(new THREE.OctahedronGeometry(0.022, 0), sapphireGemMat);
  cravatGem.position.set(0, 1.045, 0.18);
  groomGroup.add(tailFlap, collar, collarGold, cummerbund, cravat, bowTie, cravatGem);

  // Golden braided shoulder epaulettes
  [-0.205, 0.205].forEach((ex) => {
    const ep = new THREE.Mesh(new THREE.BoxGeometry(0.095, 0.026, 0.07), goldMat);
    ep.position.set(ex, 1.035, 0.01);
    ep.rotation.z = ex < 0 ? 0.24 : -0.24;
    groomGroup.add(ep);
  });

  for (let b = 0; b < 4; b++) {
    const btn = new THREE.Mesh(new THREE.SphereGeometry(0.014, 8, 8), goldMat);
    btn.position.set(0.028, 0.95 - b * 0.068, 0.205 - b * 0.004);
    groomGroup.add(btn);
  }
  const watchChain = new THREE.Mesh(
    new THREE.TorusGeometry(0.068, 0.007, 6, 16, Math.PI * 0.85),
    goldMat,
  );
  watchChain.rotation.z = Math.PI * 1.08;
  watchChain.position.set(0.065, 0.82, 0.195);
  groomGroup.add(watchChain);

  // Groom inner right arm reaching inward to hold Bride's left hand
  const groomRightArm = new THREE.Group();
  groomRightArm.position.set(0.205, 1.0, 0.02);
  groomRightArm.rotation.set(-0.34, 0, 0.34);
  const gPuffR = new THREE.Mesh(new THREE.SphereGeometry(0.058, 10, 10), tailcoatMat);
  const gSleeveR = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.044, 0.25, 12), tailcoatMat);
  gSleeveR.position.y = -0.115;
  gSleeveR.castShadow = true;
  const gHandR = new THREE.Mesh(new THREE.SphereGeometry(0.044, 10, 10), skinGroomMat);
  gHandR.position.y = -0.26;
  groomRightArm.add(gPuffR, gSleeveR, gHandR);

  // Groom outer left 2-joint articulated waving arm
  const groomLeftArm = new THREE.Group();
  groomLeftArm.position.set(-0.205, 1.0, 0.02);
  groomLeftArm.rotation.set(-0.15, 0, 0.22);
  const gPuffL = new THREE.Mesh(new THREE.SphereGeometry(0.058, 10, 10), tailcoatMat);
  const gUpperL = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.044, 0.18, 12), tailcoatMat);
  gUpperL.position.y = -0.09;
  gUpperL.castShadow = true;

  const groomLeftElbow = new THREE.Group();
  groomLeftElbow.position.set(0, -0.17, 0);
  groomLeftElbow.rotation.set(-0.95, 0, 0.25);
  const gForeL = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.036, 0.17, 10), tailcoatMat);
  gForeL.position.y = -0.075;
  const gHandL = new THREE.Mesh(new THREE.SphereGeometry(0.044, 10, 10), skinGroomMat);
  gHandL.position.y = -0.17;
  groomLeftElbow.add(gForeL, gHandL);
  groomLeftArm.add(gPuffL, gUpperL, groomLeftElbow);
  groomGroup.add(groomLeftArm, groomRightArm);

  // Groom Neck + Expressive Stylized Head + Clean Hair + Royal Gold Circlet
  const groomNeck = new THREE.Mesh(
    new THREE.CylinderGeometry(0.064, 0.074, 0.09, 12),
    skinGroomMat,
  );
  groomNeck.position.y = 1.12;
  groomGroup.add(groomNeck);

  const groomHeadGroup = new THREE.Group();
  groomHeadGroup.position.y = 1.36;
  groomGroup.add(groomHeadGroup);

  const groomFaceMat = new THREE.MeshStandardMaterial({
    map: groomOpenTex,
    roughness: 0.6,
    emissive: new THREE.Color("#261309"),
    emissiveIntensity: 0.08,
  });
  const groomHead = new THREE.Mesh(new THREE.SphereGeometry(0.262, 30, 24), groomFaceMat);
  groomHead.scale.set(1.02, 0.99, 0.96);
  groomHead.rotation.y = -Math.PI / 2;
  groomHead.castShadow = true;
  groomHeadGroup.add(groomHead);

  [-0.258, 0.258].forEach((ex) => {
    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.044, 10, 10), skinGroomMat);
    ear.position.set(ex, -0.02, 0);
    groomHeadGroup.add(ear);
  });

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
  [-0.225, 0.225].forEach((sx) => {
    const sideburn = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.09, 0.065), hairMat);
    sideburn.position.set(sx, 0.04, 0.075);
    groomHeadGroup.add(sideburn);
  });
  const groomCirclet = new THREE.Mesh(new THREE.TorusGeometry(0.242, 0.015, 8, 24), goldMat);
  groomCirclet.rotation.x = Math.PI / 2 - 0.16;
  groomCirclet.position.set(0, 0.185, 0.01);
  groomHeadGroup.add(groomHair, groomHairBack, frontQuiff, groomCirclet);

  // Stand Groom & Bride shoulder-to-shoulder angled lovingly holding hands
  groomGroup.position.set(-0.34, 0, 0.08);
  groomGroup.rotation.y = 0.15;
  brideGroup.position.set(0.34, 0, 0.08);
  brideGroup.rotation.y = -0.15;

  group.add(groomGroup, brideGroup);

  // Floating Golden & Rose Star Affection Motes above the Couple
  const heartMotes: CelestialCoupleRig["heartMotes"] = [];
  const moteGeo = new THREE.OctahedronGeometry(0.048, 0);
  for (let i = 0; i < 10; i++) {
    const ang = (i / 10) * Math.PI * 2;
    const mat = new THREE.MeshBasicMaterial({
      color: i % 2 === 0 ? 0xffe494 : 0xf79bb4,
      transparent: true,
      opacity: 0.72,
    });
    const m = new THREE.Mesh(moteGeo, mat);
    const bx = Math.cos(ang) * 0.56;
    const by = 1.48 + (i % 2) * 0.18;
    const bz = 0.08 + Math.sin(ang) * 0.26;
    m.position.set(bx, by, bz);
    group.add(m);
    heartMotes.push({
      mesh: m,
      baseX: bx,
      baseY: by,
      baseZ: bz,
      phase: (i / 10) * Math.PI * 2,
    });
  }

  return {
    group,
    bride: {
      group: brideGroup,
      headGroup: brideHeadGroup,
      faceMat: brideFaceMat,
      openTex: brideOpenTex,
      blinkTex: brideBlinkTex,
      rightArm: brideRightArm,
      rightElbow: brideRightElbow,
      leftArm: brideLeftArm,
      bouquet,
      starPins,
      veil,
    },
    groom: {
      group: groomGroup,
      headGroup: groomHeadGroup,
      faceMat: groomFaceMat,
      openTex: groomOpenTex,
      blinkTex: groomBlinkTex,
      leftArm: groomLeftArm,
      leftElbow: groomLeftElbow,
      rightArm: groomRightArm,
    },
    heartMotes,
    wasBlinking: false,
    dispose: () => {
      gownTex.dispose();
      tailcoatTex.dispose();
      brideOpenTex.dispose();
      brideBlinkTex.dispose();
      groomOpenTex.dispose();
      groomBlinkTex.dispose();
    },
  };
}

export function animateCelestialWeddingCouple(
  couple: CelestialCoupleRig,
  _dt: number,
  elapsed: number,
  guestCloseness01 = 0,
): void {
  const boost = 1 + guestCloseness01 * 0.7;

  couple.bride.group.position.y = Math.sin(elapsed * 2.0) * 0.008;
  couple.groom.group.position.y = Math.sin(elapsed * 2.0 + 0.35) * 0.008;

  const glancePhase = (elapsed % 7.5) / 7.5;
  const glancing = glancePhase > 0.66 && glancePhase < 0.92;
  const glanceAmt = glancing
    ? Math.sin(((glancePhase - 0.66) / 0.26) * Math.PI)
    : 0;

  couple.bride.headGroup.rotation.y =
    -0.22 * glanceAmt + Math.sin(elapsed * 0.8) * 0.05;
  couple.bride.headGroup.rotation.z =
    0.05 * glanceAmt + Math.sin(elapsed * 1.2) * 0.02;

  couple.groom.headGroup.rotation.y =
    0.24 * glanceAmt + Math.sin(elapsed * 0.8 + 0.7) * 0.05;
  couple.groom.headGroup.rotation.z =
    -0.04 * glanceAmt + Math.sin(elapsed * 1.15) * 0.02;

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

  couple.groom.leftArm.rotation.z = 0.22 + Math.sin(elapsed * 2.6 * boost) * 0.06;
  couple.groom.leftElbow.rotation.x =
    -1.05 - guestCloseness01 * 0.18 + Math.sin(elapsed * 4.2 * boost) * 0.16;
  couple.groom.leftElbow.rotation.z =
    0.28 + Math.sin(elapsed * 4.2 * boost) * (0.14 + guestCloseness01 * 0.12);

  couple.bride.rightElbow.rotation.x =
    -0.98 - guestCloseness01 * 0.08 + Math.sin(elapsed * 2.1) * 0.04;
  couple.bride.bouquet.rotation.z = Math.sin(elapsed * 1.9) * 0.05;
  couple.bride.veil.rotation.x = 0.16 + Math.sin(elapsed * 1.7) * 0.04;
  couple.bride.veil.rotation.z = Math.cos(elapsed * 1.3) * 0.03;

  couple.bride.starPins.forEach((pin, idx) => {
    pin.rotation.x = Math.sin(elapsed * 3.2 + idx * 0.85) * 0.07;
  });

  couple.heartMotes.forEach((hm, idx) => {
    const rise = ((elapsed * (0.18 + guestCloseness01 * 0.14) + hm.phase) % 1) * 0.38;
    hm.mesh.position.set(
      hm.baseX + Math.sin(elapsed * 1.4 + hm.phase) * 0.06,
      hm.baseY + rise,
      hm.baseZ + Math.cos(elapsed * 1.1 + hm.phase) * 0.05,
    );
    const scale = (0.75 + guestCloseness01 * 0.5) * Math.sin((rise / 0.38) * Math.PI);
    hm.mesh.scale.setScalar(Math.max(0.1, scale));
    if (idx === 0) {
      const mat = hm.mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.42 + guestCloseness01 * 0.5;
    }
  });
}
