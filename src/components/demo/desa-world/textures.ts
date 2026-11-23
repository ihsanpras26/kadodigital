import * as THREE from "three";

export function createVillageGrassTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#6ca84f";
  ctx.fillRect(0, 0, size, size);

  // Subtle organic meadow patches
  const patches = [
    "#5d9942",
    "#78b458",
    "#639f49",
    "#82be60",
  ];
  for (let i = 0; i < 160; i++) {
    const x = ((i * 97) % size);
    const y = ((i * 173) % size);
    const r = 18 + (i % 5) * 10;
    ctx.fillStyle = patches[i % patches.length];
    ctx.globalAlpha = 0.28;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Grass tufts
  ctx.strokeStyle = "#4d8536";
  ctx.lineWidth = 2;
  for (let i = 0; i < 240; i++) {
    const x = (i * 53 + 17) % size;
    const y = (i * 109 + 29) % size;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 3, y - 7);
    ctx.moveTo(x + 2, y);
    ctx.lineTo(x + 4, y - 8);
    ctx.stroke();
  }

  // Tiny wildflower accents (cream & soft gold)
  for (let i = 0; i < 70; i++) {
    const x = (i * 89 + 41) % size;
    const y = (i * 137 + 13) % size;
    ctx.fillStyle = i % 3 === 0 ? "#ffe58f" : "#fff8e8";
    ctx.beginPath();
    ctx.arc(x, y, 2.2, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(7, 7);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createDirtPathTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#d5a36b";
  ctx.fillRect(0, 0, size, size);

  const grains = ["#c59159", "#e0b37e", "#b9844d"];
  for (let i = 0; i < 320; i++) {
    const x = (i * 71) % size;
    const y = (i * 113) % size;
    const w = 6 + (i % 7) * 2;
    ctx.fillStyle = grains[i % grains.length];
    ctx.globalAlpha = 0.35;
    ctx.beginPath();
    ctx.ellipse(x, y, w, w * 0.65, (i % 6) * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Stepping pebbles
  for (let i = 0; i < 85; i++) {
    const x = (i * 131 + 19) % size;
    const y = (i * 197 + 43) % size;
    ctx.fillStyle = i % 2 === 0 ? "#bfa07e" : "#8c6d51";
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.ellipse(x, y, 3.2 + (i % 3), 2.2 + (i % 2), i * 0.4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createRiverWaterTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  const grad = ctx.createLinearGradient(0, 0, 0, size);
  grad.addColorStop(0, "#246f76");
  grad.addColorStop(0.5, "#32868c");
  grad.addColorStop(1, "#257077");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // Soft lighter depth bands
  ctx.strokeStyle = "rgba(153, 224, 217, 0.26)";
  ctx.lineWidth = 8;
  for (let y = 32; y < size; y += 72) {
    ctx.beginPath();
    for (let x = 0; x <= size; x += 16) {
      const wave = Math.sin((x / size) * Math.PI * 4 + y * 0.1) * 10;
      if (x === 0) ctx.moveTo(x, y + wave);
      else ctx.lineTo(x, y + wave);
    }
    ctx.stroke();
  }

  // Stylized cozy ripple ovals & swirl lines (echoing Snowhollow river charm)
  ctx.strokeStyle = "rgba(232, 249, 245, 0.56)";
  ctx.lineWidth = 2.6;
  for (let i = 0; i < 24; i++) {
    const cx = (i * 83 + 30) % size;
    const cy = (i * 127 + 24) % size;
    const rx = 14 + (i % 4) * 7;
    const ry = 7 + (i % 3) * 3;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0.15, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Sparkle dots
  ctx.fillStyle = "rgba(255, 250, 232, 0.72)";
  for (let i = 0; i < 40; i++) {
    const x = (i * 103 + 11) % size;
    const y = (i * 157 + 37) % size;
    ctx.beginPath();
    ctx.arc(x, y, 2 + (i % 2), 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3.2, 1.2);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createSawahTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, "#4f7c54");
  grad.addColorStop(0.5, "#609166");
  grad.addColorStop(1, "#4b744f");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  ctx.strokeStyle = "rgba(218, 244, 210, 0.25)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 16; i++) {
    const x = (i * 47 + 15) % size;
    const y = (i * 61 + 20) % size;
    ctx.beginPath();
    ctx.ellipse(x, y, 16, 6, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createWoodPlankTexture(baseHex = "#8a4f2d", darkHex = "#5c3118"): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = baseHex;
  ctx.fillRect(0, 0, size, size);

  const plankHeight = 32;
  for (let y = 0; y < size; y += plankHeight) {
    ctx.fillStyle = y % 64 === 0 ? baseHex : darkHex;
    ctx.globalAlpha = 0.14;
    ctx.fillRect(0, y, size, plankHeight);
    ctx.globalAlpha = 1;

    ctx.strokeStyle = darkHex;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y);
    ctx.stroke();

    // Subtle wood grain
    ctx.strokeStyle = "rgba(255, 224, 185, 0.12)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(10, y + 12);
    ctx.quadraticCurveTo(size * 0.5, y + 16, size - 10, y + 11);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createChibiFaceTexture(
  variant: "cewek" | "cowok",
  skinHex = "#f4c7a6",
): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  // Base warm skin fill
  ctx.fillStyle = skinHex;
  ctx.fillRect(0, 0, size, size);

  // Soft upper forehead warm shadow blend
  const topGrad = ctx.createLinearGradient(0, 0, 0, size * 0.45);
  topGrad.addColorStop(0, "rgba(180, 110, 75, 0.12)");
  topGrad.addColorStop(1, "rgba(180, 110, 75, 0)");
  ctx.fillStyle = topGrad;
  ctx.fillRect(0, 0, size, size * 0.45);

  // Face region sits centered at u=0.5 near equator v~0.51 (y~0.49*size)
  const cx = size * 0.5;
  const eyeY = size * 0.49;
  const eyeDx = 34;

  const drawEye = (ex: number, isLeft: boolean) => {
    // Dark espresso glossy anime iris
    ctx.fillStyle = "#1c120e";
    ctx.beginPath();
    ctx.ellipse(ex, eyeY, 15, 19, 0, 0, Math.PI * 2);
    ctx.fill();

    // Warm lower iris crescent
    ctx.fillStyle = "#4d2f22";
    ctx.beginPath();
    ctx.ellipse(ex, eyeY + 6, 10, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Main bright specular highlight
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(ex - 4.5, eyeY - 6, 5.2, 0, Math.PI * 2);
    ctx.fill();

    // Secondary lower catchlight
    ctx.beginPath();
    ctx.arc(ex + 4.5, eyeY + 5, 2.4, 0, Math.PI * 2);
    ctx.fill();

    // Gentle brow
    ctx.strokeStyle = "#3a241b";
    ctx.lineWidth = 3.2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(ex, eyeY - 22, 11, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();

    // Extra cute outer lash wing for cewek
    if (variant === "cewek") {
      const dir = isLeft ? -1 : 1;
      ctx.strokeStyle = "#1c120e";
      ctx.lineWidth = 3.4;
      ctx.beginPath();
      ctx.moveTo(ex + dir * 13, eyeY - 7);
      ctx.lineTo(ex + dir * 20, eyeY - 12);
      ctx.stroke();
    }
  };

  drawEye(cx - eyeDx, true);
  drawEye(cx + eyeDx, false);

  // Warm rose cheek blush ovals
  const drawBlush = (bx: number) => {
    const blushGrad = ctx.createRadialGradient(bx, eyeY + 23, 2, bx, eyeY + 23, 22);
    blushGrad.addColorStop(0, "rgba(235, 115, 106, 0.55)");
    blushGrad.addColorStop(1, "rgba(235, 115, 106, 0)");
    ctx.fillStyle = blushGrad;
    ctx.beginPath();
    ctx.ellipse(bx, eyeY + 23, 22, 13, 0, 0, Math.PI * 2);
    ctx.fill();
  };
  drawBlush(cx - 52);
  drawBlush(cx + 52);

  // Subtle nose & gentle smile
  ctx.fillStyle = "rgba(176, 98, 72, 0.45)";
  ctx.beginPath();
  ctx.arc(cx, eyeY + 18, 2.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#9c4738";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(cx, eyeY + 25, 8.5, 0.2 * Math.PI, 0.8 * Math.PI);
  ctx.stroke();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createRadialGlowTexture(): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  const grad = ctx.createRadialGradient(size / 2, size / 2, 4, size / 2, size / 2, size / 2);
  grad.addColorStop(0, "rgba(255, 200, 108, 0.82)");
  grad.addColorStop(0.42, "rgba(255, 178, 82, 0.34)");
  grad.addColorStop(1, "rgba(255, 165, 65, 0)");

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createSoftCircleTexture(): THREE.CanvasTexture {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  const grad = ctx.createRadialGradient(size / 2, size / 2, 2, size / 2, size / 2, size / 2);
  grad.addColorStop(0, "rgba(255, 255, 255, 1)");
  grad.addColorStop(0.45, "rgba(255, 245, 205, 0.78)");
  grad.addColorStop(1, "rgba(255, 240, 180, 0)");

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createSignTextTexture(title: string, subtitle: string): THREE.CanvasTexture {
  const w = 512;
  const h = 192;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  // Carved wood background
  ctx.fillStyle = "#5a2f1a";
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = "#d9ad68";
  ctx.lineWidth = 8;
  ctx.strokeRect(10, 10, w - 20, h - 20);

  ctx.fillStyle = "#f9ecd5";
  ctx.textAlign = "center";
  ctx.font = "800 48px Nunito, system-ui, sans-serif";
  ctx.fillText(title, w / 2, 92);

  ctx.fillStyle = "#e8c07c";
  ctx.font = "700 24px Nunito, system-ui, sans-serif";
  ctx.fillText(subtitle, w / 2, 142);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
