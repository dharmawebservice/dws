"use client";
import { useState, useEffect } from "react";
import { useTheme } from "./ThemeProvider";

const WORDS = [
  "That Sell",
  "That Rank",
  "That Grow",
  "That Scale",
];

export default function Hero() {
  const [wordIdx, setWordIdx]   = useState(0);
  const [typed, setTyped]       = useState("");
  const [deleting, setDeleting] = useState(false);
  const [mouse, setMouse]       = useState({ x: 0, y: 0 });
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const word = WORDS[wordIdx];
    let timer;
    if (!deleting) {
      if (typed.length < word.length) timer = setTimeout(() => setTyped(word.slice(0, typed.length + 1)), 80);
      else timer = setTimeout(() => setDeleting(true), 2200);
    } else {
      if (typed.length > 0) timer = setTimeout(() => setTyped(typed.slice(0, -1)), 45);
      else { setDeleting(false); setWordIdx(i => (i + 1) % WORDS.length); }
    }
    return () => clearTimeout(timer);
  }, [typed, deleting, wordIdx]);

  useEffect(() => {
    const onMove = e => setMouse({
      x: (e.clientX / window.innerWidth  - 0.5) * 60,
      y: (e.clientY / window.innerHeight - 0.5) * 60,
    });
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">

      {/* BG glows */}
      <div className="absolute w-150 h-150 rounded-full pointer-events-none"
        style={{
          background: isDark
            ? "radial-gradient(circle, rgba(212,175,55,0.18) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(212,175,55,0.14) 0%, transparent 70%)",
          left: "0%", top: "5%",
          filter: "blur(120px)",
          transform: `translate(${mouse.x * 0.6}px, ${mouse.y * 0.6}px)`,
          transition: "transform 0.3s ease-out",
          animation: "glow-pulse 5s ease-in-out infinite",
        }}
      />
      <div className="absolute w-100 h-100 rounded-full pointer-events-none"
        style={{
          background: isDark
            ? "radial-gradient(circle, rgba(192,200,216,0.10) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(160,120,40,0.08) 0%, transparent 70%)",
          right: "0%", bottom: "10%",
          filter: "blur(120px)",
          transform: `translate(${-mouse.x * 0.4}px, ${-mouse.y * 0.4}px)`,
          transition: "transform 0.3s ease-out",
        }}
      />

      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(212,175,55,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(212,175,55,0.5) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
          opacity: isDark ? 0.018 : 0.025,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-5 pt-28 sm:pt-32 pb-16 sm:pb-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* ── LEFT ── */}
          <div>
            <div
              className="inline-flex items-center gap-2.5 mb-6 px-4 py-2 rounded-full"
              style={{ border: "1px solid rgba(212,175,55,0.35)", background: "rgba(212,175,55,0.08)" }}
            >
              <span className="w-2 h-2 rounded-full animate-pulse shrink-0" style={{ background: "#d4af37" }} />
              <span className="text-xs sm:text-sm font-medium" style={{ color: "#d4af37" }}>Now accepting new projects</span>
            </div>

            <h1 className="display-xl mb-5 sm:mb-6">
              <span className="block" style={{ color: "var(--text-primary)" }}>Websites</span>
              <span className="block gradient-text min-h-[1.1em]">
                {typed}
                <span className="inline-block w-0.5 h-[0.85em] ml-1 animate-pulse align-middle" style={{ background: "#d4af37" }} />
              </span>
            </h1>

            <p className="text-base sm:text-lg leading-relaxed max-w-lg mb-8 sm:mb-10" style={{ color: "var(--text-secondary)" }}>
              Premium UI, blazing speed, and animations that make visitors stay. Built for startups and growing businesses across India and beyond.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 sm:py-4 rounded-2xl gradient-btn font-semibold text-[0.95rem]"
                style={{ color: "#080808" }}
              >
                Start Your Project
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a
                href="#portfolio"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 sm:py-4 rounded-2xl border font-medium text-[0.95rem] transition-all"
                style={{ border: "1px solid var(--border)", color: "var(--text-secondary)" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#d4af37"; e.currentTarget.style.color = "#d4af37"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
              >
                View Our Work
              </a>
            </div>

            {/* Trust row */}
            <div className="mt-10 sm:mt-12 flex items-center gap-5 flex-wrap">
              <div className="flex -space-x-2">
                {["S", "R", "K", "M"].map((l, i) => (
                  <div key={i} className="w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs font-bold"
                       style={{ borderColor: "var(--surface)", background: "linear-gradient(135deg,#d4af37,#a07828)", color: "#fff" }}>
                    {l}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-0.5 mb-0.5">
                  {Array(5).fill(0).map((_, i) => (
                    <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="#d4af37">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Trusted by 30+ businesses</p>
              </div>
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div className="hidden sm:flex relative justify-center items-center">
            <div className="animate-float relative w-full max-w-105 lg:max-w-115">
              <div className="glass-card p-1 overflow-hidden">
                <div className="rounded-[18px] overflow-hidden" style={{ background: "var(--surface-2)" }}>
                  {/* Browser chrome */}
                  <div className="flex items-center gap-1.5 px-4 py-3" style={{ borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
                    {["#ef4444", "#f59e0b", "#22c55e"].map((c, i) => (
                      <div key={i} className="w-3 h-3 rounded-full" style={{ background: c }} />
                    ))}
                    <div className="ml-2 flex-1 rounded-md px-3 py-1 text-xs" style={{ background: "var(--surface-3)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>
                      dws.monster
                    </div>
                  </div>
                  {/* Logo showcase */}
                  <div className="flex flex-col items-center justify-center py-8 px-6 gap-4">
                    <img
                      src={isDark ? "/dws-logo-dark.png" : "/dws-logo-light.png"}
                      alt="DWS"
                      className="w-32 h-32 sm:w-40 sm:h-40 object-contain"
                      style={{ filter: "drop-shadow(0 0 28px rgba(212,175,55,0.40))" }}
                    />
                    <p className="text-xs tracking-widest uppercase font-semibold" style={{ color: "#d4af37" }}>Dharma Web Services</p>
                    <div className="grid grid-cols-3 gap-3 w-full mt-1">
                      {[["85", "Design"], ["92", "Speed"], ["97", "SEO"]].map(([n, label], i) => (
                        <div key={i} className="rounded-xl p-3 text-center" style={{ border: "1px solid var(--border)", background: "rgba(212,175,55,0.04)" }}>
                          <div className="text-xl font-bold gradient-text">{n}</div>
                          <div className="text-[0.65rem] mt-0.5" style={{ color: "var(--text-muted)" }}>{label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating chips */}
              <div className="hidden lg:flex animate-float-slow absolute -left-10 top-16 glass-card px-3 py-2 items-center gap-2 text-xs font-medium whitespace-nowrap">
                <span>⚡</span><span style={{ color: "#f0d060" }}>0.8s Load Time</span>
              </div>
              <div className="hidden lg:flex animate-float-slower absolute -right-8 bottom-28 glass-card px-3 py-2 items-center gap-2 text-xs font-medium whitespace-nowrap">
                <span>✨</span>
                <span style={{ color: "#c0c8d8" }}>Premium UI</span>
              </div>
              <div className="animate-float absolute right-3 top-4 glass-card px-2.5 py-1.5 flex items-center gap-1.5 text-xs font-medium whitespace-nowrap">
                <span className="text-green-500">●</span><span style={{ color: "var(--text-secondary)" }}>Live</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 animate-bounce" style={{ opacity: 0.4 }}>
        <span className="text-xs tracking-widest uppercase" style={{ color: "#d4af37" }}>scroll</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
