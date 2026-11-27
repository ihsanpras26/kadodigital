export type WeddingAudioTone = "harp" | "gamelan" | "piano";

const HARP_NOTES = [261.63, 329.63, 392.0, 493.88, 523.25, 392.0, 329.63, 293.66];
const GAMELAN_NOTES = [293.66, 329.63, 392.0, 440.0, 523.25, 440.0, 392.0, 329.63];
const PIANO_NOTES = [220.0, 261.63, 329.63, 392.0, 440.0, 392.0, 329.63, 293.66];

export class WeddingAudioEngine {
  private ctx: AudioContext | null = null;
  private timer: number | null = null;
  private stepIndex = 0;
  private playing = false;
  private tone: WeddingAudioTone = "harp";

  setTone(tone: WeddingAudioTone) {
    this.tone = tone;
  }

  private ensureContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === "suspended") {
      void this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private playNote(freq: number) {
    const ctx = this.ctx;
    if (!ctx || ctx.state !== "running") return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = this.tone === "gamelan" ? "sine" : "triangle";
    osc.frequency.setValueAtTime(freq, now);

    const attack = 0.04;
    const decay = this.tone === "gamelan" ? 1.85 : 1.35;

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.045, now + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + decay + 0.05);
  }

  start() {
    this.ensureContext();
    if (this.playing) return;
    this.playing = true;
    const scale =
      this.tone === "gamelan"
        ? GAMELAN_NOTES
        : this.tone === "piano"
          ? PIANO_NOTES
          : HARP_NOTES;

    this.playNote(scale[this.stepIndex % scale.length]!);
    this.stepIndex++;

    this.timer = window.setInterval(() => {
      if (!this.playing) return;
      this.playNote(scale[this.stepIndex % scale.length]!);
      this.stepIndex++;
    }, this.tone === "gamelan" ? 780 : 620);
  }

  stop() {
    this.playing = false;
    if (this.timer !== null) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
  }

  toggle(): boolean {
    if (this.playing) {
      this.stop();
      return false;
    }
    this.start();
    return true;
  }

  dispose() {
    this.stop();
    if (this.ctx) {
      void this.ctx.close().catch(() => {});
      this.ctx = null;
    }
  }
}
