"use client";

import type { DesaTimeOfDay } from "@/data/desaWorldData";

export type FootstepSurface = "grass" | "stone" | "wood";
export type DesaMusicTrack = "senja" | "lelagon" | "pagi";

function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

interface ChordBar {
  bass: number;
  pad: number[];
  arp: number[];
  gong?: number;
}

interface MelodyEvent {
  step: number; // eighth-note offset within 128-step (16-bar) loop
  midi: number;
  durEighths: number;
  graceMidi?: number;
  vel?: number;
}

// Track 1: "senja" (Senja di Sawah — 76 BPM D Major Romantic Acoustic & Suling Ballad, 16 bars = 128 eighths)
const SENJA_BARS: ChordBar[] = [
  // Section A
  { bass: 50, pad: [62, 66, 69, 73], arp: [50, 57, 62, 66, 69, 66, 62, 57] }, // Dmaj9
  { bass: 47, pad: [59, 62, 66, 69], arp: [47, 54, 59, 62, 66, 62, 59, 54] }, // Bm7
  { bass: 43, pad: [59, 62, 66, 67], arp: [43, 50, 55, 59, 66, 59, 55, 50] }, // Gmaj7
  { bass: 45, pad: [57, 62, 64, 69], arp: [45, 52, 57, 62, 64, 62, 57, 52] }, // A6sus4
  { bass: 42, pad: [57, 61, 64, 69], arp: [42, 49, 54, 57, 64, 57, 54, 49] }, // F#m7
  { bass: 47, pad: [59, 62, 66, 69], arp: [47, 54, 59, 62, 66, 62, 59, 54] }, // Bm7
  { bass: 40, pad: [59, 62, 66, 67], arp: [40, 47, 52, 55, 62, 55, 52, 47] }, // Em9
  { bass: 45, pad: [57, 62, 64, 67], arp: [45, 52, 57, 62, 64, 67, 64, 62] }, // A9sus4
  // Section B (Lifting Chorus)
  { bass: 43, pad: [59, 62, 66, 71], arp: [43, 50, 55, 59, 66, 67, 66, 59] }, // Gmaj7
  { bass: 45, pad: [61, 64, 66, 69], arp: [45, 52, 57, 61, 64, 66, 64, 61] }, // A6
  { bass: 42, pad: [57, 61, 64, 69], arp: [42, 49, 54, 57, 61, 64, 61, 57] }, // F#m7
  { bass: 47, pad: [59, 62, 66, 69], arp: [47, 54, 59, 62, 66, 69, 66, 62] }, // Bm7
  { bass: 40, pad: [55, 59, 62, 66], arp: [40, 47, 52, 55, 59, 66, 59, 55] }, // Em9
  { bass: 42, pad: [57, 62, 66, 69], arp: [42, 50, 54, 57, 62, 66, 62, 57] }, // D/F#
  { bass: 43, pad: [59, 62, 64, 69], arp: [43, 50, 55, 59, 64, 69, 64, 59] }, // G6/9
  { bass: 45, pad: [57, 62, 64, 69], arp: [45, 52, 57, 62, 64, 61, 57, 52] }, // A7sus4 -> D
];

const SENJA_MELODY: MelodyEvent[] = [
  // Phrased singing bamboo suling melody (leaves room to breathe)
  { step: 2, midi: 74, durEighths: 3, graceMidi: 73 }, // D5
  { step: 5, midi: 78, durEighths: 3 }, // F#5
  { step: 8, midi: 76, durEighths: 4 }, // E5
  { step: 12, midi: 74, durEighths: 4 }, // D5
  { step: 18, midi: 71, durEighths: 3 }, // B4
  { step: 21, midi: 74, durEighths: 3 }, // D5
  { step: 24, midi: 73, durEighths: 6, graceMidi: 71 }, // C#5 hold
  { step: 34, midi: 76, durEighths: 2 }, // E5
  { step: 36, midi: 78, durEighths: 2 }, // F#5
  { step: 38, midi: 81, durEighths: 4 }, // A5
  { step: 42, midi: 78, durEighths: 3 }, // F#5
  { step: 45, midi: 76, durEighths: 3 }, // E5
  { step: 48, midi: 74, durEighths: 5, graceMidi: 76 }, // D5
  { step: 56, midi: 73, durEighths: 6 }, // C#5
  // Section B soaring response
  { step: 66, midi: 79, durEighths: 3, graceMidi: 78 }, // G5
  { step: 69, midi: 78, durEighths: 3 }, // F#5
  { step: 72, midi: 76, durEighths: 3 }, // E5
  { step: 75, midi: 74, durEighths: 5 }, // D5
  { step: 82, midi: 76, durEighths: 3 }, // E5
  { step: 85, midi: 78, durEighths: 3 }, // F#5
  { step: 88, midi: 81, durEighths: 6, graceMidi: 79 }, // A5
  { step: 98, midi: 79, durEighths: 3 }, // G5
  { step: 101, midi: 78, durEighths: 3 }, // F#5
  { step: 104, midi: 74, durEighths: 4 }, // D5
  { step: 108, midi: 71, durEighths: 4 }, // B4
  { step: 114, midi: 76, durEighths: 4, graceMidi: 74 }, // E5
  { step: 118, midi: 74, durEighths: 8 }, // D5 resolve warm
];

