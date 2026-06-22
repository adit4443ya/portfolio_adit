"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useStore } from "@/lib/store";
import { stationById } from "@/lib/data";
import { ACCENT } from "@/lib/palette";

export default function StationPanel() {
  const activeId = useStore((s) => s.activeId);
  const panel = useRef<HTMLDivElement>(null);
  const station = stationById(activeId);

  useEffect(() => {
    if (activeId && panel.current) {
      gsap.fromTo(
        panel.current,
        { x: 70, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, duration: 0.5, ease: "power3.out" }
      );
    }
  }, [activeId]);

  if (!station) return null;
  const c = ACCENT[station.accent];
  const close = () => useStore.getState().close();

  return (
    <div className="panel-wrap">
      <div className="panel-scrim" onClick={close} />
      <aside ref={panel} className="panel" style={{ ["--c" as string]: c }}>
        <button className="panel-x" onClick={close} aria-label="close">
          ✕
        </button>

        <p className="panel-code">
          {station.code} · {station.label}
        </p>
        <h2 className="panel-title">{station.title}</h2>
        {station.tech && <p className="panel-tech">{station.tech}</p>}
        {station.lede && <p className="panel-lede">{station.lede}</p>}

        {station.metrics && (
          <div className="panel-metrics">
            {station.metrics.map((m, i) => (
              <div key={i} className="metric">
                <span className="metric-v">{m.value}</span>
                <span className="metric-l">{m.label}</span>
              </div>
            ))}
          </div>
        )}

        {station.paragraphs?.map((p, i) => (
          <p key={i} className="panel-p">
            {p}
          </p>
        ))}

        {station.trajectory && (
          <div className="traj">
            {station.trajectory.map((t, i) => (
              <div key={i} className="traj-row">
                <span className="traj-dot" />
                <div>
                  <h3>{t.title}</h3>
                  <p>{t.detail}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {station.papers && (
          <div className="papers">
            {station.papers.map((p, i) => (
              <div key={i} className="paper">
                <div className="paper-yr">
                  <b>{p.year}</b>
                  <span>{p.stage}</span>
                </div>
                <div className="paper-body">
                  <span className="tag">{p.tag}</span>
                  {p.href ? (
                    <a className="paper-title" href={p.href} target="_blank" rel="noreferrer">
                      {p.title} ↗
                    </a>
                  ) : (
                    <p className="paper-title">{p.title}</p>
                  )}
                  <p className="paper-auth">{p.authors}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {station.projects && (
          <div className="projects">
            {station.projects.map((p, i) => (
              <a key={i} className="proj" href={p.href} target="_blank" rel="noreferrer">
                <span className="proj-code">{p.code}</span>
                <span className="proj-name">{p.name}</span>
                <span className="proj-tech">{p.tech}</span>
                <span className="proj-desc">{p.desc}</span>
                {p.metric && (
                  <span className="proj-metric">
                    {p.metric} <i>{p.metricLabel}</i>
                  </span>
                )}
              </a>
            ))}
          </div>
        )}

        {station.stack && (
          <div className="stack">
            {station.stack.map((b, i) => (
              <div key={i} className="band">
                <div className="band-h">
                  <span className="band-n">{b.n}</span>
                  {b.group}
                </div>
                <div className="band-tags">
                  {b.items.map((it, j) => (
                    <span key={j} className="chip">
                      {it}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {station.channels && (
          <div className="channels">
            {station.channels.map((ch, i) => (
              <a key={i} className="channel" href={ch.href} target="_blank" rel="noreferrer">
                {ch.label} ↗
              </a>
            ))}
          </div>
        )}

        {station.links && (
          <div className="panel-links">
            {station.links.map((l, i) => (
              <a key={i} className="panel-link" href={l.href} target="_blank" rel="noreferrer">
                {l.label} ↗
              </a>
            ))}
          </div>
        )}
      </aside>
    </div>
  );
}
