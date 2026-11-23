import * as THREE from "three";
import { createChibiFaceTexture } from "./textures";

export interface ChibiOptions {
  gender: "cewek" | "cowok";
  outfitColor?: string;
  accentColor?: string;
  skinColor?: string;
  hairColor?: string;
  hatType?: "sunhat" | "caping" | "floral" | "none";
}

export interface ChibiRig {
  group: THREE.Group;
  headGroup: THREE.Group;
  leftArm: THREE.Group;
  rightArm: THREE.Group;
  leftLeg: THREE.Group;
  rightLeg: THREE.Group;
  hatGroup: THREE.Group;
  baseY: number;
  walkPhase: number;
}

export function buildChibiCharacter(opts: ChibiOptions): ChibiRig {
  const {
    gender,
    outfitColor = gender === "cewek" ? "#b85d3b" : "#2d6a4f",
    accentColor = "#e7c178",
    skinColor = "#f4c7a6",
    hairColor = "#42271c",
    hatType = gender === "cewek" ? "floral" : "sunhat",
  } = opts;

  const group = new THREE.Group();
  const baseY = 0;

  const skinMat = new THREE.MeshStandardMaterial({
    color: skinColor,
    roughness: 0.72,
    metalness: 0.02,
  });
  const outfitMat = new THREE.MeshStandardMaterial({
    color: outfitColor,
    roughness: 0.78,
  });
  const accentMat = new THREE.MeshStandardMaterial({
    color: accentColor,
    roughness: 0.65,
  });
  const pantsMat = new THREE.MeshStandardMaterial({
    color: gender === "cewek" ? "#f4ebe0" : "#3a342f",
    roughness: 0.85,
  });
  const hairMat = new THREE.MeshStandardMaterial({
    color: hairColor,
    roughness: 0.74,
  });
  const shoeMat = new THREE.MeshStandardMaterial({
    color: "#4a2a18",
    roughness: 0.8,
  });

  // Soft ground shadow disc
  const shadowGeo = new THREE.CircleGeometry(0.32, 20);
  const shadowMat = new THREE.MeshBasicMaterial({
    color: 0x16241b,
    transparent: true,
    opacity: 0.28,
    depthWrite: false,
  });
  const shadow = new THREE.Mesh(shadowGeo, shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.015;
  group.add(shadow);

  // Legs
  const makeLeg = (offsetX: number) => {
    const legPivot = new THREE.Group();
    legPivot.position.set(offsetX, 0.25, 0);

    const thigh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.075, 0.068, 0.22, 12),
      pantsMat,
    );
    thigh.position.y = -0.1;
    thigh.castShadow = true;
    legPivot.add(thigh);

    const foot = new THREE.Mesh(new THREE.SphereGeometry(0.078, 12, 10), shoeMat);
    foot.scale.set(1, 0.68, 1.32);
    foot.position.set(0, -0.21, 0.025);
    foot.castShadow = true;
    legPivot.add(foot);

    return legPivot;
  };

  const leftLeg = makeLeg(-0.11);
  const rightLeg = makeLeg(0.11);
  group.add(leftLeg, rightLeg);

  // Torso (cozy kebaya / batik tunic)
  const torso = new THREE.Mesh(
    new THREE.CylinderGeometry(0.19, 0.26, 0.42, 16),
    outfitMat,
  );
  torso.position.y = 0.44;
  torso.castShadow = true;
  group.add(torso);

  // Selendang / waist sash detail
  const sash = new THREE.Mesh(
    new THREE.CylinderGeometry(0.225, 0.235, 0.085, 16),
    accentMat,
  );
  sash.position.y = 0.34;
  group.add(sash);

  // Neck
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.1, 10), skinMat);
  neck.position.y = 0.66;
  group.add(neck);

  // Arms
  const makeArm = (offsetX: number, tiltZ: number) => {
    const armPivot = new THREE.Group();
    armPivot.position.set(offsetX, 0.58, 0);
    armPivot.rotation.z = tiltZ;

    const sleeve = new THREE.Mesh(
      new THREE.CylinderGeometry(0.068, 0.06, 0.2, 10),
      outfitMat,
    );
    sleeve.position.y = -0.09;
    sleeve.castShadow = true;
    armPivot.add(sleeve);

    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.062, 10, 10), skinMat);
    hand.position.y = -0.21;
    armPivot.add(hand);

    return armPivot;
  };

  const leftArm = makeArm(-0.235, 0.2);
  const rightArm = makeArm(0.235, -0.2);
  group.add(leftArm, rightArm);

  // Head Group
  const headGroup = new THREE.Group();
  headGroup.position.y = 0.94;
  group.add(headGroup);

  const faceTexture = createChibiFaceTexture(gender, skinColor);
  const faceMat = new THREE.MeshStandardMaterial({
    map: faceTexture,
    roughness: 0.65,
    metalness: 0.02,
  });

  // Rotate sphere -90deg Y so u=0.5 faces +Z forward
  const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.325, 28, 22), faceMat);
  headMesh.rotation.y = -Math.PI / 2;
  headMesh.castShadow = true;
  headGroup.add(headMesh);

  // Little ears
  const earGeo = new THREE.SphereGeometry(0.06, 10, 10);
  const leftEar = new THREE.Mesh(earGeo, skinMat);
  leftEar.position.set(-0.32, -0.02, 0.01);
  const rightEar = new THREE.Mesh(earGeo, skinMat);
  rightEar.position.set(0.32, -0.02, 0.01);
  headGroup.add(leftEar, rightEar);

  // Sculpted Hair Cap (leaves +Z face 100% open!) + Back Hair Bowl
  const hairTop = new THREE.Mesh(
    new THREE.SphereGeometry(0.342, 22, 16, 0, Math.PI * 2, 0, Math.PI * 0.41),
    hairMat,
  );
  hairTop.rotation.x = -0.26;
  hairTop.castShadow = true;
  headGroup.add(hairTop);

  // Back hemisphere hair shell (centered at phi=1.5*PI = -Z) so +Z face stays completely open
  const hairBack = new THREE.Mesh(
    new THREE.SphereGeometry(
      0.345,
      20,
      16,
      Math.PI * 0.88,
      Math.PI * 1.24,
      Math.PI * 0.2,
      Math.PI * 0.62,
    ),
    hairMat,
  );
  hairBack.castShadow = true;
  headGroup.add(hairBack);

  // Cute forehead bangs high above eyebrows
  const bangCenter = new THREE.Mesh(new THREE.SphereGeometry(0.145, 14, 10), hairMat);
  bangCenter.scale.set(1.45, 0.38, 0.55);
  bangCenter.position.set(0, 0.255, 0.215);
  headGroup.add(bangCenter);

  const sideBangL = new THREE.Mesh(new THREE.SphereGeometry(0.095, 12, 10), hairMat);
  sideBangL.scale.set(0.75, 1.35, 0.72);
  sideBangL.position.set(-0.265, 0.06, 0.14);
  const sideBangR = sideBangL.clone();
  sideBangR.position.x = 0.265;
  headGroup.add(sideBangL, sideBangR);

  if (gender === "cewek") {
    // Low sanggul / twin side hair bob
    const bun = new THREE.Mesh(new THREE.SphereGeometry(0.145, 14, 12), hairMat);
    bun.position.set(0, 0.05, -0.34);
    headGroup.add(bun);

    // Frangipani / jasmine hair pin
    const flowerPin = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.07, 0),
      new THREE.MeshStandardMaterial({ color: "#fff8eb", roughness: 0.6 }),
    );
    flowerPin.position.set(0.24, 0.19, 0.17);
    headGroup.add(flowerPin);
  }

  // Optional Indonesian Hat Group
  const hatGroup = new THREE.Group();
  headGroup.add(hatGroup);

  if (hatType === "sunhat") {
    const strawMat = new THREE.MeshStandardMaterial({
      color: "#d9b372",
      roughness: 0.85,
    });
    const ribbonMat = new THREE.MeshStandardMaterial({
      color: outfitColor,
      roughness: 0.7,
    });
    const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.49, 0.04, 24), strawMat);
    brim.position.set(0, 0.25, -0.02);
    brim.rotation.x = -0.1;
    brim.castShadow = true;
    const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.3, 0.18, 20), strawMat);
    crown.position.set(0, 0.34, -0.02);
    crown.rotation.x = -0.1;
    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.295, 0.305, 0.05, 20), ribbonMat);
    band.position.set(0, 0.29, -0.02);
    band.rotation.x = -0.1;
    hatGroup.add(brim, crown, band);
  } else if (hatType === "caping") {
    const wovenMat = new THREE.MeshStandardMaterial({
      color: "#cfa360",
      roughness: 0.88,
    });
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.48, 0.26, 20), wovenMat);
    cone.position.set(0, 0.35, -0.02);
    cone.rotation.x = -0.08;
    cone.castShadow = true;
    hatGroup.add(cone);
  } else if (hatType === "floral") {
    // Festive small sunhat with floral wreath for girl protagonist
    const strawMat = new THREE.MeshStandardMaterial({
      color: "#ead2a4",
      roughness: 0.85,
    });
    const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.43, 0.45, 0.035, 22), strawMat);
    brim.position.set(0, 0.255, -0.02);
    brim.rotation.x = -0.09;
    const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.27, 0.14, 18), strawMat);
    crown.position.set(0, 0.325, -0.02);
    crown.rotation.x = -0.09;
    const petalMat = new THREE.MeshStandardMaterial({ color: "#f6e5dc", roughness: 0.6 });
    const budMat = new THREE.MeshStandardMaterial({ color: "#e5a349", roughness: 0.6 });
    for (let i = 0; i < 4; i++) {
      const f = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), i % 2 === 0 ? petalMat : budMat);
      f.position.set(-0.2 + i * 0.09, 0.3, 0.22);
      hatGroup.add(f);
    }
    hatGroup.add(brim, crown);
  }

  return {
    group,
    headGroup,
    leftArm,
    rightArm,
    leftLeg,
    rightLeg,
    hatGroup,
    baseY,
    walkPhase: 0,
  };
}

