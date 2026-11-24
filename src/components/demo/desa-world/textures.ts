import * as THREE from "three";
import type { DesaMode, DesaTimeOfDay } from "@/data/desaWorldData";

export function createVillageGrassTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#6ca84f";
  ctx.fillRect(0, 0, size, size);

  const patches = ["#5d9942", "#78b458", "#639f49", "#82be60", "#558c3b"];
  for (let i = 0; i < 180; i++) {
    const x = (i * 97) % size;
    const y = (i * 173) % size;
    const r = 18 + (i % 5) * 10;
    ctx.fillStyle = patches[i % patches.length];
    ctx.globalAlpha = 0.26;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  ctx.strokeStyle = "#4d8536";
  ctx.lineWidth = 2;
  for (let i = 0; i < 280; i++) {
    const x = (i * 53 + 17) % size;
    const y = (i * 109 + 29) % size;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 3, y - 7);
    ctx.moveTo(x + 2, y);
    ctx.lineTo(x + 4, y - 8);
    ctx.stroke();
  }

  // Tiny wildflower accents (cream, blush, & soft gold)
  for (let i = 0; i < 84; i++) {
    const x = (i * 89 + 41) % size;
    const y = (i * 137 + 13) % size;
    ctx.fillStyle = i % 4 === 0 ? "#f8c8d4" : i % 3 === 0 ? "#ffe58f" : "#fff8e8";
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

  // Warm sandstone courtyard base
  ctx.fillStyle = "#d9bc92";
  ctx.fillRect(0, 0, size, size);

  const grains = ["#cbb085", "#e4c9a2", "#bfa075"];
  for (let i = 0; i < 340; i++) {
    const x = (i * 71) % size;
    const y = (i * 113) % size;
    const w = 6 + (i % 7) * 2;
    ctx.fillStyle = grains[i % grains.length];
    ctx.globalAlpha = 0.34;
    ctx.beginPath();
    ctx.ellipse(x, y, w, w * 0.65, (i % 6) * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Natural flat garden flagstones
  for (let i = 0; i < 64; i++) {
    const x = (i * 131 + 23) % size;
    const y = (i * 197 + 43) % size;
    const rx = 10 + (i % 4) * 4;
    const ry = 7 + (i % 3) * 3;
    ctx.fillStyle = i % 2 === 0 ? "rgba(232, 214, 185, 0.55)" : "rgba(184, 154, 118, 0.38)";
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, i * 0.35, 0, Math.PI * 2);
    ctx.fill();
  }

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
  grad.addColorStop(0, "#1f6870");
  grad.addColorStop(0.5, "#2f858c");
  grad.addColorStop(1, "#216b72");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  ctx.strokeStyle = "rgba(164, 232, 224, 0.25)";
  ctx.lineWidth = 7;
  for (let y = 28; y < size; y += 64) {
    ctx.beginPath();
    for (let x = 0; x <= size; x += 16) {
      const wave = Math.sin((x / size) * Math.PI * 4 + y * 0.1) * 9;
      if (x === 0) ctx.moveTo(x, y + wave);
      else ctx.lineTo(x, y + wave);
    }
    ctx.stroke();
  }

  // Caustic ripple rings
  ctx.strokeStyle = "rgba(232, 249, 245, 0.45)";
  ctx.lineWidth = 2.2;
  for (let i = 0; i < 28; i++) {
    const cx = (i * 83 + 30) % size;
    const cy = (i * 127 + 24) % size;
    const rx = 12 + (i % 4) * 6;
    const ry = 6 + (i % 3) * 3;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0.15, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(255, 250, 232, 0.72)";
  for (let i = 0; i < 48; i++) {
    const x = (i * 103 + 11) % size;
    const y = (i * 157 + 37) % size;
    ctx.beginPath();
    ctx.arc(x, y, 1.8 + (i % 2), 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3.2, 1.4);
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
  grad.addColorStop(0, "#4b7b52");
  grad.addColorStop(0.5, "#5e9265");
  grad.addColorStop(1, "#46734c");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  ctx.strokeStyle = "rgba(218, 244, 210, 0.25)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 18; i++) {
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

export function createRoofTileTexture(
  baseHex = "#b45338",
  darkHex = "#7f321e",
): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = baseHex;
  ctx.fillRect(0, 0, size, size);

  const rows = 10;
  const cols = 12;
  const rowH = size / rows;
  const colW = size / cols;

  for (let r = 0; r < rows; r++) {
    const y = r * rowH;
    const shift = (r % 2) * (colW * 0.5);

    for (let c = -1; c <= cols; c++) {
      const x = c * colW + shift;
      const shade = ((r * 7 + c * 11) % 3) * 0.06;
      const g = ctx.createLinearGradient(x, y, x, y + rowH);
      g.addColorStop(0, `rgba(255, 212, 180, ${0.14 - shade})`);
      g.addColorStop(0.7, "rgba(0, 0, 0, 0)");
      g.addColorStop(1, darkHex);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + colW, y);
      ctx.lineTo(x + colW, y + rowH - 5);
      ctx.quadraticCurveTo(x + colW * 0.5, y + rowH + 6, x, y + rowH - 5);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = "rgba(70, 24, 14, 0.45)";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createStoneTileTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#b5b0a6";
  ctx.fillRect(0, 0, size, size);

  const rows = 6;
  const cols = 6;
  const rowH = size / rows;
  const colW = size / cols;

  for (let r = 0; r < rows; r++) {
    const offset = (r % 2) * (colW * 0.5);
    for (let c = -1; c <= cols; c++) {
      const x = c * colW + offset;
      const y = r * rowH;
      const tint = ((r * 13 + c * 17) % 5) * 6 - 12;
      const tone = 186 + tint;
      ctx.fillStyle = `rgb(${tone}, ${tone - 5}, ${tone - 12})`;
      ctx.fillRect(x + 2, y + 2, colW - 4, rowH - 4);
    }
  }

  for (let i = 0; i < 420; i++) {
    const sx = (i * 73 + 19) % size;
    const sy = (i * 137 + 31) % size;
    ctx.fillStyle = i % 2 === 0 ? "rgba(70, 65, 58, 0.16)" : "rgba(255, 250, 240, 0.18)";
    ctx.fillRect(sx, sy, 2, 2);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createBatikParangTexture(
  primaryHex = "#4f2d1b",
  goldHex = "#d8a852",
  creamHex = "#f2e3c4",
): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = primaryHex;
  ctx.fillRect(0, 0, size, size);

  // Classic diagonal Parang Kusumo waves
  ctx.save();
  ctx.translate(size / 2, size / 2);
  ctx.rotate(-Math.PI / 4);
  const stepY = 54;
  const stepX = 64;

  for (let y = -size; y < size; y += stepY) {
    ctx.strokeStyle = creamHex;
    ctx.lineWidth = 10;
    ctx.beginPath();
    for (let x = -size; x <= size; x += 16) {
      const wave = Math.sin((x / stepX) * Math.PI) * 11;
      if (x === -size) ctx.moveTo(x, y + wave);
      else ctx.lineTo(x, y + wave);
    }
    ctx.stroke();

    ctx.strokeStyle = goldHex;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    for (let x = -size; x <= size; x += 16) {
      const wave = Math.sin((x / stepX) * Math.PI) * 11;
      if (x === -size) ctx.moveTo(x, y + wave + 16);
      else ctx.lineTo(x, y + wave + 16);
    }
    ctx.stroke();

    // Small golden mlinjon diamond dots between waves
    ctx.fillStyle = goldHex;
    for (let x = -size; x <= size; x += stepX) {
      ctx.beginPath();
      ctx.arc(x + stepX * 0.5, y + 27, 4.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createKebayaBrocadeTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  const grad = ctx.createLinearGradient(0, 0, 0, size);
  grad.addColorStop(0, "#fbf6ec");
  grad.addColorStop(1, "#efe3cf");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // Delicate floral lace filigree
  const step = 48;
  for (let y = 0; y < size; y += step) {
    for (let x = 0; x < size; x += step) {
      const cx = x + (y % (step * 2) === 0 ? step * 0.5 : 0);
      const cy = y + step * 0.5;
      ctx.strokeStyle = "rgba(196, 155, 86, 0.34)";
      ctx.lineWidth = 1.6;
      for (let p = 0; p < 6; p++) {
        const ang = (p / 6) * Math.PI * 2;
        ctx.beginPath();
        ctx.ellipse(
          cx + Math.cos(ang) * 9,
          cy + Math.sin(ang) * 9,
          6,
          3.2,
          ang,
          0,
          Math.PI * 2,
        );
        ctx.stroke();
      }
      ctx.fillStyle = "rgba(218, 174, 92, 0.55)";
      ctx.beginPath();
      ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createBeskapTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#194836";
  ctx.fillRect(0, 0, size, size);

  // Subtle velvet-silk brocade motif
  ctx.strokeStyle = "rgba(216, 173, 94, 0.14)";
  ctx.lineWidth = 1.2;
  const step = 32;
  for (let y = 0; y < size; y += step) {
    for (let x = 0; x < size; x += step) {
      ctx.beginPath();
      ctx.arc(x + step * 0.5, y + step * 0.5, 7, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createGebyokTexture(): THREE.CanvasTexture {
  const w = 512;
  const h = 384;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  // Rich carved Javanese teak base
  ctx.fillStyle = "#4d2815";
  ctx.fillRect(0, 0, w, h);

  // Outer gilded carved border
  ctx.strokeStyle = "#c99a4b";
  ctx.lineWidth = 8;
  ctx.strokeRect(12, 12, w - 24, h - 24);
  ctx.strokeStyle = "#7a4424";
  ctx.lineWidth = 3;
  ctx.strokeRect(24, 24, w - 48, h - 48);

  // Three carved arched niches (Gunungan / Gebyok motif)
  const panelW = (w - 80) / 3;
  for (let i = 0; i < 3; i++) {
    const px = 40 + i * panelW + 6;
    const pw = panelW - 12;
    ctx.fillStyle = "#3a1d0e";
    ctx.beginPath();
    ctx.moveTo(px, h - 42);
    ctx.lineTo(px, 110);
    ctx.quadraticCurveTo(px + pw * 0.5, 42, px + pw, 110);
    ctx.lineTo(px + pw, h - 42);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "#d4a455";
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // Floral lattice relief inside panel
    ctx.strokeStyle = "rgba(212, 164, 85, 0.42)";
    ctx.lineWidth = 2;
    const cx = px + pw * 0.5;
    for (let r = 140; r < h - 70; r += 38) {
      ctx.beginPath();
      ctx.arc(cx, r, 12, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx - 22, r + 16, 7, 0, Math.PI * 2);
      ctx.arc(cx + 22, r + 16, 7, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // Top center gold medallion
  ctx.fillStyle = "#d9a955";
  ctx.beginPath();
  ctx.arc(w / 2, 46, 16, 0, Math.PI * 2);
  ctx.fill();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createWeddingFaceTexture(
  role: "bride" | "groom",
  skinHex = "#f5cfb2",
): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = skinHex;
  ctx.fillRect(0, 0, size, size);

  // Warm soft forehead and jawline contour shading
  const shadeGrad = ctx.createRadialGradient(
    size * 0.5,
    size * 0.52,
    30,
    size * 0.5,
    size * 0.52,
    180,
  );
  shadeGrad.addColorStop(0, "rgba(255, 240, 228, 0.25)");
  shadeGrad.addColorStop(1, "rgba(190, 125, 92, 0.14)");
  ctx.fillStyle = shadeGrad;
  ctx.fillRect(0, 0, size, size);

  const cx = size * 0.5;
  const eyeY = size * 0.5;
  const eyeDx = 30;

  // Authentic Javanese Paes hairline curves for Bride
  if (role === "bride") {
    ctx.fillStyle = "#1f1512";
    // Center Gajahan peak
    ctx.beginPath();
    ctx.moveTo(cx - 18, eyeY - 76);
    ctx.quadraticCurveTo(cx, eyeY - 34, cx + 18, eyeY - 76);
    ctx.closePath();
    ctx.fill();

    // Side Pengapit & Penitis curves
    [-1, 1].forEach((dir) => {
      ctx.beginPath();
      ctx.moveTo(cx + dir * 24, eyeY - 72);
      ctx.quadraticCurveTo(cx + dir * 32, eyeY - 46, cx + dir * 40, eyeY - 68);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(cx + dir * 48, eyeY - 62);
      ctx.quadraticCurveTo(cx + dir * 60, eyeY - 36, cx + dir * 68, eyeY - 48);
      ctx.closePath();
      ctx.fill();
    });

    // Delicate gold Prada outline along Paes
    ctx.strokeStyle = "#e0b35a";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(cx - 18, eyeY - 76);
    ctx.quadraticCurveTo(cx, eyeY - 34, cx + 18, eyeY - 76);
    ctx.stroke();
  }

  const drawEye = (ex: number, isLeft: boolean) => {
    // Soft warm eyeshadow for bride
    if (role === "bride") {
      const lidGrad = ctx.createRadialGradient(ex, eyeY - 2, 2, ex, eyeY - 2, 18);
      lidGrad.addColorStop(0, "rgba(176, 118, 92, 0.36)");
      lidGrad.addColorStop(1, "rgba(176, 118, 92, 0)");
      ctx.fillStyle = lidGrad;
      ctx.beginPath();
      ctx.ellipse(ex, eyeY - 2, 18, 13, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Crisp sclera almond shape
    ctx.fillStyle = "#fffdf9";
    ctx.beginPath();
    ctx.ellipse(ex, eyeY, 13, 9.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Warm dark brown iris
    ctx.fillStyle = "#2b1a13";
    ctx.beginPath();
    ctx.arc(ex, eyeY, 7.6, 0, Math.PI * 2);
    ctx.fill();

    // Rich amber lower iris reflection
    ctx.fillStyle = "#5c3928";
    ctx.beginPath();
    ctx.arc(ex, eyeY + 2.2, 4.2, 0, Math.PI * 2);
    ctx.fill();

    // Specular catchlight
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(ex - 2.4, eyeY - 2.6, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Eyeliner & lashes
    ctx.strokeStyle = "#1d120e";
    ctx.lineWidth = role === "bride" ? 3.0 : 2.2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(ex, eyeY + 2, 13, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();

    if (role === "bride") {
      const dir = isLeft ? -1 : 1;
      ctx.beginPath();
      ctx.moveTo(ex + dir * 11, eyeY - 3);
      ctx.lineTo(ex + dir * 17, eyeY - 7);
      ctx.stroke();
    }

    // Refined arched eyebrows
    ctx.strokeStyle = "#261712";
    ctx.lineWidth = role === "bride" ? 2.6 : 3.4;
    ctx.beginPath();
    ctx.moveTo(ex - 13, eyeY - 14);
    ctx.quadraticCurveTo(ex, eyeY - 19, ex + 13, eyeY - 14);
    ctx.stroke();
  };

  drawEye(cx - eyeDx, true);
  drawEye(cx + eyeDx, false);

  // Subtle warm blush
  [-42, 42].forEach((dx) => {
    const blush = ctx.createRadialGradient(cx + dx, eyeY + 18, 2, cx + dx, eyeY + 18, 18);
    blush.addColorStop(0, role === "bride" ? "rgba(228, 118, 118, 0.44)" : "rgba(216, 128, 108, 0.25)");
    blush.addColorStop(1, "rgba(228, 118, 118, 0)");
    ctx.fillStyle = blush;
    ctx.beginPath();
    ctx.ellipse(cx + dx, eyeY + 18, 18, 10, 0, 0, Math.PI * 2);
    ctx.fill();
  });

  // Delicate nose shadow + serene smile
  ctx.strokeStyle = "rgba(165, 96, 68, 0.5)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, eyeY + 14, 4, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();

  if (role === "bride") {
    ctx.fillStyle = "#bf5458";
    ctx.beginPath();
    ctx.ellipse(cx, eyeY + 29, 9.5, 4.2, 0, 0, Math.PI);
    ctx.fill();
    ctx.strokeStyle = "#94353a";
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(cx, eyeY + 27, 9.5, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
  } else {
    ctx.strokeStyle = "#8d493a";
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.arc(cx, eyeY + 25, 10, 0.18 * Math.PI, 0.82 * Math.PI);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createSkyDomeTexture(time: DesaTimeOfDay): THREE.CanvasTexture {
  const w = 64;
  const h = 512;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  const grad = ctx.createLinearGradient(0, 0, 0, h);
  if (time === "pagi") {
    grad.addColorStop(0, "#7ab4cf");
    grad.addColorStop(0.38, "#aed7d9");
    grad.addColorStop(0.54, "#e6f2e4");
    grad.addColorStop(1, "#cfe5da");
  } else if (time === "sore") {
    grad.addColorStop(0, "#5e7588");
    grad.addColorStop(0.28, "#9d9e9b");
    grad.addColorStop(0.47, "#e5b884");
    grad.addColorStop(0.56, "#f4cfa0");
    grad.addColorStop(1, "#dec19c");
  } else {
    grad.addColorStop(0, "#0a1420");
    grad.addColorStop(0.38, "#132638");
    grad.addColorStop(0.55, "#1b3342");
    grad.addColorStop(1, "#162836");
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  if (time === "malam") {
    for (let i = 0; i < 42; i++) {
      const sx = (i * 19 + 7) % w;
      const sy = (i * 41 + 11) % Math.floor(h * 0.45);
      ctx.fillStyle = `rgba(255, 250, 230, ${0.45 + (i % 4) * 0.14})`;
      ctx.fillRect(sx, sy, i % 3 === 0 ? 2 : 1, i % 3 === 0 ? 2 : 1);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
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

  ctx.fillStyle = skinHex;
  ctx.fillRect(0, 0, size, size);

  const topGrad = ctx.createLinearGradient(0, 0, 0, size * 0.45);
  topGrad.addColorStop(0, "rgba(180, 110, 75, 0.12)");
  topGrad.addColorStop(1, "rgba(180, 110, 75, 0)");
  ctx.fillStyle = topGrad;
  ctx.fillRect(0, 0, size, size * 0.45);

  const cx = size * 0.5;
  const eyeY = size * 0.49;
  const eyeDx = 34;

  const drawEye = (ex: number, isLeft: boolean) => {
    ctx.fillStyle = "#1c120e";
    ctx.beginPath();
    ctx.ellipse(ex, eyeY, 15, 19, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#4d2f22";
    ctx.beginPath();
    ctx.ellipse(ex, eyeY + 6, 10, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(ex - 4.5, eyeY - 6, 5.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(ex + 4.5, eyeY + 5, 2.4, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#3a241b";
    ctx.lineWidth = 3.2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(ex, eyeY - 22, 11, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();

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

  // Rich carved teak plaque
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, "#4d2714");
  grad.addColorStop(1, "#371b0d");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Double antique gold border
  ctx.strokeStyle = "#d9ad68";
  ctx.lineWidth = 6;
  ctx.strokeRect(10, 10, w - 20, h - 20);
  ctx.strokeStyle = "rgba(217, 173, 104, 0.45)";
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 20, w - 40, h - 40);

  // Corner diamonds
  const corners = [
    [22, 22],
    [w - 22, 22],
    [22, h - 22],
    [w - 22, h - 22],
  ];
  ctx.fillStyle = "#e6be79";
  corners.forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = "#faf1de";
  ctx.textAlign = "center";
  ctx.font = "600 44px 'Playfair Display', Georgia, serif";
  ctx.fillText(title, w / 2, 92);

  ctx.fillStyle = "#e5be79";
  ctx.font = "600 20px 'Plus Jakarta Sans', system-ui, sans-serif";
  ctx.fillText(subtitle.toUpperCase(), w / 2, 138);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createGalleryBoardTexture(mode: DesaMode): THREE.CanvasTexture {
  const w = 512;
  const h = 384;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  // Warm cream linen background
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, "#fbf6ea");
  bg.addColorStop(1, "#f2e7d2");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Fine antique gold inner border
  ctx.strokeStyle = "#c99a4b";
  ctx.lineWidth = 4;
  ctx.strokeRect(14, 14, w - 28, h - 28);
  ctx.strokeStyle = "rgba(42, 92, 69, 0.28)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(22, 22, w - 44, h - 44);

  // Botanical corner flourishes
  [
    [34, 34],
    [w - 34, 34],
    [34, h - 34],
    [w - 34, h - 34],
  ].forEach(([fx, fy]) => {
    ctx.fillStyle = "#c99a4b";
    ctx.beginPath();
    ctx.arc(fx, fy, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  // Header
  ctx.fillStyle = "#2A5C45";
  ctx.textAlign = "center";
  ctx.font = "600 13px 'Plus Jakarta Sans', system-ui, sans-serif";
  ctx.fillText(mode === "wedding" ? "ALBUM PERNIKAHAN" : "ALBUM KENANGAN", w / 2, 52);

  ctx.fillStyle = "#3E2B1E";
  ctx.font = "600 28px 'Playfair Display', Georgia, serif";
  ctx.fillText(mode === "wedding" ? "Galeri Momen" : "Galeri Foto", w / 2, 84);

  // Three framed Polaroid-style landscape vignettes
  const cards = [
    { x: 40, y: 110, rot: -0.04, sky: "#f3c58b", hill: "#588b5a", accent: "#e894a6" },
    { x: 186, y: 102, rot: 0.02, sky: "#cfe4dc", hill: "#3a7a6c", accent: "#d4a359" },
    { x: 332, y: 112, rot: 0.04, sky: "#d9b58e", hill: "#4c7c48", accent: "#b85d3b" },
  ];
  cards.forEach((c, idx) => {
    ctx.save();
    ctx.translate(c.x + 70, c.y + 92);
    ctx.rotate(c.rot);

    // Polaroid mat
    ctx.fillStyle = "rgba(38, 28, 18, 0.14)";
    ctx.fillRect(-66, -86, 136, 178);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(-68, -88, 136, 178);
    ctx.strokeStyle = "#d9c8ac";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-68, -88, 136, 178);

    // Landscape scene art
    ctx.fillStyle = c.sky;
    ctx.fillRect(-58, -78, 116, 114);
    ctx.fillStyle = "#fff5d8";
    ctx.beginPath();
    ctx.arc(24 - idx * 14, -46, 14, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = c.hill;
    ctx.beginPath();
    ctx.moveTo(-58, 36);
    ctx.quadraticCurveTo(-18, -14, 58, 16);
    ctx.lineTo(58, 36);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = c.accent;
    ctx.beginPath();
    ctx.arc(-16 + idx * 16, 12, 7, 0, Math.PI * 2);
    ctx.fill();

    // Caption bars
    ctx.fillStyle = "#7b634d";
    ctx.fillRect(-44, 52, 88, 5);
    ctx.fillStyle = "#b8a38b";
    ctx.fillRect(-30, 64, 60, 4);

    ctx.restore();
  });

  // Footer rule
  ctx.fillStyle = "#6E5541";
  ctx.font = "500 13px 'Plus Jakarta Sans', system-ui, sans-serif";
  ctx.fillText("Ketuk untuk melihat foto & catatan rahasia", w / 2, 344);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createStoryBoardTexture(mode: DesaMode): THREE.CanvasTexture {
  const w = 512;
  const h = 384;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, "#faf4e6");
  bg.addColorStop(1, "#efe2ca");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = "#b88940";
  ctx.lineWidth = 4;
  ctx.strokeRect(14, 14, w - 28, h - 28);

  ctx.fillStyle = "#AD4B2C";
  ctx.textAlign = "center";
  ctx.font = "600 13px 'Plus Jakarta Sans', system-ui, sans-serif";
  ctx.fillText(mode === "wedding" ? "PERJALANAN CINTA" : "ALBUM WAKTU", w / 2, 52);

  ctx.fillStyle = "#3E2B1E";
  ctx.font = "600 30px 'Playfair Display', Georgia, serif";
  ctx.fillText(mode === "wedding" ? "Kisah Kami" : "Cerita Kita", w / 2, 86);

  // Golden connecting timeline ribbon
  ctx.strokeStyle = "#d4a359";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(85, 200);
  ctx.quadraticCurveTo(w / 2, 168, w - 85, 200);
  ctx.stroke();

  const milestones =
    mode === "wedding"
      ? [
          { year: "2022", title: "Bertemu", color: "#4d8559" },
          { year: "2025", title: "Lamaran", color: "#b85d3b" },
          { year: "2027", title: "Menikah", color: "#2A5C45" },
        ]
      : [
          { year: "2022", title: "Mulai", color: "#4d8559" },
          { year: "2024", title: "Tumbuh", color: "#b85d3b" },
          { year: "Kini", title: "Bersama", color: "#2A5C45" },
        ];

  milestones.forEach((m, idx) => {
    const cx = 96 + idx * 160;
    const cy = 205;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(cx - 56, cy - 64, 112, 134);
    ctx.strokeStyle = "#d4c2a3";
    ctx.lineWidth = 2;
    ctx.strokeRect(cx - 56, cy - 64, 112, 134);

    ctx.fillStyle = m.color;
    ctx.fillRect(cx - 46, cy - 54, 92, 68);

    ctx.fillStyle = "#fdf4e4";
    ctx.beginPath();
    ctx.arc(cx, cy - 20, 14, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#2A5C45";
    ctx.font = "700 13px 'Plus Jakarta Sans', system-ui, sans-serif";
    ctx.fillText(m.year, cx, cy + 34);

    ctx.fillStyle = "#3E2B1E";
    ctx.font = "600 15px 'Playfair Display', Georgia, serif";
    ctx.fillText(m.title, cx, cy + 54);
  });

  ctx.fillStyle = "#6E5541";
  ctx.font = "500 13px 'Plus Jakarta Sans', system-ui, sans-serif";
  ctx.fillText("Ketuk untuk membaca bab perjalanan kami", w / 2, 344);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
