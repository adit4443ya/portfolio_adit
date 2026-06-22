"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useStore } from "@/lib/store";
import { profile } from "@/lib/data";

export default function LoadingScreen() {
  const phase = useStore((s) => s.phase);
  const root = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const pct = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const obj = { p: 0 };
    const tl = gsap.timeline();
    tl.to(obj, {
      p: 100,
      duration: 1.5,
      ease: "power1.inOut",
      onUpdate: () => {
        if (bar.current) bar.current.style.width = `${obj.p}%`;
        if (pct.current) pct.current.textContent = String(Math.round(obj.p)).padStart(3, "0");
      },
    });
    tl.to(root.current, {
      autoAlpha: 0,
      duration: 0.6,
      ease: "power2.inOut",
      onComplete: () => useStore.getState().setPhase("ready"),
    });
    return () => {
      tl.kill();
    };
  }, []);

  if (phase !== "loading") return null;

  return (
    <div ref={root} className="loader">
      <div className="loader-inner">
        <p className="eyebrow">{profile.role} · Portfolio Sector</p>
        <h1 className="loader-name">{profile.name}</h1>
        <div className="loader-bar">
          <div ref={bar} className="loader-fill" />
        </div>
        <p className="loader-status">
          INITIALIZING SECTOR GRID · <span ref={pct}>000</span>%
        </p>
      </div>
    </div>
  );
}
