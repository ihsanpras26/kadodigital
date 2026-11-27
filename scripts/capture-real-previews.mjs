import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const ROOT = process.cwd();
const CATALOG_PATH = path.join(ROOT, "src", "data", "catalog.ts");
const OUT_DIR = path.join(ROOT, "public", "themes", "real-previews");
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE_URL = process.env.PREVIEW_BASE_URL || "http://localhost:3000";
const CDP_PORT = Number(process.env.CDP_PORT || 9229);

function getAllCatalogSlugs() {
  const src = fs.readFileSync(CATALOG_PATH, "utf8");
  const matches = [...src.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
  return [...new Set(matches)];
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class CdpClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.nextId = 1;
    this.pending = new Map();
    this.events = new Map();
  }

  async connect() {
    this.ws = new WebSocket(this.wsUrl);
    await new Promise((resolve, reject) => {
      this.ws.addEventListener("open", resolve, { once: true });
      this.ws.addEventListener("error", reject, { once: true });
    });
    this.ws.addEventListener("message", (ev) => {
      const msg = JSON.parse(String(ev.data));
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) {
          reject(new Error(`${msg.error.code}: ${msg.error.message}`));
        } else {
          resolve(msg.result);
        }
      } else if (msg.method) {
        const list = this.events.get(msg.method) || [];
        list.forEach((fn) => fn(msg.params));
      }
    });
  }

  send(method, params = {}) {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        if (this.pending.has(id)) {
          this.pending.delete(id);
          reject(new Error(`CDP timeout calling ${method}`));
        }
      }, 25000);
      this.pending.set(id, {
        resolve: (res) => {
          clearTimeout(timer);
          resolve(res);
        },
        reject: (err) => {
          clearTimeout(timer);
          reject(err);
        },
      });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  once(method, timeoutMs = 20000) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        remove();
        reject(new Error(`Timed out waiting for event ${method}`));
      }, timeoutMs);
      const handler = (params) => {
        clearTimeout(timer);
        remove();
        resolve(params);
      };
      const remove = () => {
        const arr = (this.events.get(method) || []).filter((f) => f !== handler);
        this.events.set(method, arr);
      };
      const existing = this.events.get(method) || [];
      existing.push(handler);
      this.events.set(method, existing);
    });
  }

  close() {
    try {
      this.ws?.close();
    } catch {
      // ignore
    }
  }
}

async function waitForCondition(cdp, expression, timeoutMs, intervalMs = 250) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const res = await cdp.send("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    if (res?.result?.value === true) {
      return true;
    }
    await sleep(intervalMs);
  }
  return false;
}

async function launchChrome(userDataDir) {
  const args = [
    "--headless=new",
    `--remote-debugging-port=${CDP_PORT}`,
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-background-timer-throttling",
    "--disable-renderer-backgrounding",
    "--enable-webgl",
    "--ignore-gpu-blocklist",
    "--enable-unsafe-swiftshader",
    "--window-size=390,700",
    `--user-data-dir=${userDataDir}`,
    "about:blank",
  ];

  const proc = spawn(CHROME_PATH, args, { stdio: "ignore" });
  const listUrl = `http://127.0.0.1:${CDP_PORT}/json/list`;

  for (let i = 0; i < 40; i++) {
    try {
      const resp = await fetch(listUrl);
      if (resp.ok) {
        const targets = await resp.json();
        const pageTarget = targets.find((t) => t.type === "page" && t.webSocketDebuggerUrl);
        if (pageTarget) {
          return { proc, wsUrl: pageTarget.webSocketDebuggerUrl };
        }
      }
    } catch {
      // retry
    }
    await sleep(250);
  }
  proc.kill();
  throw new Error("Chrome DevTools endpoint failed to start on port " + CDP_PORT);
}

