import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { birthday as C } from "@/content/birthday";
import { Confetti } from "@/components/birthday/Confetti";
import { Fireworks } from "@/components/birthday/Fireworks";
import { Balloons, Cake, Particles, Reveal } from "@/components/birthday/Decor";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Happy Birthday, Joshua Lazer 🎉" },
      {
        name: "description",
        content:
          "A cinematic birthday surprise made just for Joshua Lazer — confetti, memories and a warm message.",
      },
      { property: "og:title", content: "Happy Birthday, Joshua Lazer 🎉" },
      {
        property: "og:description",
        content: "Open your surprise — a personal birthday experience made just for you.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BirthdayPage,
});

function GlowButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="animate-pulse-glow group relative inline-flex items-center justify-center rounded-full bg-[var(--gradient-gold)] px-8 py-4 text-base font-semibold tracking-wide text-primary-foreground transition-transform duration-300 hover:scale-105 active:scale-95 sm:px-12 sm:py-5 sm:text-lg"
    >
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 rounded-full bg-rose/40 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
    </button>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-gold-gradient animate-shimmer text-center text-3xl font-bold sm:text-5xl">
      {children}
    </h2>
  );
}

function BirthdayPage() {
  const [opened, setOpened] = useState(false);
  const [burst, setBurst] = useState(0);
  const [moreRevealed, setMoreRevealed] = useState(false);
  const [finaleStep, setFinaleStep] = useState(0);
  const mainRef = useRef<HTMLDivElement | null>(null);
  const finaleRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!opened) return;
    const el = finaleRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setFinaleStep(1);
          window.setTimeout(() => setFinaleStep(2), 2200);
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [opened]);

  const open = () => {
    setOpened(true);
    setBurst((b) => b + 1);
    window.setTimeout(() => mainRef.current?.scrollIntoView({ behavior: "smooth" }), 350);
  };

  if (!opened) {
    return (
      <main className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 text-center">
        <Particles />
        <div className="animate-fade-in relative z-10 max-w-xl">
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-6xl">
            {C.opening.hey}
          </h1>
          <p className="mt-6 text-lg text-muted-foreground sm:text-xl">{C.opening.tease}</p>
          <div className="mt-12">
            <GlowButton onClick={open}>{C.opening.button}</GlowButton>
          </div>
        </div>
        <p className="absolute bottom-6 text-xs text-muted-foreground">{C.footer}</p>
      </main>
    );
  }

  return (
    <main className="relative overflow-hidden">
      <Confetti burstKey={burst} />
      <Particles count={34} />

      {/* Hero */}
      <section
        ref={mainRef}
        className="relative flex min-h-[100svh] flex-col items-center justify-center px-6 py-20 text-center"
      >
        <Balloons />
        <div className="animate-scale-in relative z-10 max-w-3xl">
          <h1 className="font-display text-gold-gradient animate-shimmer text-3xl leading-tight font-extrabold sm:text-6xl">
            {C.hero.title}
          </h1>
          <div className="mt-10">
            <Cake />
          </div>
          <p className="mx-auto mt-10 max-w-xl text-base whitespace-pre-line text-muted-foreground sm:text-xl">
            {C.hero.message}
          </p>
          <p className="mt-12 text-xs tracking-[0.3em] text-muted-foreground uppercase">
            scroll down ↓
          </p>
        </div>
      </section>

      {/* Celebration */}
      <section className="relative px-6 py-24">
        <Reveal className="mx-auto max-w-3xl">
          <div className="glass relative overflow-hidden rounded-3xl p-8 text-center sm:p-14">
            <Balloons count={4} />
            <SectionTitle>{C.celebration.heading}</SectionTitle>
            <p className="relative z-10 mt-6 text-xl font-medium sm:text-2xl">
              {C.celebration.line}
            </p>
            <div className="relative z-10 mt-10">
              <Cake candles={4} />
            </div>
            <button
              onClick={() => setBurst((b) => b + 1)}
              className="relative z-10 mt-10 rounded-full border border-gold/50 px-6 py-3 text-sm font-medium text-gold transition-colors hover:bg-gold/10"
            >
              🎊 Throw more confetti
            </button>
          </div>
        </Reveal>
      </section>

      {/* Message */}
      <section className="relative px-6 py-24">
        <Reveal className="mx-auto max-w-3xl">
          <div className="glass rounded-3xl p-8 text-center sm:p-14">
            <SectionTitle>{C.note.heading}</SectionTitle>
            <p className="font-hand mt-8 text-2xl leading-relaxed whitespace-pre-line text-foreground/90 sm:text-4xl">
              {C.note.text}
            </p>
          </div>
        </Reveal>
      </section>

      {/* Memory Lane */}
      <section className="relative px-6 py-24">
        <Reveal>
          <SectionTitle>{C.memories.heading}</SectionTitle>
        </Reveal>
        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {C.memories.photos.map((p, i) => (
            <Reveal key={i} delay={i * 90}>
              <figure
                className="glass rounded-sm p-3 pb-5 transition-transform duration-500 hover:-translate-y-2 hover:rotate-0"
                style={{ transform: `rotate(${i % 2 === 0 ? -2.5 : 2.5}deg)` }}
              >
                <div className="flex aspect-[4/5] items-center justify-center overflow-hidden rounded-sm bg-[linear-gradient(140deg,oklch(0.35_0.1_300),oklch(0.28_0.09_5))]">
                  {p.src ? (
                    <img
                      src={p.src}
                      alt={p.caption}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="px-4 text-center text-sm text-muted-foreground">
                      📸 Add a photo here
                    </span>
                  )}
                </div>
                <figcaption className="font-hand mt-3 text-center text-xl text-foreground/85">
                  {p.caption}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Reasons */}
      <section className="relative px-6 py-24">
        <Reveal>
          <SectionTitle>{C.reasons.heading}</SectionTitle>
        </Reveal>
        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {C.reasons.items.map((r, i) => (
            <Reveal key={r.title} delay={i * 80}>
              <button
                onClick={() => setBurst((b) => b + 1)}
                className="glass group h-full w-full rounded-2xl p-7 text-left transition-all duration-500 hover:-translate-y-2 hover:border-gold/60 hover:shadow-[var(--shadow-glow)]"
              >
                <span className="block text-4xl transition-transform duration-500 group-hover:scale-125">
                  {r.emoji}
                </span>
                <span className="mt-4 block text-lg font-semibold text-gold">{r.title}</span>
                <span className="mt-1 block text-sm text-muted-foreground">{r.note}</span>
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Surprise */}
      <section className="relative px-6 py-24 text-center">
        {!moreRevealed ? (
          <Reveal>
            <GlowButton
              onClick={() => {
                setMoreRevealed(true);
                setBurst((b) => b + 1);
              }}
            >
              {C.surprise.button}
            </GlowButton>
          </Reveal>
        ) : (
          <div className="animate-scale-in mx-auto max-w-3xl">
            <div className="glass rounded-3xl p-8 sm:p-14">
              <h2 className="font-display text-gold-gradient animate-shimmer text-3xl font-extrabold sm:text-5xl">
                {C.surprise.title}
              </h2>
              <p className="mt-8 text-base whitespace-pre-line text-muted-foreground sm:text-xl">
                {C.surprise.text}
              </p>
              <p className="animate-float mt-12 text-2xl font-extrabold text-rose sm:text-4xl">
                {C.surprise.banner}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Finale */}
      <section
        ref={finaleRef}
        className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 text-center"
      >
        <Fireworks />
        {finaleStep >= 1 && <Confetti continuous />}
        <div className="relative z-10 max-w-2xl">
          <p
            className={`font-display text-2xl text-muted-foreground transition-opacity duration-1000 sm:text-3xl ${
              finaleStep >= 2 ? "opacity-40" : "opacity-100"
            }`}
          >
            {C.finale.tease}
          </p>
          {finaleStep >= 2 && (
            <div className="animate-fade-in mt-10">
              <h2 className="font-display text-gold-gradient animate-shimmer text-3xl leading-tight font-extrabold sm:text-6xl">
                {C.finale.title}
              </h2>
              <p className="mt-6 text-base text-muted-foreground sm:text-xl">
                {C.finale.subtitle}
              </p>
            </div>
          )}
        </div>
      </section>

      <footer className="relative z-10 py-10 text-center text-sm text-muted-foreground">
        {C.footer}
      </footer>
    </main>
  );
}
