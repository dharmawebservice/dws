"use client";
import { useState } from "react";

export default function Contact() {
  const [form, setForm]       = useState({ name: "", email: "", service: "", message: "" });
  const [status, setStatus]   = useState("idle");
  const [errors, setErrors]   = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = "Name is required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Valid email required";
    if (!form.message.trim()) e.message = "Message is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStatus("loading");
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus("done");
      setForm({ name: "", email: "", service: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const set = (k) => (e) => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors(p => { const n = { ...p }; delete n[k]; return n; });
  };

  return (
    <section id="contact" className="py-20 sm:py-28 relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(180deg, transparent, rgba(212,175,55,0.02) 50%, transparent)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Left info */}
          <div>
            <p className="section-label mb-4 reveal">Contact</p>
            <h2 className="display-lg mb-6 reveal reveal-delay-1" style={{ color: "var(--text-primary)" }}>
              Let&apos;s build <span className="gradient-text">something great</span>
            </h2>
            <p className="text-lg leading-relaxed mb-8 reveal reveal-delay-2" style={{ color: "var(--text-secondary)" }}>
              Tell us about your project and we&apos;ll get back to you within 2 hours. Free consultation included.
            </p>

            <div className="space-y-4 reveal reveal-delay-3">
              {[
                { icon: "📧", label: "Email", value: "dharmawebservice@gmail.com", href: "mailto:dharmawebservice@gmail.com" },
                { icon: "💬", label: "WhatsApp", value: "+91 9611241651", href: "https://wa.me/919611241651" },
                { icon: "⏱️", label: "Response time", value: "Usually within 24 hours", href: null },
              ].map(({ icon, label, value, href }) => (
                <div key={label} className="flex items-center gap-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-lg shrink-0"
                    style={{ background: "rgba(212,175,55,0.10)", border: "1px solid rgba(212,175,55,0.20)" }}
                  >
                    {icon}
                  </div>
                  <div>
                    <p className="text-xs mb-0.5" style={{ color: "var(--text-muted)" }}>{label}</p>
                    {href ? (
                      <a href={href} target="_blank" rel="noopener noreferrer" className="text-sm font-medium transition-colors" style={{ color: "#d4af37" }}>
                        {value}
                      </a>
                    ) : (
                      <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="glass-card p-7 sm:p-8 reveal reveal-delay-2">
            {status === "done" ? (
              <div className="text-center py-10">
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Message sent!</h3>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>We&apos;ll get back to you within 2 hours.</p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-6 px-6 py-2.5 rounded-xl gradient-btn text-sm font-semibold"
                  style={{ color: "#080808" }}
                >
                  Send another →
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--text-secondary)" }}>Your Name</label>
                    <input value={form.name} onChange={set("name")} placeholder="John Doe" className="field" />
                    {errors.name && <p className="text-xs mt-1 text-red-500">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--text-secondary)" }}>Email</label>
                    <input type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" className="field" />
                    {errors.email && <p className="text-xs mt-1 text-red-500">{errors.email}</p>}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--text-secondary)" }}>Service Needed</label>
                  <select value={form.service} onChange={set("service")} className="field" style={{ cursor: "pointer" }}>
                    <option value="">Select a service…</option>
                    <option>Landing Page (Starter — ₹2499)</option>
                    <option>Business Website (Pro — ₹5999)</option>
                    <option>Full-Stack App (Business — ₹9999)</option>
                    <option>Custom / Not Sure</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--text-secondary)" }}>Tell us about your project</label>
                  <textarea
                    value={form.message}
                    onChange={set("message")}
                    placeholder="Brief description of what you need…"
                    rows={4}
                    className="field resize-none"
                  />
                  {errors.message && <p className="text-xs mt-1 text-red-500">{errors.message}</p>}
                </div>

                {status === "error" && (
                  <p className="text-xs text-red-500">Something went wrong. Please try again or WhatsApp us.</p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-3.5 rounded-2xl gradient-btn font-semibold text-sm disabled:opacity-60 flex items-center justify-center gap-2"
                  style={{ color: "#080808" }}
                >
                  {status === "loading" ? (
                    <><span className="spinner" style={{ borderTopColor: "#080808", borderColor: "rgba(0,0,0,0.2)" }} />Sending…</>
                  ) : (
                    "Send Message →"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
