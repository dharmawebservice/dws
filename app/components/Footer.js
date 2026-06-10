"use client";
import Link from "next/link";
import { useState } from "react";
import { useTheme } from "./ThemeProvider";

const LINKS = {
  Company: [
    { label: "About",     href: "/about" },
    { label: "Portfolio", href: "/#portfolio" },
    { label: "Blog",      href: "/blog" },
    { label: "Careers",   href: "/careers" },
  ],
  Support: [
    { label: "FAQ",     href: "/#faq" },
    { label: "Contact", href: "/#contact" },
    { label: "Terms",   href: "/terms" },
    { label: "Privacy", href: "/privacy" },
  ],
};

export default function Footer() {
  const [email, setEmail]       = useState("");
  const [subStatus, setSubStatus] = useState("idle");
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return;
    setSubStatus("loading");
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSubStatus("done");
      setEmail("");
    } catch { setSubStatus("done"); }
  };

  return (
    <footer
      className="relative"
      style={{ borderTop: "1px solid var(--section-divider)", background: "var(--surface-2)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-5 py-12 sm:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">

          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={isDark ? "/dws-logo-dark.png" : "/dws-logo-light.png"}
                alt="Dharma Web Services"
                className="h-10 sm:h-12 w-auto object-contain"
              />
            </div>
            <p className="text-sm leading-relaxed mb-5 max-w-xs" style={{ color: "var(--text-secondary)" }}>
              Premium websites for businesses that want to grow. Built fast, built right.
            </p>
            <div className="flex gap-2.5">
              {[
                { icon: "𝕏", href: "https://x.com/DharmaServices", label: "Twitter" },
                {
                  icon: (
                    <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.9a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2z"/>
                    </svg>
                  ),
                  href: "https://instagram.com/dharma_web_services", label: "Instagram",
                },
              ].map(({ icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                   className="w-9 h-9 rounded-lg flex items-center justify-center text-sm transition-all"
                   style={{ border: "1px solid var(--border)", background: "transparent", color: "var(--text-muted)" }}
                   onMouseEnter={e => { e.currentTarget.style.color = "#d4af37"; e.currentTarget.style.borderColor = "rgba(212,175,55,0.40)"; }}
                   onMouseLeave={e => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.borderColor = "var(--border)"; }}>
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {Object.entries(LINKS).map(([title, items]) => (
            <div key={title}>
              <p className="text-xs font-semibold tracking-widest uppercase mb-4 sm:mb-5" style={{ color: "var(--text-muted)" }}>{title}</p>
              <ul className="space-y-2.5 sm:space-y-3">
                {items.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm transition-colors"
                      style={{ color: "var(--text-secondary)" }}
                      onMouseEnter={e => e.currentTarget.style.color = "#d4af37"}
                      onMouseLeave={e => e.currentTarget.style.color = "var(--text-secondary)"}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <p className="text-xs font-semibold tracking-widest uppercase mb-4 sm:mb-5" style={{ color: "var(--text-muted)" }}>Stay Updated</p>
            <p className="text-sm mb-4 leading-relaxed" style={{ color: "var(--text-secondary)" }}>Get notified about new offers and web tips.</p>

            {subStatus === "done" ? (
              <div className="text-sm flex items-center gap-2 text-green-500"><span>✓</span> You&apos;re subscribed!</div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                <input type="email" placeholder="your@email.com" value={email}
                       onChange={e => setEmail(e.target.value)} className="field text-sm py-3" />
                <button type="submit" disabled={subStatus === "loading"}
                        className="py-2.5 rounded-xl gradient-btn font-medium text-sm disabled:opacity-60"
                        style={{ color: "#080808" }}>
                  {subStatus === "loading" ? "Subscribing…" : "Subscribe →"}
                </button>
              </form>
            )}
            <p className="text-xs mt-3 break-all" style={{ color: "var(--text-muted)" }}>dharmawebservice@gmail.com</p>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-5 py-5" style={{ borderTop: "1px solid var(--section-divider)" }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-center" style={{ color: "var(--text-muted)" }}>
          <p>© {new Date().getFullYear()} Dharma Web Services. All rights reserved.</p>
          <p>Made with ❤️ in Hyderabad, India</p>
        </div>
      </div>
    </footer>
  );
}
