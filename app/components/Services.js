"use client";

const SERVICES = [
  {
    icon: "🎨",
    title: "UI/UX Design",
    desc: "Pixel-perfect interfaces with smooth animations, responsive polish, and mobile-first layouts that impress from the first scroll.",
    tags: ["Figma", "Framer", "Tailwind"],
    accent: "#d4af37",
  },
  {
    icon: "⚡",
    title: "Performance Builds",
    desc: "Next.js & React websites with 90+ Lighthouse scores, sub-second load times, and Core Web Vitals that Google loves.",
    tags: ["Next.js", "React", "Vercel"],
    accent: "#c0c8d8",
  },
  {
    icon: "🛒",
    title: "E-Commerce",
    desc: "Full-featured online stores with product management, payments, cart, and admin panel. Ready to sell from day one.",
    tags: ["Razorpay", "Stripe", "Supabase"],
    accent: "#34d399",
  },
  {
    icon: "🔧",
    title: "Custom Web Apps",
    desc: "Dashboards, portals, booking systems, and SaaS tools with full backend, auth, and database. Built to scale.",
    tags: ["Node.js", "PostgreSQL", "APIs"],
    accent: "#f59e0b",
  },
  {
    icon: "📱",
    title: "Mobile-First",
    desc: "Every pixel engineered for phones first. Your site looks stunning on every screen size, from 320px to 4K.",
    tags: ["Responsive", "PWA", "Touch"],
    accent: "#ec4899",
  },
  {
    icon: "🚀",
    title: "SEO & Speed",
    desc: "Technical SEO, meta setup, schema markup, and performance tuning so you rank higher and load faster.",
    tags: ["Schema", "Sitemap", "Analytics"],
    accent: "#06b6d4",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-20 sm:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-5">
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-20">
          <p className="section-label mb-4 reveal">What We Build</p>
          <h2 className="display-lg mb-6 reveal reveal-delay-1" style={{ color: "var(--text-primary)" }}>
            Services built for <span className="gradient-text">results</span>
          </h2>
          <p className="text-lg leading-relaxed reveal reveal-delay-2" style={{ color: "var(--text-secondary)" }}>
            From a sleek landing page to a full-stack platform — we build whatever your business needs to grow online.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map(({ icon, title, desc, tags, accent }, i) => (
            <div
              key={i}
              className="relative group glass-card p-7 cursor-default overflow-hidden reveal"
              style={{ transitionDelay: `${(i % 3) * 0.08}s` }}
            >
              {/* Hover bg */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[20px]"
                style={{ background: `linear-gradient(135deg, ${accent}18 0%, transparent 60%)` }}
              />

              <div className="relative">
                <div
                  className="text-3xl mb-4 w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: `${accent}15`, border: `1px solid ${accent}30` }}
                >
                  {icon}
                </div>
                <h3 className="text-lg font-semibold mb-3" style={{ color: "var(--text-primary)" }}>{title}</h3>
                <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--text-secondary)" }}>{desc}</p>
                <div className="flex flex-wrap gap-2">
                  {tags.map(t => (
                    <span
                      key={t}
                      className="text-xs px-3 py-1 rounded-full"
                      style={{ background: `${accent}12`, color: accent, border: `1px solid ${accent}30` }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
