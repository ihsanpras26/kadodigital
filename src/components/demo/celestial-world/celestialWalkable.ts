export interface WalkableGroundSample {
  walkable: boolean;
  y: number;
}

const DECK_Y = 0.45;

const ISLANDS: { x: number; z: number; r: number }[] = [
  { x: 0, z: 12.2, r: 3.25 }, // Gerbang
  { x: 0, z: 0, r: 5.95 }, // Altar
  { x: -11.0, z: -0.8, r: 3.6 }, // Kisah
  { x: 11.0, z: -0.8, r: 3.6 }, // Galeri
  { x: 0, z: -11.2, r: 3.4 }, // Bintang Doa
];

const PELAMINAN_BLOCKER = { x: 0, z: -1.65, r: 1.65 };

export function sampleBridgeHeight(x: number, z: number): number | null {
  // South Bridge: x in [-1.25, 1.25], z in [5.4, 9.3]
  if (Math.abs(x) <= 1.25 && z >= 5.4 && z <= 9.3) {
    const u = (z - 5.4) / (9.3 - 5.4);
    return DECK_Y + Math.sin(u * Math.PI) * 0.42;
  }

  // West Bridge: z in [-1.75, 0.15], x in [-8.1, -5.4]
  if (z >= -1.75 && z <= 0.15 && x >= -8.1 && x <= -5.4) {
    const u = (x - -8.1) / (-5.4 - -8.1);
    return DECK_Y + Math.sin(u * Math.PI) * 0.36;
  }

  // East Bridge: z in [-1.75, 0.15], x in [5.4, 8.1]
  if (z >= -1.75 && z <= 0.15 && x >= 5.4 && x <= 8.1) {
    const u = (x - 5.4) / (8.1 - 5.4);
    return DECK_Y + Math.sin(u * Math.PI) * 0.36;
  }

  // North Bridge: x in [-1.15, 1.15], z in [-8.3, -5.5]
  if (Math.abs(x) <= 1.15 && z >= -8.3 && z <= -5.5) {
    const u = (z - -8.3) / (-5.5 - -8.3);
    return DECK_Y + Math.sin(u * Math.PI) * 0.38;
  }

  return null;
}

export function sampleWalkableGround(
  x: number,
  z: number,
): WalkableGroundSample {
  // Prevent stepping inside the elevated Pelaminan & Couple rig
  const dp = Math.hypot(x - PELAMINAN_BLOCKER.x, z - PELAMINAN_BLOCKER.z);
  if (dp < PELAMINAN_BLOCKER.r) {
    return { walkable: false, y: DECK_Y };
  }

  // Bridges take precedence where they arch slightly above DECK_Y
  const bridgeY = sampleBridgeHeight(x, z);
  if (bridgeY !== null) {
    return { walkable: true, y: bridgeY };
  }

  for (const isl of ISLANDS) {
    if (Math.hypot(x - isl.x, z - isl.z) <= isl.r) {
      return { walkable: true, y: DECK_Y };
    }
  }

  return { walkable: false, y: DECK_Y };
}

export function resolveWalkStep(
  curX: number,
  curZ: number,
  nextX: number,
  nextZ: number,
): { x: number; z: number; y: number } {
  const full = sampleWalkableGround(nextX, nextZ);
  if (full.walkable) {
    return { x: nextX, z: nextZ, y: full.y };
  }

  // Slide smoothly along X or Z if hugging an edge
  const tryX = sampleWalkableGround(nextX, curZ);
  if (tryX.walkable) {
    return { x: nextX, z: curZ, y: tryX.y };
  }

  const tryZ = sampleWalkableGround(curX, nextZ);
  if (tryZ.walkable) {
    return { x: curX, z: nextZ, y: tryZ.y };
  }

  // Tangent push if sliding against circular Pelaminan dais
  const dx = nextX - PELAMINAN_BLOCKER.x;
  const dz = nextZ - PELAMINAN_BLOCKER.z;
  const dist = Math.hypot(dx, dz);
  if (dist > 0.001 && dist < PELAMINAN_BLOCKER.r) {
    const pushX = PELAMINAN_BLOCKER.x + (dx / dist) * (PELAMINAN_BLOCKER.r + 0.02);
    const pushZ = PELAMINAN_BLOCKER.z + (dz / dist) * (PELAMINAN_BLOCKER.r + 0.02);
    const pushed = sampleWalkableGround(pushX, pushZ);
    if (pushed.walkable) {
      return { x: pushX, z: pushZ, y: pushed.y };
    }
  }

  const fallback = sampleWalkableGround(curX, curZ);
  return { x: curX, z: curZ, y: fallback.y };
}
