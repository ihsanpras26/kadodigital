"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import * as THREE from "three";
import type {
  DesaStationId,
  DesaTimeOfDay,
  DesaWorldPayload,
} from "@/data/desaWorldData";
import {
  animateChibi,
  buildChibiCharacter,
  renderChibiPortraits,
  type ChibiRig,
} from "./chibiBuilder";
import { animateWeddingCouple } from "./brideGroomBuilder";
import {
  animateButterflies,
  animateDetailedAnimals,
  animateDetailedKoi,
} from "./faunaBuilder";
import type { FootstepSurface } from "./audioEngine";
import { buildVillageEnvironment } from "./villageProps";

export type DesaCanvasPhase = "loading" | "cover" | "picking" | "intro" | "world";

export interface ProximityTarget {
  kind: "station" | "npc";
  id: string;
  label: string;
}

export interface DesaCanvasHandle {
  startDroneIntro: () => void;
  skipDroneIntro: () => void;
  enterWorld: () => void;
  setPlayerGender: (gender: "cewek" | "cowok") => void;
  focusStation: (stationId: DesaStationId) => void;
  setTimeOfDay: (time: DesaTimeOfDay) => void;
  setJoystickVector: (vec: { x: number; y: number }) => void;
  triggerNearestInteraction: () => void;
}

interface CozyDesaCanvasProps {
  payload: DesaWorldPayload;
  phase: DesaCanvasPhase;
  overlayOpen?: boolean;
  visitedStations?: DesaStationId[];
  onLoadProgress: (pct: number) => void;
  onReadyPortraits: (portraits: { cewek: string; cowok: string }) => void;
  onIntroComplete: () => void;
  onSelectStation: (stationId: DesaStationId) => void;
  onSelectNpc: (npcId: string) => void;
  onProximityChange: (target: ProximityTarget | null) => void;
  onFootstep?: (surface: FootstepSurface) => void;
  onRiverProximity?: (closeness01: number) => void;
}

interface LightingPreset {
  skyHex: string;
  fogHex: string;
  fogDensity: number;
  hemiSky: string;
  hemiGround: string;
  hemiIntensity: number;
  sunColor: string;
  sunIntensity: number;
  ambientIntensity: number;
  lanternEmissive: number;
  lanternGlowOpacity: number;
  stringEmissive: number;
  fireflyOpacity: number;
  petalOpacity: number;
  discColor: string;
  discPos: [number, number, number];
}

const LIGHTING_PRESETS: Record<DesaTimeOfDay, LightingPreset> = {
  pagi: {
    skyHex: "#cfe5da",
    fogHex: "#cfe5da",
    fogDensity: 0.012,
    hemiSky: "#fff7e5",
    hemiGround: "#6b9365",
    hemiIntensity: 1.08,
    sunColor: "#fff1d0",
    sunIntensity: 1.55,
    ambientIntensity: 0.5,
    lanternEmissive: 0.25,
    lanternGlowOpacity: 0.14,
    stringEmissive: 0.28,
    fireflyOpacity: 0.12,
    petalOpacity: 0.85,
    discColor: "#fff4cf",
    discPos: [26, 26, -32],
  },
  sore: {
    skyHex: "#e3c59e",
    fogHex: "#dec19c",
    fogDensity: 0.012,
    hemiSky: "#ffe3ba",
    hemiGround: "#687a57",
    hemiIntensity: 0.95,
    sunColor: "#ffc478",
    sunIntensity: 1.65,
    ambientIntensity: 0.44,
    lanternEmissive: 0.92,
    lanternGlowOpacity: 0.58,
    stringEmissive: 1.05,
    fireflyOpacity: 0.65,
    petalOpacity: 0.72,
    discColor: "#ffd187",
    discPos: [24, 19, -34],
  },
  malam: {
    skyHex: "#152533",
    fogHex: "#162836",
    fogDensity: 0.016,
    hemiSky: "#5f84a8",
    hemiGround: "#21332c",
    hemiIntensity: 0.65,
    sunColor: "#9cc5ed",
    sunIntensity: 0.76,
    ambientIntensity: 0.36,
    lanternEmissive: 1.65,
    lanternGlowOpacity: 0.94,
    stringEmissive: 1.85,
    fireflyOpacity: 1.0,
    petalOpacity: 0.35,
    discColor: "#eaf3ff",
    discPos: [-22, 26, -32],
  },
};

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function computeBridgeElevation(x: number, z: number): number {
  if (x >= -6.9 && x <= -3.9 && z >= 1.2 && z <= 3.2) {
    const frac = (x + 6.9) / 3.0;
    return Math.sin(frac * Math.PI) * 0.28 + 0.08;
  }
  return 0;
}

function moveWithVillageCollisions(
  prevX: number,
  prevZ: number,
  nextX: number,
  nextZ: number,
): { x: number; z: number } {
  let x = nextX;
  let z = nextZ;

  const onBridgeZ = (valZ: number) => valZ >= 1.5 && valZ <= 2.9;

  if (prevX < -6.8 && x >= -6.8 && !onBridgeZ(z)) {
    x = -6.81;
  } else if (prevX > -4.0 && x <= -4.0 && !onBridgeZ(z)) {
    x = -3.99;
  }

  if (x > -6.8 && x < -4.0) {
    z = Math.min(Math.max(z, 1.52), 2.88);
  } else if (x <= -6.8) {
    x = Math.max(-10.2, x);
    z = Math.min(Math.max(z, -1.6), 5.6);
  } else {
    x = Math.min(8.4, x);
    z = Math.min(Math.max(z, -5.2), 7.8);
  }

  // Circular keep-out collider around Pendopo Pelaminan dais (6.0, -3.8)
  const pendopoCx = 6.0;
  const pendopoCz = -3.8;
  const minRadius = 2.15;
  const dx = x - pendopoCx;
  const dz = z - pendopoCz;
  const dist = Math.hypot(dx, dz);
  if (dist < minRadius && dist > 0.0001) {
    x = pendopoCx + (dx / dist) * minRadius;
    z = pendopoCz + (dz / dist) * minRadius;
  }

  return { x, z };
}

