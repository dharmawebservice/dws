"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";

const NAV = [
  { id: "home",      label: "Home" },
  { id: "services",  label: "Services" },
  { id: "pricing",   label: "Pricing" },
  { id: "portfolio", label: "Work" },
  { id: "brands",    label: "Clients" },
  { id: "contact",   label: "Contact" },
];

export default function Header() {
  const [open, setOpen]         = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive]     = useState("home");
  const router   = useRouter();
  const pathname = usePathname();
  const { theme, toggle } = useTheme();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (pathname !== "/") return;
    const sections = document.querySelectorAll("section[id]");
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && setActive(e.target.id)),
      { threshold: 0.35, rootMargin: "-60px 0px 0px 0px" }
    );
    sections.forEach(s => obs.observe(s));
    return () => obs.disconnect();
  }, [pathname]);

  const goTo = (id) => {
    setOpen(false);
    if (pathname === "/") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`/#${id}`);
    }
  };

  const isDark = theme === "dark";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "py-3 shadow-lg"
            : "bg-transparent py-5"
        }`}
        style={scrolled ? { background: "var(--nav-bg)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--nav-border)" } : {}}
      >
        <div className="max-w-7xl mx-auto px-5 flex items-center justify-between">

          {/* ── Logo ── */}
          <button onClick={() => goTo("home")} className="flex items-center gap-3 group">
            <img
              src={isDark ? "/dws-logo-dark.png" : "/dws-logo-light.png"}
              alt="Dharma Web Services"
              className="h-10 w-auto object-contain transition-all duration-300 group-hover:scale-105"
              style={{ filter: "drop-shadow(0 0 0 transparent)", transition: "filter 0.3s" }}
              onMouseEnter={e => { e.currentTarget.style.filter = "drop-shadow(0 0 14px rgba(212,175,55,0.55))"; }}
              onMouseLeave={e => { e.currentTarget.style.filter = "drop-shadow(0 0 0 transparent)"; }}
            />
            <span className="hidden lg:block text-sm font-semibold tracking-wide"
                  style={{ background: "linear-gradient(135deg,#f0d060,#d4af37,#a07828)",
                           WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Dharma Web Services
            </span>
          </button>

          {/* ── Desktop Nav ── */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => goTo(id)}
                className={`relative px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                  active === id
                    ? "text-[#d4af37] font-semibold"
                    : "hover:text-[#d4af37]"
                }`}
                style={{ color: active === id ? "#d4af37" : "var(--text-secondary)" }}
              >
                {label}
                {active === id && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#d4af37]" />
                )}
              </button>
            ))}

            {/* Theme Toggle */}
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className={`theme-toggle ml-2 ${isDark ? "dark-on" : "light-on"}`}
            >
              <span className="theme-toggle-knob">
                {isDark ? "🌙" : "☀️"}
              </span>
            </button>

            <button
              onClick={() => goTo("contact")}
              className="ml-3 px-5 py-2.5 text-sm font-semibold rounded-xl gradient-btn"
              style={{ color: "#080808" }}
            >
              Get Started →
            </button>
          </nav>

          {/* ── Mobile right side ── */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className={`theme-toggle ${isDark ? "dark-on" : "light-on"}`}
            >
              <span className="theme-toggle-knob">
                {isDark ? "🌙" : "☀️"}
              </span>
            </button>
            <button
              onClick={() => setOpen(true)}
              className="w-10 h-10 rounded-xl flex flex-col items-center justify-center gap-1.5 p-2.5"
              style={{ border: "1px solid var(--border)" }}
              aria-label="Open menu"
            >
              <span className="w-full h-0.5 rounded" style={{ background: "#d4af37" }} />
              <span className="w-full h-0.5 rounded" style={{ background: "#d4af37" }} />
              <span className="w-3/4 h-0.5 rounded self-start" style={{ background: "#d4af37" }} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Menu ── */}
      <div
        className={`fixed inset-0 z-60 flex flex-col transition-all duration-400 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ background: "var(--surface-2)", backdropFilter: "blur(24px)" }}
      >
        <div className="flex items-center justify-between px-5 py-5" style={{ borderBottom: "1px solid var(--border)" }}>
          <img
            src={isDark ? "/dws-logo-dark.png" : "/dws-logo-light.png"}
            alt="DWS"
            className="h-9 w-auto object-contain"
          />
          <button
            onClick={() => setOpen(false)}
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ border: "1px solid var(--border)", color: "#d4af37" }}
          >✕</button>
        </div>

        <nav className="flex-1 flex flex-col justify-center gap-1 px-6">
          {NAV.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => goTo(id)}
              className="text-left py-4 text-2xl font-semibold transition-colors"
              style={{ color: "var(--text-secondary)", borderBottom: "1px solid var(--border)" }}
              onMouseEnter={e => e.currentTarget.style.color = "#d4af37"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--text-secondary)"}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="p-6">
          <button
            onClick={() => goTo("contact")}
            className="w-full py-4 rounded-2xl gradient-btn font-bold text-lg"
            style={{ color: "#080808" }}
          >
            Start Your Project →
          </button>
          <p className="text-center text-xs mt-3" style={{ color: "var(--text-muted)" }}>dharmawebservice@gmail.com</p>
        </div>
      </div>
    </>
  );
}
