"use client";

import type { DesaTimeOfDay } from "@/data/desaWorldData";

export type FootstepSurface = "grass" | "stone" | "wood";

/**
 * Spatial procedural Web Audio API synthesizer for the 3D invitation experience.
 * Generates pentatonic background music, outdoor breeze, proximity-scaled river water,
 * time-of-day birdsong/crickets, surface-aware footsteps, and depth interaction SFX
 * with zero external audio file dependencies.
 */
export class DesaAudioEngine {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private riverGain: GainNode | null = null;
  private windGain: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private activeSources: AudioScheduledSourceNode[] = [];

  private loopTimer: number | null = null;
  private natureTimer: number | null = null;
  private voiceTimer: number | null = null;

  private musicEnabled = true;
  private sfxEnabled = true;
  private timeOfDay: DesaTimeOfDay = "sore";
  private started = false;
  private step = 0;

  // Pelog-inspired warm pentatonic frequencies (Hz) around F4-A5
  private readonly scale = [349.23, 392.0, 440.0, 523.25, 587.33, 659.25, 698.46, 783.99];
  private readonly pattern = [0, 2, 4, 3, 5, 4, 2, 1, 0, 3, 5, 6, 4, 2, 3, 1];
  private readonly bass = [174.61, 174.61, 196.0, 196.0, 146.83, 146.83, 130.81, 164.81];

  private ensureContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;

      this.ctx = new AudioCtx();
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = this.musicEnabled ? 0.13 : 0;
      this.musicGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = this.sfxEnabled ? 1.0 : 0;
      this.sfxGain.connect(this.ctx.destination);

