"use client";

const PLANS = [
  {
    name: "Starter", price: 2499, original: 2999, badge: "₹500 OFF",
    desc: "Perfect for small businesses and landing pages.",
    features: ["1–3 pages", "Mobile responsive", "Contact form", "Basic SEO setup", "Free Vercel hosting", "1-week delivery"],
    cta: "Get Started", popular: false,
  },
  {
    name: "Pro", price: 5999, original: null, badge: "Most Popular",
    desc: "For businesses that need a powerful online presence.",
    features: ["Up to 6 pages", "Premium animations", "WhatsApp integration", "Advanced SEO", "Priority support", "Unlimited revisions", "Google Analytics"],
    cta: "Get Pro", popular: true,
  },
  {
    name: "Business", price: 9999, original: null, badge: null,
    desc: "Full-stack solution with backend & admin panel.",
    features: ["Unlimited pages", "Custom admin panel", "Database & backend", "Payment integration", "Performance optimization", "1-month free support", "Full source code"],
    cta: "Go Business", popular: false,
  },
];

export default function Pricing() {
  const scrollToContact = () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="pricing" className="py-20 sm:py-28 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(180deg, transparent, rgba(212,175,55,0.025) 50%, transparent)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-5">
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-20">
          <p className="section-label mb-4 reveal">Pricing</p>
          <h2 className="display-lg mb-5 reveal reveal-delay-1" style={{ color: "var(--text-primary)" }}>
            Simple, <span className="gradient-text">transparent</span> pricing
          </h2>
          <p className="text-base sm:text-lg leading-relaxed reveal reveal-delay-2" style={{ color: "var(--text-secondary)" }}>
            One-time payment. No subscriptions. No hidden charges. You own everything.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {PLANS.map(({ name, price, original, badge, desc, features, cta, popular }, i) => (
            <div
              key={name}
              className={`relative glass-card p-6 sm:p-8 flex flex-col reveal ${popular ? "ring-2 ring-[rgba(212,175,55,0.45)]" : ""}`}
              style={{
                transitionDelay: `${i * 0.1}s`,
                background: popular ? "linear-gradient(135deg, rgba(212,175,55,0.06) 0%, var(--surface-card) 100%)" : undefined,
              }}
            >
              {badge && (
                <div
                  className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                    popular ? "gradient-btn" : ""
                  }`}
                  style={popular ? { color: "#080808" } : { background: "rgba(212,175,55,0.12)", color: "#d4af37", border: "1px solid rgba(212,175,55,0.30)" }}
                >
                  {badge}
                </div>
              )}

              <div className="mb-5">
                <h3 className="font-bold text-lg mb-1" style={{ color: "var(--text-primary)" }}>{name}</h3>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{desc}</p>
              </div>

              <div className="mb-7">
                {original && (
                  <span className="text-sm line-through mr-2" style={{ color: "var(--text-muted)" }}>₹{original.toLocaleString()}</span>
                )}
                <span className="text-4xl sm:text-5xl font-extrabold" style={{ color: "var(--text-primary)" }}>
                  ₹{price.toLocaleString()}
                </span>
                <span className="text-sm ml-1" style={{ color: "var(--text-muted)" }}>/ one-time</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0 mt-0.5">
                      <path d="M5 13l4 4L19 7" stroke={popular ? "#d4af37" : "#34d399"} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={scrollToContact}
                className={`w-full py-3.5 rounded-2xl font-semibold text-sm transition-all active:scale-95 ${
                  popular ? "gradient-btn" : ""
                }`}
                style={popular ? { color: "#080808" } : { border: "1px solid var(--border)", color: "var(--text-secondary)", background: "transparent" }}
                onMouseEnter={e => { if (!popular) { e.currentTarget.style.borderColor = "#d4af37"; e.currentTarget.style.color = "#d4af37"; } }}
                onMouseLeave={e => { if (!popular) { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; } }}
              >
                {cta} →
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-sm mt-10 reveal" style={{ color: "var(--text-muted)" }}>
          Need something custom?{" "}
          <a href="#contact" className="text-[#d4af37] hover:text-[#f0d060] underline underline-offset-2">Let&apos;s talk</a>
        </p>
      </div>
    </section>
  );
}
