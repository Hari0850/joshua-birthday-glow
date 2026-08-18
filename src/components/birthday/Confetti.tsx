import { useEffect, useRef } from "react";

type Piece = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rot: number;
  vr: number;
  color: string;
  life: number;
};

const COLORS = ["#f4c15d", "#ffe9b0", "#ff9ec4", "#ffffff", "#c084fc", "#ffd700"];

/** Full-screen confetti canvas. `burstKey` change triggers a burst; `continuous` keeps a gentle rain. */
export function Confetti({
  burstKey = 0,
  continuous = false,
}: {
  burstKey?: number;
  continuous?: boolean;
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const pieces = useRef<Piece[]>([]);
  const raf = useRef<number>(0);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const spawn = (n: number, fromTop: boolean) => {
      for (let i = 0; i < n; i++) {
        pieces.current.push({
          x: Math.random() * canvas.width,
          y: fromTop ? -20 - Math.random() * 200 : canvas.height * (0.35 + Math.random() * 0.2),
          vx: (Math.random() - 0.5) * (fromTop ? 1.6 : 9),
          vy: fromTop ? 1 + Math.random() * 2.5 : -6 - Math.random() * 8,
          size: 4 + Math.random() * 7,
          rot: Math.random() * Math.PI,
          vr: (Math.random() - 0.5) * 0.3,
          color: COLORS[Math.floor(Math.random() * COLORS.length)] as string,
          life: 1,
        });
      }
    };

    if (burstKey > 0) spawn(180, false);
    if (continuous) spawn(60, true);

    let last = performance.now();
    let acc = 0;
    const tick = (now: number) => {
      const dt = Math.min(32, now - last) / 16;
      last = now;
      acc += now - last;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (continuous && Math.random() < 0.14) spawn(2, true);

      pieces.current = pieces.current.filter((p) => p.y < canvas.height + 40 && p.life > 0);
      for (const p of pieces.current) {
        p.vy += 0.16 * dt;
        p.vx *= 0.995;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rot += p.vr * dt;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.9;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", resize);
      pieces.current = [];
      void acc;
    };
  }, [burstKey, continuous]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 h-full w-full"
    />
  );
}
