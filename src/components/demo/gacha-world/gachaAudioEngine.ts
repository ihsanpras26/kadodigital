import type { GachaMode } from "./gachaData";

interface ChordStep {
  bass: number;
  chord: number[];
  bell?: number;
}

const CAFE_PROGRESSION: Record<GachaMode, { bpm: number; steps: ChordStep[] }> = {
  anniversary: {
    bpm: 74,
    steps: [
      { bass: 174.61, chord: [261.63, 329.63, 440.0], bell: 659.25 }, // Fmaj7
      { bass: 164.81, chord: [246.94, 293.66, 392.0], bell: 587.33 }, // Em7
      { bass: 146.83, chord: [261.63, 329.63, 349.23], bell: 523.25 }, // Dm9
      { bass: 130.81, chord: [246.94, 293.66, 329.63], bell: 493.88 }, // Cmaj7
    ],
  },
  ultah: {
    bpm: 84,
    steps: [
      { bass: 196.0, chord: [293.66, 369.99, 440.0], bell: 739.99 }, // Gmaj9
      { bass: 164.81, chord: [246.94, 293.66, 392.0], bell: 659.25 }, // Em7
      { bass: 146.83, chord: [261.63, 329.63, 392.0], bell: 587.33 }, // Am7/D
      { bass: 196.0, chord: [293.66, 369.99, 493.88], bell: 783.99 }, // Gmaj7
    ],
  },
  sahabat: {
    bpm: 80,
    steps: [
      { bass: 130.81, chord: [246.94, 293.66, 392.0], bell: 659.25 }, // Cmaj9
      { bass: 110.0, chord: [246.94, 261.63, 392.0], bell: 587.33 }, // Am9
      { bass: 174.61, chord: [261.63, 329.63, 440.0], bell: 523.25 }, // Fmaj7
      { bass: 196.0, chord: [293.66, 349.23, 440.0], bell: 587.33 }, // G6/9
    ],
  },
};

