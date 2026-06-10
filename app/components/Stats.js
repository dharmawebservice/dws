"use client";
import { useEffect, useRef, useState } from "react";

const STATS = [
  { value: 30, suffix: "+",   label: "Projects Delivered", icon: "🚀", decimal: false },
  { value: 100, suffix: "%",  label: "Client Satisfaction", icon: "⭐", decimal: false },
  { value: 0.8, suffix: "s",  label: "Avg Load Time",       icon: "⚡", decimal: true },
  { value: 3,  suffix: " yrs",label: "Industry Experience", icon: "🏆", decimal: false },
];

function Counter({ value, suffix, decimal }) {
  const [count, setCount] = useState(0);
  const ref     = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const duration = 1800, steps = 60;
        const increment = value / steps;
        let current = 0;
        const timer = setInterval(() => {
          current += increment;
          if (current >= value) { setCount(value); clearInterval(timer); }
          else setCount(decimal ? parseFloat(current.toFixed(1)) : Math.floor(current));
        }, duration / steps);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [value, decimal]);

  return (
    <span ref={ref} className="tabular-nums">
      {decimal ? count.toFixed(1) : count}{suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section className="py-12 sm:py-16 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, var(--section-divider), transparent)" }} />
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, var(--section-divider), transparent)" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {STATS.map(({ value, suffix, label, icon, decimal }, i) => (
            <div
              key={i}
              className="glass-card px-6 py-8 text-center group hover:scale-[1.02] transition-all reveal"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className="text-3xl mb-3">{icon}</div>
              <div className="text-4xl md:text-5xl font-extrabold gradient-text mb-2">
                <Counter value={value} suffix={suffix} decimal={decimal} />
              </div>
              <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
