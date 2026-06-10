"use client";
import { useState } from "react";

const TESTIMONIALS = [
  {
    name: "Rajesh Kumar",
    role: "Founder, CraveCart",
    text: "DWS delivered our food delivery platform in under 2 weeks. The code quality is excellent and the UI is exactly what we envisioned. Highly recommend!",
    avatar: "RK", rating: 5, color: "from-orange-500 to-red-500",
  },
  {
    name: "Priya Sharma",
    role: "Director, Diyami Productions",
    text: "We needed a creative site that matched our brand energy. DWS nailed it — the animations are smooth, the design is premium, and the site loads super fast.",
    avatar: "PS", rating: 5, color: "from-pink-500 to-violet-500",
  },
  {
    name: "James O'Connor",
    role: "CEO, AC5 Construction",
    text: "Professional service, excellent communication despite the time zone difference. Our UK website is clean, fast, and has already brought us new clients.",
    avatar: "JO", rating: 5, color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Meera Patel",
    role: "Owner, Subio Foods",
    text: "The website they built for Subio is beautiful. Our online orders increased by 40% in the first month. Worth every rupee and more.",
    avatar: "MP", rating: 5, color: "from-green-500 to-teal-500",
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);

  return (
    <section id="testimonials" className="py-20 sm:py-28 relative overflow-hidden">
      <div
        className="absolute left-1/4 bottom-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)", filter: "blur(100px)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-5">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <p className="section-label mb-4 reveal">Client Love</p>
          <h2 className="display-lg mb-5 reveal reveal-delay-1" style={{ color: "var(--text-primary)" }}>
            Don&apos;t just take <span className="gradient-text">our word</span>
          </h2>
          <p className="text-base reveal reveal-delay-2" style={{ color: "var(--text-secondary)" }}>
            Real feedback from real clients who&apos;ve grown with us.
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-8 reveal">
          <div className="glass-card p-7 sm:p-10 text-center relative overflow-hidden">
            <div
              className="absolute inset-0 rounded-[20px]"
              style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.05) 0%, transparent 60%)" }}
            />
            <div className="relative">
              <div className="flex justify-center gap-1 mb-5 sm:mb-6">
                {Array(TESTIMONIALS[active].rating).fill(0).map((_, i) => (
                  <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="#d4af37">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
              <blockquote className="text-base sm:text-xl leading-relaxed mb-6 sm:mb-8 font-light italic" style={{ color: "var(--text-primary)" }}>
                &ldquo;{TESTIMONIALS[active].text}&rdquo;
              </blockquote>
              <div className="flex items-center justify-center gap-3">
                <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${TESTIMONIALS[active].color} flex items-center justify-center font-bold text-sm text-white shrink-0`}>
                  {TESTIMONIALS[active].avatar}
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{TESTIMONIALS[active].name}</p>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{TESTIMONIALS[active].role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-2 sm:gap-3 flex-wrap reveal">
          {TESTIMONIALS.map(({ name, avatar, color }, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all text-sm"
              style={
                active === i
                  ? { border: "1px solid rgba(212,175,55,0.55)", background: "rgba(212,175,55,0.10)", color: "var(--text-primary)" }
                  : { border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text-secondary)" }
              }
            >
              <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-xs font-bold text-white shrink-0`}>
                {avatar}
              </div>
              <span>{name.split(" ")[0]}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
