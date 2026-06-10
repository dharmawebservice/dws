"use client";
const REASONS = [
  { icon: "⚡", title: "Delivered in 7–14 days",        desc: "No months of waiting. We work fast without cutting corners." },
  { icon: "💎", title: "Premium at affordable prices",   desc: "Agency-quality design at freelancer prices. Starting ₹2499." },
  { icon: "🔒", title: "Free hosting setup",             desc: "We set up Vercel/Netlify for you — zero additional cost." },
  { icon: "📞", title: "WhatsApp support",               desc: "Direct access to us on WhatsApp. No ticketing, no delays." },
  { icon: "🔄", title: "Unlimited revisions",            desc: "We iterate until you're 100% happy. No limits on Pro plan." },
  { icon: "🛡️", title: "1-month post-launch support",   desc: "Free bug fixes and tweaks after launch — we stand by our work." },
];

export default function WhyChoose() {
  return (
    <section id="why" className="py-20 sm:py-28 relative overflow-hidden">
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-150 h-150 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)", filter: "blur(80px)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <p className="section-label mb-4 reveal">Why DWS</p>
            <h2 className="display-lg mb-6 reveal reveal-delay-1" style={{ color: "var(--text-primary)" }}>
              The agency experience,{" "}
              <span className="gradient-text">without the agency price</span>
            </h2>
            <p className="text-lg leading-relaxed mb-10 reveal reveal-delay-2" style={{ color: "var(--text-secondary)" }}>
              We're a lean, focused team obsessed with quality. Every project gets our full attention — no interns, no outsourcing.
            </p>
            <div className="flex items-center gap-4 reveal reveal-delay-3 flex-wrap">
              <a href="#contact" className="px-7 py-3.5 rounded-2xl gradient-btn font-semibold text-sm" style={{ color: "#080808" }}>
                Work With Us →
              </a>
              <a
                href="#portfolio"
                className="text-sm font-medium transition-colors underline underline-offset-4"
                style={{ color: "var(--text-secondary)" }}
                onMouseEnter={e => e.currentTarget.style.color = "#d4af37"}
                onMouseLeave={e => e.currentTarget.style.color = "var(--text-secondary)"}
              >
                See our portfolio
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {REASONS.map(({ icon, title, desc }, i) => (
              <div
                key={i}
                className="glass-card p-5 reveal"
                style={{ transitionDelay: `${i * 0.07}s` }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3"
                  style={{ background: "rgba(212,175,55,0.10)", border: "1px solid rgba(212,175,55,0.20)" }}
                >
                  {icon}
                </div>
                <h3 className="font-semibold text-sm mb-1.5" style={{ color: "var(--text-primary)" }}>{title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
