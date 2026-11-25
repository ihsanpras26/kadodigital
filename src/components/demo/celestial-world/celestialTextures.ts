import * as THREE from "three";

export function createMarbleCompassTexture(): THREE.CanvasTexture {
  const size = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const cx = size / 2;
  const cy = size / 2;

  // Warm ivory marble gradient base
  const rad = ctx.createRadialGradient(cx, cy, 20, cx, cy, size * 0.52);
  rad.addColorStop(0, "#FCF8EE");
  rad.addColorStop(0.55, "#F2E9D8");
  rad.addColorStop(1, "#DED2BC");
  ctx.fillStyle = rad;
  ctx.fillRect(0, 0, size, size);

  // Subtle marble veins
  ctx.strokeStyle = "rgba(176, 158, 128, 0.22)";
  for (let i = 0; i < 22; i++) {
    ctx.beginPath();
    ctx.lineWidth = 1 + (i % 3);
    let x = ((i * 97) % size) * 0.9;
    let y = 0;
    ctx.moveTo(x, y);
    for (let s = 1; s <= 10; s++) {
      y = (s / 10) * size;
      x += Math.sin(s * 0.9 + i * 1.4) * 38;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Champagne-gold compass rings
  ctx.strokeStyle = "#D4AF5A";
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(cx, cy, 445, 0, Math.PI * 2);
  ctx.stroke();

  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx, cy, 415, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = "rgba(212, 175, 90, 0.72)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, 250, 0, Math.PI * 2);
  ctx.stroke();

  // 8-point celestial star rose inlay
  ctx.save();
  ctx.translate(cx, cy);
  for (let i = 0; i < 8; i++) {
    ctx.rotate(Math.PI / 4);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-24, -145);
    ctx.lineTo(0, -395);
    ctx.lineTo(24, -145);
    ctx.closePath();
    ctx.fillStyle = i % 2 === 0 ? "rgba(222, 184, 92, 0.85)" : "rgba(136, 166, 245, 0.42)";
    ctx.fill();
    ctx.strokeStyle = "#B98D32";
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  ctx.restore();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

export function createGlowSpriteTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const grad = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  );
  grad.addColorStop(0, "rgba(255, 252, 240, 1)");
  grad.addColorStop(0.24, "rgba(255, 232, 168, 0.78)");
  grad.addColorStop(0.55, "rgba(182, 208, 255, 0.28)");
  grad.addColorStop(1, "rgba(182, 208, 255, 0)");

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

export function paintMonogramCanvas(
  canvas: HTMLCanvasElement,
  initials: string,
): void {
  const size = canvas.width;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const cx = size / 2;
  const cy = size / 2;
  ctx.clearRect(0, 0, size, size);

  const bg = ctx.createRadialGradient(cx, cy, 12, cx, cy, size * 0.48);
  bg.addColorStop(0, "#1D2856");
  bg.addColorStop(1, "#0B1026");
  ctx.fillStyle = bg;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.48, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#EFC86E";
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.45, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = "rgba(239, 200, 110, 0.45)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.39, 0, Math.PI * 2);
  ctx.stroke();

  // Four cardinal 4-point sparkles
  ctx.fillStyle = "#FFE5A3";
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2;
    const sx = cx + Math.cos(a) * (size * 0.39);
    const sy = cy + Math.sin(a) * (size * 0.39);
    ctx.beginPath();
    ctx.arc(sx, sy, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "#FAF5E8";
  ctx.font = "italic 600 84px Georgia, 'Times New Roman', serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(initials, cx, cy + 4);
}

export function createMonogramTexture(initials: string): {
  texture: THREE.CanvasTexture;
  canvas: HTMLCanvasElement;
} {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  paintMonogramCanvas(canvas, initials);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return { texture, canvas };
}

export function createCloudMistTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.clearRect(0, 0, size, size);
  const puffs: [number, number, number, number][] = [
    [128, 134, 78, 0.5],
    [82, 146, 56, 0.42],
    [174, 144, 58, 0.42],
    [126, 98, 60, 0.36],
  ];
  for (const [px, py, pr, alpha] of puffs) {
    const g = ctx.createRadialGradient(px, py, 4, px, py, pr);
    g.addColorStop(0, `rgba(244, 248, 255, ${alpha})`);
    g.addColorStop(0.55, `rgba(206, 218, 250, ${alpha * 0.45})`);
    g.addColorStop(1, "rgba(206, 218, 250, 0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(px, py, pr, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

export function paintGatePlaqueCanvas(
  canvas: HTMLCanvasElement,
  coupleDisplay: string,
  dateDisplay: string,
): void {
  const w = canvas.width;
  const h = canvas.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, w, h);
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, "#1A2554");
  bg.addColorStop(1, "#0B112B");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = "#EFC86E";
  ctx.lineWidth = 8;
  ctx.strokeRect(10, 10, w - 20, h - 20);
  ctx.strokeStyle = "rgba(239, 200, 110, 0.42)";
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 20, w - 40, h - 40);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#EFC86E";
  ctx.font = "600 18px monospace";
  ctx.fillText("ISTANA AWAN WEDDING", w / 2, 46);

  ctx.fillStyle = "#FAF6EE";
  ctx.font = "italic 600 50px Georgia, serif";
  ctx.fillText(coupleDisplay, w / 2, 104);

  ctx.fillStyle = "#BFD1FF";
  ctx.font = "500 20px sans-serif";
  ctx.fillText(dateDisplay, w / 2, 152);
}

export function createGatePlaqueTexture(
  coupleDisplay: string,
  dateDisplay: string,
): {
  texture: THREE.CanvasTexture;
  canvas: HTMLCanvasElement;
} {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 192;
  paintGatePlaqueCanvas(canvas, coupleDisplay, dateDisplay);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return { texture, canvas };
}

export function createCelestialGownTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const grad = ctx.createLinearGradient(0, 0, 0, size);
  grad.addColorStop(0, "#FFFDF7");
  grad.addColorStop(0.55, "#F9F3E6");
  grad.addColorStop(1, "#F3EAD8");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // Delicate champagne-gold diamond filigree lace mesh
  ctx.strokeStyle = "rgba(220, 178, 92, 0.24)";
  ctx.lineWidth = 1.5;
  const step = 32;
  for (let y = 0; y < size; y += step) {
    for (let x = 0; x < size; x += step) {
      ctx.beginPath();
      ctx.moveTo(x + step / 2, y);
      ctx.lineTo(x + step, y + step / 2);
      ctx.lineTo(x + step / 2, y + step);
      ctx.lineTo(x, y + step / 2);
      ctx.closePath();
      ctx.stroke();
    }
  }

  // Twinkling champagne stardust dots
  ctx.fillStyle = "rgba(245, 206, 118, 0.52)";
  for (let i = 0; i < 64; i++) {
    const sx = (i * 83) % size;
    const sy = (i * 137) % (size - 48);
    ctx.beginPath();
    ctx.arc(sx, sy, (i % 2) + 1.4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Ornate scalloped golden-lace hem border at bottom edge
  ctx.strokeStyle = "#DFB354";
  ctx.lineWidth = 4;
  for (let x = 16; x < size; x += 32) {
    ctx.beginPath();
    ctx.arc(x, size - 18, 16, Math.PI, Math.PI * 2);
    ctx.stroke();
  }
  ctx.fillStyle = "#EFC86E";
  ctx.fillRect(0, size - 8, size, 8);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

export function createRoyalTailcoatTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const grad = ctx.createLinearGradient(0, 0, 0, size);
  grad.addColorStop(0, "#FAF4E8");
  grad.addColorStop(0.55, "#F2E7D3");
  grad.addColorStop(1, "#E6D9C2");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // Subtle woven golden star-damask trellis
  ctx.strokeStyle = "rgba(212, 170, 82, 0.18)";
  ctx.lineWidth = 1.6;
  for (let y = 16; y < size; y += 36) {
    for (let x = 16; x < size; x += 36) {
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // Vertical front gold trim piping around center
  ctx.fillStyle = "rgba(232, 189, 98, 0.58)";
  ctx.fillRect(size * 0.495 - 12, 0, 4, size);
  ctx.fillRect(size * 0.495 + 8, 0, 4, size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}