// Track 2: "lelagon" (Lelagon Jawa — 64 BPM Serene Pelog Lullaby: D Eb G A Bb)
const LELAGON_BARS: ChordBar[] = [
  { bass: 38, pad: [50, 57, 62, 67], arp: [50, 55, 57, 62, 63, 62, 57, 55], gong: 38 },
  { bass: 39, pad: [51, 58, 63, 67], arp: [51, 55, 58, 63, 67, 63, 58, 55] },
  { bass: 43, pad: [55, 58, 62, 67], arp: [55, 58, 62, 67, 70, 67, 62, 58], gong: 43 },
  { bass: 45, pad: [57, 62, 67, 69], arp: [57, 62, 63, 69, 67, 63, 62, 57] },
  { bass: 46, pad: [58, 62, 67, 70], arp: [58, 62, 67, 70, 74, 70, 67, 62], gong: 46 },
  { bass: 43, pad: [55, 58, 62, 67], arp: [55, 62, 63, 67, 69, 67, 62, 55] },
  { bass: 39, pad: [51, 57, 62, 67], arp: [51, 57, 62, 63, 67, 63, 62, 57] },
  { bass: 45, pad: [57, 62, 63, 69], arp: [57, 62, 67, 69, 67, 63, 62, 50], gong: 38 },
];

const LELAGON_MELODY: MelodyEvent[] = [
  { step: 2, midi: 74, durEighths: 4, graceMidi: 75 }, // D5 with Pelog slide
  { step: 6, midi: 70, durEighths: 4 }, // Bb4
  { step: 11, midi: 69, durEighths: 5, graceMidi: 70 }, // A4
  { step: 18, midi: 67, durEighths: 4 }, // G4
  { step: 22, midi: 63, durEighths: 4 }, // Eb4
  { step: 26, midi: 62, durEighths: 6 }, // D4
  { step: 34, midi: 69, durEighths: 3 }, // A4
  { step: 37, midi: 70, durEighths: 3 }, // Bb4
  { step: 40, midi: 74, durEighths: 5, graceMidi: 75 }, // D5
  { step: 48, midi: 75, durEighths: 4 }, // Eb5
  { step: 52, midi: 74, durEighths: 4 }, // D5
  { step: 56, midi: 69, durEighths: 6, graceMidi: 67 }, // A4
];

// Track 3: "pagi" (Pagi Ceria — 92 BPM Bright G Major Cozy Village Acoustic)
const PAGI_BARS: ChordBar[] = [
  { bass: 43, pad: [59, 62, 67, 71], arp: [43, 50, 55, 59, 62, 67, 62, 59] }, // G
  { bass: 42, pad: [57, 62, 66, 69], arp: [42, 50, 54, 57, 62, 66, 62, 57] }, // D/F#
  { bass: 40, pad: [55, 59, 62, 67], arp: [40, 47, 52, 55, 59, 67, 59, 55] }, // Em7
  { bass: 48, pad: [55, 60, 62, 67], arp: [48, 55, 60, 62, 67, 62, 60, 55] }, // Cadd9
  { bass: 45, pad: [55, 60, 64, 67], arp: [45, 52, 57, 60, 64, 67, 64, 60] }, // Am7
  { bass: 47, pad: [59, 62, 66, 69], arp: [47, 54, 59, 62, 66, 62, 59, 54] }, // Bm7
  { bass: 48, pad: [55, 60, 62, 67], arp: [48, 55, 60, 62, 64, 67, 64, 60] }, // Cadd9
  { bass: 50, pad: [57, 62, 64, 67], arp: [50, 57, 62, 64, 66, 62, 57, 50] }, // Dsus4 -> D
];

const PAGI_MELODY: MelodyEvent[] = [
  { step: 0, midi: 74, durEighths: 2 },
  { step: 2, midi: 76, durEighths: 2 },
  { step: 4, midi: 79, durEighths: 4 },
  { step: 10, midi: 78, durEighths: 3, graceMidi: 79 },
  { step: 13, midi: 74, durEighths: 3 },
  { step: 16, midi: 71, durEighths: 3 },
  { step: 19, midi: 74, durEighths: 3 },
  { step: 24, midi: 72, durEighths: 6 },
  { step: 34, midi: 76, durEighths: 2 },
  { step: 36, midi: 74, durEighths: 2 },
  { step: 38, midi: 71, durEighths: 4 },
  { step: 42, midi: 69, durEighths: 3 },
  { step: 45, midi: 71, durEighths: 3 },
  { step: 48, midi: 72, durEighths: 4 },
  { step: 52, midi: 74, durEighths: 4 },
  { step: 56, midi: 74, durEighths: 6, graceMidi: 76 },
];

/**
 * Spatial procedural Web Audio API soundscape & acoustic studio synthesizer.
 * Renders warm fingerpicked Karplus-Strong kecapi/guitar, expressive bamboo suling
 * flute with breath & vibrato, bowed string beds, soft Javanese gender chimes,
 * stereo hall convolution reverb, and distance-aware nature SFX.
 */
