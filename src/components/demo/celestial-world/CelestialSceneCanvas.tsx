"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import * as THREE from "three";
import {
  CELESTIAL_NPCS,
  CELESTIAL_STATIONS,
  type CelestialAtmosphere,
  type CelestialStationId,
} from "./celestialData";
import {
  animateCelestialChibi,
  animateCelestialWeddingCouple,
  buildCelestialChibi,
  renderCelestialPortraits,
  type CelestialChibiRig,
} from "./celestialCharacters";
import {
  buildCelestialSanctuaryScene,
  createWishStarOrb,
  type CelestialSceneHandles,
} from "./celestialSceneBuilder";
import {
  createCloudMistTexture,
  createGatePlaqueTexture,
  createGlowSpriteTexture,
  createMarbleCompassTexture,
  createMonogramTexture,
  paintGatePlaqueCanvas,
  paintMonogramCanvas,
} from "./celestialTextures";
import { resolveWalkStep, sampleWalkableGround } from "./celestialWalkable";

export interface CelestialProximityTarget {
  kind: "station" | "npc";
  id: string;
  label: string;
}

export interface CelestialCanvasHandle {
  startDroneIntro: () => void;
  skipIntro: () => void;
  setPlayerGender: (gender: "cewek" | "cowok") => void;
  setJoystickVector: (vec: { x: number; y: number }) => void;
  teleportNearStation: (stationId: CelestialStationId) => void;
  focusStation: (stationId: CelestialStationId | null) => void;
  triggerNearestInteraction: () => void;
  spawnWishStar: (guestName: string) => void;
}

interface CelestialSceneCanvasProps {
  atmosphere: CelestialAtmosphere;
  initials: string;
  coupleDisplay: string;
  dateDisplay: string;
  photoUrls: string[];
  reducedMotion?: boolean;
  overlayOpen?: boolean;
  heroShot?: boolean;
  onReadyPortraits: (portraits: { cewek: string; cowok: string }) => void;
  onSelectStation: (stationId: CelestialStationId) => void;
  onSelectNpc: (npcId: string) => void;
  onProximityChange: (target: CelestialProximityTarget | null) => void;
  onPlayerMoved?: () => void;
  onIntroComplete: () => void;
}

interface AtmospherePreset {
  skyTop: THREE.Color;
  skyMid: THREE.Color;
  skyBot: THREE.Color;
  aura: THREE.Color;
  fogColor: THREE.Color;
  fogDensity: number;
  hemiSky: THREE.Color;
  hemiGround: THREE.Color;
  sunColor: THREE.Color;
  sunIntensity: number;
  auroraOpacity: number;
  cloudPrimary: THREE.Color;
  cloudSecondary: THREE.Color;
  cloudHorizon: THREE.Color;
  cloudEmissivePrimary: THREE.Color;
  cloudEmissiveSecondary: THREE.Color;
}

const ATMOSPHERE_PRESETS: Record<CelestialAtmosphere, AtmospherePreset> = {
  malam: {
    skyTop: new THREE.Color(0x05091a),
    skyMid: new THREE.Color(0x131d46),
    skyBot: new THREE.Color(0x28356b),
    aura: new THREE.Color(0x88a6f5),
    fogColor: new THREE.Color(0x131c42),
    fogDensity: 0.013,
    hemiSky: new THREE.Color(0x9ab4ff),
    hemiGround: new THREE.Color(0x2b2448),
    sunColor: new THREE.Color(0xffebd0),
    sunIntensity: 1.55,
    auroraOpacity: 0.12,
    cloudPrimary: new THREE.Color(0xd5dff8),
    cloudSecondary: new THREE.Color(0xc3cef0),
    cloudHorizon: new THREE.Color(0xe2e8fc),
    cloudEmissivePrimary: new THREE.Color(0x3b4982),
    cloudEmissiveSecondary: new THREE.Color(0x2c3769),
  },
  senja: {
    skyTop: new THREE.Color(0x170e2e),
    skyMid: new THREE.Color(0x522a54),
    skyBot: new THREE.Color(0xc86d60),
    aura: new THREE.Color(0xffb470),
    fogColor: new THREE.Color(0x4b2a4d),
    fogDensity: 0.012,
    hemiSky: new THREE.Color(0xffc99e),
    hemiGround: new THREE.Color(0x3b223d),
    sunColor: new THREE.Color(0xffd093),
    sunIntensity: 1.85,
    auroraOpacity: 0.0,
    cloudPrimary: new THREE.Color(0xffdec9),
    cloudSecondary: new THREE.Color(0xe6b5c8),
    cloudHorizon: new THREE.Color(0xffebd6),
    cloudEmissivePrimary: new THREE.Color(0x6e3a59),
    cloudEmissiveSecondary: new THREE.Color(0x4f2946),
  },
  aurora: {
    skyTop: new THREE.Color(0x041221),
    skyMid: new THREE.Color(0x0c2b46),
    skyBot: new THREE.Color(0x1b4e63),
    aura: new THREE.Color(0x5df2d6),
    fogColor: new THREE.Color(0x0c2740),
    fogDensity: 0.012,
    hemiSky: new THREE.Color(0x7af5df),
    hemiGround: new THREE.Color(0x182544),
    sunColor: new THREE.Color(0xe6fff9),
    sunIntensity: 1.5,
    auroraOpacity: 0.85,
    cloudPrimary: new THREE.Color(0xcdf8f2),
    cloudSecondary: new THREE.Color(0xa6d2e8),
    cloudHorizon: new THREE.Color(0xdafaf5),
    cloudEmissivePrimary: new THREE.Color(0x1e5663),
    cloudEmissiveSecondary: new THREE.Color(0x153e52),
  },
};