async function captureVariant(cdp, slug, mode) {
  const isCover = mode === "cover";
  const targetUrl = isCover
    ? `${BASE_URL}/demo/${slug}?embed=1&to=Tamu+Spesial`
    : `${BASE_URL}/demo/${slug}?embed=1&to=Tamu+Spesial&open=1&shot=hero`;

  const loadPromise = cdp.once("Page.loadEventFired", 22000);
  await cdp.send("Page.navigate", { url: targetUrl });
  await loadPromise;

  if (slug === "istana-awan") {
    const ok = await waitForCondition(
      cdp,
      isCover
        ? `(() => {
            const c = document.querySelector('canvas');
            const t = document.body?.innerText || '';
            return Boolean(c && c.width > 0 && t.includes('Buka Undangan'));
          })()`
        : `(() => {
            const c = document.querySelector('canvas');
            const t = document.body?.innerText || '';
            return Boolean(c && c.width > 0 && t.includes('Gerbang'));
          })()`,
      22000,
    );
    if (!ok) throw new Error(`Timed out waiting for 3D scene (${mode}) on ${slug}`);
    await sleep(isCover ? 2600 : 3800);
  } else if (slug === "desa-asri" || slug === "saung-kenangan") {
    const ok = await waitForCondition(
      cdp,
      isCover
        ? `(() => {
            const c = document.querySelector('canvas');
            const t = document.body?.innerText || '';
            return Boolean(c && c.width > 0 && !t.includes('Menyiapkan'));
          })()`
        : `(() => {
            const c = document.querySelector('canvas');
            const t = document.body?.innerText || '';
            return Boolean(
              c &&
              c.width > 0 &&
              !t.includes('Menyiapkan') &&
              (t.includes('Buka ') || t.includes('Denah') || t.includes('Panduan') || t.includes('Jejak'))
            );
          })()`,
      24000,
    );
    if (!ok) throw new Error(`Timed out waiting for Desa 3D (${mode}) on ${slug}`);
    await sleep(isCover ? 2600 : 5400);
  } else if (slug === "kapsul-kenangan") {
    const ok = await waitForCondition(
      cdp,
      isCover
        ? `(() => {
            const t = document.body?.innerText || '';
            return Boolean(!t.includes('Menyiapkan') && (t.includes('Segel') || t.includes('Lilin') || t.includes('Tahan') || t.includes('Kapsul') || t.includes('Buka')));
          })()`
        : `(() => Boolean((document.body?.innerText || '').includes('MESIN NO.')))()`,
      15000,
    );
    if (!ok) throw new Error(`Timed out waiting for Gacha UI (${mode}) on ${slug}`);
    await sleep(isCover ? 900 : 1400);
  } else {
    const ok = await waitForCondition(
      cdp,
      `(async () => {
        if (document.readyState !== 'complete') return false;
        if (document.fonts && document.fonts.ready) await document.fonts.ready;
        const imgs = Array.from(document.images);
        if (imgs.length === 0) return true;
        return imgs.every((img) => img.complete && img.naturalWidth > 0);
      })()`,
      14000,
    );
    if (!ok) throw new Error(`Timed out waiting for fonts/images (${mode}) on ${slug}`);
    await sleep(450);
  }

  const shot = await cdp.send("Page.captureScreenshot", {
    format: "jpeg",
    quality: 88,
    fromSurface: true,
  });

  const buf = Buffer.from(shot.data, "base64");
  if (buf.length < 5000) {
    throw new Error(`Captured screenshot (${mode}) for ${slug} is too small (${buf.length} B)`);
  }

  const outFile = isCover ? `${slug}-cover.jpg` : `${slug}.jpg`;
  const outPath = path.join(OUT_DIR, outFile);
  fs.writeFileSync(outPath, buf);
  console.log(`[ok] ${outFile} (${buf.length} bytes)`);
}

async function main() {
  if (!fs.existsSync(CHROME_PATH)) {
    throw new Error(`Chrome not found at ${CHROME_PATH}`);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const cliSlugs = process.argv.slice(2).filter(Boolean);
  const slugs = cliSlugs.length > 0 ? cliSlugs : getAllCatalogSlugs();

  if (slugs.length === 0) {
    throw new Error("No slugs found to capture.");
  }

  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), "kado-cdp-"));
  let chromeProc = null;
  let cdp = null;

  try {
    const launched = await launchChrome(userDataDir);
    chromeProc = launched.proc;
    cdp = new CdpClient(launched.wsUrl);
    await cdp.connect();

    await cdp.send("Page.enable");
    await cdp.send("Runtime.enable");
    await cdp.send("Emulation.setDeviceMetricsOverride", {
      width: 390,
      height: 700,
      deviceScaleFactor: 2,
      mobile: true,
    });

    console.log(
      `Capturing ${slugs.length * 2} real mobile screenshots (cover + inside) from ${BASE_URL}...`,
    );
    for (const slug of slugs) {
      await captureVariant(cdp, slug, "cover");
      await captureVariant(cdp, slug, "inside");
    }
    console.log(
      `Done. Saved ${slugs.length * 2} screenshots in public/themes/real-previews/`,
    );
  } finally {
    cdp?.close();
    if (chromeProc) {
      try {
        chromeProc.kill();
      } catch {
        // ignore
      }
    }
    await sleep(400);
    try {
      fs.rmSync(userDataDir, { recursive: true, force: true });
    } catch {
      // ignore locked temp cleanup on Windows
    }
  }
  process.exit(0);
}

main().catch((err) => {
  console.error("CAPTURE FAILED:", err);
  process.exit(1);
});
