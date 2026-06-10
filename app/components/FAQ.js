"use client";
import { useState } from "react";

const FAQS = [
  { q: "How long does it take to build my website?", a: "Most projects are delivered in 7–14 days. Simple landing pages in 5–7 days. Complex e-commerce or web apps may take up to 3 weeks." },
  { q: "Do I need to pay anything upfront?", a: "Yes, we take a 50% advance before starting and the remaining 50% on completion. For smaller projects (₹2499), full payment upfront is required." },
  { q: "Will I own the website and code?", a: "100%. Once the final payment is made, all code, assets, and the deployed site belong to you. We give you access to the GitHub repo and hosting." },
  { q: "What if I'm not happy with the design?", a: "We offer unlimited revisions on Pro and Business plans until you're satisfied. Starter plan includes 3 revision rounds." },
  { q: "Do you provide hosting?", a: "We set up free hosting on Vercel (for Next.js projects) or Netlify. These handle thousands of visitors with zero cost. For heavy traffic or backend-heavy apps, we'll recommend options." },
  { q: "Can I update the website myself after launch?", a: "Yes! We use simple CMS integrations or provide a basic admin panel (on Business plan) so you can update content without touching code." },
  { q: "Do you work with international clients?", a: "Absolutely. We've worked with clients in the UK, UAE, and US. We communicate on WhatsApp and Zoom, and payments are accepted internationally." },
  { q: "What tech stack do you use?", a: "Primarily Next.js, React, and Tailwind CSS for frontend. Supabase or MongoDB for backend. Hosted on Vercel. We choose the best tools for each project." },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);

  return (
    <section id="faq" className="py-20 sm:py-28 relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-5">
        <div className="text-center mb-10 sm:mb-16">
          <p className="section-label mb-4 reveal">FAQ</p>
          <h2 className="display-lg mb-5 reveal reveal-delay-1" style={{ color: "var(--text-primary)" }}>
            Questions? <span className="gradient-text">Answered.</span>
          </h2>
          <p className="text-base reveal reveal-delay-2" style={{ color: "var(--text-secondary)" }}>
            Everything you need to know before getting started with DWS.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map(({ q, a }, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className="glass-card overflow-hidden reveal"
                style={{
                  transitionDelay: `${i * 0.04}s`,
                  borderColor: isOpen ? "rgba(212,175,55,0.35)" : undefined,
                }}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-sm leading-snug" style={{ color: "var(--text-primary)" }}>
                    {q}
                  </span>
                  <span
                    className="shrink-0 w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-300 text-base font-light"
                    style={{
                      borderColor: isOpen ? "#d4af37" : "var(--border)",
                      color: isOpen ? "#d4af37" : "var(--text-muted)",
                      transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                      background: isOpen ? "rgba(212,175,55,0.08)" : "transparent",
                    }}
                  >
                    +
                  </span>
                </button>

                {/* Animated answer — uses grid trick for smooth height */}
                <div
                  className="faq-answer"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="faq-answer-inner">
                    <div
                      className="px-6 pb-5 pt-0 text-sm leading-relaxed"
                      style={{
                        color: "var(--text-secondary)",
                        borderTop: "1px solid var(--border)",
                        paddingTop: "16px",
                      }}
                    >
                      {a}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12 reveal">
          <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>Still have questions?</p>
          <a
            href="https://wa.me/919611241651"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
            style={{ color: "#d4af37" }}
          >
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.9-1.3A10 10 0 1 0 12 2zm4.4 13.6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.7 1-.1.2-.3.2-.5.1a6.5 6.5 0 0 1-3.8-3.3c-.2-.3 0-.4.1-.5l.4-.4c.1-.1.2-.2.3-.4.1-.2 0-.3 0-.4-.1-.1-.6-1.5-.9-2-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2s.8 2.3.9 2.5c.1.2 1.6 2.5 3.9 3.5.5.2.9.4 1.2.5.5.2 1 .2 1.4.1.4-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1z"/>
            </svg>
            Ask us on WhatsApp →
          </a>
        </div>
      </div>
    </section>
  );
}
