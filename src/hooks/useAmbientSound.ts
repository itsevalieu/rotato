"use client";

import { useEffect, useRef, useCallback } from "react";
import type { CreativeWeather } from "@/lib/types";

type CleanupFn = () => void;

// Each synthesiser receives the AudioContext and a destination node, returns cleanup
function makeSunny(ctx: AudioContext, dest: AudioNode): CleanupFn {
  const notes = [261.63, 329.63, 392.0, 493.88];
  let noteIdx = 0;
  const ids: ReturnType<typeof setInterval>[] = [];

  function playChime() {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(dest);
    osc.type = "sine";
    osc.frequency.value = notes[noteIdx % notes.length];
    noteIdx++;
    const t = ctx.currentTime;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.12, t + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 2.5);
    osc.start(t);
    osc.stop(t + 2.5);
  }

  playChime();
  ids.push(setInterval(playChime, 2200));
  return () => ids.forEach(clearInterval);
}

function makeBreezy(ctx: AudioContext, dest: AudioNode): CleanupFn {
  const bufSize = ctx.sampleRate * 2;
  const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;

  const source = ctx.createBufferSource();
  source.buffer = buf;
  source.loop = true;

  const bpf = ctx.createBiquadFilter();
  bpf.type = "bandpass";
  bpf.frequency.value = 800;
  bpf.Q.value = 0.5;

  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.value = 0.2;
  lfoGain.gain.value = 400;
  lfo.connect(lfoGain);
  lfoGain.connect(bpf.frequency);

  const masterGain = ctx.createGain();
  masterGain.gain.value = 0.2;
  source.connect(bpf);
  bpf.connect(masterGain);
  masterGain.connect(dest);
  source.start();
  lfo.start();

  return () => { source.stop(); lfo.stop(); };
}

function makeCozyRain(ctx: AudioContext, dest: AudioNode): CleanupFn {
  const bufSize = ctx.sampleRate * 4;
  const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const data = buf.getChannelData(0);
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0;
  for (let i = 0; i < bufSize; i++) {
    const w = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + w * 0.0555179;
    b1 = 0.99332 * b1 + w * 0.0750759;
    b2 = 0.96900 * b2 + w * 0.1538520;
    b3 = 0.86650 * b3 + w * 0.3104856;
    b4 = 0.55000 * b4 + w * 0.5329522;
    b5 = -0.7616 * b5 - w * 0.0168980;
    data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + w * 0.5362) * 0.11;
  }

  const source = ctx.createBufferSource();
  source.buffer = buf;
  source.loop = true;

  const lpf = ctx.createBiquadFilter();
  lpf.type = "lowpass";
  lpf.frequency.value = 1400;

  const masterGain = ctx.createGain();
  masterGain.gain.value = 0.85;
  source.connect(lpf);
  lpf.connect(masterGain);
  masterGain.connect(dest);
  source.start();

  return () => source.stop();
}

function makeFoggy(ctx: AudioContext, dest: AudioNode): CleanupFn {
  const freqs = [87.31, 130.81, 207.65];
  const oscs: OscillatorNode[] = [];
  const gains: GainNode[] = [];

  freqs.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    osc.detune.value = (i - 1) * 4;
    g.gain.value = 0.06;
    osc.connect(g);
    g.connect(dest);
    osc.start();
    oscs.push(osc);
    gains.push(g);
  });

  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.value = 0.08;
  lfoGain.gain.value = 0.025;
  lfo.connect(lfoGain);
  gains.forEach((g) => lfoGain.connect(g.gain));
  lfo.start();

  return () => { oscs.forEach((o) => o.stop()); lfo.stop(); };
}

function makeStarry(ctx: AudioContext, dest: AudioNode): CleanupFn {
  const notes = [196.0, 293.66, 440.0, 659.25];
  const ids: ReturnType<typeof setInterval>[] = [];

  function playTone(freq: number, delay = 0) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    osc.connect(g);
    g.connect(dest);
    const t = ctx.currentTime + delay;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.06, t + 1.2);
    g.gain.linearRampToValueAtTime(0, t + 5);
    osc.start(t);
    osc.stop(t + 5);
  }

  notes.forEach((n, i) => playTone(n, i * 0.6));
  ids.push(
    setInterval(() => playTone(notes[Math.floor(Math.random() * notes.length)]), 3500)
  );

  return () => ids.forEach(clearInterval);
}

const synthMap: Record<CreativeWeather, (ctx: AudioContext, dest: AudioNode) => CleanupFn> = {
  sunny: makeSunny,
  breezy: makeBreezy,
  "cozy-rain": makeCozyRain,
  foggy: makeFoggy,
  starry: makeStarry,
};

export function useAmbientSound(
  enabled: boolean,
  weather: CreativeWeather,
  volume = 0.5
) {
  const ctxRef = useRef<AudioContext | null>(null);
  const cleanupRef = useRef<CleanupFn | null>(null);
  const masterRef = useRef<GainNode | null>(null);

  const stop = useCallback(() => {
    cleanupRef.current?.();
    cleanupRef.current = null;
    ctxRef.current?.close().catch(() => {});
    ctxRef.current = null;
    masterRef.current = null;
  }, []);

  useEffect(() => {
    if (!enabled) {
      stop();
      return;
    }

    // Stop any previous sounds
    stop();

    const AudioCtxClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtxClass) return;

    const ctx = new AudioCtxClass();
    ctxRef.current = ctx;

    const master = ctx.createGain();
    master.gain.value = volume;
    master.connect(ctx.destination);
    masterRef.current = master;

    cleanupRef.current = synthMap[weather](ctx, master);

    return stop;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, weather]);

  // Volume-only changes don't restart the engine
  useEffect(() => {
    if (masterRef.current) {
      masterRef.current.gain.value = volume;
    }
  }, [volume]);
}
