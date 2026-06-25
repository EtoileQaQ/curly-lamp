"use client";

import { useEffect, useRef, useState } from "react";

type Metric = {
  value: number;
  decimals?: number;
  suffix?: string;
  label: string;
};

const METRICS: Metric[] = [
  { value: 10, label: "beta-testeur" },
  { value: 50, label: "posts générés" },
  { value: 4.9, decimals: 1, suffix: "/5", label: "note moyenne" },
  { value: 7, suffix: "h", label: "gagnées / mois" },
];

function formatNumber(n: number, decimals: number) {
  return n.toLocaleString("fr-FR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function Counter({ metric }: { metric: Metric }) {
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  const [display, setDisplay] = useState(0);
  const decimals = metric.decimals ?? 0;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // On déclenche l'animation quand la métrique entre dans l'écran (une seule fois).
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            const duration = 1500;
            const startTime = performance.now();
            const tick = (now: number) => {
              const progress = Math.min((now - startTime) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
              setDisplay(metric.value * eased);
              if (progress < 1) requestAnimationFrame(tick);
              else setDisplay(metric.value);
            };
            requestAnimationFrame(tick);
          }
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [metric.value]);

  return (
    <div
      ref={ref}
      className="transition-transform duration-200 hover:scale-105"
    >
      <div className="text-[22px] font-medium text-[#111]">
        {formatNumber(display, decimals)}
        {metric.suffix}
      </div>
      <div className="text-sm text-[#666]">{metric.label}</div>
    </div>
  );
}

export function SocialProofBar() {
  return (
    <section className="border-y border-[#e5e5e5] bg-[#f8f8f8] px-6 py-10">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-16 gap-y-8 text-center">
        {METRICS.map((m) => (
          <Counter key={m.label} metric={m} />
        ))}
      </div>
    </section>
  );
}
