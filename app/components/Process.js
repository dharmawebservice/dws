"use client";
const STEPS = [
  { num: "01", title: "Discovery Call",     desc: "We understand your goals, audience, and vision in a quick 20-min WhatsApp or Zoom call.", icon: "💬" },
  { num: "02", title: "Design & Prototype", desc: "We build a live preview. You see exactly what you're getting before we write a single line of code.", icon: "🎨" },
  { num: "03", title: "Development",        desc: "Full build with Next.js, animations, and responsive layout. Clean code, fast delivery.", icon: "⌨️" },
  { num: "04", title: "Review & Refine",    desc: "You test it. We revise it. No limits on feedback rounds until you love every pixel.", icon: "🔍" },
  { num: "05", title: "Launch & Handoff",   desc: "We deploy to Vercel, set up your domain, and hand over everything — full ownership.", icon: "🚀" },
];

export default function Process() {
  return (
    <section id="process" className="py-20 sm:py-28 relative overflow-hidden">
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-100 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 70%)", filter: "blur(100px)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-5">
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-20">
          <p className="section-label mb-4 reveal">How It Works</p>
          <h2 className="display-lg mb-5 reveal reveal-delay-1" style={{ color: "var(--text-primary)" }}>
            From idea to <span className="gradient-text">live in 14 days</span>
          </h2>
          <p className="text-base sm:text-lg leading-relaxed reveal reveal-delay-2" style={{ color: "var(--text-secondary)" }}>
            A clear, transparent process with no surprises.
          </p>
        </div>

        <div className="relative">
          <div
            className="hidden lg:block absolute top-12 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.20), transparent)" }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 lg:gap-4">
            {STEPS.map(({ num, title, desc, icon }, i) => (
              <div key={i} className="relative reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="flex sm:flex-col items-start sm:items-center gap-4 sm:gap-0">
                  <div
                    className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all"
                    style={{ border: "1px solid var(--border)", background: "var(--surface-2)" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(212,175,55,0.40)"; e.currentTarget.style.background = "rgba(212,175,55,0.05)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--surface-2)"; }}
                  >
                    <span className="text-xl sm:text-2xl">{icon}</span>
                    <span className="text-xs font-mono" style={{ color: "rgba(212,175,55,0.65)" }}>{num}</span>
                  </div>
                  <div className="sm:mt-5 sm:text-center">
                    <h3 className="font-semibold text-sm mb-1.5" style={{ color: "var(--text-primary)" }}>{title}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{desc}</p>
                  </div>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="sm:hidden flex justify-start pl-10 py-2 text-sm" style={{ color: "var(--border)" }}>↓</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 sm:mt-20 glass-card p-7 sm:p-10 max-w-2xl mx-auto text-center reveal">
          <p className="text-xl sm:text-2xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>Ready to start?</p>
          <p className="mb-6 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Message us on WhatsApp or fill the contact form. We typically respond within 2 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="https://wa.me/919611241651" target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#25d366] text-white font-semibold text-sm hover:bg-[#20b858] transition-colors">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.9-1.3A10 10 0 1 0 12 2zm4.4 13.6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.7 1-.1.2-.3.2-.5.1a6.5 6.5 0 0 1-3.8-3.3c-.2-.3 0-.4.1-.5l.4-.4c.1-.1.2-.2.3-.4.1-.2 0-.3 0-.4-.1-.1-.6-1.5-.9-2-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2s.8 2.3.9 2.5c.1.2 1.6 2.5 3.9 3.5.5.2.9.4 1.2.5.5.2 1 .2 1.4.1.4-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1z"/>
              </svg>
              WhatsApp Us
            </a>
            <a href="#contact" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl gradient-btn font-semibold text-sm" style={{ color: "#080808" }}>
              Fill Contact Form →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