      this.initNoiseAndAmbience(this.ctx);
    }
    if (this.ctx.state === "suspended") {
      void this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private initNoiseAndAmbience(ctx: AudioContext): void {
    if (!this.sfxGain) return;

    // 3-second smooth pink-ish noise buffer shared across wind, river, & footsteps
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
      data[i] = (b0 + b1 + b2 + white * 0.1848) * 0.08;
    }
    this.noiseBuffer = buffer;

    // 1. Outdoor gentle wind breeze
    const windSrc = ctx.createBufferSource();
    windSrc.buffer = buffer;
    windSrc.loop = true;

    const windFilter = ctx.createBiquadFilter();
    windFilter.type = "lowpass";
    windFilter.frequency.value = 420;
    windFilter.Q.value = 0.7;

    this.windGain = ctx.createGain();
    this.windGain.gain.value = 0.045;

    const windLfo = ctx.createOscillator();
    windLfo.type = "sine";
    windLfo.frequency.value = 0.11;
    const windLfoGain = ctx.createGain();
    windLfoGain.gain.value = 0.022;
    windLfo.connect(windLfoGain);
    windLfoGain.connect(this.windGain.gain);

    windSrc.connect(windFilter);
    windFilter.connect(this.windGain);
    this.windGain.connect(this.sfxGain);
    windSrc.start();
    windLfo.start();
    this.activeSources.push(windSrc, windLfo);

    // 2. Spatial river stream (scaled live by distance to stream)
    const riverSrc = ctx.createBufferSource();
    riverSrc.buffer = buffer;
    riverSrc.loop = true;

    const riverFilter = ctx.createBiquadFilter();
    riverFilter.type = "bandpass";
    riverFilter.frequency.value = 680;
    riverFilter.Q.value = 1.1;

    this.riverGain = ctx.createGain();
    this.riverGain.gain.value = 0.03;

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

    this.scheduleNextNote();
    this.loopTimer = window.setInterval(() => {
      this.scheduleNextNote();
    }, 620);

    this.scheduleNatureSound();
    this.natureTimer = window.setInterval(() => {
      this.scheduleNatureSound();
    }, 2800);
  }

  public setEnabled(next: boolean): void {
    this.setMusicEnabled(next);
  }

  public setMusicEnabled(next: boolean): void {
    this.musicEnabled = next;
    if (this.musicGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.musicGain.gain.cancelScheduledValues(now);
      this.musicGain.gain.setTargetAtTime(next ? 0.13 : 0, now, 0.08);
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
      this.sfxGain.gain.setTargetAtTime(next ? 1.0 : 0, now, 0.08);
    }
  }

  public setTimeOfDay(time: DesaTimeOfDay): void {
    this.timeOfDay = time;
  }

  public setRiverProximity(closeness01: number): void {
    if (!this.riverGain || !this.ctx) return;
    const clamped = Math.min(1, Math.max(0, closeness01));
    const targetGain = 0.018 + clamped * clamped * 0.22;
    this.riverGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.15);
  }

  private scheduleNatureSound(): void {
    if (!this.sfxEnabled || !this.ctx || !this.sfxGain) return;
    if (this.ctx.state !== "running") return;
    if (Math.random() > 0.65) return;

    const now = this.ctx.currentTime;
    if (this.timeOfDay === "malam") {
      // Soft rhythmic night cricket pulses
      for (let i = 0; i < 3; i++) {
        const osc = this.ctx.createOscillator();
        const env = this.ctx.createGain();
        const st = now + i * 0.09;
        osc.type = "sine";
        osc.frequency.setValueAtTime(3950 + (i % 2) * 140, st);
        env.gain.setValueAtTime(0.0001, st);
        env.gain.linearRampToValueAtTime(0.014, st + 0.015);
        env.gain.exponentialRampToValueAtTime(0.0001, st + 0.065);
        osc.connect(env);
        env.connect(this.sfxGain);
        osc.start(st);
        osc.stop(st + 0.08);
      }
    } else {
      // Gentle two-note tropical bird chirp
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
        env.gain.linearRampToValueAtTime(0.02, st + 0.02);
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

  private scheduleNextNote(): void {
    if (!this.musicEnabled || !this.ctx || !this.musicGain) return;
    if (this.ctx.state !== "running") return;

    const now = this.ctx.currentTime;
    const idx = this.pattern[this.step % this.pattern.length];
    const freq = this.scale[idx];

    // Gentle kalimba/siter pluck
    const osc = this.ctx.createOscillator();
    const env = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, now);

    env.gain.setValueAtTime(0.001, now);
    env.gain.exponentialRampToValueAtTime(0.32, now + 0.03);
    env.gain.exponentialRampToValueAtTime(0.001, now + 0.72);

    osc.connect(env);
    env.connect(this.musicGain);
    osc.start(now);
    osc.stop(now + 0.75);

    // Subtle soft bamboo flute/pad drone on downbeats
    if (this.step % 2 === 0) {
      const bassFreq = this.bass[(this.step / 2) % this.bass.length];
      const pad = this.ctx.createOscillator();
      const padEnv = this.ctx.createGain();
      pad.type = "sine";
      pad.frequency.setValueAtTime(bassFreq, now);

      padEnv.gain.setValueAtTime(0.001, now);
      padEnv.gain.linearRampToValueAtTime(0.22, now + 0.25);
      padEnv.gain.exponentialRampToValueAtTime(0.001, now + 1.25);

      pad.connect(padEnv);
      padEnv.connect(this.musicGain);
      pad.start(now);
      pad.stop(now + 1.3);
    }

    this.step += 1;
  }

  public playFootstep(surface: FootstepSurface): void {
    if (!this.sfxEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxGain) return;
    if (ctx.state !== "running") return;

    const now = ctx.currentTime;
    const jitter = 0.92 + Math.random() * 0.16;

    // Low organic thump
    const thump = ctx.createOscillator();
    const thumpEnv = ctx.createGain();
    thump.type = surface === "wood" ? "triangle" : "sine";
    const fStart = surface === "wood" ? 185 * jitter : surface === "stone" ? 225 * jitter : 130 * jitter;
    const fEnd = surface === "wood" ? 95 : surface === "stone" ? 105 : 65;
    thump.frequency.setValueAtTime(fStart, now);
    thump.frequency.exponentialRampToValueAtTime(fEnd, now + 0.065);
    thumpEnv.gain.setValueAtTime(0.001, now);
    thumpEnv.gain.linearRampToValueAtTime(surface === "wood" ? 0.08 : surface === "stone" ? 0.055 : 0.035, now + 0.008);
    thumpEnv.gain.exponentialRampToValueAtTime(0.001, now + 0.075);
    thump.connect(thumpEnv);
    thumpEnv.connect(this.sfxGain);
    thump.start(now);
    thump.stop(now + 0.09);

    // Filtered noise texture burst (turf rustle / sandstone grit / wood creak)
    if (this.noiseBuffer) {
      const nSrc = ctx.createBufferSource();
      nSrc.buffer = this.noiseBuffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value =
        surface === "grass" ? 2100 * jitter : surface === "stone" ? 1200 * jitter : 640 * jitter;
      filter.Q.value = surface === "wood" ? 2.4 : 1.3;

      const nEnv = ctx.createGain();
      const peak = surface === "grass" ? 0.16 : surface === "stone" ? 0.12 : 0.07;
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
      env.gain.linearRampToValueAtTime(0.032, st + 0.015);
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
    env.gain.linearRampToValueAtTime(0.24, now + 0.65);
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
      env.gain.linearRampToValueAtTime(0.045, st + 0.02);
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
    env.gain.linearRampToValueAtTime(0.038, now + 0.015);
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
    env.gain.linearRampToValueAtTime(0.042, now + 0.015);
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
      env.gain.linearRampToValueAtTime(0.048, start + 0.03);
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
    env.gain.linearRampToValueAtTime(0.036, now + 0.01);
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
        const note = this.scale[(current + 2) % this.scale.length];
        osc.type = "sine";
        osc.frequency.setValueAtTime(note, now);
        env.gain.setValueAtTime(0.001, now);
        env.gain.linearRampToValueAtTime(0.042, now + 0.08);
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
    if (this.loopTimer !== null) {
      window.clearInterval(this.loopTimer);
      this.loopTimer = null;
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
    if (this.ctx) {
      void this.ctx.close().catch(() => {});
      this.ctx = null;
    }
    this.musicGain = null;
    this.sfxGain = null;
    this.riverGain = null;
    this.windGain = null;
    this.noiseBuffer = null;
    this.started = false;
  }
}