export class DesaAudioEngine {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private musicFilter: BiquadFilterNode | null = null;
  private dryBus: GainNode | null = null;
  private reverbBus: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private riverGain: GainNode | null = null;
  private windGain: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private pluckCache = new Map<number, AudioBuffer>();
  private activeSources: AudioScheduledSourceNode[] = [];

  private schedulerTimer: number | null = null;
  private natureTimer: number | null = null;
  private voiceTimer: number | null = null;

  private musicEnabled = true;
  private sfxEnabled = true;
  private timeOfDay: DesaTimeOfDay = "sore";
  private musicTrack: DesaMusicTrack = "senja";
  private started = false;

  private currentStep = 0;
  private nextStepTime = 0;

  private readonly voiceScale = [349.23, 392.0, 440.0, 523.25, 587.33, 659.25, 698.46, 783.99];

  private ensureContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;

      const ctx = new AudioCtx();
      this.ctx = ctx;

      // Mastering music bus: dry + stereo hall reverb -> warm LP filter -> glue compressor -> master gain
      this.musicGain = ctx.createGain();
      this.musicGain.gain.value = this.musicEnabled ? 0.36 : 0;
      this.musicGain.connect(ctx.destination);

      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.value = -16;
      compressor.knee.value = 24;
      compressor.ratio.value = 3;
      compressor.attack.value = 0.025;
      compressor.release.value = 0.25;
      compressor.connect(this.musicGain);

      this.musicFilter = ctx.createBiquadFilter();
      this.musicFilter.type = "lowpass";
      this.musicFilter.frequency.value = this.getMusicFilterCutoff(this.timeOfDay);
      this.musicFilter.Q.value = 0.55;
      this.musicFilter.connect(compressor);

      this.dryBus = ctx.createGain();
      this.dryBus.gain.value = 0.86;
      this.dryBus.connect(this.musicFilter);

      const convolver = ctx.createConvolver();
      convolver.buffer = this.createHallImpulse(ctx, 2.35);
      this.reverbBus = ctx.createGain();
      this.reverbBus.gain.value = 0.44;
      this.reverbBus.connect(convolver);
      convolver.connect(this.musicFilter);

      // Gentle ambient SFX bus
      this.sfxGain = ctx.createGain();
      this.sfxGain.gain.value = this.sfxEnabled ? 1.0 : 0;
      this.sfxGain.connect(ctx.destination);

