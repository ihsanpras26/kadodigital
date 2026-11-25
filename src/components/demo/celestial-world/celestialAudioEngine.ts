export type CelestialMusicTrack = "harpa" | "orkestra";

function createHallImpulseResponse(
  ctx: AudioContext,
  durationSec = 2.6,
  decay = 2.4,
): AudioBuffer {
  const rate = ctx.sampleRate;
  const length = Math.floor(rate * durationSec);
  const impulse = ctx.createBuffer(2, length, rate);
  for (let ch = 0; ch < 2; ch++) {
    const channelData = impulse.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      const env = Math.pow(1 - i / length, decay);
      channelData[i] = (Math.random() * 2 - 1) * env * 0.48;
    }
  }
  return impulse;
}

export class CelestialAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicBus: GainNode | null = null;
  private sfxBus: GainNode | null = null;
  private reverbNode: ConvolverNode | null = null;

  private musicEnabled = true;
  private sfxEnabled = true;
  private track: CelestialMusicTrack = "harpa";
  private schedulerId: number | null = null;
  private step = 0;

  private ensureContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return null;

    if (!this.ctx) {
      const ctx = new AC();
      const master = ctx.createGain();
      master.gain.value = 0.85;
      master.connect(ctx.destination);

      const reverb = ctx.createConvolver();
      reverb.buffer = createHallImpulseResponse(ctx);
      const wetGain = ctx.createGain();
      wetGain.gain.value = 0.42;
      reverb.connect(wetGain);
      wetGain.connect(master);

      const musicBus = ctx.createGain();
      musicBus.gain.value = this.musicEnabled ? 0.36 : 0;
      musicBus.connect(master);
      musicBus.connect(reverb);

      const sfxBus = ctx.createGain();
      sfxBus.gain.value = this.sfxEnabled ? 0.56 : 0;
      sfxBus.connect(master);
      sfxBus.connect(reverb);

      this.ctx = ctx;
      this.masterGain = master;
      this.musicBus = musicBus;
      this.sfxBus = sfxBus;
      this.reverbNode = reverb;
    }

    if (this.ctx.state === "suspended") {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  start(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    if (this.schedulerId !== null) return;

    this.scheduleNextTick();
    this.schedulerId = window.setInterval(() => {
      this.scheduleNextTick();
    }, 640);
  }

  private playTone(
    freq: number,
    duration: number,
    gainVal: number,
    type: OscillatorType,
    bus: GainNode | null,
    attack = 0.03,
    detuneCents = 0,
  ): void {
    if (!this.ctx || !bus) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const env = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (detuneCents !== 0) osc.detune.setValueAtTime(detuneCents, now);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(Math.min(4800, freq * 4.5), now);

    env.gain.setValueAtTime(0.0001, now);
    env.gain.linearRampToValueAtTime(gainVal, now + attack);
    env.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    filter.connect(env);
    env.connect(bus);

    osc.start(now);
    osc.stop(now + duration + 0.06);
  }

  private scheduleNextTick(): void {
    if (!this.ctx || !this.musicBus || !this.musicEnabled) return;

    // Lydian celestial progression: Cmaj9 -> Am9 -> Fmaj7#11 -> G6/9
    const harpaChords = [
      [261.63, 329.63, 392.0, 493.88, 587.33],
      [220.0, 261.63, 329.63, 392.0, 493.88],
      [174.61, 220.0, 261.63, 329.63, 369.99],
      [196.0, 246.94, 293.66, 329.63, 440.0],
    ];
    const bar = Math.floor(this.step / 8) % harpaChords.length;
    const beat = this.step % 8;
    const chord = harpaChords[bar]!;

    if (this.track === "harpa") {
      // Soft atmospheric string pad on bar start
      if (beat === 0) {
        this.playTone(chord[0]! * 0.5, 4.8, 0.12, "sine", this.musicBus, 0.75, -5);
        this.playTone(chord[2]!, 4.4, 0.065, "triangle", this.musicBus, 0.9, 6);
      }
      // Ascending/descending crystal harp notes
      const harpIdx = [0, 1, 2, 3, 4, 3, 2, 4][beat]!;
      this.playTone(chord[harpIdx]!, 1.9, 0.14, "sine", this.musicBus, 0.02);
      if (beat === 4) {
        this.playTone(chord[4]! * 2, 2.2, 0.055, "sine", this.musicBus, 0.015);
      }
    } else {
      // Orkestra Celesta Waltz feel
      const waltzRoots = [130.81, 110.0, 174.61, 196.0];
      if (beat % 3 === 0) {
        this.playTone(waltzRoots[bar]!, 2.2, 0.16, "triangle", this.musicBus, 0.08);
      } else {
        const note = chord[(beat % 4) + 1]!;
        this.playTone(note, 1.4, 0.11, "sine", this.musicBus, 0.02);
        this.playTone(note * 1.5, 1.2, 0.04, "sine", this.musicBus, 0.02);
      }
    }

    this.step++;
  }

  setMusicEnabled(enabled: boolean): void {
    this.musicEnabled = enabled;
    const ctx = this.ensureContext();
    if (!ctx || !this.musicBus) return;
    this.musicBus.gain.setTargetAtTime(enabled ? 0.36 : 0, ctx.currentTime, 0.12);
  }

  setSfxEnabled(enabled: boolean): void {
    this.sfxEnabled = enabled;
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxBus) return;
    this.sfxBus.gain.setTargetAtTime(enabled ? 0.56 : 0, ctx.currentTime, 0.08);
  }

  setTrack(track: CelestialMusicTrack): void {
    this.track = track;
    this.step = 0;
  }

  playTap(): void {
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxEnabled || !this.sfxBus) return;
    this.playTone(784, 0.22, 0.16, "sine", this.sfxBus, 0.008);
  }

  playGateChime(): void {
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxEnabled || !this.sfxBus) return;
    const notes = [523.25, 659.25, 783.99, 987.77, 1174.66];
    notes.forEach((f, idx) => {
      window.setTimeout(() => {
        this.playTone(f, 1.3, 0.16, "sine", this.sfxBus, 0.012);
      }, idx * 75);
    });
  }

  playIslandGlide(): void {
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxEnabled || !this.sfxBus) return;
    this.playTone(440, 0.45, 0.10, "sine", this.sfxBus, 0.04);
    window.setTimeout(() => {
      this.playTone(659.25, 0.65, 0.12, "sine", this.sfxBus, 0.04);
    }, 85);
  }

  playWishStarRelease(): void {
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxEnabled || !this.sfxBus) return;
    const sparkle = [659.25, 880.0, 1046.5, 1318.5, 1567.98];
    sparkle.forEach((f, idx) => {
      window.setTimeout(() => {
        this.playTone(f, 1.5, 0.15, "sine", this.sfxBus, 0.01);
        this.playTone(f * 2, 0.9, 0.04, "triangle", this.sfxBus, 0.01);
      }, idx * 65);
    });
  }

  dispose(): void {
    if (this.schedulerId !== null) {
      window.clearInterval(this.schedulerId);
      this.schedulerId = null;
    }
    if (this.reverbNode) {
      this.reverbNode.disconnect();
      this.reverbNode = null;
    }
    if (this.masterGain) {
      this.masterGain.disconnect();
      this.masterGain = null;
    }
    if (this.ctx) {
      void this.ctx.close();
      this.ctx = null;
    }
  }
}
