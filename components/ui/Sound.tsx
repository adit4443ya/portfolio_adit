"use client";

import { useEffect } from "react";
import { carState } from "@/lib/carState";
import { useStore } from "@/lib/store";

// Procedural engine hum via the Web Audio API — no audio files. Frequency and
// volume track the rover's speed. Starts after the user enters (a valid gesture).
export default function Sound() {
  const phase = useStore((s) => s.phase);
  const muted = useStore((s) => s.muted);

  useEffect(() => {
    if (phase !== "explore") return;
    let raf = 0;
    let ctx: AudioContext | undefined;

    try {
      const Ctor =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx = new Ctor();

      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.value = 42;
      const sub = ctx.createOscillator();
      sub.type = "sine";
      sub.frequency.value = 22;
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 650;
      const gain = ctx.createGain();
      gain.gain.value = 0;

      osc.connect(filter);
      sub.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      sub.start();

      const tick = () => {
        const sp = Math.min(Math.abs(carState.speed) / 17, 1);
        const isMuted = useStore.getState().muted;
        const target = isMuted ? 0 : 0.014 + sp * 0.06;
        const f = 40 + sp * 150;
        gain.gain.setTargetAtTime(target, ctx!.currentTime, 0.1);
        osc.frequency.setTargetAtTime(f, ctx!.currentTime, 0.08);
        sub.frequency.setTargetAtTime(f * 0.5, ctx!.currentTime, 0.08);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);

      return () => {
        cancelAnimationFrame(raf);
        try {
          osc.stop();
          sub.stop();
        } catch {
          /* already stopped */
        }
        ctx?.close();
      };
    } catch {
      // Web Audio unavailable — fail silently.
      return;
    }
  }, [phase]);

  if (phase !== "explore") return null;

  return (
    <button className="sound-btn" onClick={() => useStore.getState().toggleMute()} aria-label="toggle sound">
      {muted ? "🔇" : "🔊"}
    </button>
  );
}
