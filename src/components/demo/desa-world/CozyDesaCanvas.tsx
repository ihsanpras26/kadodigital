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
import { buildVillageEnvironment } from "./villageProps";

export interface ProximityTarget {
  kind: "station" | "npc";
  id: string;
  label: string;
}

export interface DesaCanvasHandle {
  enterWorld: () => void;
  setPlayerGender: (gender: "cewek" | "cowok") => void;
  focusStation: (stationId: DesaStationId) => void;
  setTimeOfDay: (time: DesaTimeOfDay) => void;
  setJoystickVector: (vec: { x: number; y: number }) => void;
  triggerNearestInteraction: () => void;
}

interface CozyDesaCanvasProps {
  payload: DesaWorldPayload;
  inWorld: boolean;
  overlayOpen?: boolean;
  visitedStations?: DesaStationId[];
  onLoadProgress: (pct: number) => void;
  onReadyPortraits: (portraits: { cewek: string; cowok: string }) => void;
  onSelectStation: (stationId: DesaStationId) => void;
  onSelectNpc: (npcId: string) => void;
  onProximityChange: (target: ProximityTarget | null) => void;
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
  fireflyOpacity: number;
  petalOpacity: number;
}

const LIGHTING_PRESETS: Record<DesaTimeOfDay, LightingPreset> = {
  pagi: {
    skyHex: "#cfe5da",
    fogHex: "#cfe5da",
    fogDensity: 0.015,
    hemiSky: "#fff7e5",
    hemiGround: "#6b9365",
    hemiIntensity: 1.05,
    sunColor: "#fff1d0",
    sunIntensity: 1.5,
    ambientIntensity: 0.48,
    lanternEmissive: 0.25,
    lanternGlowOpacity: 0.14,
    fireflyOpacity: 0.15,
    petalOpacity: 0.85,
  },
  sore: {
    skyHex: "#e3c59e",
    fogHex: "#dec19c",
    fogDensity: 0.014,
    hemiSky: "#ffe3ba",
    hemiGround: "#687a57",
    hemiIntensity: 0.92,
    sunColor: "#ffc478",
    sunIntensity: 1.62,
    ambientIntensity: 0.42,
    lanternEmissive: 0.88,
    lanternGlowOpacity: 0.56,
    fireflyOpacity: 0.62,
    petalOpacity: 0.72,
  },
  malam: {
    skyHex: "#152533",
    fogHex: "#162836",
    fogDensity: 0.018,
    hemiSky: "#5f84a8",
    hemiGround: "#21332c",
    hemiIntensity: 0.62,
    sunColor: "#9cc5ed",
    sunIntensity: 0.72,
    ambientIntensity: 0.34,
    lanternEmissive: 1.6,
    lanternGlowOpacity: 0.92,
    fireflyOpacity: 1.0,
    petalOpacity: 0.35,
  },
};

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

  // Prevent crossing river edge except across the bridge corridor
  if (prevX < -6.8 && x >= -6.8 && !onBridgeZ(z)) {
    x = -6.81;
  } else if (prevX > -4.0 && x <= -4.0 && !onBridgeZ(z)) {
    x = -3.99;
  }

  // Clamp Z inside outer bounds or bridge corridor
  if (x > -6.8 && x < -4.0) {
    z = Math.min(Math.max(z, 1.52), 2.88);
  } else if (x <= -6.8) {
    x = Math.max(-10.2, x);
    z = Math.min(Math.max(z, -1.6), 5.6);
  } else {
    x = Math.min(8.2, x);
    z = Math.min(Math.max(z, -5.2), 7.8);
  }

  return { x, z };
}

