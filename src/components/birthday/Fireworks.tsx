import { useEffect, useRef } from "react";

type Spark = { x: number; y: number; vx: number; vy: number; life: number; color: string };

const COLORS = ["#f4c15d", "#ff9ec4", "#ffffff", "#c084fc", "#ffe9b0"];

/** Soft looping fireworks background. */
export function Fireworks() {
  const ref = useRef<HTMLCanvasElement | null>(null);

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

    let sparks: Spark[] = [];
    const explode = () => {
      const cx = canvas.width * (0.15 + Math.random() * 0.7);
      const cy = canvas.height * (0.1 + Math.random() * 0.45);
      const color = COLORS[Math.floor(Math.random() * COLORS.length)] as string;
      const count = 50 + Math.floor(Math.random() * 40);
      for (let i = 0; i < count; i++) {
        const a = (Math.PI * 2 * i) / count;
        const s = 1.5 + Math.random() * 3.5;
        sparks.push({ x: cx, y: cy, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1, color });
      }
    };

    const timer = window.setInterval(explode, 1400);
    explode();

    let raf = 0;
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      sparks = sparks.filter((s) => s.life > 0);
      for (const s of sparks) {
        s.vy += 0.02;
        s.vx *= 0.985;
        s.vy *= 0.985;
        s.x += s.vx;
        s.y += s.vy;
        s.life -= 0.011;
        ctx.globalAlpha = Math.max(0, s.life) * 0.85;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.clearInterval(timer);
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full opacity-70" />
  );
}