function easeInOutQuint(t: number): number {
  return t < 0.5
    ? 16 * t * t * t * t * t
    : 1 - Math.pow(-2 * t + 2, 5) / 2;
}

function lerpAngle(a: number, b: number, alpha: number): number {
  const diff = Math.atan2(Math.sin(b - a), Math.cos(b - a));
  return a + diff * alpha;
}

export const CelestialSceneCanvas = forwardRef<
  CelestialCanvasHandle,
  CelestialSceneCanvasProps
>(function CelestialSceneCanvas(
  {
    atmosphere,
    initials,
    coupleDisplay,
    dateDisplay,
    photoUrls,
    reducedMotion = false,
    overlayOpen = false,
    heroShot = false,
    onReadyPortraits,
    onSelectStation,
    onSelectNpc,
    onProximityChange,
    onPlayerMoved,
    onIntroComplete,
  },
  ref,
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const handlesRef = useRef<CelestialSceneHandles | null>(null);
  const playerRigRef = useRef<CelestialChibiRig | null>(null);
  const walkMarkerRef = useRef<THREE.Mesh | null>(null);

  const monogramCanvasRef = useRef<{
    canvas: HTMLCanvasElement;
    texture: THREE.CanvasTexture;
  } | null>(null);
  const plaqueCanvasRef = useRef<{
    canvas: HTMLCanvasElement;
    texture: THREE.CanvasTexture;
  } | null>(null);

  const atmosphereRef = useRef<CelestialAtmosphere>(atmosphere);
  const reducedMotionRef = useRef<boolean>(reducedMotion);
  const overlayOpenRef = useRef<boolean>(overlayOpen);
  const heroShotRef = useRef<boolean>(heroShot);
  const coupleDisplayRef = useRef<string>(coupleDisplay);

  const callbacksRef = useRef({
    onReadyPortraits,
    onSelectStation,
    onSelectNpc,
    onProximityChange,
    onPlayerMoved,
    onIntroComplete,
  });
  callbacksRef.current = {
    onReadyPortraits,
    onSelectStation,
    onSelectNpc,
    onProximityChange,
    onPlayerMoved,
    onIntroComplete,
  };

  useEffect(() => {
    atmosphereRef.current = atmosphere;
  }, [atmosphere]);
  useEffect(() => {
    reducedMotionRef.current = reducedMotion;
  }, [reducedMotion]);
  useEffect(() => {
    overlayOpenRef.current = overlayOpen;
  }, [overlayOpen]);
  useEffect(() => {
    heroShotRef.current = heroShot;
  }, [heroShot]);
  useEffect(() => {
    coupleDisplayRef.current = coupleDisplay;
  }, [coupleDisplay]);

  useEffect(() => {
    if (!monogramCanvasRef.current) return;
    paintMonogramCanvas(monogramCanvasRef.current.canvas, initials);
    monogramCanvasRef.current.texture.needsUpdate = true;
  }, [initials]);

  useEffect(() => {
    if (!plaqueCanvasRef.current) return;
    paintGatePlaqueCanvas(
      plaqueCanvasRef.current.canvas,
      coupleDisplay,
      dateDisplay,
    );
    plaqueCanvasRef.current.texture.needsUpdate = true;
  }, [coupleDisplay, dateDisplay]);

  const flightStateRef = useRef({
    mode: "cover" as "cover" | "intro" | "world" | "station",
    introElapsed: 0,
    introDuration: 4.4,
    desiredPos: new THREE.Vector3(4.2, 4.4, 7.6),
    desiredTarget: new THREE.Vector3(0, 1.8, -0.8),
    orbitYaw: 0.22,
    orbitPitch: 0.28,
    orbitDist: 10.6,
    coverAngle: 0.35,
  });

  const playerStateRef = useRef({
    gender: "cewek" as "cewek" | "cowok",
    pos: new THREE.Vector3(0, 0.45, 11.1),
    rotY: Math.PI,
    walkTarget: null as THREE.Vector3 | null,
    movedOnce: false,
  });

  const keysRef = useRef({
    up: false,
    down: false,
    left: false,
    right: false,
  });
  const joystickRef = useRef({ x: 0, y: 0 });
  const nearestTargetRef = useRef<CelestialProximityTarget | null>(null);

  const rebuildPlayerCharacter = (gender: "cewek" | "cowok") => {
    const sc = sceneRef.current;
    if (!sc) return;
    if (playerRigRef.current) {
      sc.remove(playerRigRef.current.group);
      playerRigRef.current.group.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const m = obj as THREE.Mesh;
          m.geometry.dispose();
          const mats = Array.isArray(m.material) ? m.material : [m.material];
          mats.forEach((mt) => mt.dispose());
        }
      });
    }
    const rig = buildCelestialChibi({
      gender,
      outfitColor: gender === "cewek" ? "#efe2cb" : "#18234a",
      accentColor: "#efc86e",
      accessory: gender === "cewek" ? "tiara" : "starhat",
    });
    rig.baseY = playerStateRef.current.pos.y;
    rig.group.position.copy(playerStateRef.current.pos);
    rig.group.rotation.y = playerStateRef.current.rotY;
    sc.add(rig.group);
    playerRigRef.current = rig;
  };

  useImperativeHandle(ref, () => ({
    startDroneIntro() {
      const f = flightStateRef.current;
      if (reducedMotionRef.current) {
        f.mode = "world";
        callbacksRef.current.onIntroComplete();
        return;
      }
      f.mode = "intro";
      f.introElapsed = 0;
    },
    skipIntro() {
      const f = flightStateRef.current;
      f.mode = "world";
      callbacksRef.current.onIntroComplete();
    },
    setPlayerGender(gender) {
      playerStateRef.current.gender = gender;
      rebuildPlayerCharacter(gender);
    },
    setJoystickVector(vec) {
      joystickRef.current = vec;
    },
    teleportNearStation(stationId) {
      const meta = CELESTIAL_STATIONS.find((s) => s.id === stationId);
      if (!meta) return;
      playerStateRef.current.pos.set(...meta.spawnPos);
      playerStateRef.current.walkTarget = null;
      if (walkMarkerRef.current) walkMarkerRef.current.visible = false;
      if (playerRigRef.current) {
        playerRigRef.current.baseY = meta.spawnPos[1];
        playerRigRef.current.group.position.set(...meta.spawnPos);
      }
    },
    focusStation(stationId) {
      const f = flightStateRef.current;
      if (!stationId) {
        f.mode = "world";
        return;
      }
      const meta = CELESTIAL_STATIONS.find((s) => s.id === stationId);
      if (meta) {
        f.mode = "station";
        f.desiredPos.set(...meta.cameraPos);
        f.desiredTarget.set(...meta.targetPos);
      }
    },
    triggerNearestInteraction() {
      const t = nearestTargetRef.current;
      if (!t) return;
      if (t.kind === "npc") {
        callbacksRef.current.onSelectNpc(t.id);
      } else {
        callbacksRef.current.onSelectStation(t.id as CelestialStationId);
      }
    },
    spawnWishStar() {
      const handles = handlesRef.current;
      if (!handles) return;
      const orbGroup = createWishStarOrb(handles.glowTexture, 1.2);
      orbGroup.position.set(0, 2.2, -11.2);
      handles.wishOrbsGroup.add(orbGroup);
      handles.wishOrbs.push({
        group: orbGroup,
        orbitRadius: 5.8 + Math.random() * 2.8,
        orbitSpeed: 0.16 + Math.random() * 0.06,
        orbitPhase: -Math.PI / 2,
        baseY: 6.8 + Math.random() * 2.0,
        bobPhase: Math.random() * Math.PI * 2,
        launching: {
          elapsed: 0,
          duration: 1.75,
          startPos: new THREE.Vector3(0, 2.2, -11.2),
          peakPos: new THREE.Vector3(
            (Math.random() - 0.5) * 3.0,
            7.8 + Math.random() * 1.4,
            -4.5,
          ),
        },
      });
    },
  }));

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
      alpha: false,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(container.clientWidth || 800, container.clientHeight || 600);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.className = "block h-full w-full touch-none outline-none";
    container.appendChild(renderer.domElement);

    const portraits = renderCelestialPortraits(renderer);
    callbacksRef.current.onReadyPortraits(portraits);

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const initPreset = ATMOSPHERE_PRESETS[atmosphereRef.current];
    const fog = new THREE.FogExp2(initPreset.fogColor.getHex(), initPreset.fogDensity);
    scene.fog = fog;

    const camera = new THREE.PerspectiveCamera(
      45,
      (container.clientWidth || 800) / Math.max(1, container.clientHeight || 600),
      0.2,
      195,
    );
    camera.position.set(15, 10, 21);

    // Lighting
    const hemiLight = new THREE.HemisphereLight(
      initPreset.hemiSky.getHex(),
      initPreset.hemiGround.getHex(),
      1.1,
    );
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(
      initPreset.sunColor.getHex(),
      initPreset.sunIntensity,
    );
    keyLight.position.set(16, 24, 18);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 2;
    keyLight.shadow.camera.far = 70;
    keyLight.shadow.camera.left = -20;
    keyLight.shadow.camera.right = 20;
    keyLight.shadow.camera.top = 20;
    keyLight.shadow.camera.bottom = -20;
    scene.add(keyLight);

    const pelaminanLight = new THREE.PointLight(0xffe099, 2.4, 14, 1.3);
    pelaminanLight.position.set(0, 3.6, -1.0);
    scene.add(pelaminanLight);

    const floorTexture = createMarbleCompassTexture();
    const glowTexture = createGlowSpriteTexture();
    const cloudMistTexture = createCloudMistTexture();
    const monogram = createMonogramTexture(initials);
    monogramCanvasRef.current = monogram;
    const plaque = createGatePlaqueTexture(coupleDisplay, dateDisplay);
    plaqueCanvasRef.current = plaque;

    const handles = buildCelestialSanctuaryScene({
      floorTexture,
      monogramTexture: monogram.texture,
      gatePlaqueTexture: plaque.texture,
      glowTexture,
      cloudMistTexture,
      photoUrls,
    });
    handlesRef.current = handles;
    scene.add(handles.root);

    // Walk destination ring marker
    const walkMarker = new THREE.Mesh(
      new THREE.RingGeometry(0.24, 0.36, 20),
      new THREE.MeshBasicMaterial({
        color: 0xffdf85,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85,
      }),
    );
    walkMarker.rotation.x = -Math.PI / 2;
    walkMarker.visible = false;
    scene.add(walkMarker);
    walkMarkerRef.current = walkMarker;

    // Initial Playable Chibi Guest Avatar
    rebuildPlayerCharacter(playerStateRef.current.gender);

    // Smooth Centripetal Drone Intro Spline ending behind Player Avatar at Star-Gate
    const dronePosCurve = new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(-12, 13.5, 24.0),
        new THREE.Vector3(-4.5, 6.4, 13.0),
        new THREE.Vector3(3.4, 3.8, 3.6),
        new THREE.Vector3(2.8, 4.4, 10.4),
        new THREE.Vector3(2.4, 3.8, 20.6),
      ],
      false,
      "centripetal",
    );
    const droneTargetCurve = new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(0, 2.0, 0),
        new THREE.Vector3(0, 2.0, -1.2),
        new THREE.Vector3(0, 1.8, -1.6),
        new THREE.Vector3(0, 1.5, 4.5),
        new THREE.Vector3(0, 1.4, 11.1),
      ],
      false,
      "centripetal",
    );

    const liveCamPos = camera.position.clone();
    const liveCamTarget = new THREE.Vector3(0, 1.8, 0);
    if (heroShotRef.current) {
      flightStateRef.current.mode = "station";
      flightStateRef.current.desiredPos.set(5.6, 4.7, 9.6);
      flightStateRef.current.desiredTarget.set(0, 2.1, -1.2);
      liveCamPos.copy(flightStateRef.current.desiredPos);
      liveCamTarget.copy(flightStateRef.current.desiredTarget);
    }
    const tmpPos = new THREE.Vector3();
    const tmpTarget = new THREE.Vector3();

    // Keyboard input listener
    const updateKey = (code: string, down: boolean) => {
      if (down && overlayOpenRef.current) return;
      const activeTag = document.activeElement?.tagName;
      if (
        down &&
        (activeTag === "INPUT" ||
          activeTag === "TEXTAREA" ||
          activeTag === "SELECT")
      ) {
        return;
      }
      if (code === "KeyW" || code === "ArrowUp") keysRef.current.up = down;
      if (code === "KeyS" || code === "ArrowDown") keysRef.current.down = down;
      if (code === "KeyA" || code === "ArrowLeft") keysRef.current.left = down;
      if (code === "KeyD" || code === "ArrowRight") keysRef.current.right = down;
    };
    const onKeyDown = (e: KeyboardEvent) => updateKey(e.code, true);
    const onKeyUp = (e: KeyboardEvent) => updateKey(e.code, false);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    // Raycast click / drag orbit
    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2();
    let dragging = false;
    let movedDist = 0;
    let lastX = 0;
    let lastY = 0;

    function handleCanvasClick(clientX: number, clientY: number) {
      const f = flightStateRef.current;
      if (f.mode !== "world" && f.mode !== "station") return;

      const rect = renderer.domElement.getBoundingClientRect();
      pointerNdc.x = ((clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1;
      pointerNdc.y = -((clientY - rect.top) / Math.max(1, rect.height)) * 2 + 1;
      raycaster.setFromCamera(pointerNdc, camera);

      const hits = raycaster.intersectObjects(handles.root.children, true);
      for (const hit of hits) {
        let obj: THREE.Object3D | null = hit.object;
        while (obj) {
          if (typeof obj.userData.npcId === "string") {
            callbacksRef.current.onSelectNpc(obj.userData.npcId);
            return;
          }
          if (typeof obj.userData.stationId === "string") {
            callbacksRef.current.onSelectStation(
              obj.userData.stationId as CelestialStationId,
            );
            return;
          }
          obj = obj.parent;
        }
      }

      // Click-to-walk on walkable ground surface
      for (const hit of hits) {
        const pt = hit.point;
        if (pt.y > -0.2 && pt.y < 1.35) {
          const sample = sampleWalkableGround(pt.x, pt.z);
          if (sample.walkable) {
            playerStateRef.current.walkTarget = new THREE.Vector3(pt.x, sample.y, pt.z);
            walkMarker.position.set(pt.x, sample.y + 0.03, pt.z);
            walkMarker.visible = true;
            return;
          }
        }
      }
    }

    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      movedDist = 0;
      lastX = e.clientX;
      lastY = e.clientY;
      renderer.domElement.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (dragging) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        movedDist += Math.hypot(dx, dy);
        lastX = e.clientX;
        lastY = e.clientY;
        const f = flightStateRef.current;
        if (f.mode === "world" || f.mode === "station") {
          if (f.mode === "station") f.mode = "world";
          f.orbitYaw -= dx * 0.0068;
          f.orbitPitch = Math.max(0.08, Math.min(1.05, f.orbitPitch + dy * 0.0052));
        }
        return;
      }

      if (flightStateRef.current.mode === "world" || flightStateRef.current.mode === "station") {
        const rect = renderer.domElement.getBoundingClientRect();
        pointerNdc.x = ((e.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1;
        pointerNdc.y = -((e.clientY - rect.top) / Math.max(1, rect.height)) * 2 + 1;
        raycaster.setFromCamera(pointerNdc, camera);
        const hits = raycaster.intersectObjects(handles.root.children, true);
        let interactive = false;
        for (const hit of hits) {
          let obj: THREE.Object3D | null = hit.object;
          while (obj) {
            if (obj.userData.npcId || obj.userData.stationId) {
              interactive = true;
              break;
            }
            obj = obj.parent;
          }
          if (interactive) break;
        }
        renderer.domElement.style.cursor = interactive ? "pointer" : "grab";
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      const wasClick = dragging && movedDist < 6;
      dragging = false;
      try {
        renderer.domElement.releasePointerCapture(e.pointerId);
      } catch {
        // Ignore if capture was released
      }
      if (wasClick) handleCanvasClick(e.clientX, e.clientY);
    };

    const onWheel = (e: WheelEvent) => {
      const f = flightStateRef.current;
      if (f.mode !== "world" && f.mode !== "station") return;
      e.preventDefault();
      if (f.mode === "station") f.mode = "world";
      f.orbitDist = Math.max(6.2, Math.min(26.0, f.orbitDist + e.deltaY * 0.011));
    };

    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("wheel", onWheel, { passive: false });

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 800;
      const h = Math.max(1, container.clientHeight || 600);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // Animation loop
    let rafId = 0;
    let prevNow = performance.now();

    const animate = (now: number) => {
      rafId = window.requestAnimationFrame(animate);
      const dt = Math.min(0.05, (now - prevNow) * 0.001);
      prevNow = now;
      const elapsed = now * 0.001;
      const motionMul = reducedMotionRef.current ? 0.18 : 1;

      // Atmosphere Lerping (Sky, Fog, Lights & 3-Tier Cloud Sea)
      const targetPreset = ATMOSPHERE_PRESETS[atmosphereRef.current];
      const lerpAlpha = 1 - Math.exp(-3.2 * dt);
      handles.skyUniforms.uSkyTop.value.lerp(targetPreset.skyTop, lerpAlpha);
      handles.skyUniforms.uSkyMid.value.lerp(targetPreset.skyMid, lerpAlpha);
      handles.skyUniforms.uSkyBot.value.lerp(targetPreset.skyBot, lerpAlpha);
      handles.skyUniforms.uAuraColor.value.lerp(targetPreset.aura, lerpAlpha);
      fog.color.lerp(targetPreset.fogColor, lerpAlpha);
      fog.density += (targetPreset.fogDensity - fog.density) * lerpAlpha;
      hemiLight.color.lerp(targetPreset.hemiSky, lerpAlpha);
      hemiLight.groundColor.lerp(targetPreset.hemiGround, lerpAlpha);
      keyLight.color.lerp(targetPreset.sunColor, lerpAlpha);
      keyLight.intensity += (targetPreset.sunIntensity - keyLight.intensity) * lerpAlpha;
      handles.auroraUniforms.uTime.value = elapsed * motionMul;
      handles.auroraUniforms.uOpacity.value +=
        (targetPreset.auroraOpacity - handles.auroraUniforms.uOpacity.value) * lerpAlpha;

      handles.cloudMaterials.primary.color.lerp(targetPreset.cloudPrimary, lerpAlpha);
      handles.cloudMaterials.primary.emissive.lerp(
        targetPreset.cloudEmissivePrimary,
        lerpAlpha,
      );
      handles.cloudMaterials.secondary.color.lerp(targetPreset.cloudSecondary, lerpAlpha);
      handles.cloudMaterials.secondary.emissive.lerp(
        targetPreset.cloudEmissiveSecondary,
        lerpAlpha,
      );
      handles.cloudMaterials.horizon.color.lerp(targetPreset.cloudHorizon, lerpAlpha);

      // Animate Kingdom Props & Clouds
      handles.haloRingOuter.rotation.y = elapsed * 0.25 * motionMul;
      handles.haloRingInner.rotation.y = -elapsed * 0.34 * motionMul;
      handles.chandelier.rotation.y = elapsed * 0.2 * motionMul;
      handles.intertwinedRings.rotation.y = elapsed * 0.48 * motionMul;
      handles.intertwinedRings.position.y =
        2.38 + Math.sin(elapsed * 1.4 * motionMul) * 0.08;
      handles.astrolabe.rotation.y = elapsed * 0.42 * motionMul;
      handles.hourglass.rotation.y = elapsed * 0.28 * motionMul;
      handles.cloudsGroup.rotation.y = elapsed * 0.015 * motionMul;
      handles.stardustPoints.rotation.y = -elapsed * 0.025 * motionMul;

      for (const ms of handles.mistSprites) {
        ms.sprite.position.set(
          ms.baseX + Math.sin(elapsed * 0.22 * motionMul + ms.phase) * 1.2,
          ms.baseY + Math.cos(elapsed * 0.3 * motionMul + ms.phase) * 0.18,
          ms.baseZ,
        );
      }

      // Animate 10 Celestial Doves
      for (const dove of handles.doves) {
        const ang = elapsed * dove.speed * motionMul + dove.phase;
        const nextAng = ang + 0.06;
        const x = dove.centerX + Math.cos(ang) * dove.rx;
        const z = dove.centerZ + Math.sin(ang) * dove.rz;
        const y = dove.centerY + Math.sin(ang * 2 + dove.phase) * 0.45;
        dove.group.position.set(x, y, z);
        const nx = dove.centerX + Math.cos(nextAng) * dove.rx;
        const nz = dove.centerZ + Math.sin(nextAng) * dove.rz;
        dove.group.rotation.y = Math.atan2(nx - x, nz - z);
        const flap = Math.sin(elapsed * 9.5 * motionMul + dove.phase * 3) * 0.52;
        dove.leftWing.rotation.z = flap;
        dove.rightWing.rotation.z = -flap;
      }

      // Animate 5 NPCs & Talk Diamonds
      for (const npc of handles.npcEntities) {
        animateCelestialChibi(npc.rig, 0, dt, elapsed + npc.basePos.x);
        npc.talkIndicator.position.y = 1.56 + Math.sin(elapsed * 2.6 + npc.basePos.z) * 0.06;
        npc.talkIndicator.rotation.y = elapsed * 1.6;
      }

      // Animate Station Beacons
      handles.beacons.forEach((b, id) => {
        const meta = CELESTIAL_STATIONS.find((s) => s.id === id);
        const baseY = meta
          ? id === "altar"
            ? 10.9
            : id === "gerbang"
              ? 5.2
              : 4.2
          : 4.5;
        b.position.y = baseY + Math.sin(elapsed * 2.0 * motionMul + b.position.x) * 0.14;
        b.rotation.y = elapsed * 0.9 * motionMul;
      });

      // Animate Wish Stars
      for (const orb of handles.wishOrbs) {
        if (orb.launching) {
          orb.launching.elapsed += dt;
          const u = Math.min(1, orb.launching.elapsed / orb.launching.duration);
          const e = easeInOutQuint(u);
          const orbitPos = new THREE.Vector3(
            Math.cos(orb.orbitPhase) * orb.orbitRadius,
            orb.baseY,
            Math.sin(orb.orbitPhase) * orb.orbitRadius,
          );
          if (u < 0.5) {
            orb.group.position.lerpVectors(
              orb.launching.startPos,
              orb.launching.peakPos,
              u * 2,
            );
          } else {
            orb.group.position.lerpVectors(
              orb.launching.peakPos,
              orbitPos,
              (u - 0.5) * 2,
            );
          }
          orb.group.scale.setScalar(0.85 + Math.sin(e * Math.PI) * 0.55);
          if (u >= 1) {
            orb.group.scale.setScalar(1);
            orb.launching = undefined;
          }
        } else {
          orb.orbitPhase += orb.orbitSpeed * dt * motionMul;
          orb.group.position.set(
            Math.cos(orb.orbitPhase) * orb.orbitRadius,
            orb.baseY + Math.sin(elapsed * 1.4 * motionMul + orb.bobPhase) * 0.25,
            Math.sin(orb.orbitPhase) * orb.orbitRadius,
          );
        }
        orb.group.rotation.y = elapsed * 0.8 * motionMul;
      }

      // Playable Avatar Walking Update
      const f = flightStateRef.current;
      const ps = playerStateRef.current;
      let moveSpeed = 0;

      if ((f.mode === "world" || f.mode === "station") && !overlayOpenRef.current) {
        const kx = (keysRef.current.right ? 1 : 0) - (keysRef.current.left ? 1 : 0);
        const kz = (keysRef.current.down ? 1 : 0) - (keysRef.current.up ? 1 : 0);
        const jx = joystickRef.current.x;
        const jy = joystickRef.current.y;

        let dirScreenX = kx + jx;
        let dirScreenFwd = -kz + -jy;
        const mag = Math.hypot(dirScreenX, dirScreenFwd);

        if (mag > 0.14) {
          ps.walkTarget = null;
          walkMarker.visible = false;
          if (f.mode === "station") f.mode = "world";

          dirScreenX /= mag;
          dirScreenFwd /= mag;
          const clampedMag = Math.min(1, mag);

          const yaw = f.orbitYaw;
          const fwdX = -Math.sin(yaw);
          const fwdZ = -Math.cos(yaw);
          const rightX = Math.cos(yaw);
          const rightZ = -Math.sin(yaw);

          const worldDx = rightX * dirScreenX + fwdX * dirScreenFwd;
          const worldDz = rightZ * dirScreenX + fwdZ * dirScreenFwd;

          const speed = 3.85 * clampedMag;
          const resolved = resolveWalkStep(
            ps.pos.x,
            ps.pos.z,
            ps.pos.x + worldDx * speed * dt,
            ps.pos.z + worldDz * speed * dt,
          );
          const stepDist = Math.hypot(resolved.x - ps.pos.x, resolved.z - ps.pos.z);
          moveSpeed = stepDist / Math.max(0.001, dt);
          ps.pos.set(resolved.x, resolved.y, resolved.z);
          ps.rotY = lerpAngle(ps.rotY, Math.atan2(worldDx, worldDz), 1 - Math.exp(-12 * dt));
          if (!ps.movedOnce && stepDist > 0.01) {
            ps.movedOnce = true;
            callbacksRef.current.onPlayerMoved?.();
          }
        } else if (ps.walkTarget) {
          const dx = ps.walkTarget.x - ps.pos.x;
          const dz = ps.walkTarget.z - ps.pos.z;
          const dist = Math.hypot(dx, dz);
          if (dist < 0.22) {
            ps.walkTarget = null;
            walkMarker.visible = false;
          } else {
            const speed = 3.6;
            const resolved = resolveWalkStep(
              ps.pos.x,
              ps.pos.z,
              ps.pos.x + (dx / dist) * speed * dt,
              ps.pos.z + (dz / dist) * speed * dt,
            );
            const stepDist = Math.hypot(resolved.x - ps.pos.x, resolved.z - ps.pos.z);
            if (stepDist < 0.005) {
              ps.walkTarget = null;
              walkMarker.visible = false;
            } else {
              moveSpeed = stepDist / Math.max(0.001, dt);
              ps.pos.set(resolved.x, resolved.y, resolved.z);
              ps.rotY = lerpAngle(ps.rotY, Math.atan2(dx, dz), 1 - Math.exp(-12 * dt));
              if (!ps.movedOnce) {
                ps.movedOnce = true;
                callbacksRef.current.onPlayerMoved?.();
              }
            }
          }
        }
      }

      if (walkMarker.visible) {
        walkMarker.rotation.z = elapsed * 2.2;
      }

      if (playerRigRef.current) {
        playerRigRef.current.baseY = ps.pos.y;
        playerRigRef.current.group.position.x = ps.pos.x;
        playerRigRef.current.group.position.z = ps.pos.z;
        playerRigRef.current.group.rotation.y = ps.rotY;
        animateCelestialChibi(playerRigRef.current, moveSpeed, dt, elapsed);
      }

      // Royal Bride & Groom Wave Closeness & Animation
      const coupleDist = Math.hypot(ps.pos.x - 0, ps.pos.z - -1.55);
      const guestCloseness01 = Math.max(0, Math.min(1, 1 - (coupleDist - 1.7) / 4.5));
      animateCelestialWeddingCouple(handles.coupleRig, dt, elapsed, guestCloseness01);

      // Proximity Target Detection (NPC / Couple / Station)
      let foundTarget: CelestialProximityTarget | null = null;
      if (f.mode === "world" || f.mode === "station") {
        let bestDist = Infinity;
        if (coupleDist <= 3.35) {
          bestDist = coupleDist;
          foundTarget = {
            kind: "npc",
            id: "couple-altar",
            label: `Sapa Pengantin ${coupleDisplayRef.current} [E]`,
          };
        }
        for (const npc of CELESTIAL_NPCS) {
          const d = Math.hypot(ps.pos.x - npc.position[0], ps.pos.z - npc.position[2]);
          if (d <= 2.3 && d < bestDist) {
            bestDist = d;
            foundTarget = {
              kind: "npc",
              id: npc.id,
              label: `Sapa ${npc.name} [E]`,
            };
          }
        }
        if (!foundTarget) {
          for (const st of CELESTIAL_STATIONS) {
            const d = Math.hypot(ps.pos.x - st.position[0], ps.pos.z - st.position[2]);
            if (d <= 2.9 && d < bestDist) {
              bestDist = d;
              foundTarget = {
                kind: "station",
                id: st.id,
                label: `Buka ${st.shortLabel} [E]`,
              };
            }
          }
        }
      }

      const prevT = nearestTargetRef.current;
      if (
        prevT?.kind !== foundTarget?.kind ||
        prevT?.id !== foundTarget?.id ||
        prevT?.label !== foundTarget?.label
      ) {
        nearestTargetRef.current = foundTarget;
        callbacksRef.current.onProximityChange(foundTarget);
      }

      // Camera State Machine
      const camDamp = 1 - Math.exp(-6.0 * dt);
      if (f.mode === "cover") {
        f.coverAngle += dt * 0.11 * motionMul;
        tmpPos.set(
          Math.sin(f.coverAngle) * 20.5,
          7.2,
          Math.cos(f.coverAngle) * 20.5,
        );
        tmpTarget.set(0, 1.8, 0);
        liveCamPos.lerp(tmpPos, camDamp);
        liveCamTarget.lerp(tmpTarget, camDamp);
      } else if (f.mode === "intro") {
        f.introElapsed += dt;
        const u = Math.min(1, f.introElapsed / f.introDuration);
        const eased = easeInOutQuint(u);
        dronePosCurve.getPoint(eased, tmpPos);
        droneTargetCurve.getPoint(eased, tmpTarget);
        liveCamPos.lerp(tmpPos, 1 - Math.exp(-7.5 * dt));
        liveCamTarget.lerp(tmpTarget, 1 - Math.exp(-7.5 * dt));
        if (u >= 1) {
          f.mode = "world";
          f.orbitYaw = 0.22;
          f.orbitPitch = 0.28;
          f.orbitDist = 10.6;
          callbacksRef.current.onIntroComplete();
        }
      } else if (f.mode === "world") {
        const horiz = Math.cos(f.orbitPitch) * f.orbitDist;
        tmpTarget.set(ps.pos.x, ps.pos.y + 1.05, ps.pos.z - 0.65);
        tmpPos.set(
          tmpTarget.x + Math.sin(f.orbitYaw) * horiz,
          tmpTarget.y + Math.sin(f.orbitPitch) * f.orbitDist,
          tmpTarget.z + Math.cos(f.orbitYaw) * horiz,
        );
        liveCamPos.lerp(tmpPos, camDamp);
        liveCamTarget.lerp(tmpTarget, camDamp);
      } else if (f.mode === "station") {
        liveCamPos.lerp(f.desiredPos, camDamp);
        liveCamTarget.lerp(f.desiredTarget, camDamp);
      }

      camera.position.copy(liveCamPos);
      camera.lookAt(liveCamTarget);

      renderer.render(scene, camera);
    };

    rafId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("wheel", onWheel);
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      handles.coupleRig.dispose();
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).geometry) {
          (obj as THREE.Mesh).geometry.dispose();
        }
        const mat = (obj as THREE.Mesh).material;
        if (Array.isArray(mat)) {
          mat.forEach((m) => m.dispose());
        } else if (mat) {
          mat.dispose();
        }
      });
      floorTexture.dispose();
      glowTexture.dispose();
      cloudMistTexture.dispose();
      monogram.texture.dispose();
      plaque.texture.dispose();
      renderer.dispose();
      sceneRef.current = null;
      handlesRef.current = null;
      playerRigRef.current = null;
      walkMarkerRef.current = null;
      monogramCanvasRef.current = null;
      plaqueCanvasRef.current = null;
    };
  }, [photoUrls]);

  return <div ref={containerRef} className="relative h-full w-full" />;
});