export const CozyDesaCanvas = forwardRef<DesaCanvasHandle, CozyDesaCanvasProps>(
  function CozyDesaCanvas(
    {
      payload,
      inWorld,
      overlayOpen = false,
      visitedStations = [],
      onLoadProgress,
      onReadyPortraits,
      onSelectStation,
      onSelectNpc,
      onProximityChange,
    },
    ref,
  ) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const labelRefs = useRef<Record<string, HTMLButtonElement | null>>({});

    // Mutable bridge state accessed cleanly from RAF loop
    const stateRef = useRef({
      inWorld: false,
      entering: false,
      gateProgress: 0,
      autoWalkTarget: null as { x: number; z: number } | null,
      playerGender: "cewek" as "cewek" | "cowok",
      timeOfDay: "sore" as DesaTimeOfDay,
      joystick: { x: 0, y: 0 },
      orbitYawOffset: 0,
      orbitZoomScale: 1,
      focusTarget: null as { x: number; z: number; until: number } | null,
      nearestKey: "",
    });

    stateRef.current.inWorld = inWorld;

    const callbacksRef = useRef({
      onLoadProgress,
      onReadyPortraits,
      onSelectStation,
      onSelectNpc,
      onProximityChange,
    });
    callbacksRef.current = {
      onLoadProgress,
      onReadyPortraits,
      onSelectStation,
      onSelectNpc,
      onProximityChange,
    };

    const actionsRef = useRef<{
      swapGender: (g: "cewek" | "cowok") => void;
      applyLighting: (t: DesaTimeOfDay) => void;
      triggerNearest: () => void;
    } | null>(null);

    useImperativeHandle(ref, () => ({
      enterWorld() {
        stateRef.current.entering = true;
        stateRef.current.autoWalkTarget = { x: -2.7, z: 2.2 };
      },
      setPlayerGender(gender) {
        stateRef.current.playerGender = gender;
        actionsRef.current?.swapGender(gender);
      },
      focusStation(stationId) {
        const station = payload.stations.find((s) => s.id === stationId);
        if (!station) return;
        stateRef.current.focusTarget = {
          x: station.x,
          z: station.z,
          until: performance.now() + 2400,
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
        33,
        initialSize.w / initialSize.h,
        0.1,
        140,
      );

      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({
          antialias: true,
          powerPreference: "high-performance",
        });
      } catch {
        // Fallback so UI remains interactive even if WebGL fails cleanly
        callbacksRef.current.onLoadProgress(100);
        return;
      }

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
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

      // Base lights (stay strictly within <= 4 dynamic PointLights)
      const hemiLight = new THREE.HemisphereLight(0xffe3ba, 0x687a57, 0.92);
      scene.add(hemiLight);

      const ambientLight = new THREE.AmbientLight(0xfff1dc, 0.42);
      scene.add(ambientLight);

      const sunLight = new THREE.DirectionalLight(0xffc478, 1.62);
      sunLight.position.set(12, 18, 10);
      sunLight.castShadow = true;
      sunLight.shadow.mapSize.set(1024, 1024);
      sunLight.shadow.camera.near = 1;
      sunLight.shadow.camera.far = 52;
      const d = 17;
      sunLight.shadow.camera.left = -d;
      sunLight.shadow.camera.right = d;
      sunLight.shadow.camera.top = d;
      sunLight.shadow.camera.bottom = -d;
      sunLight.shadow.bias = -0.0008;
      scene.add(sunLight);

      // 3 warm strategic accent lights (Pendopo, Plaza, Bridge Gapura)
      const pendopoLight = new THREE.PointLight(0xffb55c, 2.2, 11, 1.6);
      pendopoLight.position.set(6.2, 2.2, -3.6);
      const plazaLight = new THREE.PointLight(0xffbc68, 1.8, 10, 1.6);
      plazaLight.position.set(1.5, 2.0, 2.1);
      const gateLight = new THREE.PointLight(0xffb662, 1.6, 9, 1.6);
      gateLight.position.set(-5.4, 2.0, 2.2);
      scene.add(pendopoLight, plazaLight, gateLight);

      const env = buildVillageEnvironment(scene, payload);
      callbacksRef.current.onLoadProgress(72);

      // Render crisp 3D chibi portraits with main renderer before entering loop
      const portraits = renderChibiPortraits(renderer);
      callbacksRef.current.onReadyPortraits(portraits);

      // Build player chibi rig starting just outside Gapura
      let playerRig: ChibiRig = buildChibiCharacter({
        gender: stateRef.current.playerGender,
        hatType: stateRef.current.playerGender === "cewek" ? "floral" : "sunhat",
      });
      playerRig.group.position.set(-8.8, 0, 2.2);
      playerRig.group.rotation.y = Math.PI / 2; // facing Gapura & bridge
      scene.add(playerRig.group);

      // Build NPC chibi villagers
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
        scene.add(rig.group);
        return {
          data: npc,
          rig,
          waypointIdx: 1 % npc.patrolPoints.length,
          pauseUntil: idx * 1.2,
        };
      });

      // Apply preset lighting function
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

        env.lanternShadeMats.forEach((mat) => {
          mat.emissiveIntensity = preset.lanternEmissive;
        });
        env.lanternGlowMeshes.forEach((mesh) => {
          const mat = mesh.material as THREE.MeshBasicMaterial;
          mat.opacity = preset.lanternGlowOpacity;
        });
        env.fireflies.material.opacity = preset.fireflyOpacity;
        const pMat = env.petals.points.material as THREE.PointsMaterial;
        pMat.opacity = preset.petalOpacity;

        const ptIntensity = presetKey === "malam" ? 3.2 : presetKey === "sore" ? 2.0 : 0.7;
        pendopoLight.intensity = ptIntensity;
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
        if ((k === "e" || k === "enter") && stateRef.current.inWorld) {
          actionsRef.current?.triggerNearest();
        }
      };
      const handleKeyUp = (e: KeyboardEvent) => {
        keysDown.delete(e.key.toLowerCase());
      };
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);

      // Drag-to-orbit camera + click ground to walk
      let dragging = false;
      let dragMoved = 0;
      let lastPtrX = 0;
      let ptrDownPos = { x: 0, y: 0 };
      const raycaster = new THREE.Raycaster();
      const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const hitPoint = new THREE.Vector3();

      const onPointerDown = (e: PointerEvent) => {
        if (!stateRef.current.inWorld) return;
        dragging = true;
        dragMoved = 0;
        lastPtrX = e.clientX;
        ptrDownPos = { x: e.clientX, y: e.clientY };
      };
      const onPointerMove = (e: PointerEvent) => {
        if (!dragging) return;
        const dx = e.clientX - lastPtrX;
        dragMoved += Math.abs(dx) + Math.abs(e.clientY - ptrDownPos.y) * 0.1;
        lastPtrX = e.clientX;
        stateRef.current.orbitYawOffset = THREE.MathUtils.clamp(
          stateRef.current.orbitYawOffset - dx * 0.0045,
          -0.65,
          0.65,
        );
      };
      const onPointerUp = (e: PointerEvent) => {
        if (!dragging) return;
        dragging = false;
        const dist = Math.hypot(e.clientX - ptrDownPos.x, e.clientY - ptrDownPos.y);
        if (dist < 6 && dragMoved < 8 && stateRef.current.inWorld) {
          const rect = renderer.domElement.getBoundingClientRect();
          const ndc = new THREE.Vector2(
            ((e.clientX - rect.left) / rect.width) * 2 - 1,
            -((e.clientY - rect.top) / rect.height) * 2 + 1,
          );
          raycaster.setFromCamera(ndc, camera);
          if (raycaster.ray.intersectPlane(groundPlane, hitPoint)) {
            stateRef.current.autoWalkTarget = {
              x: THREE.MathUtils.clamp(hitPoint.x, -9.8, 8.1),
              z: THREE.MathUtils.clamp(hitPoint.z, -5.0, 7.6),
            };
          }
        }
      };
      const onWheel = (e: WheelEvent) => {
        if (!stateRef.current.inWorld) return;
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

      // Resize observer ensuring mobile canvas is never blank
      const handleResize = () => {
        const { w, h } = getSize();
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      const resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(container);
      window.addEventListener("resize", handleResize);

      // Proximity helper
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

      // Smooth camera tracking variables (initialize aerial position immediately so Frame 0 Cover is scenic!)
      const camTarget = new THREE.Vector3(-1.2, 0.75, 1.2);
      const baseCamOffset = new THREE.Vector3(-9.2, 10.6, 11.4);
      const initAspect = initialSize.w / initialSize.h;
      const initPortraitFactor = initAspect < 0.85 ? 1.42 : initAspect < 1.1 ? 1.18 : 1.0;
      camera.position
        .copy(camTarget)
        .addScaledVector(baseCamOffset, initPortraitFactor);
      camera.lookAt(camTarget);
      renderer.render(scene, camera);

      const desiredCamPos = new THREE.Vector3();
      const projVec = new THREE.Vector3();

      callbacksRef.current.onLoadProgress(100);

      let prevTime = performance.now();
      let rafId = 0;

      const animate = (now: number) => {
        if (disposed) return;
        rafId = requestAnimationFrame(animate);

        const dt = Math.min((now - prevTime) / 1000, 0.05);
        prevTime = now;
        const elapsed = now * 0.001;

        // 1. Animate stream water & swaying tropical foliage
        env.waterTexture.offset.y -= dt * 0.22;
        env.waterTexture.offset.x = Math.sin(elapsed * 0.5) * 0.025;

        for (const sw of env.swaying) {
          sw.object.rotation.z =
            sw.baseRotZ + Math.sin(elapsed * sw.speed + sw.phase) * sw.amp;
          sw.object.rotation.x =
            sw.baseRotX + Math.cos(elapsed * sw.speed * 0.8 + sw.phase) * sw.amp * 0.6;
        }

        // 2. Animate swimming koi
        for (const fish of env.koiFish) {
          const loopZ = ((fish.baseZ + elapsed * fish.speed + 10) % 20) - 10;
          const wiggleX = Math.sin(elapsed * 3.5 + fish.phase) * 0.14;
          fish.group.position.x = fish.baseX + wiggleX;
          fish.group.position.z = loopZ;
          fish.group.rotation.y = Math.sin(elapsed * 4.5 + fish.phase) * 0.25;
        }

        // 3. Animate balloons
        for (const b of env.balloons) {
          b.mesh.position.y = b.baseY + Math.sin(elapsed * 1.9 + b.phase) * 0.09;
        }

        // 4. Animate animals (ayam, domba, bebek)
        for (const a of env.animals) {
          const angle = elapsed * 0.42 + a.phase;
          const nx = a.homeX + Math.cos(angle) * a.radius;
          const nz = a.homeZ + Math.sin(angle * 0.85) * a.radius;
          const dx = nx - a.group.position.x;
          const dz = nz - a.group.position.z;
          a.group.position.x = nx;
          a.group.position.z = nz;
          if (Math.hypot(dx, dz) > 0.0005) {
            a.group.rotation.y = Math.atan2(dx, dz);
          }
          a.group.position.y = Math.abs(Math.sin(elapsed * 5 + a.phase)) * 0.03;
        }

        // 5. Drifting kamboja petals
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

        // 6. Twinkling kunang-kunang (fireflies)
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

        // 7. Pendopo celebrants gentle wave
        env.celebrantRigs.forEach((rig, idx) => {
          animateChibi(rig, 0, dt, elapsed + idx * 1.1);
          rig.rightArm.rotation.z = -0.35 + Math.sin(elapsed * 2.8 + idx) * 0.16;
        });

        // 8. Gate doors swing animation upon entry
        if (stateRef.current.entering || stateRef.current.inWorld) {
          stateRef.current.gateProgress = Math.min(1, stateRef.current.gateProgress + dt * 1.8);
          const openAngle = stateRef.current.gateProgress * 1.35;
          env.gateDoors.left.rotation.y = openAngle;
          env.gateDoors.right.rotation.y = -openAngle;
        }

        // 9. Roaming villagers (NPCs)
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

        if (stateRef.current.inWorld) {
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

          // Align movement vector cleanly with camera forward/right on ground plane
          const camForward = new THREE.Vector3();
          camera.getWorldDirection(camForward);
          camForward.y = 0;
          camForward.normalize();
          const camRight = new THREE.Vector3().crossVectors(camForward, THREE.Object3D.DEFAULT_UP).normalize();

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
        } else if (stateRef.current.autoWalkTarget) {
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

        // 11. Proximity Detection
        if (stateRef.current.inWorld) {
          const nearest = computeNearest();
          const nextKey = nearest ? `${nearest.kind}:${nearest.id}` : "";
          if (nextKey !== stateRef.current.nearestKey) {
            stateRef.current.nearestKey = nextKey;
            currentNearest = nearest;
            callbacksRef.current.onProximityChange(currentNearest);
          }
        }

        // 12. Responsive Isometric Camera Follow & Orbit
        const aspect = camera.aspect || 1;
        const portraitFactor = aspect < 0.85 ? 1.42 : aspect < 1.1 ? 1.18 : 1.0;

        if (!stateRef.current.inWorld) {
          // Scenic village framing for Cover & Character Picker
          const targetGoal = new THREE.Vector3(-1.2, 0.75, 1.2);
          camTarget.lerp(targetGoal, 1 - Math.exp(-3.5 * dt));
          const idleSway = Math.sin(elapsed * 0.35) * 0.45;
          desiredCamPos.set(
            camTarget.x + baseCamOffset.x * portraitFactor + idleSway,
            camTarget.y + baseCamOffset.y * portraitFactor,
            camTarget.z + baseCamOffset.z * portraitFactor,
          );
          camera.position.lerp(desiredCamPos, 1 - Math.exp(-4 * dt));
        } else {
          const focus = stateRef.current.focusTarget;
          const useFocus = focus && now < focus.until;
          const tx = useFocus ? focus.x : playerRig.group.position.x;
          const tz = useFocus ? focus.z : playerRig.group.position.z;
          camTarget.lerp(new THREE.Vector3(tx, 0.72, tz), 1 - Math.exp(-5.5 * dt));

          const rotOffset = baseCamOffset
            .clone()
            .multiplyScalar(portraitFactor * stateRef.current.orbitZoomScale)
            .applyAxisAngle(THREE.Object3D.DEFAULT_UP, stateRef.current.orbitYawOffset);

          desiredCamPos.copy(camTarget).add(rotOffset);
          camera.position.lerp(desiredCamPos, 1 - Math.exp(-5.5 * dt));
        }
        camera.lookAt(camTarget);

        renderer.render(scene, camera);

        // 13. Project 3D Stations & NPCs directly to floating HTML pills (zero React re-renders)
        if (stateRef.current.inWorld) {
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
            const yHeight = st.id === "acara" ? 3.55 : st.id === "cerita" || st.id === "galeri" ? 1.95 : 1.55;
            placeLabel(`st:${st.id}`, st.x, yHeight, st.z);
          }
          for (const npc of npcInstances) {
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
          aria-label="Dunia 3D Pedesaan Indonesia Interaktif"
        />

        {/* Projected 3D Hotspot Pins (clean Opsi 1 markers, hidden when modal overlays are open) */}
        {inWorld && !overlayOpen && (
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
                  className="pointer-events-auto absolute left-0 top-0 inline-flex items-center gap-1.5 rounded-[10px] border border-[#B79B74] bg-[#F7F1E3]/92 px-2.5 py-0.5 text-[11px] font-extrabold text-[#3E2B1E] shadow-xs transition-opacity duration-150 hover:border-[#2A5C45] hover:bg-[#2A5C45] hover:text-white"
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
                className="pointer-events-auto absolute left-0 top-0 rounded-[10px] border border-[#2A5C45]/45 bg-[#E3EFE8]/92 px-2 py-0.5 text-[10px] font-bold text-[#1D4432] shadow-xs transition-opacity duration-150 hover:bg-[#2A5C45] hover:text-white"
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