export class GachaAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicBus: GainNode | null = null;
  private sfxBus: GainNode | null = null;
  private reverbNode: ConvolverNode | null = null;
  private reverbSend: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;

  private musicEnabled = true;
  private sfxEnabled = true;
  private mode: GachaMode = "anniversary";

  private schedulerTimer: number | null = null;
  private nextBarTime = 0;
  private stepIdx = 0;

  private voiceTimer: number | null = null;
  private voiceStopNodes: (() => void)[] = [];
  private lastScratchMs = 0;

  private ensureContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtor) return null;

      const ctx = new AudioCtor();
      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.value = -16;
      compressor.knee.value = 18;
      compressor.ratio.value = 3;
      compressor.attack.value = 0.005;
      compressor.release.value = 0.18;

      const master = ctx.createGain();
      master.gain.value = 0.85;

      const music = ctx.createGain();
      music.gain.value = this.musicEnabled ? 0.42 : 0;

      const sfx = ctx.createGain();
      sfx.gain.value = this.sfxEnabled ? 0.78 : 0;

      // Warm cozy wooden cafe room reverb
      const impulse = this.createCafeImpulse(ctx, 1.55);
      const convolver = ctx.createConvolver();
      convolver.buffer = impulse;
      const revFilter = ctx.createBiquadFilter();
      revFilter.type = "lowpass";
      revFilter.frequency.value = 2800;
      const revSend = ctx.createGain();
      revSend.gain.value = 0.34;

      music.connect(compressor);
      music.connect(revSend);
      sfx.connect(compressor);

      revSend.connect(convolver);
      convolver.connect(revFilter);
      revFilter.connect(compressor);

      compressor.connect(master);
      master.connect(ctx.destination);

      this.ctx = ctx;
      this.masterGain = master;
      this.musicBus = music;
      this.sfxBus = sfx;
      this.reverbNode = convolver;
      this.reverbSend = revSend;
      this.noiseBuffer = this.createWhiteNoiseBuffer(ctx, 0.5);
    }

    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private createCafeImpulse(ctx: AudioContext, durationSec: number): AudioBuffer {
    const len = Math.floor(ctx.sampleRate * durationSec);
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        const decay = Math.pow(1 - i / len, 2.4);
        data[i] = (Math.random() * 2 - 1) * decay * 0.4;
      }
    }
    return buf;
  }

  private createWhiteNoiseBuffer(ctx: AudioContext, durationSec: number): AudioBuffer {
    const len = Math.floor(ctx.sampleRate * durationSec);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buf;
  }

  start(): void {
    const ctx = this.ensureContext();
    if (!ctx || this.schedulerTimer !== null) return;
    this.nextBarTime = ctx.currentTime + 0.08;
    this.schedulerTimer = window.setInterval(() => this.tickMusic(), 120);
  }

  setMode(mode: GachaMode): void {
    this.mode = mode;
    this.stepIdx = 0;
  }

  setMusicEnabled(enabled: boolean): void {
    this.musicEnabled = enabled;
    const ctx = this.ctx;
    if (ctx && this.musicBus) {
      this.musicBus.gain.setTargetAtTime(enabled ? 0.42 : 0, ctx.currentTime, 0.08);
    }
  }

  setSfxEnabled(enabled: boolean): void {
    this.sfxEnabled = enabled;
    const ctx = this.ctx;
    if (ctx && this.sfxBus) {
      this.sfxBus.gain.setTargetAtTime(enabled ? 0.78 : 0, ctx.currentTime, 0.04);
    }
  }

  private tickMusic(): void {
    const ctx = this.ctx;
    if (!ctx || !this.musicBus || !this.musicEnabled) return;

    const { bpm, steps } = CAFE_PROGRESSION[this.mode];
    const barDur = (60 / bpm) * 4;
    const horizon = ctx.currentTime + 0.35;

    while (this.nextBarTime < horizon) {
      const step = steps[this.stepIdx % steps.length];
      this.scheduleCafeBar(ctx, this.nextBarTime, barDur, step);
      this.nextBarTime += barDur;
      this.stepIdx++;
    }
  }

  private scheduleCafeBar(
    ctx: AudioContext,
    startTime: number,
    barDur: number,
    step: ChordStep,
  ): void {
    if (!this.musicBus) return;
    const beat = barDur / 4;

    // 1. Warm Rhodes Electric Piano Chord on beats 1 and 2.5
    [startTime, startTime + beat * 2.5].forEach((hitTime, hitIdx) => {
      const dur = hitIdx === 0 ? beat * 2.2 : beat * 1.4;
      step.chord.forEach((freq, noteIdx) => {
        const osc = ctx.createOscillator();
        const overtone = ctx.createOscillator();
        const gain = ctx.createGain();
        const overGain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, hitTime + noteIdx * 0.018);

        overtone.type = "triangle";
        overtone.frequency.setValueAtTime(freq * 2, hitTime + noteIdx * 0.018);
        overGain.gain.setValueAtTime(0.08, hitTime + noteIdx * 0.018);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(1450, hitTime);

        const peak = hitIdx === 0 ? 0.085 : 0.06;
        gain.gain.setValueAtTime(0.0001, hitTime + noteIdx * 0.018);
        gain.gain.exponentialRampToValueAtTime(peak, hitTime + noteIdx * 0.018 + 0.025);
        gain.gain.exponentialRampToValueAtTime(0.0001, hitTime + dur);

        osc.connect(filter);
        overtone.connect(overGain);
        overGain.connect(filter);
        filter.connect(gain);
        gain.connect(this.musicBus!);

        osc.start(hitTime + noteIdx * 0.018);
        overtone.start(hitTime + noteIdx * 0.018);
        osc.stop(hitTime + dur + 0.05);
        overtone.stop(hitTime + dur + 0.05);
      });
    });

    // 2. Warm Upright Jazz Bass
    [0, 2].forEach((bIdx) => {
      const t = startTime + bIdx * beat;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(bIdx === 0 ? step.bass : step.bass * 1.498, t);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.11, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + beat * 1.4);
      osc.connect(gain);
      gain.connect(this.musicBus!);
      osc.start(t);
      osc.stop(t + beat * 1.45);
    });

    // 3. Soft Celesta Cafe Bell Sparkle on Beat 4
    if (step.bell) {
      const bellTime = startTime + beat * 3;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(step.bell, bellTime);
      gain.gain.setValueAtTime(0.0001, bellTime);
      gain.gain.exponentialRampToValueAtTime(0.038, bellTime + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, bellTime + beat * 0.9);
      osc.connect(gain);
      gain.connect(this.musicBus!);
      osc.start(bellTime);
      osc.stop(bellTime + beat);
    }

    // 4. Delicate Lo-fi Shaker Brush on off-beats
    if (this.noiseBuffer) {
      [0.5, 1.5, 2.5, 3.5].forEach((subBeat) => {
        const t = startTime + subBeat * beat;
        const src = ctx.createBufferSource();
        src.buffer = this.noiseBuffer;
        const hp = ctx.createBiquadFilter();
        hp.type = "bandpass";
        hp.frequency.value = 5400;
        hp.Q.value = 2.2;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.014, t);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);
        src.connect(hp);
        hp.connect(g);
        g.connect(this.musicBus!);
        src.start(t);
        src.stop(t + 0.05);
      });
    }
  }

  playCoinInsert(): void {
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxBus || !this.sfxEnabled) return;
    const now = ctx.currentTime;

    // Bright dual-harmonic brass token clink
    [2280, 3420].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + 0.04);
      gain.gain.setValueAtTime(0.0001, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(i === 0 ? 0.14 : 0.07, now + 0.046);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.36);
      osc.connect(gain);
      gain.connect(this.sfxBus!);
      osc.start(now + 0.04);
      osc.stop(now + 0.38);
    });

    // Mechanical slot drop thump
    const thud = ctx.createOscillator();
    const tGain = ctx.createGain();
    thud.type = "triangle";
    thud.frequency.setValueAtTime(210, now + 0.11);
    thud.frequency.exponentialRampToValueAtTime(95, now + 0.19);
    tGain.gain.setValueAtTime(0.14, now + 0.11);
    tGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.21);
    thud.connect(tGain);
    tGain.connect(this.sfxBus!);
    thud.start(now + 0.11);
    thud.stop(now + 0.22);
  }

  playCrankClick(intensity = 1): void {
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxBus || !this.sfxEnabled) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(420 * intensity, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.032);
    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.038);
    osc.connect(gain);
    gain.connect(this.sfxBus!);
    osc.start(now);
    osc.stop(now + 0.045);

    if (this.noiseBuffer) {
      const src = ctx.createBufferSource();
      src.buffer = this.noiseBuffer;
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = 1850;
      const nGain = ctx.createGain();
      nGain.gain.setValueAtTime(0.09, now);
      nGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);
      src.connect(bp);
      bp.connect(nGain);
      nGain.connect(this.sfxBus!);
      src.start(now);
      src.stop(now + 0.03);
    }
  }

  playCapsuleTumble(): void {
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxBus || !this.sfxEnabled) return;
    const now = ctx.currentTime;

    [0, 0.09, 0.17, 0.28].forEach((offset, idx) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(640 + idx * 95, now + offset);
      osc.frequency.exponentialRampToValueAtTime(290, now + offset + 0.035);
      g.gain.setValueAtTime(0.06, now + offset);
      g.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.042);
      osc.connect(g);
      g.connect(this.sfxBus!);
      osc.start(now + offset);
      osc.stop(now + offset + 0.05);
    });
  }

  playChuteDrop(): void {
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxBus || !this.sfxEnabled) return;
    const now = ctx.currentTime;

    // Tray acrylic bounce + hollow thud at two impacts
    [0.08, 0.21].forEach((offset, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(i === 0 ? 520 : 620, now + offset);
      osc.frequency.exponentialRampToValueAtTime(185, now + offset + 0.065);
      g.gain.setValueAtTime(i === 0 ? 0.16 : 0.09, now + offset);
      g.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.075);
      osc.connect(g);
      g.connect(this.sfxBus!);
      osc.start(now + offset);
      osc.stop(now + offset + 0.08);
    });
  }

  playCapsuleWobble(): void {
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxBus || !this.sfxEnabled) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(340, now);
    osc.frequency.exponentialRampToValueAtTime(480, now + 0.06);
    g.gain.setValueAtTime(0.08, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);
    osc.connect(g);
    g.connect(this.sfxBus!);
    osc.start(now);
    osc.stop(now + 0.075);
  }

  playCapsuleCrack(): void {
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxBus || !this.sfxEnabled) return;
    const now = ctx.currentTime;

    // Crisp plastic pop
    if (this.noiseBuffer) {
      const src = ctx.createBufferSource();
      src.buffer = this.noiseBuffer;
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = 1400;
      const nGain = ctx.createGain();
      nGain.gain.setValueAtTime(0.2, now);
      nGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
      src.connect(bp);
      bp.connect(nGain);
      nGain.connect(this.sfxBus!);
      src.start(now);
      src.stop(now + 0.07);
    }

    // Bright Cmaj9 sparkle reveal arpeggio
    [523.25, 659.25, 783.99, 987.77, 1174.66].forEach((freq, idx) => {
      const t = now + 0.04 + idx * 0.055;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.11, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.42);
      osc.connect(g);
      g.connect(this.sfxBus!);
      osc.start(t);
      osc.stop(t + 0.44);
    });
  }

  playFlipCard(): void {
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxBus || !this.sfxEnabled || !this.noiseBuffer) return;
    const now = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(900, now);
    filter.frequency.exponentialRampToValueAtTime(2400, now + 0.09);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.09, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);
    src.connect(filter);
    filter.connect(g);
    g.connect(this.sfxBus!);
    src.start(now);
    src.stop(now + 0.12);
  }

  playQuizCorrect(): void {
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxBus || !this.sfxEnabled) return;
    const now = ctx.currentTime;
    [523.25, 659.25, 1046.5].forEach((f, idx) => {
      const t = now + idx * 0.075;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(f, t);
      g.gain.setValueAtTime(0.13, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
      osc.connect(g);
      g.connect(this.sfxBus!);
      osc.start(t);
      osc.stop(t + 0.32);
    });
  }

  playQuizWrong(): void {
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxBus || !this.sfxEnabled) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.linearRampToValueAtTime(210, now + 0.16);
    g.gain.setValueAtTime(0.11, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
    osc.connect(g);
    g.connect(this.sfxBus!);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  playScratchTick(): void {
    const nowMs = performance.now();
    if (nowMs - this.lastScratchMs < 55) return;
    this.lastScratchMs = nowMs;

    const ctx = this.ensureContext();
    if (!ctx || !this.sfxBus || !this.sfxEnabled || !this.noiseBuffer) return;
    const now = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 3200;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.045, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.032);
    src.connect(hp);
    hp.connect(g);
    g.connect(this.sfxBus!);
    src.start(now);
    src.stop(now + 0.04);
  }

  playReceiptStep(): void {
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxBus || !this.sfxEnabled || !this.noiseBuffer) return;
    const now = ctx.currentTime;

    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 2600 + (Math.random() - 0.5) * 300;
    bp.Q.value = 2.6;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.055, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.024);
    src.connect(bp);
    bp.connect(g);
    g.connect(this.sfxBus!);
    src.start(now);
    src.stop(now + 0.028);
  }

  playStampSlam(): void {
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxBus || !this.sfxEnabled) return;
    const now = ctx.currentTime;

    // Rubber stamp thud
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(115, now);
    osc.frequency.exponentialRampToValueAtTime(42, now + 0.14);
    g.gain.setValueAtTime(0.32, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
    osc.connect(g);
    g.connect(this.sfxBus!);
    osc.start(now);
    osc.stop(now + 0.2);

    // Crisp paper slap noise
    if (this.noiseBuffer) {
      const src = ctx.createBufferSource();
      src.buffer = this.noiseBuffer;
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 2100;
      const ng = ctx.createGain();
      ng.gain.setValueAtTime(0.14, now);
      ng.gain.exponentialRampToValueAtTime(0.0001, now + 0.055);
      src.connect(lp);
      lp.connect(ng);
      ng.connect(this.sfxBus!);
      src.start(now);
      src.stop(now + 0.06);
    }
  }

  playSealCharge(): void {
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxBus || !this.sfxEnabled) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(185, now);
    osc.frequency.exponentialRampToValueAtTime(295, now + 0.72);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.09, now + 0.15);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
    osc.connect(g);
    g.connect(this.sfxBus!);
    osc.start(now);
    osc.stop(now + 0.82);
  }

  playSealBreak(): void {
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxBus || !this.sfxEnabled) return;
    const now = ctx.currentTime;

    if (this.noiseBuffer) {
      const src = ctx.createBufferSource();
      src.buffer = this.noiseBuffer;
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = 1150;
      const ng = ctx.createGain();
      ng.gain.setValueAtTime(0.18, now);
      ng.gain.exponentialRampToValueAtTime(0.0001, now + 0.075);
      src.connect(bp);
      bp.connect(ng);
      ng.connect(this.sfxBus!);
      src.start(now);
      src.stop(now + 0.08);
    }

    // Warm Rhodes Fmaj7 reveal swell
    [261.63, 329.63, 440.0, 523.25].forEach((freq, idx) => {
      const t = now + 0.05 + idx * 0.045;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.11, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.75);
      osc.connect(g);
      g.connect(this.sfxBus!);
      osc.start(t);
      osc.stop(t + 0.8);
    });
  }

  playDomeTap(): void {
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxBus || !this.sfxEnabled) return;
    const now = ctx.currentTime;
    [0, 0.065].forEach((off, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(i === 0 ? 780 : 540, now + off);
      osc.frequency.exponentialRampToValueAtTime(240, now + off + 0.045);
      g.gain.setValueAtTime(i === 0 ? 0.11 : 0.07, now + off);
      g.gain.exponentialRampToValueAtTime(0.0001, now + off + 0.05);
      osc.connect(g);
      g.connect(this.sfxBus!);
      osc.start(now + off);
      osc.stop(now + off + 0.055);
    });
  }

  playPinKey(): void {
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxBus || !this.sfxEnabled) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(980, now);
    osc.frequency.exponentialRampToValueAtTime(640, now + 0.025);
    g.gain.setValueAtTime(0.08, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.032);
    osc.connect(g);
    g.connect(this.sfxBus!);
    osc.start(now);
    osc.stop(now + 0.036);
  }

  playPinUnlock(): void {
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxBus || !this.sfxEnabled) return;
    const now = ctx.currentTime;
    [523.25, 659.25, 783.99].forEach((f, idx) => {
      const t = now + idx * 0.06;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(f, t);
      g.gain.setValueAtTime(0.1, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
      osc.connect(g);
      g.connect(this.sfxBus!);
      osc.start(t);
      osc.stop(t + 0.28);
    });
  }

  playPinError(): void {
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxBus || !this.sfxEnabled) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(160, now + 0.14);
    g.gain.setValueAtTime(0.11, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
    osc.connect(g);
    g.connect(this.sfxBus!);
    osc.start(now);
    osc.stop(now + 0.18);
  }

  playVoiceNoteClip(
    durationSec: number,
    onProgress: (ratio: number) => void,
    onComplete: () => void,
  ): void {
    this.stopVoiceNoteClip();
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxBus) return;

    const melody = [523.25, 587.33, 659.25, 587.33, 440.0, 523.25, 587.33, 493.88];
    const startMs = performance.now();
    const totalMs = durationSec * 1000;
    const noteGap = durationSec / 12;

    const now = ctx.currentTime;
    for (let i = 0; i < 12; i++) {
      const t = now + i * noteGap;
      const freq = melody[i % melody.length];
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.08, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + noteGap * 0.9);
      osc.connect(g);
      g.connect(this.sfxBus!);
      osc.start(t);
      osc.stop(t + noteGap);
      this.voiceStopNodes.push(() => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {
          // already stopped
        }
      });
    }

    this.voiceTimer = window.setInterval(() => {
      const elapsed = performance.now() - startMs;
      const ratio = Math.min(1, elapsed / totalMs);
      onProgress(ratio);
      if (ratio >= 1) {
        this.stopVoiceNoteClip();
        onComplete();
      }
    }, 80);
  }

  stopVoiceNoteClip(): void {
    if (this.voiceTimer !== null) {
      window.clearInterval(this.voiceTimer);
      this.voiceTimer = null;
    }
    this.voiceStopNodes.forEach((fn) => fn());
    this.voiceStopNodes = [];
  }

  dispose(): void {
    if (this.schedulerTimer !== null) {
      window.clearInterval(this.schedulerTimer);
      this.schedulerTimer = null;
    }
    this.stopVoiceNoteClip();
    if (this.ctx) {
      this.ctx.close().catch(() => {});
      this.ctx = null;
    }
    this.reverbNode = null;
    this.reverbSend = null;
    this.masterGain = null;
    this.musicBus = null;
    this.sfxBus = null;
  }
}