      this.initNoiseAndAmbience(ctx);
    }

    if (this.ctx.state === "suspended") {
      void this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private getMusicFilterCutoff(time: DesaTimeOfDay): number {
    if (time === "pagi") return 5200;
    if (time === "malam") return 3100;
    return 4400;
  }

  /**
   * Generates a lush 2.35s stereo hall impulse response with soft high-frequency damping.
   */
  private createHallImpulse(ctx: AudioContext, durationSec: number): AudioBuffer {
    const len = Math.floor(ctx.sampleRate * durationSec);
    const ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = ir.getChannelData(ch);
      let lp = 0;
      for (let i = 0; i < len; i++) {
        const t = i / len;
        // Smooth early-to-late swell then warm exponential tail
        const env = Math.min(1, i / (ctx.sampleRate * 0.03)) * Math.pow(1 - t, 2.6);
        const white = (Math.random() * 2 - 1) * env;
        lp = lp * 0.62 + white * 0.38;
        data[i] = lp * 0.45;
      }
    }
    return ir;
  }

  /**
   * Pre-synthesizes warm acoustic nylon / kecapi Karplus-Strong plucked string buffers.
   */
  private getPluckBuffer(ctx: AudioContext, freq: number): AudioBuffer {
    const cacheKey = Math.round(freq * 10);
    const cached = this.pluckCache.get(cacheKey);
    if (cached) return cached;

    const dur = 1.75;
    const len = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const out = buf.getChannelData(0);

    const period = Math.max(2, Math.round(ctx.sampleRate / freq));
    const ring = new Float32Array(period);
    // Warm finger-plucked excitation: smoothed noise + gentle fundamental triangle core
    let smooth = 0;
    for (let i = 0; i < period; i++) {
      const raw = (Math.random() * 2 - 1) * 0.65;
      smooth = smooth * 0.45 + raw * 0.55;
      const tri = (1 - Math.abs((i / period) * 4 - 2)) * 0.4;
      ring[i] = smooth + tri;
    }

    let ptr = 0;
    const damping = 0.9942;
    let bodyLp = 0;
    for (let i = 0; i < len; i++) {
      const nextPtr = (ptr + 1) % period;
      const cur = ring[ptr];
      const nxt = ring[nextPtr];
      // Asymmetric warm plucked string dispersion
      ring[ptr] = (0.52 * cur + 0.48 * nxt) * damping;
      bodyLp = bodyLp * 0.24 + ring[ptr] * 0.76;
      const fadeEnd = i > len - 1800 ? (len - i) / 1800 : 1;
      out[i] = bodyLp * fadeEnd * 0.72;
      ptr = nextPtr;
    }

    this.pluckCache.set(cacheKey, buf);
    return buf;
  }

  private initNoiseAndAmbience(ctx: AudioContext): void {
    if (!this.sfxGain) return;

    const len = ctx.sampleRate * 3;
    const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0;
    let b1 = 0;
    let b2 = 0;
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99765 * b0 + white * 0.099046;
      b1 = 0.963 * b1 + white * 0.2965164;
      b2 = 0.57 * b2 + white * 1.0526913;
      data[i] = (b0 + b1 + b2 + white * 0.1848) * 0.075;
    }
    this.noiseBuffer = buffer;

    // 1. Subtle gentle breeze (balanced cleanly underneath the acoustic score)
    const windSrc = ctx.createBufferSource();
    windSrc.buffer = buffer;
    windSrc.loop = true;

    const windFilter = ctx.createBiquadFilter();
    windFilter.type = "lowpass";
    windFilter.frequency.value = 360;
    windFilter.Q.value = 0.65;

    this.windGain = ctx.createGain();
    this.windGain.gain.value = 0.025;

    const windLfo = ctx.createOscillator();
    windLfo.type = "sine";
    windLfo.frequency.value = 0.1;
    const windLfoGain = ctx.createGain();
    windLfoGain.gain.value = 0.011;
    windLfo.connect(windLfoGain);
    windLfoGain.connect(this.windGain.gain);

    windSrc.connect(windFilter);
    windFilter.connect(this.windGain);
    this.windGain.connect(this.sfxGain);
    windSrc.start();
    windLfo.start();
    this.activeSources.push(windSrc, windLfo);

    // 2. Spatial river stream (scaled gently by distance to bridge water)
    const riverSrc = ctx.createBufferSource();
    riverSrc.buffer = buffer;
    riverSrc.loop = true;

    const riverFilter = ctx.createBiquadFilter();
    riverFilter.type = "bandpass";
    riverFilter.frequency.value = 620;
    riverFilter.Q.value = 1.0;

    this.riverGain = ctx.createGain();
    this.riverGain.gain.value = 0.014;

    riverSrc.connect(riverFilter);
    riverFilter.connect(this.riverGain);
    this.riverGain.connect(this.sfxGain);
    riverSrc.start();
    this.activeSources.push(riverSrc);
  }

  public start(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    if (this.started) return;
    this.started = true;

    this.currentStep = 0;
    this.nextStepTime = ctx.currentTime + 0.06;

    // Precision lookahead musical scheduler (60ms tick, 180ms lookahead)
    this.tickScheduler();
    this.schedulerTimer = window.setInterval(() => {
      this.tickScheduler();
    }, 60);

    this.scheduleNatureSound();
    this.natureTimer = window.setInterval(() => {
      this.scheduleNatureSound();
    }, 3200);
  }

  public setEnabled(next: boolean): void {
    this.setMusicEnabled(next);
  }

  public setMusicEnabled(next: boolean): void {
    this.musicEnabled = next;
    if (this.musicGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.musicGain.gain.cancelScheduledValues(now);
      this.musicGain.gain.setTargetAtTime(next ? 0.36 : 0, now, 0.14);
    }
    if (next && !this.started) {
      this.start();
    }
  }

  public setSfxEnabled(next: boolean): void {
    this.sfxEnabled = next;
    if (this.sfxGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.sfxGain.gain.cancelScheduledValues(now);
      this.sfxGain.gain.setTargetAtTime(next ? 1.0 : 0, now, 0.1);
    }
  }

  public setTimeOfDay(time: DesaTimeOfDay): void {
    this.timeOfDay = time;
    if (this.musicFilter && this.ctx) {
      this.musicFilter.frequency.setTargetAtTime(
        this.getMusicFilterCutoff(time),
        this.ctx.currentTime,
        0.5,
      );
    }
  }

  public setMusicTrack(track: DesaMusicTrack): void {
    if (this.musicTrack === track) return;
    this.musicTrack = track;
    this.currentStep = 0;
    if (this.ctx) {
      this.nextStepTime = Math.max(this.nextStepTime, this.ctx.currentTime + 0.08);
    }
  }

  public setRiverProximity(closeness01: number): void {
    if (!this.riverGain || !this.ctx) return;
    const clamped = Math.min(1, Math.max(0, closeness01));
    const targetGain = 0.014 + clamped * clamped * 0.15;
    this.riverGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.16);
  }

  private tickScheduler(): void {
    if (!this.ctx || !this.musicEnabled || this.ctx.state !== "running") {
      if (this.ctx) {
        this.nextStepTime = Math.max(this.nextStepTime, this.ctx.currentTime + 0.06);
      }
      return;
    }

    const bpm = this.musicTrack === "pagi" ? 92 : this.musicTrack === "lelagon" ? 64 : 76;
    const eighthSec = 60 / bpm / 2;
    const horizon = this.ctx.currentTime + 0.18;

    while (this.nextStepTime < horizon) {
      this.scheduleStepAt(this.currentStep, this.nextStepTime, eighthSec);
      this.nextStepTime += eighthSec;
      this.currentStep += 1;
    }
  }

  private scheduleStepAt(globalStep: number, time: number, eighthSec: number): void {
    const ctx = this.ctx;
    if (!ctx || !this.dryBus || !this.reverbBus) return;

    const bars =
      this.musicTrack === "lelagon"
        ? LELAGON_BARS
        : this.musicTrack === "pagi"
          ? PAGI_BARS
          : SENJA_BARS;
    const melody =
      this.musicTrack === "lelagon"
        ? LELAGON_MELODY
        : this.musicTrack === "pagi"
          ? PAGI_MELODY
          : SENJA_MELODY;

    const loopEighths = bars.length * 8;
    const loopStep = globalStep % loopEighths;
    const barIdx = Math.floor(loopStep / 8);
    const stepInBar = loopStep % 8;
    const bar = bars[barIdx];

    // Subtle organic timing humanization (±6ms) so arpeggios feel hand-played
    const humanTime = Math.max(ctx.currentTime + 0.01, time + (Math.random() - 0.5) * 0.012);

    // 1. Acoustic Fingerpicked Guitar / Kecapi Arpeggio every eighth note
    const arpMidi = bar.arp[stepInBar];
    if (arpMidi) {
      const vel = stepInBar === 0 ? 0.42 : stepInBar % 2 === 0 ? 0.31 : 0.24;
      this.triggerAcousticPluck(ctx, midiToFreq(arpMidi), humanTime, vel, -0.22);
    }

    // 2. Warm Lush Pad Chords & Upright Bass on Bar Downbeat
    if (stepInBar === 0) {
      const barDur = eighthSec * 8;
      this.triggerWarmBass(ctx, midiToFreq(bar.bass), humanTime, barDur * 0.92, 0.32);
      this.triggerWarmStringPad(
        ctx,
        bar.pad.map(midiToFreq),
        humanTime,
        barDur,
        this.musicTrack === "lelagon" ? 0.11 : 0.13,
      );
      if (bar.gong) {
        this.triggerSoftGong(ctx, midiToFreq(bar.gong - 12), humanTime, barDur * 1.4, 0.18);
      }
    }

    // 3. Soft Javanese Gender / Bell Shimmer accent at bar midpoint / phrase ends
    if (
      (stepInBar === 4 && barIdx % 2 === 1) ||
      (this.musicTrack === "lelagon" && stepInBar === 6)
    ) {
      const shimmerMidi = bar.pad[(stepInBar + barIdx) % bar.pad.length] + 12;
      this.triggerGenderChime(ctx, midiToFreq(shimmerMidi), humanTime + 0.01, 0.13, 0.25);
    }

    // 4. Expressive Bamboo Suling / Warm Flute Melody
    for (const ev of melody) {
      if (ev.step === loopStep) {
        this.triggerExpressiveFlute(
          ctx,
          midiToFreq(ev.midi),
          ev.graceMidi ? midiToFreq(ev.graceMidi) : undefined,
          humanTime,
          ev.durEighths * eighthSec,
          ev.vel ?? 0.28,
        );
      }
    }
  }

  private triggerAcousticPluck(
    ctx: AudioContext,
    freq: number,
    time: number,
    vel: number,
    panVal: number,
  ): void {
    if (!this.dryBus || !this.reverbBus) return;
    const buf = this.getPluckBuffer(ctx, freq);
    const src = ctx.createBufferSource();
    src.buffer = buf;

    const g = ctx.createGain();
    g.gain.setValueAtTime(vel, time);

    const pan = ctx.createStereoPanner();
    pan.pan.value = panVal;

    const send = ctx.createGain();
    send.gain.value = 0.55;

    src.connect(g);
    g.connect(pan);
    pan.connect(this.dryBus);
    pan.connect(send);
    send.connect(this.reverbBus);

    src.start(time);
  }

  private triggerExpressiveFlute(
    ctx: AudioContext,
    freq: number,
    graceFreq: number | undefined,
    time: number,
    dur: number,
    vel: number,
  ): void {
    if (!this.dryBus || !this.reverbBus) return;
    const stopAt = time + dur + 0.22;

    const fund = ctx.createOscillator();
    fund.type = "sine";

    const harm = ctx.createOscillator();
    harm.type = "sine";

    if (graceFreq) {
      fund.frequency.setValueAtTime(graceFreq, time);
      fund.frequency.exponentialRampToValueAtTime(freq, time + 0.09);
      harm.frequency.setValueAtTime(graceFreq * 2, time);
      harm.frequency.exponentialRampToValueAtTime(freq * 2, time + 0.09);
    } else {
      fund.frequency.setValueAtTime(freq * 0.985, time);
      fund.frequency.exponentialRampToValueAtTime(freq, time + 0.055);
      harm.frequency.setValueAtTime(freq * 1.97, time);
      harm.frequency.exponentialRampToValueAtTime(freq * 2, time + 0.055);
    }

    // Gentle delayed vibrato so sustained phrases breathe naturally
    const vib = ctx.createOscillator();
    vib.type = "sine";
    vib.frequency.value = 4.7;
    const vibGain = ctx.createGain();
    vibGain.gain.setValueAtTime(0.0001, time);
    vibGain.gain.linearRampToValueAtTime(0.0001, time + Math.min(0.2, dur * 0.3));
    vibGain.gain.linearRampToValueAtTime(freq * 0.009, time + Math.min(0.55, dur * 0.7));
    vib.connect(vibGain);
    vibGain.connect(fund.frequency);

    const harmGain = ctx.createGain();
    harmGain.gain.value = 0.14;
    harm.connect(harmGain);

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, time);
    env.gain.linearRampToValueAtTime(vel, time + Math.min(0.14, dur * 0.25));
    env.gain.setValueAtTime(vel * 0.88, time + dur * 0.72);
    env.gain.exponentialRampToValueAtTime(0.0001, stopAt - 0.02);

    const pan = ctx.createStereoPanner();
    pan.pan.value = 0.18;

    const send = ctx.createGain();
    send.gain.value = 0.85;

    fund.connect(env);
    harmGain.connect(env);
    env.connect(pan);
    pan.connect(this.dryBus);
    pan.connect(send);
    send.connect(this.reverbBus);

    // Subtle organic bamboo breath chiff on note attack
    if (this.noiseBuffer) {
      const puff = ctx.createBufferSource();
      puff.buffer = this.noiseBuffer;
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = freq * 2.2;
      bp.Q.value = 2.0;
      const pEnv = ctx.createGain();
      pEnv.gain.setValueAtTime(0.0001, time);
      pEnv.gain.linearRampToValueAtTime(vel * 0.16, time + 0.02);
      pEnv.gain.exponentialRampToValueAtTime(0.0001, time + 0.09);
      puff.connect(bp);
      bp.connect(pEnv);
      pEnv.connect(pan);
      puff.start(time, Math.random() * 1.2, 0.11);
    }

    fund.start(time);
    harm.start(time);
    vib.start(time);
    fund.stop(stopAt);
    harm.stop(stopAt);
    vib.stop(stopAt);
  }

  private triggerWarmStringPad(
    ctx: AudioContext,
    freqs: number[],
    time: number,
    dur: number,
    vel: number,
  ): void {
    if (!this.dryBus || !this.reverbBus) return;
    const attack = Math.min(0.85, dur * 0.3);
    const stopAt = time + dur + 0.9;

    const padBus = ctx.createGain();
    padBus.gain.setValueAtTime(0.0001, time);
    padBus.gain.linearRampToValueAtTime(vel / Math.sqrt(freqs.length), time + attack);
    padBus.gain.setValueAtTime((vel * 0.85) / Math.sqrt(freqs.length), time + dur * 0.78);
    padBus.gain.exponentialRampToValueAtTime(0.0001, stopAt - 0.02);

    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 1450;

    padBus.connect(lp);
    lp.connect(this.reverbBus);
    const dryTap = ctx.createGain();
    dryTap.gain.value = 0.45;
    lp.connect(dryTap);
    dryTap.connect(this.dryBus);

    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      osc.type = idx % 2 === 0 ? "triangle" : "sine";
      osc.frequency.setValueAtTime(f, time);
      osc.detune.setValueAtTime(idx % 2 === 0 ? -4 : 4, time);
      osc.connect(padBus);
      osc.start(time);
      osc.stop(stopAt);
    });
  }

  private triggerWarmBass(
    ctx: AudioContext,
    freq: number,
    time: number,
    dur: number,
    vel: number,
  ): void {
    if (!this.dryBus) return;
    const stopAt = time + dur + 0.25;
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, time);

    const sub = ctx.createOscillator();
    sub.type = "sine";
    sub.frequency.setValueAtTime(freq, time);

    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(520, time);
    lp.frequency.exponentialRampToValueAtTime(210, time + dur * 0.6);

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, time);
    env.gain.linearRampToValueAtTime(vel, time + 0.035);
    env.gain.exponentialRampToValueAtTime(0.0001, stopAt - 0.02);

    osc.connect(lp);
    sub.connect(lp);
    lp.connect(env);
    env.connect(this.dryBus);

    osc.start(time);
    sub.start(time);
    osc.stop(stopAt);
    sub.stop(stopAt);
  }

  private triggerGenderChime(
    ctx: AudioContext,
    freq: number,
    time: number,
    vel: number,
    panVal: number,
  ): void {
    if (!this.dryBus || !this.reverbBus) return;
    const stopAt = time + 1.45;

    const fund = ctx.createOscillator();
    fund.type = "sine";
    fund.frequency.setValueAtTime(freq, time);

    const over = ctx.createOscillator();
    over.type = "sine";
    over.frequency.setValueAtTime(freq * 2.0, time);
    const overGain = ctx.createGain();
    overGain.gain.value = 0.22;
    over.connect(overGain);

    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 2200;

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, time);
    env.gain.linearRampToValueAtTime(vel, time + 0.015);
    env.gain.exponentialRampToValueAtTime(0.0001, stopAt - 0.02);

    const pan = ctx.createStereoPanner();
    pan.pan.value = panVal;

    fund.connect(lp);
    overGain.connect(lp);
    lp.connect(env);
    env.connect(pan);
    pan.connect(this.dryBus);
    pan.connect(this.reverbBus);

    fund.start(time);
    over.start(time);
    fund.stop(stopAt);
    over.stop(stopAt);
  }

  private triggerSoftGong(
    ctx: AudioContext,
    freq: number,
    time: number,
    dur: number,
    vel: number,
  ): void {
    if (!this.reverbBus || !this.dryBus) return;
    const stopAt = time + Math.min(dur, 3.2);
    const fund = ctx.createOscillator();
    fund.type = "sine";
    fund.frequency.setValueAtTime(freq, time);

    const det = ctx.createOscillator();
    det.type = "sine";
    det.frequency.setValueAtTime(freq * 1.008, time);

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, time);
    env.gain.linearRampToValueAtTime(vel, time + 0.08);
    env.gain.exponentialRampToValueAtTime(0.0001, stopAt - 0.02);

    fund.connect(env);
    det.connect(env);
    env.connect(this.dryBus);
    env.connect(this.reverbBus);

    fund.start(time);
    det.start(time);
    fund.stop(stopAt);
    det.stop(stopAt);
  }

  private scheduleNatureSound(): void {
    if (!this.sfxEnabled || !this.ctx || !this.sfxGain) return;
    if (this.ctx.state !== "running") return;
    if (Math.random() > 0.6) return;

    const now = this.ctx.currentTime;
    if (this.timeOfDay === "malam") {
      for (let i = 0; i < 3; i++) {
        const osc = this.ctx.createOscillator();
        const env = this.ctx.createGain();
        const st = now + i * 0.09;
        osc.type = "sine";
        osc.frequency.setValueAtTime(3850 + (i % 2) * 140, st);
        env.gain.setValueAtTime(0.0001, st);
        env.gain.linearRampToValueAtTime(0.011, st + 0.015);
        env.gain.exponentialRampToValueAtTime(0.0001, st + 0.065);
        osc.connect(env);
        env.connect(this.sfxGain);
        osc.start(st);
        osc.stop(st + 0.08);
      }
    } else {
      const baseFreq = this.timeOfDay === "pagi" ? 1850 : 1550;
      const chirp = (offset: number, f1: number, f2: number, dur: number) => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const env = this.ctx.createGain();
        const st = now + offset;
        osc.type = "sine";
        osc.frequency.setValueAtTime(f1, st);
        osc.frequency.exponentialRampToValueAtTime(f2, st + dur);
        env.gain.setValueAtTime(0.0001, st);
        env.gain.linearRampToValueAtTime(0.016, st + 0.02);
        env.gain.exponentialRampToValueAtTime(0.0001, st + dur);
        osc.connect(env);
        env.connect(this.sfxGain);
        osc.start(st);
        osc.stop(st + dur + 0.02);
      };
      const shift = Math.random() * 280;
      chirp(0, baseFreq + shift, baseFreq + shift + 420, 0.11);
      chirp(0.16, baseFreq + shift + 220, baseFreq + shift + 620, 0.14);
    }
  }

  public playFootstep(surface: FootstepSurface): void {
    if (!this.sfxEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxGain || ctx.state !== "running") return;

    const now = ctx.currentTime;
    const jitter = 0.92 + Math.random() * 0.16;

    const thump = ctx.createOscillator();
    const thumpEnv = ctx.createGain();
    thump.type = surface === "wood" ? "triangle" : "sine";
    const fStart = surface === "wood" ? 185 * jitter : surface === "stone" ? 225 * jitter : 130 * jitter;
    const fEnd = surface === "wood" ? 95 : surface === "stone" ? 105 : 65;
    thump.frequency.setValueAtTime(fStart, now);
    thump.frequency.exponentialRampToValueAtTime(fEnd, now + 0.065);
    thumpEnv.gain.setValueAtTime(0.001, now);
    thumpEnv.gain.linearRampToValueAtTime(surface === "wood" ? 0.075 : surface === "stone" ? 0.05 : 0.032, now + 0.008);
    thumpEnv.gain.exponentialRampToValueAtTime(0.001, now + 0.075);
    thump.connect(thumpEnv);
    thumpEnv.connect(this.sfxGain);
    thump.start(now);
    thump.stop(now + 0.09);

    if (this.noiseBuffer) {
      const nSrc = ctx.createBufferSource();
      nSrc.buffer = this.noiseBuffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value =
        surface === "grass" ? 2100 * jitter : surface === "stone" ? 1200 * jitter : 640 * jitter;
      filter.Q.value = surface === "wood" ? 2.4 : 1.3;

      const nEnv = ctx.createGain();
      const peak = surface === "grass" ? 0.13 : surface === "stone" ? 0.1 : 0.06;
      nEnv.gain.setValueAtTime(0.001, now);
      nEnv.gain.linearRampToValueAtTime(peak, now + 0.01);
      nEnv.gain.exponentialRampToValueAtTime(0.001, now + 0.085);

      nSrc.connect(filter);
      filter.connect(nEnv);
      nEnv.connect(this.sfxGain);
      nSrc.start(now, Math.random() * 1.8, 0.1);
    }
  }

  public playProximityHover(): void {
    if (!this.sfxEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxGain || ctx.state !== "running") return;
    const now = ctx.currentTime;
    [659.25, 987.77].forEach((freq, idx) => {
      if (!this.sfxGain) return;
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      const st = now + idx * 0.045;
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, st);
      env.gain.setValueAtTime(0.0001, st);
      env.gain.linearRampToValueAtTime(0.03, st + 0.015);
      env.gain.exponentialRampToValueAtTime(0.0001, st + 0.24);
      osc.connect(env);
      env.connect(this.sfxGain);
      osc.start(st);
      osc.stop(st + 0.26);
    });
  }

  public playDroneWhoosh(): void {
    if (!this.sfxEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxGain || !this.noiseBuffer) return;
    const now = ctx.currentTime;

    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    src.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(240, now);
    filter.frequency.exponentialRampToValueAtTime(760, now + 1.1);
    filter.frequency.exponentialRampToValueAtTime(320, now + 2.4);
    filter.Q.value = 1.4;

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.001, now);
    env.gain.linearRampToValueAtTime(0.2, now + 0.65);
    env.gain.exponentialRampToValueAtTime(0.001, now + 2.45);

    src.connect(filter);
    filter.connect(env);
    env.connect(this.sfxGain);
    src.start(now);
    src.stop(now + 2.5);
  }

  public playModalOpen(): void {
    if (!this.sfxEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxGain) return;
    const now = ctx.currentTime;
    [523.25, 659.25].forEach((freq, i) => {
      if (!this.sfxGain) return;
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      const st = now + i * 0.05;
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, st);
      env.gain.setValueAtTime(0.0001, st);
      env.gain.linearRampToValueAtTime(0.042, st + 0.02);
      env.gain.exponentialRampToValueAtTime(0.0001, st + 0.22);
      osc.connect(env);
      env.connect(this.sfxGain);
      osc.start(st);
      osc.stop(st + 0.24);
    });
  }

  public playModalClose(): void {
    if (!this.sfxEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxGain) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, now);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.14);
    env.gain.setValueAtTime(0.0001, now);
    env.gain.linearRampToValueAtTime(0.036, now + 0.015);
    env.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
    osc.connect(env);
    env.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.18);
  }

  public playTap(): void {
    if (!this.sfxEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxGain) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(660, now + 0.08);
    env.gain.setValueAtTime(0.001, now);
    env.gain.linearRampToValueAtTime(0.04, now + 0.015);
    env.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
    osc.connect(env);
    env.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.16);
  }

  public playGateOpen(): void {
    if (!this.sfxEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxGain) return;
    const now = ctx.currentTime;
    [392, 493.88, 587.33, 783.99].forEach((freq, i) => {
      if (!this.sfxGain) return;
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      const start = now + i * 0.09;
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, start);
      env.gain.setValueAtTime(0.001, start);
      env.gain.linearRampToValueAtTime(0.046, start + 0.03);
      env.gain.exponentialRampToValueAtTime(0.001, start + 0.65);
      osc.connect(env);
      env.connect(this.sfxGain);
      osc.start(start);
      osc.stop(start + 0.7);
    });
  }

  public playDialogueBlip(): void {
    if (!this.sfxEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxGain) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(460, now);
    osc.frequency.linearRampToValueAtTime(610, now + 0.06);
    env.gain.setValueAtTime(0.001, now);
    env.gain.linearRampToValueAtTime(0.035, now + 0.01);
    env.gain.exponentialRampToValueAtTime(0.001, now + 0.11);
    osc.connect(env);
    env.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.13);
  }

  public playReveal(): void {
    if (!this.sfxEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxGain) return;
    const now = ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      if (!this.sfxGain) return;
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      const start = now + i * 0.07;
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, start);
      env.gain.setValueAtTime(0.001, start);
      env.gain.linearRampToValueAtTime(0.04, start + 0.02);
      env.gain.exponentialRampToValueAtTime(0.001, start + 0.45);
      osc.connect(env);
      env.connect(this.sfxGain);
      osc.start(start);
      osc.stop(start + 0.5);
    });
  }

  public startVoicePreview(durationSec: number, onTick: (sec: number) => void, onEnd: () => void): void {
    this.stopVoicePreview();
    this.ensureContext();
    let current = 0;
    onTick(0);
    this.voiceTimer = window.setInterval(() => {
      current += 1;
      onTick(current);
      if (this.sfxEnabled && this.ctx && this.sfxGain && current % 2 === 1) {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const env = this.ctx.createGain();
        const note = this.voiceScale[(current + 2) % this.voiceScale.length];
        osc.type = "sine";
        osc.frequency.setValueAtTime(note, now);
        env.gain.setValueAtTime(0.001, now);
        env.gain.linearRampToValueAtTime(0.04, now + 0.08);
        env.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        osc.connect(env);
        env.connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 0.85);
      }
      if (current >= durationSec) {
        this.stopVoicePreview();
        onEnd();
      }
    }, 1000);
  }

  public stopVoicePreview(): void {
    if (this.voiceTimer !== null) {
      window.clearInterval(this.voiceTimer);
      this.voiceTimer = null;
    }
  }

  public dispose(): void {
    this.stopVoicePreview();
    if (this.schedulerTimer !== null) {
      window.clearInterval(this.schedulerTimer);
      this.schedulerTimer = null;
    }
    if (this.natureTimer !== null) {
      window.clearInterval(this.natureTimer);
      this.natureTimer = null;
    }
    for (const src of this.activeSources) {
      try {
        src.stop();
        src.disconnect();
      } catch {
        // Ignore already stopped sources
      }
    }
    this.activeSources = [];
    this.pluckCache.clear();
    if (this.ctx) {
      void this.ctx.close().catch(() => {});
      this.ctx = null;
    }
    this.musicGain = null;
    this.musicFilter = null;
    this.dryBus = null;
    this.reverbBus = null;
    this.sfxGain = null;
    this.riverGain = null;
    this.windGain = null;
    this.noiseBuffer = null;
    this.started = false;
  }
}
