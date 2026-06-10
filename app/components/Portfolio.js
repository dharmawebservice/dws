"use client";
import { useState, useEffect, useRef } from "react";

const PROJECTS = [
  {
    title: "CraveCart",
    category: "E-Commerce",
    desc: "Full-stack food delivery platform with real-time cart, Razorpay payments, and admin dashboard.",
    url: "https://crave-cart-82wd.onrender.com",
    image: "/portfolio/1.webp",
    tags: ["Next.js", "Node.js", "MongoDB"],
    accent: "#f97316",
  },
  {
    title: "Diyami Productions",
    category: "Creative Agency",
    desc: "Visually rich portfolio site for a production house with video embeds and smooth scroll animations.",
    url: "https://diyamiproductions.com",
    image: "/portfolio/2.webp",
    tags: ["React", "GSAP", "Vercel"],
    accent: "#ec4899",
  },
  {
    title: "AC5 Construction",
    category: "Corporate",
    desc: "Professional website for a UK-based construction company with service listings and contact pipeline.",
    url: "https://www.ac5construction.co.uk",
    image: "/portfolio/3.webp",
    tags: ["Next.js", "Tailwind", "Netlify"],
    accent: "#6366f1",
  },
  {
    title: "Subio Foods",
    category: "Food & Beverage",
    desc: "Brand website for an artisan food startup with product showcase, story, and online order flow.",
    url: "https://subiofoods.com",
    image: "/portfolio/1.webp",
    tags: ["React", "Framer Motion", "Vercel"],
    accent: "#22c55e",
  },
];

const FILTERS = ["All", "E-Commerce", "Creative Agency", "Corporate", "Food & Beverage"];

export default function Portfolio() {
  const [active, setActive] = useState("All");
  const [visible, setVisible] = useState([]);
  const [animate, setAnimate] = useState(false);
  const prevFilter = useRef("All");

  const filtered = active === "All" ? PROJECTS : PROJECTS.filter(p => p.category === active);

  useEffect(() => {
    if (prevFilter.current !== active) {
      setAnimate(false);
      const t = setTimeout(() => {
        setAnimate(true);
        prevFilter.current = active;
      }, 80);
      return () => clearTimeout(t);
    } else {
      setAnimate(true);
    }
  }, [active]);

  return (
    <section id="portfolio" className="py-20 sm:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-5">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <p className="section-label mb-4 reveal">Our Work</p>
          <h2 className="display-lg mb-5 reveal reveal-delay-1" style={{ color: "var(--text-primary)" }}>
            Projects we&apos;re <span className="gradient-text">proud of</span>
          </h2>
          <p className="text-base sm:text-lg leading-relaxed reveal reveal-delay-2" style={{ color: "var(--text-secondary)" }}>
            Real projects, real results. Each one built with care and launched on time.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 sm:mb-12 reveal reveal-delay-3">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
              style={
                active === f
                  ? {
                      background: "linear-gradient(135deg, #d4af37, #a07828)",
                      color: "#fff",
                      boxShadow: "0 3px 12px rgba(212,175,55,0.35)",
                    }
                  : {
                      background: "var(--surface-2)",
                      color: "var(--text-secondary)",
                      border: "1px solid var(--border)",
                    }
              }
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map(({ title, category, desc, url, image, tags, accent }, i) => (
            <a
              key={title}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative glass-card overflow-hidden"
              style={{
                opacity: animate ? 1 : 0,
                transform: animate ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 0.4s ease ${i * 0.08}s, transform 0.4s ease ${i * 0.08}s`,
              }}
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden" style={{ background: "var(--surface-3)" }}>
                <div
                  className="absolute inset-0 z-10"
                  style={{
                    background: `linear-gradient(135deg, ${accent}22 0%, transparent 60%)`,
                  }}
                />
                <img
                  src={image}
                  alt={title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  onError={e => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.parentElement.style.background = `linear-gradient(135deg, ${accent}33, var(--surface-3))`;
                  }}
                />
                <div
                  className="absolute inset-0 z-20"
                  style={{ background: "linear-gradient(to top, var(--surface-2) 0%, transparent 60%)" }}
                />
                {/* Category badge */}
                <div
                  className="absolute top-4 left-4 z-30 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{
                    background: `${accent}22`,
                    color: accent,
                    border: `1px solid ${accent}44`,
                    backdropFilter: "blur(8px)",
                  }}
                >
                  {category}
                </div>
                {/* Arrow */}
                <div
                  className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.25)",
                    color: "#fff",
                  }}
                >
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-bold text-lg mb-2" style={{ color: "var(--text-primary)" }}>{title}</h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>{desc}</p>
                <div className="flex flex-wrap gap-2">
                  {tags.map(t => (
                    <span
                      key={t}
                      className="text-xs px-2.5 py-1 rounded-full"
                      style={{
                        background: "var(--surface-3)",
                        color: "var(--text-secondary)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16" style={{ color: "var(--text-muted)" }}>
            No projects in this category yet.
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-14 reveal">
          <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>Want to see your project here?</p>
          <a href="#contact" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl gradient-btn font-semibold text-sm" style={{ color: "#080808" }}>
            Start Your Project →
          </a>
        </div>
      </div>
    </section>
  );
}