export function animateChibi(
  rig: ChibiRig,
  moveSpeed: number,
  dt: number,
  elapsed: number,
): void {
  if (moveSpeed > 0.08) {
    rig.walkPhase += dt * Math.min(14, 6 + moveSpeed * 2.2);
    const swing = Math.sin(rig.walkPhase) * 0.62;
    rig.leftLeg.rotation.x = swing;
    rig.rightLeg.rotation.x = -swing;
    rig.leftArm.rotation.x = -swing * 0.7;
    rig.rightArm.rotation.x = swing * 0.7;
    rig.group.position.y = rig.baseY + Math.abs(Math.sin(rig.walkPhase)) * 0.065;
    rig.headGroup.rotation.z = Math.sin(rig.walkPhase) * 0.045;
  } else {
    rig.leftLeg.rotation.x *= 0.82;
    rig.rightLeg.rotation.x *= 0.82;
    rig.leftArm.rotation.x *= 0.82;
    rig.rightArm.rotation.x *= 0.82;
    rig.group.position.y = rig.baseY + Math.sin(elapsed * 2.4) * 0.015;
    rig.headGroup.rotation.z = Math.sin(elapsed * 1.4) * 0.025;
  }
}

/**
 * Renders both Cewek and Cowok 3D chibi close-up portraits using the existing
 * WebGLRenderer + a single temporary WebGLRenderTarget (zero extra WebGL contexts).
 */
export function renderChibiPortraits(renderer: THREE.WebGLRenderer): {
  cewek: string;
  cowok: string;
} {
  const size = 256;
  const target = new THREE.WebGLRenderTarget(size, size, {
    samples: 0,
    type: THREE.UnsignedByteType,
  });

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#dce8df");

  const hemi = new THREE.HemisphereLight(0xfff9ee, 0x99b398, 1.85);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xfff4df, 1.5);
  key.position.set(1.4, 2.0, 3.6);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xffe9cf, 0.75);
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
    const rig = buildChibiCharacter({
      gender,
      hatType: gender === "cewek" ? "floral" : "sunhat",
    });
    rig.group.rotation.y = 0.08;
    scene.add(rig.group);

    const prevTarget = renderer.getRenderTarget();
    renderer.setRenderTarget(target);
    renderer.clear();
    renderer.render(scene, cam);
    renderer.readRenderTargetPixels(target, 0, 0, size, size, pixelBuf);
    renderer.setRenderTarget(prevTarget);

    // Flip Y from WebGL bottom-up to Canvas top-down
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
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
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
