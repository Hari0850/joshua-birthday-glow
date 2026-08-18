import { useEffect, useRef, useState, type ReactNode } from "react";

/** Slow floating sparkle particles + twinkling stars, purely decorative. */
export function Particles({ count = 26 }: { count?: number }) {
  const items = Array.from({ length: count }, (_, i) => ({
    left: (i * 37) % 100,
    delay: (i % 10) * 1.3,
    dur: 12 + (i % 7) * 3,
    size: 3 + (i % 4),
  }));
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((p, i) => (
        <span
          key={i}
          className="absolute bottom-0 rounded-full bg-gold/70 blur-[1px]"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            animation: `rise ${p.dur}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
      {items.slice(0, 16).map((p, i) => (
        <span
          key={`s-${i}`}
          className="animate-twinkle absolute rounded-full bg-foreground"
          style={{
            left: `${(p.left * 1.7) % 100}%`,
            top: `${(i * 13) % 90}%`,
            width: 2,
            height: 2,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

const BALLOON_COLORS = ["bg-gold/80", "bg-rose/80", "bg-violet/80", "bg-foreground/70"];

export function Balloons({ count = 6 }: { count?: number }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="animate-float absolute"
          style={{
            left: `${6 + i * 16}%`,
            top: `${10 + ((i * 27) % 60)}%`,
            animationDelay: `${i * 0.7}s`,
            animationDuration: `${5 + (i % 4)}s`,
          }}
        >
          <div
            className={`h-12 w-9 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] ${BALLOON_COLORS[i % 4]} shadow-[0_0_30px_-6px_currentColor] opacity-70 sm:h-16 sm:w-12`}
          />
          <div className="mx-auto h-10 w-px bg-foreground/30" />
        </div>
      ))}
    </div>
  );
}

/** Pure-CSS birthday cake with flickering candles. */
export function Cake({ candles = 5 }: { candles?: number }) {
  return (
    <div className="relative mx-auto w-52 select-none sm:w-64" aria-hidden="true">
      <div className="absolute -inset-10 rounded-full bg-gold/20 blur-3xl" />
      <div className="relative flex justify-center gap-3">
        {Array.from({ length: candles }, (_, i) => (
          <div key={i} className="flex flex-col items-center">
            <span
              className="animate-flicker h-4 w-2.5 rounded-full bg-gold shadow-[0_0_18px_6px_oklch(0.86_0.15_88/0.75)]"
              style={{ animationDelay: `${i * 0.11}s` }}
            />
            <span className="h-7 w-1.5 rounded-sm bg-rose/90" />
          </div>
        ))}
      </div>
      <div className="relative h-8 rounded-t-xl bg-[linear-gradient(180deg,oklch(0.94_0.06_95),oklch(0.86_0.09_80))] shadow-[0_0_40px_-10px_oklch(0.86_0.15_88/0.8)]" />
      <div className="relative h-10 bg-[linear-gradient(180deg,oklch(0.8_0.11_5),oklch(0.66_0.13_10))]" />
      <div className="relative h-12 rounded-b-2xl bg-[linear-gradient(180deg,oklch(0.55_0.12_300),oklch(0.4_0.11_295))]" />
      <div className="mx-auto h-2 w-[110%] -translate-x-[5%] rounded-full bg-foreground/10 blur-sm" />
    </div>
  );
}

/** Scroll-triggered reveal wrapper. */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      data-visible={visible}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