export const CozyDesaCanvas = forwardRef<DesaCanvasHandle, CozyDesaCanvasProps>(
  function CozyDesaCanvas(
    {
      payload,
      phase,
      overlayOpen = false,
      visitedStations = [],
      onLoadProgress,
      onReadyPortraits,
      onIntroComplete,
      onSelectStation,
      onSelectNpc,
      onProximityChange,
      onFootstep,
      onRiverProximity,
    },
    ref,
  ) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const labelRefs = useRef<Record<string, HTMLButtonElement | null>>({});

    const stateRef = useRef({
      phase: "loading" as DesaCanvasPhase,
      entering: false,
      gateProgress: 0,
      introProgress: 0,
      introActive: false,
      introFinishedSent: false,
      autoWalkTarget: null as { x: number; z: number } | null,
      playerGender: "cewek" as "cewek" | "cowok",
      timeOfDay: "sore" as DesaTimeOfDay,
      joystick: { x: 0, y: 0 },
      orbitYawOffset: 0,
      orbitZoomScale: 1,
      focusTarget: null as { x: number; z: number; until: number } | null,
      nearestKey: "",
      hoveredTarget: null as ProximityTarget | null,
    });

    stateRef.current.phase = phase;

    const callbacksRef = useRef({
      onLoadProgress,
      onReadyPortraits,
      onIntroComplete,
      onSelectStation,
      onSelectNpc,
      onProximityChange,
      onFootstep,
      onRiverProximity,
    });
    callbacksRef.current = {
      onLoadProgress,
      onReadyPortraits,
      onIntroComplete,
      onSelectStation,
      onSelectNpc,
      onProximityChange,
      onFootstep,
      onRiverProximity,
    };

    const actionsRef = useRef<{
      swapGender: (g: "cewek" | "cowok") => void;
      applyLighting: (t: DesaTimeOfDay) => void;
      triggerNearest: () => void;
      resetPlayerToGate: () => void;
    } | null>(null);

    const completeIntroNow = () => {
      if (stateRef.current.introFinishedSent) return;
      stateRef.current.introActive = false;
      stateRef.current.introProgress = 1;
      stateRef.current.introFinishedSent = true;
      stateRef.current.entering = true;
      stateRef.current.autoWalkTarget = { x: -2.7, z: 2.2 };
      callbacksRef.current.onIntroComplete();
    };

    useImperativeHandle(ref, () => ({
      startDroneIntro() {
        actionsRef.current?.resetPlayerToGate();
        stateRef.current.introProgress = 0;
        stateRef.current.introActive = true;
        stateRef.current.introFinishedSent = false;
        stateRef.current.entering = false;
        stateRef.current.gateProgress = 0;
        stateRef.current.autoWalkTarget = null;
      },
      skipDroneIntro() {
        completeIntroNow();
      },
      enterWorld() {
        completeIntroNow();
      },
      setPlayerGender(gender) {
        stateRef.current.playerGender = gender;
        actionsRef.current?.swapGender(gender);
      },
      focusStation(stationId) {
        const station = payload.stations.find((s) => s.id === stationId);
        if (!station) return;
        const fx = stationId === "acara" ? 5.4 : station.x;
        const fz = stationId === "acara" ? -3.05 : station.z;
        stateRef.current.focusTarget = {
          x: fx,
          z: fz,
          until: performance.now() + 2600,
        };
      },
      setTimeOfDay(time) {
        stateRef.current.timeOfDay = time;
        actionsRef.current?.applyLighting(time);
      },
      setJoystickVector(vec) {
        stateRef.current.joystick = vec;
        if (Math.hypot(vec.x, vec.y) > 0.05) {
          stateRef.current.autoWalkTarget = null;
        }
      },
      triggerNearestInteraction() {
        actionsRef.current?.triggerNearest();
      },
    }));

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      let disposed = false;
      callbacksRef.current.onLoadProgress(18);

      const getSize = () => ({
        w: Math.max(container.clientWidth || window.innerWidth || 390, 320),
        h: Math.max(container.clientHeight || window.innerHeight || 640, 320),
      });

      const initialSize = getSize();

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        42,
        initialSize.w / initialSize.h,
        0.1,
        180,
      );

      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({
          antialias: true,
          powerPreference: "high-performance",
        });
      } catch {
        callbacksRef.current.onLoadProgress(100);
        return;
      }

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setSize(initialSize.w, initialSize.h);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.06;

      renderer.domElement.style.display = "block";
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      renderer.domElement.setAttribute("data-engine", "three.js");
      container.innerHTML = "";
      container.appendChild(renderer.domElement);

      callbacksRef.current.onLoadProgress(42);

      // Base lights
      const hemiLight = new THREE.HemisphereLight(0xffe3ba, 0x687a57, 0.95);
      scene.add(hemiLight);

      const ambientLight = new THREE.AmbientLight(0xfff1dc, 0.44);
      scene.add(ambientLight);

      const sunLight = new THREE.DirectionalLight(0xffc478, 1.65);
      sunLight.position.set(13, 19, 11);
      sunLight.castShadow = true;
      sunLight.shadow.mapSize.set(1024, 1024);
      sunLight.shadow.camera.near = 1;
      sunLight.shadow.camera.far = 56;
      const d = 18;
      sunLight.shadow.camera.left = -d;
      sunLight.shadow.camera.right = d;
      sunLight.shadow.camera.top = d;
      sunLight.shadow.camera.bottom = -d;
      sunLight.shadow.bias = -0.0006;
      scene.add(sunLight);

      // 3 warm accent lights (Pendopo Pelaminan front, Plaza, Bridge Gapura)
      const pendopoLight = new THREE.PointLight(0xffba66, 2.5, 12, 1.5);
      pendopoLight.position.set(4.6, 2.6, -2.2);
      const plazaLight = new THREE.PointLight(0xffbc68, 1.8, 10, 1.6);
      plazaLight.position.set(1.5, 2.0, 2.1);
      const gateLight = new THREE.PointLight(0xffb662, 1.6, 9, 1.6);
      gateLight.position.set(-5.4, 2.0, 2.2);
      scene.add(pendopoLight, plazaLight, gateLight);

      const env = buildVillageEnvironment(scene, payload);
      callbacksRef.current.onLoadProgress(72);

      try {
        const portraits = renderChibiPortraits(renderer);
        callbacksRef.current.onReadyPortraits(portraits);
      } catch {
        // Gracefully skip portrait readback if GPU context forbids readRenderTargetPixels
      }

      let playerRig: ChibiRig = buildChibiCharacter({
        gender: stateRef.current.playerGender,
        hatType: stateRef.current.playerGender === "cewek" ? "floral" : "sunhat",
      });
      playerRig.group.position.set(-8.8, 0, 2.2);
      playerRig.group.rotation.y = Math.PI / 2;
      scene.add(playerRig.group);

      const npcInstances = payload.npcs.map((npc, idx) => {
        const rig = buildChibiCharacter({
          gender: npc.gender,
          outfitColor: npc.outfitColor,
          accentColor: npc.accentColor,
          hairColor: npc.hairColor,
          hatType: npc.hatType,
        });
        const start = npc.patrolPoints[0];
        rig.group.position.set(start.x, 0, start.z);
        rig.group.traverse((obj) => {
          obj.userData.npcId = npc.id;
        });
        scene.add(rig.group);
        return {
          data: npc,
          rig,
          waypointIdx: 1 % npc.patrolPoints.length,
          pauseUntil: idx * 1.2,
        };
      });

      // 3D Interactive Hover & Proximity Highlight Ring + Floating Diamond Marker
      const highlightGroup = new THREE.Group();
      highlightGroup.visible = false;
      const haloOuterMat = new THREE.MeshBasicMaterial({
        color: "#e6b85c",
        transparent: true,
        opacity: 0.78,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const haloOuter = new THREE.Mesh(new THREE.RingGeometry(0.9, 1.05, 36), haloOuterMat);
      haloOuter.rotation.x = -Math.PI / 2;
      haloOuter.position.y = 0.035;

      const haloFillMat = new THREE.MeshBasicMaterial({
        color: "#f7dca0",
        transparent: true,
        opacity: 0.16,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const haloFill = new THREE.Mesh(new THREE.CircleGeometry(0.9, 32), haloFillMat);
      haloFill.rotation.x = -Math.PI / 2;
      haloFill.position.y = 0.032;

      const markerMat = new THREE.MeshStandardMaterial({
        color: "#ffd97d",
        emissive: new THREE.Color("#f0a83a"),
        emissiveIntensity: 0.9,
        roughness: 0.25,
        metalness: 0.4,
      });
      const floatMarker = new THREE.Mesh(new THREE.OctahedronGeometry(0.14, 0), markerMat);
      floatMarker.position.y = 2.0;

      highlightGroup.add(haloOuter, haloFill, floatMarker);
      scene.add(highlightGroup);

      let basePendopoIntensity = 2.53;
      const applyLighting = (presetKey: DesaTimeOfDay) => {
        const preset = LIGHTING_PRESETS[presetKey];
        scene.background = new THREE.Color(preset.skyHex);
        scene.fog = new THREE.FogExp2(preset.fogHex, preset.fogDensity);
        hemiLight.color.set(preset.hemiSky);
        hemiLight.groundColor.set(preset.hemiGround);
        hemiLight.intensity = preset.hemiIntensity;
        sunLight.color.set(preset.sunColor);
        sunLight.intensity = preset.sunIntensity;
        ambientLight.intensity = preset.ambientIntensity;

        env.skyDomeMat.map = env.skyTextures[presetKey];
        env.skyDomeMat.needsUpdate = true;
        (env.sunDisc.material as THREE.MeshBasicMaterial).color.set(preset.discColor);
        env.sunDisc.position.set(...preset.discPos);

        env.lanternShadeMats.forEach((mat) => {
          mat.emissiveIntensity = preset.lanternEmissive;
        });
        env.lanternGlowMeshes.forEach((mesh) => {
          const mat = mesh.material as THREE.MeshBasicMaterial;
          mat.opacity = preset.lanternGlowOpacity;
        });
        env.stringLightMat.emissiveIntensity = preset.stringEmissive;
        env.fireflies.material.opacity = preset.fireflyOpacity;
        const pMat = env.petals.points.material as THREE.PointsMaterial;
        pMat.opacity = preset.petalOpacity;

        const ptIntensity = presetKey === "malam" ? 3.2 : presetKey === "sore" ? 2.2 : 0.8;
        basePendopoIntensity = ptIntensity * 1.15;
        pendopoLight.intensity = basePendopoIntensity;
        plazaLight.intensity = ptIntensity * 0.85;
        gateLight.intensity = ptIntensity * 0.8;
      };

      applyLighting(stateRef.current.timeOfDay);

      const swapGender = (gender: "cewek" | "cowok") => {
        const pos = playerRig.group.position.clone();
        const rot = playerRig.group.rotation.y;
        scene.remove(playerRig.group);
        playerRig = buildChibiCharacter({
          gender,
          hatType: gender === "cewek" ? "floral" : "sunhat",
        });
        playerRig.group.position.copy(pos);
        playerRig.group.rotation.y = rot;
        scene.add(playerRig.group);
      };

      const resetPlayerToGate = () => {
        playerRig.group.position.set(-8.8, 0, 2.2);
        playerRig.group.rotation.y = Math.PI / 2;
        playerRig.baseY = 0;
        env.gateDoors.left.rotation.y = 0;
        env.gateDoors.right.rotation.y = 0;
      };

      // Keyboard controls
      const keysDown = new Set<string>();
      const handleKeyDown = (e: KeyboardEvent) => {
        const tag = (e.target as HTMLElement | null)?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
        const k = e.key.toLowerCase();
        keysDown.add(k);
        if (["arrowup", "arrowdown", "arrowleft", "arrowright"].includes(k)) {
          stateRef.current.autoWalkTarget = null;
        }
        if ((k === "e" || k === "enter") && stateRef.current.phase === "world") {
          actionsRef.current?.triggerNearest();
        }
      };
      const handleKeyUp = (e: KeyboardEvent) => {
        keysDown.delete(e.key.toLowerCase());
      };
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);

      // Drag-to-orbit camera + hover raycast + click object/ground
      let dragging = false;
      let dragMoved = 0;
      let lastPtrX = 0;
      let ptrDownPos = { x: 0, y: 0 };
      const raycaster = new THREE.Raycaster();
      const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const hitPoint = new THREE.Vector3();

      const pickInteractiveAt = (clientX: number, clientY: number): ProximityTarget | null => {
        const rect = renderer.domElement.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return null;
        const ndc = new THREE.Vector2(
          ((clientX - rect.left) / rect.width) * 2 - 1,
          -((clientY - rect.top) / rect.height) * 2 + 1,
        );
        raycaster.setFromCamera(ndc, camera);
        const interactables = [
          ...Object.values(env.stationMeshes),
          ...npcInstances.map((n) => n.rig.group),
        ];
        const hits = raycaster.intersectObjects(interactables, true);
        for (const h of hits) {
          let cur: THREE.Object3D | null = h.object;
          while (cur) {
            if (typeof cur.userData?.stationId === "string") {
              const st = payload.stations.find((s) => s.id === cur!.userData.stationId);
              if (st) return { kind: "station", id: st.id, label: st.dockLabel };
            }
            if (typeof cur.userData?.npcId === "string") {
              const npc = payload.npcs.find((n) => n.id === cur!.userData.npcId);
              if (npc) return { kind: "npc", id: npc.id, label: `Sapa ${npc.name.split(" ")[0]}` };
            }
            cur = cur.parent;
          }
        }
        return null;
      };

      const onPointerDown = (e: PointerEvent) => {
        if (stateRef.current.phase !== "world") return;
        dragging = true;
        dragMoved = 0;
        lastPtrX = e.clientX;
        ptrDownPos = { x: e.clientX, y: e.clientY };
      };
      const onPointerMove = (e: PointerEvent) => {
        if (dragging) {
          const dx = e.clientX - lastPtrX;
          dragMoved += Math.abs(dx) + Math.abs(e.clientY - ptrDownPos.y) * 0.1;
          lastPtrX = e.clientX;
          stateRef.current.orbitYawOffset = THREE.MathUtils.clamp(
            stateRef.current.orbitYawOffset - dx * 0.0045,
            -0.65,
            0.65,
          );
          return;
        }
        if (stateRef.current.phase === "world") {
          const hovered = pickInteractiveAt(e.clientX, e.clientY);
          stateRef.current.hoveredTarget = hovered;
          renderer.domElement.style.cursor = hovered ? "pointer" : "grab";
        }
      };
      const onPointerUp = (e: PointerEvent) => {
        if (!dragging) return;
        dragging = false;
        const dist = Math.hypot(e.clientX - ptrDownPos.x, e.clientY - ptrDownPos.y);
        if (dist < 6 && dragMoved < 8 && stateRef.current.phase === "world") {
          const clickedObj = pickInteractiveAt(e.clientX, e.clientY);
          if (clickedObj) {
            if (clickedObj.kind === "station") {
              callbacksRef.current.onSelectStation(clickedObj.id as DesaStationId);
            } else {
              callbacksRef.current.onSelectNpc(clickedObj.id);
            }
            return;
          }
          const rect = renderer.domElement.getBoundingClientRect();
          const ndc = new THREE.Vector2(
            ((e.clientX - rect.left) / rect.width) * 2 - 1,
            -((e.clientY - rect.top) / rect.height) * 2 + 1,
          );
          raycaster.setFromCamera(ndc, camera);
          if (raycaster.ray.intersectPlane(groundPlane, hitPoint)) {
            stateRef.current.autoWalkTarget = {
              x: THREE.MathUtils.clamp(hitPoint.x, -9.8, 8.2),
              z: THREE.MathUtils.clamp(hitPoint.z, -5.0, 7.6),
            };
          }
        }
      };
      const onWheel = (e: WheelEvent) => {
        if (stateRef.current.phase !== "world") return;
        stateRef.current.orbitZoomScale = THREE.MathUtils.clamp(
          stateRef.current.orbitZoomScale + e.deltaY * 0.0005,
          0.78,
          1.35,
        );
      };

      const domEl = renderer.domElement;
      domEl.addEventListener("pointerdown", onPointerDown);
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
      domEl.addEventListener("wheel", onWheel, { passive: true });

      const handleResize = () => {
        const { w, h } = getSize();
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      const resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(container);
      window.addEventListener("resize", handleResize);

      let currentNearest: ProximityTarget | null = null;
      const computeNearest = (): ProximityTarget | null => {
        const px = playerRig.group.position.x;
        const pz = playerRig.group.position.z;
        let best: { target: ProximityTarget; d: number } | null = null;

        for (const st of payload.stations) {
          const d = Math.hypot(px - st.x, pz - st.z);
          if (d <= st.interactRadius && (!best || d < best.d)) {
            best = {
              target: { kind: "station", id: st.id, label: st.dockLabel },
              d,
            };
          }
        }
        for (const npc of npcInstances) {
          const nx = npc.rig.group.position.x;
          const nz = npc.rig.group.position.z;
          const d = Math.hypot(px - nx, pz - nz);
          if (d <= 2.15 && (!best || d < best.d)) {
            best = {
              target: { kind: "npc", id: npc.data.id, label: `Sapa ${npc.data.name.split(" ")[0]}` },
              d,
            };
          }
        }
        return best ? best.target : null;
      };

      actionsRef.current = {
        swapGender,
        applyLighting,
        resetPlayerToGate,
        triggerNearest() {
          const target = computeNearest();
          if (!target) return;
          if (target.kind === "station") {
            callbacksRef.current.onSelectStation(target.id as DesaStationId);
          } else {
            callbacksRef.current.onSelectNpc(target.id);
          }
        },
      };

      // Camera baselines
      const baseCamOffset = new THREE.Vector3(-9.2, 10.6, 11.4);
      const getPortraitFactor = () => {
        const asp = camera.aspect || 1;
        return asp < 0.85 ? 1.42 : asp < 1.1 ? 1.18 : 1.0;
      };

      // Drone Overview Center (Cover phase)
      const droneCenter = new THREE.Vector3(0.6, 1.0, -1.0);
      const initPF = getPortraitFactor();
      camera.fov = 42;
      camera.updateProjectionMatrix();
      camera.position.set(
        droneCenter.x - 16.5 * initPF,
        14.2 * initPF,
        droneCenter.z + 15.5 * initPF,
      );
      camera.lookAt(droneCenter);
      renderer.render(scene, camera);

      const camTarget = droneCenter.clone();
      const desiredCamPos = new THREE.Vector3();
      const projVec = new THREE.Vector3();

      // Cinematic Game-Style Drone Flyover Spline Curves (6.5s intro, cached per portraitFactor)
      const buildIntroCurves = (pf: number) => {
        const endPos = new THREE.Vector3(-8.8, 0.72, 2.2).addScaledVector(baseCamOffset, pf);
        const posCurve = new THREE.CatmullRomCurve3(
          [
            new THREE.Vector3(-14.0 * pf, 15.5 * pf, 16.5 * pf),
            new THREE.Vector3(12.5 * pf, 11.0 * pf, 12.5 * pf),
            new THREE.Vector3(2.4, 3.0, 0.5), // sweeps directly up the aisle toward Pendopo & Couple!
            new THREE.Vector3(-5.0, 6.2, 7.8),
            endPos,
          ],
          false,
          "catmullrom",
          0.45,
        );
        const lookCurve = new THREE.CatmullRomCurve3(
          [
            new THREE.Vector3(0.5, 0.8, -1.5),
            new THREE.Vector3(2.0, 1.0, -2.0),
            new THREE.Vector3(5.4, 1.5, -3.05), // focuses Bride & Groom on Pelaminan
            new THREE.Vector3(-5.2, 1.1, 2.2),
            new THREE.Vector3(-8.8, 0.72, 2.2), // lands on player character
          ],
          false,
          "catmullrom",
          0.45,
        );
        return { posCurve, lookCurve };
      };

      let cachedCurvesPf = -1;
      let cachedCurves = buildIntroCurves(initPF);
      cachedCurvesPf = initPF;
      const getIntroCurves = (pf: number) => {
        if (Math.abs(pf - cachedCurvesPf) > 0.01) {
          cachedCurves = buildIntroCurves(pf);
          cachedCurvesPf = pf;
        }
        return cachedCurves;
      };

      callbacksRef.current.onLoadProgress(100);

      let prevTime = performance.now();
      let rafId = 0;
      let lastStrideHalf = -1;
      let lastRiverReport = 0;

      const detectSurface = (x: number, z: number): FootstepSurface => {
        if (x >= -6.9 && x <= -3.9 && z >= 1.2 && z <= 3.2) return "wood";
        const onEntry = x >= -12.3 && x <= -6.1 && z >= 1.2 && z <= 3.2;
        const onMain = x >= -4.5 && x <= 7.7 && z >= 1.15 && z <= 3.25;
        const onNorth = x >= 0.3 && x <= 2.1 && z >= -3.0 && z <= 2.2;
        const onWest = x >= -2.9 && x <= -1.3 && z >= -3.6 && z <= 2.0;
        const onAisle = x >= 1.4 && x <= 5.2 && z >= -2.5 && z <= 1.6;
        if (onEntry || onMain || onNorth || onWest || onAisle) return "stone";
        return "grass";
      };

      const animate = (now: number) => {
        if (disposed) return;
        rafId = requestAnimationFrame(animate);

        const dt = Math.min((now - prevTime) / 1000, 0.05);
        prevTime = now;
        const elapsed = now * 0.001;
        const currentPhase = stateRef.current.phase;

        // 1. Animate stream water & swaying tropical foliage
        env.waterTexture.offset.y -= dt * 0.22;
        env.waterTexture.offset.x = Math.sin(elapsed * 0.5) * 0.025;
        env.waterWheel.rotation.x -= dt * 0.85;

        for (const sw of env.swaying) {
          sw.object.rotation.z =
            sw.baseRotZ + Math.sin(elapsed * sw.speed + sw.phase) * sw.amp;
          sw.object.rotation.x =
            sw.baseRotX + Math.cos(elapsed * sw.speed * 0.8 + sw.phase) * sw.amp * 0.6;
        }

        // Drifting clouds
        for (const c of env.clouds) {
          c.group.position.x = c.baseX + Math.sin(elapsed * c.speed * 0.35) * c.range;
        }

        // 2. Animate swimming detailed koi & fluttering butterflies
        animateDetailedKoi(env.koiFish, elapsed);
        animateButterflies(env.butterflies, elapsed);

        // 3. Animate balloons (Kado mode)
        for (const b of env.balloons) {
          b.mesh.position.y = b.baseY + Math.sin(elapsed * 1.9 + b.phase) * 0.09;
        }

        // 4. Animate detailed animals (domba, ayam, bebek)
        animateDetailedAnimals(env.animals, elapsed);

        // 5. Drifting blossom petals
        const pAttr = env.petals.points.geometry.getAttribute("position") as THREE.BufferAttribute;
        const pArr = pAttr.array as Float32Array;
        const pVel = env.petals.velocities;
        for (let i = 0; i < pArr.length; i += 3) {
          pArr[i] += pVel[i] * dt + Math.sin(elapsed + i) * 0.004;
          pArr[i + 1] += pVel[i + 1] * dt;
          pArr[i + 2] += pVel[i + 2] * dt;
          if (pArr[i + 1] < 0.05) {
            pArr[i] = (Math.random() - 0.5) * 18;
            pArr[i + 1] = 5.5 + Math.random() * 1.5;
            pArr[i + 2] = (Math.random() - 0.5) * 16;
          }
        }
        pAttr.needsUpdate = true;

        // 6. Twinkling fireflies
        const ffAttr = env.fireflies.points.geometry.getAttribute("position") as THREE.BufferAttribute;
        const ffArr = ffAttr.array as Float32Array;
        const ffBase = env.fireflies.basePositions;
        const ffPh = env.fireflies.phases;
        for (let i = 0; i < ffPh.length; i++) {
          const k = i * 3;
          const ph = ffPh[i];
          ffArr[k] = ffBase[k] + Math.sin(elapsed * 0.9 + ph) * 0.45;
          ffArr[k + 1] = ffBase[k + 1] + Math.cos(elapsed * 1.3 + ph * 1.5) * 0.28;
          ffArr[k + 2] = ffBase[k + 2] + Math.sin(elapsed * 0.75 + ph * 0.7) * 0.42;
        }
        ffAttr.needsUpdate = true;

        // 7. Hero Bride & Groom animation + reception greeter gentle wave
        animateWeddingCouple(env.weddingCouple, dt, elapsed);
        env.celebrantRigs.forEach((rig, idx) => {
          animateChibi(rig, 0, dt, elapsed + idx * 1.1);
          rig.rightArm.rotation.z = -0.35 + Math.sin(elapsed * 2.8 + idx) * 0.16;
        });

        // 8. Gate doors swing open when entering world
        if (stateRef.current.entering || currentPhase === "world") {
          stateRef.current.gateProgress = Math.min(1, stateRef.current.gateProgress + dt * 1.8);
          const openAngle = stateRef.current.gateProgress * 1.35;
          env.gateDoors.left.rotation.y = openAngle;
          env.gateDoors.right.rotation.y = -openAngle;
        } else {
          env.gateDoors.left.rotation.y = 0;
          env.gateDoors.right.rotation.y = 0;
        }

        // 9. Roaming guests (NPCs)
        for (const npc of npcInstances) {
          if (elapsed < npc.pauseUntil) {
            animateChibi(npc.rig, 0, dt, elapsed);
            continue;
          }
          const wp = npc.data.patrolPoints[npc.waypointIdx];
          const dx = wp.x - npc.rig.group.position.x;
          const dz = wp.z - npc.rig.group.position.z;
          const dist = Math.hypot(dx, dz);
          if (dist < 0.15) {
            npc.waypointIdx = (npc.waypointIdx + 1) % npc.data.patrolPoints.length;
            npc.pauseUntil = elapsed + 2.4;
            animateChibi(npc.rig, 0, dt, elapsed);
          } else {
            const spd = 1.05;
            npc.rig.group.position.x += (dx / dist) * spd * dt;
            npc.rig.group.position.z += (dz / dist) * spd * dt;
            npc.rig.group.rotation.y = Math.atan2(dx, dz);
            animateChibi(npc.rig, spd, dt, elapsed);
          }
        }

        // 10. Player movement (WASD / Arrow / Joystick / Auto-walk through bridge)
        let moveX = stateRef.current.joystick.x;
        let moveZ = stateRef.current.joystick.y;

        if (currentPhase === "world") {
          if (keysDown.has("w") || keysDown.has("arrowup")) moveZ -= 1;
          if (keysDown.has("s") || keysDown.has("arrowdown")) moveZ += 1;
          if (keysDown.has("a") || keysDown.has("arrowleft")) moveX -= 1;
          if (keysDown.has("d") || keysDown.has("arrowright")) moveX += 1;
        }

        let speed = 0;
        const px = playerRig.group.position.x;
        const pz = playerRig.group.position.z;

        if (Math.hypot(moveX, moveZ) > 0.08) {
          const inputMag = Math.min(1, Math.hypot(moveX, moveZ));
          const normX = moveX / Math.hypot(moveX, moveZ);
          const normZ = moveZ / Math.hypot(moveX, moveZ);

          const camForward = new THREE.Vector3();
          camera.getWorldDirection(camForward);
          camForward.y = 0;
          camForward.normalize();
          const camRight = new THREE.Vector3()
            .crossVectors(camForward, THREE.Object3D.DEFAULT_UP)
            .normalize();

          const worldDx = camRight.x * normX + camForward.x * -normZ;
          const worldDz = camRight.z * normX + camForward.z * -normZ;

          speed = 4.2 * inputMag;
          const candX = px + worldDx * speed * dt;
          const candZ = pz + worldDz * speed * dt;
          const clamped = moveWithVillageCollisions(px, pz, candX, candZ);
          playerRig.group.position.x = clamped.x;
          playerRig.group.position.z = clamped.z;
          playerRig.baseY = computeBridgeElevation(clamped.x, clamped.z);
          if (Math.hypot(worldDx, worldDz) > 0.02) {
            playerRig.group.rotation.y = Math.atan2(worldDx, worldDz);
          }
        } else if (stateRef.current.autoWalkTarget && currentPhase === "world") {
          const target = stateRef.current.autoWalkTarget;
          const dx = target.x - px;
          const dz = target.z - pz;
          const dist = Math.hypot(dx, dz);
          if (dist < 0.2) {
            stateRef.current.autoWalkTarget = null;
            stateRef.current.entering = false;
          } else {
            speed = stateRef.current.entering ? 3.8 : 3.4;
            const candX = px + (dx / dist) * speed * dt;
            const candZ = pz + (dz / dist) * speed * dt;
            const clamped = moveWithVillageCollisions(px, pz, candX, candZ);
            if (Math.hypot(clamped.x - px, clamped.z - pz) < 0.001) {
              stateRef.current.autoWalkTarget = null;
            } else {
              playerRig.group.position.x = clamped.x;
              playerRig.group.position.z = clamped.z;
              playerRig.baseY = computeBridgeElevation(clamped.x, clamped.z);
              playerRig.group.rotation.y = Math.atan2(dx, dz);
            }
          }
        } else {
          playerRig.baseY = computeBridgeElevation(px, pz);
        }

        animateChibi(playerRig, speed, dt, elapsed);

        // Surface-aware footsteps synced to walk stride + throttled spatial river proximity
        if (currentPhase === "world") {
          if (speed > 0.25) {
            const halfIdx = Math.floor(playerRig.walkPhase / Math.PI);
            if (halfIdx !== lastStrideHalf) {
              lastStrideHalf = halfIdx;
              callbacksRef.current.onFootstep?.(
                detectSurface(playerRig.group.position.x, playerRig.group.position.z),
              );
            }
          } else {
            lastStrideHalf = Math.floor(playerRig.walkPhase / Math.PI);
          }

          if (now - lastRiverReport > 125) {
            lastRiverReport = now;
            const distRiver = Math.abs(playerRig.group.position.x - (-5.4));
            const closeness = THREE.MathUtils.clamp(1 - distRiver / 9.5, 0, 1);
            callbacksRef.current.onRiverProximity?.(closeness);
          }
        }

        // 11. Proximity Detection & 3D Interactive Hover Highlight
        if (currentPhase === "world") {
          const nearest = computeNearest();
          const nextKey = nearest ? `${nearest.kind}:${nearest.id}` : "";
          if (nextKey !== stateRef.current.nearestKey) {
            stateRef.current.nearestKey = nextKey;
            currentNearest = nearest;
            callbacksRef.current.onProximityChange(currentNearest);
          }
        }

        const activeHighlight =
          currentPhase === "world" ? (stateRef.current.hoveredTarget ?? currentNearest) : null;

        // Smooth 3D hover lift on non-Pendopo stations & NPCs + Pendopo light emphasis
        const scaleLerp = 1 - Math.exp(-10 * dt);
        for (const [stId, mesh] of Object.entries(env.stationMeshes)) {
          if (stId === "acara") continue;
          const isHl = activeHighlight?.kind === "station" && activeHighlight.id === stId;
          const targetS = isHl ? 1.048 : 1.0;
          const nextS = THREE.MathUtils.lerp(mesh.scale.x, targetS, scaleLerp);
          mesh.scale.setScalar(nextS);
        }
        const acaraActive = activeHighlight?.kind === "station" && activeHighlight.id === "acara";
        pendopoLight.intensity = THREE.MathUtils.lerp(
          pendopoLight.intensity,
          basePendopoIntensity + (acaraActive ? 1.05 : 0),
          scaleLerp,
        );
        for (const npc of npcInstances) {
          const isHl = activeHighlight?.kind === "npc" && activeHighlight.id === npc.data.id;
          const targetS = isHl ? 1.06 : 1.0;
          const nextS = THREE.MathUtils.lerp(npc.rig.group.scale.x, targetS, scaleLerp);
          npc.rig.group.scale.setScalar(nextS);
        }

        // Position & pulse 3D Ground Halo Ring + Floating Diamond Marker
        if (activeHighlight) {
          highlightGroup.visible = true;
          let hx = 0;
          let hz = 0;
          let ringScale = 1.0;
          let markerY = 2.0;

          if (activeHighlight.kind === "station") {
            const st = payload.stations.find((s) => s.id === activeHighlight.id);
            if (st) {
              hx = st.id === "acara" ? 5.1 : st.id === "galeri" ? 6.4 : st.id === "cerita" ? -2.1 : st.x;
              hz = st.id === "acara" ? -2.7 : st.id === "galeri" ? 0.55 : st.id === "cerita" ? -3.65 : st.z;
              ringScale =
                st.id === "acara"
                  ? 2.2
                  : st.id === "galeri" || st.id === "cerita" || st.id === "kado" || st.id === "ucapan"
                    ? 1.35
                    : 0.95;
              markerY = st.id === "acara" ? 5.5 : st.id === "galeri" ? 2.75 : st.id === "cerita" ? 2.5 : 1.75;
            }
          } else {
            const npc = npcInstances.find((n) => n.data.id === activeHighlight.id);
            if (npc) {
              hx = npc.rig.group.position.x;
              hz = npc.rig.group.position.z;
              ringScale = 0.65;
              markerY = 1.85;
            }
          }

          highlightGroup.position.set(hx, 0, hz);
          const pulse = 1 + Math.sin(elapsed * 4.5) * 0.06;
          haloOuter.scale.setScalar(ringScale * pulse);
          haloFill.scale.setScalar(ringScale * pulse);
          floatMarker.position.y = markerY + Math.sin(elapsed * 3.5) * 0.1;
          floatMarker.rotation.y = elapsed * 2.1;
        } else {
          highlightGroup.visible = false;
        }

        // 12. 4-State Camera System: Cover Drone Orbit -> Picker -> Intro Spline -> World Follow
        const portraitFactor = getPortraitFactor();

        if (currentPhase === "loading" || currentPhase === "cover") {
          const targetFov = 42;
          if (Math.abs(camera.fov - targetFov) > 0.05) {
            camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, 1 - Math.exp(-4 * dt));
            camera.updateProjectionMatrix();
          }
          const orbitAngle = elapsed * 0.14 + Math.PI * 0.72;
          const orbitRadius = 21.5 * portraitFactor;
          desiredCamPos.set(
            droneCenter.x + Math.cos(orbitAngle) * orbitRadius,
            13.8 * portraitFactor,
            droneCenter.z + Math.sin(orbitAngle) * orbitRadius,
          );
          camTarget.lerp(droneCenter, 1 - Math.exp(-3.5 * dt));
          camera.position.lerp(desiredCamPos, 1 - Math.exp(-3.5 * dt));
        } else if (currentPhase === "picking") {
          const targetFov = 37;
          if (Math.abs(camera.fov - targetFov) > 0.05) {
            camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, 1 - Math.exp(-4 * dt));
            camera.updateProjectionMatrix();
          }
          const pickTarget = new THREE.Vector3(-1.4, 0.9, 1.0);
          camTarget.lerp(pickTarget, 1 - Math.exp(-4 * dt));
          const sway = Math.sin(elapsed * 0.35) * 0.5;
          desiredCamPos.set(
            pickTarget.x + baseCamOffset.x * portraitFactor * 1.18 + sway,
            pickTarget.y + baseCamOffset.y * portraitFactor * 1.18,
            pickTarget.z + baseCamOffset.z * portraitFactor * 1.18,
          );
          camera.position.lerp(desiredCamPos, 1 - Math.exp(-4 * dt));
        } else if (currentPhase === "intro") {
          if (!stateRef.current.introActive) {
            stateRef.current.introActive = true;
            stateRef.current.introProgress = 0;
          }
          stateRef.current.introProgress = Math.min(
            1,
            stateRef.current.introProgress + dt / 6.5,
          );
          const eased = easeInOutCubic(stateRef.current.introProgress);
          const { posCurve, lookCurve } = getIntroCurves(portraitFactor);
          posCurve.getPointAt(eased, desiredCamPos);
          lookCurve.getPointAt(eased, camTarget);
          camera.position.copy(desiredCamPos);

          const targetFov = THREE.MathUtils.lerp(44, 33, eased);
          camera.fov = targetFov;
          camera.updateProjectionMatrix();

          if (stateRef.current.introProgress >= 1) {
            completeIntroNow();
          }
        } else {
          const targetFov = 33;
          if (Math.abs(camera.fov - targetFov) > 0.05) {
            camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, 1 - Math.exp(-5 * dt));
            camera.updateProjectionMatrix();
          }
          const focus = stateRef.current.focusTarget;
          const useFocus = focus && now < focus.until;
          const tx = useFocus ? focus.x : playerRig.group.position.x;
          const tz = useFocus ? focus.z : playerRig.group.position.z;
          camTarget.lerp(new THREE.Vector3(tx, 0.78, tz), 1 - Math.exp(-5.5 * dt));

          const rotOffset = baseCamOffset
            .clone()
            .multiplyScalar(portraitFactor * stateRef.current.orbitZoomScale)
            .applyAxisAngle(THREE.Object3D.DEFAULT_UP, stateRef.current.orbitYawOffset);

          desiredCamPos.copy(camTarget).add(rotOffset);
          camera.position.lerp(desiredCamPos, 1 - Math.exp(-5.5 * dt));
        }
        camera.lookAt(camTarget);

        renderer.render(scene, camera);

        // 13. Project 3D Stations & NPCs directly to floating HTML pills
        if (currentPhase === "world") {
          const rectW = renderer.domElement.clientWidth || initialSize.w;
          const rectH = renderer.domElement.clientHeight || initialSize.h;

          const placeLabel = (id: string, wx: number, wy: number, wz: number) => {
            const el = labelRefs.current[id];
            if (!el) return;
            projVec.set(wx, wy, wz).project(camera);
            if (projVec.z > 1) {
              el.style.opacity = "0";
              el.style.pointerEvents = "none";
              return;
            }
            const sx = (projVec.x * 0.5 + 0.5) * rectW;
            const sy = (-projVec.y * 0.5 + 0.5) * rectH;
            const visible = sx >= -40 && sx <= rectW + 40 && sy >= 36 && sy <= rectH - 50;
            el.style.opacity = visible ? "1" : "0";
            el.style.pointerEvents = visible ? "auto" : "none";
            el.style.transform = `translate3d(${Math.round(sx)}px, ${Math.round(sy)}px, 0) translate(-50%, -100%)`;
          };

          for (const st of payload.stations) {
            const stEl = labelRefs.current[`st:${st.id}`];
            if (stEl) {
              stEl.dataset.active =
                activeHighlight?.kind === "station" && activeHighlight.id === st.id ? "true" : "false";
            }
            if (st.id === "acara") {
              placeLabel(`st:${st.id}`, 6.0, 5.9, -3.8);
            } else if (st.id === "galeri") {
              placeLabel(`st:${st.id}`, 6.4, 2.85, 0.55);
            } else if (st.id === "cerita") {
              placeLabel(`st:${st.id}`, -2.1, 2.55, -3.65);
            } else {
              placeLabel(`st:${st.id}`, st.x, 1.55, st.z);
            }
          }
          for (const npc of npcInstances) {
            const npcEl = labelRefs.current[`npc:${npc.data.id}`];
            if (npcEl) {
              npcEl.dataset.active =
                activeHighlight?.kind === "npc" && activeHighlight.id === npc.data.id ? "true" : "false";
            }
            placeLabel(
              `npc:${npc.data.id}`,
              npc.rig.group.position.x,
              1.68,
              npc.rig.group.position.z,
            );
          }
        }
      };

      rafId = requestAnimationFrame(animate);

      return () => {
        disposed = true;
        cancelAnimationFrame(rafId);
        resizeObserver.disconnect();
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
        domEl.removeEventListener("pointerdown", onPointerDown);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
        domEl.removeEventListener("wheel", onWheel);
        env.disposeExtras();
        scene.traverse((obj) => {
          if ((obj as THREE.Mesh).isMesh || (obj as THREE.Points).isPoints) {
            const item = obj as THREE.Mesh;
            item.geometry?.dispose();
            const mats = Array.isArray(item.material) ? item.material : [item.material];
            mats.forEach((m) => {
              if (m && "map" in m && (m as THREE.MeshStandardMaterial).map) {
                (m as THREE.MeshStandardMaterial).map?.dispose();
              }
              m?.dispose();
            });
          }
        });
        renderer.dispose();
        if (domEl.parentNode === container) {
          container.removeChild(domEl);
        }
      };
    }, [payload]);

    return (
      <>
        <div
          ref={containerRef}
          className="fixed inset-0 h-[100dvh] w-screen overflow-hidden select-none touch-none"
          aria-label="Pengalaman Undangan 3D Interaktif"
        />

        {/* Projected 3D Hotspot Pins */}
        {phase === "world" && !overlayOpen && (
          <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden">
            {payload.stations.map((st) => {
              const visited = visitedStations.includes(st.id);
              return (
                <button
                  key={st.id}
                  ref={(el) => {
                    labelRefs.current[`st:${st.id}`] = el;
                  }}
                  type="button"
                  onClick={() => onSelectStation(st.id)}
                  className="pointer-events-auto absolute left-0 top-0 inline-flex items-center gap-1.5 rounded-[10px] border border-[#C8B490] bg-[#FAF6EE]/94 px-2.5 py-1 text-[11px] font-semibold text-[#3E2B1E] shadow-xs backdrop-blur-xs transition-all duration-150 hover:border-[#2A5C45] hover:bg-[#2A5C45] hover:text-white data-[active=true]:border-[#D4A359] data-[active=true]:bg-[#2A5C45] data-[active=true]:text-white data-[active=true]:ring-2 data-[active=true]:ring-[#D4A359]/65 data-[active=true]:shadow-md"
                  style={{ opacity: 0 }}
                >
                  <span
                    aria-hidden="true"
                    className={`h-1.5 w-1.5 rounded-full ${
                      visited ? "bg-[#2A5C45]" : "bg-[#AD4B2C]"
                    }`}
                  />
                  <span>{st.markerLabel}</span>
                </button>
              );
            })}

            {payload.npcs.map((npc) => (
              <button
                key={npc.id}
                ref={(el) => {
                  labelRefs.current[`npc:${npc.id}`] = el;
                }}
                type="button"
                onClick={() => onSelectNpc(npc.id)}
                className="pointer-events-auto absolute left-0 top-0 rounded-[10px] border border-[#2A5C45]/40 bg-[#E6F1EA]/94 px-2.5 py-0.5 text-[10px] font-medium text-[#1D4432] shadow-xs backdrop-blur-xs transition-all duration-150 hover:bg-[#2A5C45] hover:text-white data-[active=true]:border-[#D4A359] data-[active=true]:bg-[#2A5C45] data-[active=true]:text-white data-[active=true]:ring-2 data-[active=true]:ring-[#D4A359]/65 data-[active=true]:shadow-md"
                style={{ opacity: 0 }}
              >
                {npc.name.split(" ")[0]}
              </button>
            ))}
          </div>
        )}
      </>
    );
  },
);
