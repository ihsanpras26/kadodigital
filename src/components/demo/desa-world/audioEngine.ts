"use client";

/**
 * Cozy Web Audio API synthesizer for Desa Asri.
 * Produces gentle Indonesian pelog-pentatonic chimes and warm wooden/chime UI SFX
 * with zero external MP3 dependencies.
 */
export class DesaAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private loopTimer: number | null = null;
  private voiceTimer: number | null = null;
  private enabled = true;
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
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.enabled ? 0.14 : 0;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") {
      void this.ctx.resume().catch(() => {});
    }
    return this.ctx;
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
  }

  public setEnabled(next: boolean): void {
    this.enabled = next;
    if (!this.masterGain || !this.ctx) return;
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setTargetAtTime(next ? 0.14 : 0, now, 0.08);
    if (next && !this.started) {
      this.start();
    }
  }

  private scheduleNextNote(): void {
    if (!this.enabled || !this.ctx || !this.masterGain) return;
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
    env.connect(this.masterGain);
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
      padEnv.connect(this.masterGain);
      pad.start(now);
      pad.stop(now + 1.3);
    }

    this.step += 1;
  }

  public playTap(): void {
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(660, now + 0.08);
    env.gain.setValueAtTime(0.001, now);
    env.gain.linearRampToValueAtTime(0.28, now + 0.015);
    env.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
    osc.connect(env);
    env.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.16);
  }

  public playGateOpen(): void {
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;
    const now = ctx.currentTime;
    [392, 493.88, 587.33, 783.99].forEach((freq, i) => {
      if (!this.masterGain) return;
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      const start = now + i * 0.09;
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, start);
      env.gain.setValueAtTime(0.001, start);
      env.gain.linearRampToValueAtTime(0.32, start + 0.03);
      env.gain.exponentialRampToValueAtTime(0.001, start + 0.65);
      osc.connect(env);
      env.connect(this.masterGain);
      osc.start(start);
      osc.stop(start + 0.7);
    });
  }

  public playDialogueBlip(): void {
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(460, now);
    osc.frequency.linearRampToValueAtTime(610, now + 0.06);
    env.gain.setValueAtTime(0.001, now);
    env.gain.linearRampToValueAtTime(0.24, now + 0.01);
    env.gain.exponentialRampToValueAtTime(0.001, now + 0.11);
    osc.connect(env);
    env.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.13);
  }

  public playReveal(): void {
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;
    const now = ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      if (!this.masterGain) return;
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      const start = now + i * 0.07;
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, start);
      env.gain.setValueAtTime(0.001, start);
      env.gain.linearRampToValueAtTime(0.26, start + 0.02);
      env.gain.exponentialRampToValueAtTime(0.001, start + 0.45);
      osc.connect(env);
      env.connect(this.masterGain);
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
      if (this.enabled && this.ctx && this.masterGain && current % 2 === 1) {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const env = this.ctx.createGain();
        const note = this.scale[(current + 2) % this.scale.length];
        osc.type = "sine";
        osc.frequency.setValueAtTime(note, now);
        env.gain.setValueAtTime(0.001, now);
        env.gain.linearRampToValueAtTime(0.28, now + 0.08);
        env.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        osc.connect(env);
        env.connect(this.masterGain);
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
    if (this.ctx) {
      void this.ctx.close().catch(() => {});
      this.ctx = null;
    }
    this.masterGain = null;
    this.started = false;
  }
}
