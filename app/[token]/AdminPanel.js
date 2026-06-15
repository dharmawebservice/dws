"use client";
import { useState, useEffect, useCallback } from "react";
async function adminFetch(url, options = {}) {
  return fetch(url, {
    credentials: "include",
    cache: "no-store",
    ...options,
  });
}

/* ── helpers ─────────────────────────────────────────────────────────────── */
function fmt(n) { return Number(n || 0).toLocaleString("en-IN"); }

/* ── Login ───────────────────────────────────────────────────────────────── */
function LoginScreen({ onLogin }) {
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await adminFetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) onLogin();
    else setError("Incorrect password. Try again.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
         style={{ background: "#0b0b12" }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img src="/dws-logo.png" alt="DWS"
               className="h-16 w-auto object-contain mx-auto mb-5"
               style={{ filter: "drop-shadow(0 0 16px rgba(212,175,55,0.4))" }} />
          <h1 className="text-xl font-bold text-white">Admin Access</h1>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
            Enter your password to continue
          </p>
        </div>
        <form onSubmit={handleLogin}
              className="rounded-2xl border p-7 space-y-4"
              style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(212,175,55,0.15)" }}>
          <input type="password" placeholder="Password" value={password}
                 onChange={e => setPassword(e.target.value)}
                 className="admin-input" autoFocus required />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl gradient-btn font-semibold text-sm disabled:opacity-60 flex items-center justify-center gap-2">
            {loading ? <><span className="spinner" /> Verifying…</> : "Enter →"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ── Stat Card ───────────────────────────────────────────────────────────── */
function StatCard({ label, value, sub, accent = "#d4af37" }) {
  return (
    <div className="rounded-2xl border p-5"
         style={{ background: "rgba(255,255,255,0.025)", borderColor: "rgba(255,255,255,0.08)" }}>
      <p className="text-xs mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
      {sub && <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>{sub}</p>}
    </div>
  );
}

/* ── Bar Chart ───────────────────────────────────────────────────────────── */
function BarChart({ data = [] }) {
  if (!data.length) return null;
  const visible = data.slice(-30);
  const max     = Math.max(...visible.map(d => d.unique), 1);

  return (
    <div className="flex items-end gap-[2px] sm:gap-[3px] h-20 w-full">
      {visible.map((d, i) => {
        const pct      = Math.max((d.unique / max) * 100, d.unique > 0 ? 6 : 2);
        const isToday  = i === visible.length - 1;
        const isWeekend = new Date(d.date).getDay() % 6 === 0;
        return (
          <div key={d.date} className="relative group flex-1 flex flex-col justify-end h-full">
            <div style={{
              height: `${pct}%`,
              background: isToday ? "#d4af37" : isWeekend ? "rgba(192,200,216,0.35)" : "rgba(255,255,255,0.18)",
              borderRadius: "2px 2px 0 0",
              transition: "background 0.2s",
              minHeight: d.unique > 0 ? "4px" : "2px",
            }} />
            {/* tooltip */}
            <div className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 z-20 px-2 py-1
                            rounded-lg border whitespace-nowrap text-[11px] text-white
                            opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                 style={{ background: "#1a1a2e", borderColor: "rgba(212,175,55,0.25)" }}>
              {d.label}: <span className="font-bold">{d.unique}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Visitors Tab ─────────────────────────────────────────────────────────── */
function VisitorsTab() {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const loadStats = async () => {
    setLoading(true); setError(null);
    try {
      const res = await adminFetch("/api/admin/visits");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setStats(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadStats(); }, []);

  if (loading) return (
    <div className="text-center py-24 flex flex-col items-center gap-3">
      <div className="spinner" />
      <p style={{ color: "rgba(255,255,255,0.3)" }}>Loading analytics…</p>
    </div>
  );

  if (error) return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-red-500/20 p-6 text-center"
           style={{ background: "rgba(239,68,68,0.05)" }}>
        <p className="text-red-400 font-medium mb-1">Could not load visitor data</p>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>{error}</p>
        <button onClick={loadStats}
                className="mt-4 px-4 py-2 rounded-xl text-sm font-medium"
                style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)" }}>
          Try Again
        </button>
      </div>
      <SetupGuide />
    </div>
  );

  const trend = stats.yesterdayUnique > 0
    ? (((stats.todayUnique - stats.yesterdayUnique) / stats.yesterdayUnique) * 100).toFixed(0)
    : null;

  return (
    <div className="space-y-6">
      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Today's Visitors" value={fmt(stats.todayUnique)}
          sub={trend !== null ? `${trend >= 0 ? "+" : ""}${trend}% vs yesterday` : "First day tracked"} />
        <StatCard label="Yesterday" value={fmt(stats.yesterdayUnique)} sub="Unique visitors" />
        <StatCard label="Last 30 Days" value={fmt(stats.last30Unique)} sub="Unique visitors" />
        <StatCard label="All-Time Hits" value={fmt(stats.totalHits)} sub="Total page loads" />
      </div>

      {/* Chart */}
      <div className="rounded-2xl border p-5 sm:p-6"
           style={{ background: "rgba(255,255,255,0.025)", borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-semibold text-white text-sm">Daily Unique Visitors</h3>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>Last 30 days</p>
          </div>
          <button onClick={loadStats}
                  className="text-xs px-3 py-1.5 rounded-lg transition-colors"
                  style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)" }}>
            ↻ Refresh
          </button>
        </div>
        <BarChart data={stats.daily} />
        {stats.daily?.length > 0 && (
          <div className="flex justify-between mt-2 text-[10px]"
               style={{ color: "rgba(255,255,255,0.25)" }}>
            <span>{stats.daily[0]?.label}</span>
            <span>{stats.daily[Math.floor(stats.daily.length / 2)]?.label}</span>
            <span>{stats.daily[stats.daily.length - 1]?.label} (today)</span>
          </div>
        )}
        {/* Legend */}
        <div className="flex gap-4 mt-4 text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-2 rounded-sm inline-block" style={{ background: "#d4af37" }} />
            Today
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-2 rounded-sm inline-block" style={{ background: "rgba(192,200,216,0.35)" }} />
            Weekend
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-2 rounded-sm inline-block" style={{ background: "rgba(255,255,255,0.18)" }} />
            Weekday
          </span>
        </div>
      </div>

      {/* Top pages */}
      {stats.topPages?.length > 0 && (
        <div className="rounded-2xl border p-5 sm:p-6"
             style={{ background: "rgba(255,255,255,0.025)", borderColor: "rgba(255,255,255,0.08)" }}>
          <h3 className="font-semibold text-white text-sm mb-4">Top Pages Today</h3>
          <div className="space-y-3">
            {stats.topPages.map(({ path, count }) => {
              const maxCount = stats.topPages[0]?.count || 1;
              return (
                <div key={path}>
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: "rgba(255,255,255,0.65)" }}>{path || "/"}</span>
                    <span className="font-semibold" style={{ color: "#d4af37" }}>{count}</span>
                  </div>
                  <div className="rounded-full h-1.5 w-full" style={{ background: "rgba(255,255,255,0.07)" }}>
                    <div className="h-1.5 rounded-full"
                         style={{ width: `${(count / maxCount) * 100}%`, background: "linear-gradient(90deg,#d4af37,#f0d060)" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Daily table */}
      <div className="rounded-2xl border p-5 sm:p-6"
           style={{ background: "rgba(255,255,255,0.025)", borderColor: "rgba(255,255,255,0.08)" }}>
        <h3 className="font-semibold text-white text-sm mb-4">Daily Breakdown — Last 30 Days</h3>
        <div className="overflow-x-auto">
          <table className="admin-table w-full">
            <thead>
              <tr>
                <th>Date</th>
                <th>Unique Visitors</th>
                <th className="w-40">Bar</th>
              </tr>
            </thead>
            <tbody>
              {[...stats.daily].reverse().map(d => {
                const maxU    = Math.max(...stats.daily.map(x => x.unique), 1);
                const pct     = (d.unique / maxU) * 100;
                const isToday = d.date === new Date().toISOString().split("T")[0];
                return (
                  <tr key={d.date}>
                    <td className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                      {d.label}
                      {isToday && (
                        <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full"
                              style={{ background: "rgba(212,175,55,0.2)", color: "#d4af37" }}>
                          today
                        </span>
                      )}
                    </td>
                    <td className="font-bold text-white text-sm">{d.unique}</td>
                    <td>
                      <div className="rounded-full h-1.5 w-full" style={{ background: "rgba(255,255,255,0.07)" }}>
                        <div className="h-1.5 rounded-full transition-all"
                             style={{
                               width: `${pct}%`,
                               background: isToday ? "#d4af37" : "rgba(255,255,255,0.3)",
                             }} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <SetupGuide />
    </div>
  );
}

function SetupGuide() {
  return (
    <div className="rounded-2xl border p-5"
         style={{ background: "rgba(212,175,55,0.04)", borderColor: "rgba(212,175,55,0.2)" }}>
      <p className="text-xs font-semibold mb-2" style={{ color: "rgba(212,175,55,0.9)" }}>
        📡 Visitor Tracking Setup
      </p>
      <p className="text-xs leading-relaxed mb-3" style={{ color: "rgba(255,255,255,0.45)" }}>
        1. Run the SQL below in your Supabase SQL editor to create the table.
        <br />2. Add the tracking call to your <code className="px-1 rounded text-xs" style={{ background: "rgba(255,255,255,0.1)", color: "#f0d060" }}>layout.js</code>.
      </p>
      <details className="group">
        <summary className="text-xs cursor-pointer font-medium" style={{ color: "#d4af37" }}>
          Show SQL Migration ▾
        </summary>
        <pre className="mt-3 p-3 rounded-xl overflow-x-auto text-[11px] leading-relaxed"
             style={{ background: "rgba(0,0,0,0.4)", color: "rgba(255,255,255,0.6)" }}>
{`CREATE TABLE IF NOT EXISTS page_visits (
  id           bigserial PRIMARY KEY,
  visitor_ip   text NOT NULL,
  visit_date   date NOT NULL DEFAULT CURRENT_DATE,
  page_path    text NOT NULL DEFAULT '/',
  user_agent   text,
  hit_count    int  NOT NULL DEFAULT 1,
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (visitor_ip, visit_date, page_path)
);

CREATE INDEX IF NOT EXISTS idx_visits_date
  ON page_visits (visit_date DESC);

-- Enable Row Level Security but allow service role full access
ALTER TABLE page_visits ENABLE ROW LEVEL SECURITY;`}
        </pre>
      </details>
      <details className="group mt-3">
        <summary className="text-xs cursor-pointer font-medium" style={{ color: "#d4af37" }}>
          Show layout.js tracking call ▾
        </summary>
        <pre className="mt-3 p-3 rounded-xl overflow-x-auto text-[11px] leading-relaxed"
             style={{ background: "rgba(0,0,0,0.4)", color: "rgba(255,255,255,0.6)" }}>
{`// Add this to your app/layout.js inside a useEffect
// (wrap in a Client Component or inline script)
useEffect(() => {
  fetch('/api/visits', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ page: window.location.pathname }),
  }).catch(() => {});
}, []);`}
        </pre>
      </details>
    </div>
  );
}

/* ── Transactions Tab ─────────────────────────────────────────────────────── */
const EMPTY_FORM = {
  client_name: "", client_email: "", client_phone: "",
  service_type: "Website", package_name: "Pro",
  amount: "", payment_status: "pending", payment_method: "",
  notes: "", project_url: "", deadline: "",
};

const PAY_METHODS = [
  { value: "",                   label: "— Select Method —" },
  { value: "UPI",                label: "💸 UPI" },
  { value: "Cash",               label: "💵 Cash" },
  { value: "Account Transfer",   label: "🏦 Account Transfer" },
  { value: "Cheque",             label: "📄 Cheque" },
  { value: "Other",              label: "Other" },
];

function StatusBadge({ s }) {
  const map = {
    paid:      { bg: "rgba(16,185,129,0.15)",  color: "#34d399" },
    pending:   { bg: "rgba(245,158,11,0.15)",  color: "#fbbf24" },
    partial:   { bg: "rgba(59,130,246,0.15)",  color: "#60a5fa" },
    cancelled: { bg: "rgba(239,68,68,0.15)",   color: "#f87171" },
  };
  const style = map[s] || map.pending;
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
          style={style}>
      {s}
    </span>
  );
}

function TransactionsTab() {
  const [txns,    setTxns]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState("all");
  const [showForm,setShowForm]= useState(false);
  const [editTxn, setEditTxn] = useState(null);
  const [form,    setForm]    = useState(EMPTY_FORM);
  const [saving,  setSaving]  = useState(false);
  const [saveErr, setSaveErr] = useState("");

  const loadTxns = useCallback(async () => {
    setLoading(true);
    const res = await adminFetch(
      `/api/admin/transactions?status=${filter}`
    );
    const data = await res.json();
    setTxns(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [filter]);

  useEffect(() => { loadTxns(); }, [loadTxns]);

  const openNew = () => { setEditTxn(null); setForm(EMPTY_FORM); setSaveErr(""); setShowForm(true); };
  const openEdit = t => {
    setEditTxn(t);
    setSaveErr("");
    setForm({
      client_name:    t.client_name    || "",
      client_email:   t.client_email   || "",
      client_phone:   t.client_phone   || "",
      service_type:   t.service_type   || "",
      package_name:   t.package_name   || "",
      amount:         t.amount         || "",
      payment_status: t.payment_status || "pending",
      payment_method: t.payment_method || "",
      notes:          t.notes          || "",
      project_url:    t.project_url    || "",
      deadline:       t.deadline       || "",
    });
    setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditTxn(null); setSaveErr(""); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setSaveErr("");
    const method = editTxn ? "PATCH" : "POST";
    const body   = editTxn ? { ...form, id: editTxn.id } : form;
    const res = await adminFetch("/api/admin/transactions", {
      method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setSaveErr(data.error || "Save failed"); return; }
    closeForm(); loadTxns();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this transaction permanently?")) return;
    await adminFetch("/api/admin/transactions", {
      method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }),
    });
    loadTxns();
  };

  const totalRevenue = txns.filter(t => t.payment_status === "paid")
                           .reduce((s, t) => s + Number(t.amount), 0);
  const pending      = txns.filter(t => t.payment_status === "pending")
                           .reduce((s, t) => s + Number(t.amount), 0);

  const FILTERS = ["all","pending","partial","paid","cancelled"];

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Records"     value={fmt(txns.length)} />
        <StatCard label="Revenue Collected" value={`₹${fmt(totalRevenue)}`} />
        <StatCard label="Pending Amount"    value={`₹${fmt(pending)}`} />
        <StatCard label="Paid Projects"     value={fmt(txns.filter(t => t.payment_status === "paid").length)} />
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <div className="flex gap-1.5 flex-wrap">
          {FILTERS.map(s => (
            <button key={s} onClick={() => setFilter(s)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize"
                    style={filter === s
                      ? { background: "#d4af37", color: "#000" }
                      : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)" }}>
              {s}
            </button>
          ))}
        </div>
        <button onClick={openNew}
                className="ml-auto px-4 py-2 rounded-xl gradient-btn font-semibold text-xs">
          + Add Transaction
        </button>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
     style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}>
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border p-6"
               style={{ background: "#13131f", borderColor: "rgba(255,255,255,0.1)" }}
               onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-white">{editTxn ? "Edit Transaction" : "New Transaction"}</h3>
              <button type="button" onClick={closeForm}
                      className="text-lg" style={{ color: "rgba(255,255,255,0.4)" }}>✕</button>
            </div>
            <form onSubmit={handleSave} className="space-y-3">
              {[
                { key: "client_name",  label: "Client Name *",      type: "text"   },
                { key: "client_email", label: "Email",               type: "email"  },
                { key: "client_phone", label: "Phone / WhatsApp",    type: "tel"    },
                { key: "service_type", label: "Service Type",        type: "text"   },
                { key: "package_name", label: "Package",             type: "text"   },
                { key: "amount",       label: "Amount (₹) *",        type: "number" },
                { key: "project_url",  label: "Project URL",         type: "url"    },
                { key: "deadline",     label: "Deadline",            type: "date"   },
              ].map(({ key, label, type }) => (
                <div key={key}>
                  <label className="text-xs mb-1 block" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</label>
                  <input type={type} value={form[key]} required={label.includes("*")}
                         onChange={e => setForm({ ...form, [key]: e.target.value })}
                         className="admin-input" />
                </div>
              ))}
              <div>
                <label className="text-xs mb-1 block" style={{ color: "rgba(255,255,255,0.4)" }}>Payment Method</label>
                <select value={form.payment_method}
                        onChange={e => setForm({ ...form, payment_method: e.target.value })}
                        className="admin-input">
                  {PAY_METHODS.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: "rgba(255,255,255,0.4)" }}>Payment Status</label>
                <select value={form.payment_status}
                        onChange={e => setForm({ ...form, payment_status: e.target.value })}
                        className="admin-input">
                  {["pending","partial","paid","cancelled"].map(s => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: "rgba(255,255,255,0.4)" }}>Notes</label>
                <textarea value={form.notes} rows={3}
                          onChange={e => setForm({ ...form, notes: e.target.value })}
                          className="admin-input resize-none" />
              </div>
              {saveErr && <p className="text-red-400 text-sm bg-red-500/10 px-3 py-2 rounded-lg">{saveErr}</p>}
              <div className="flex gap-3 pt-1">
                <button type="submit" disabled={saving}
                        className="flex-1 py-3 rounded-xl gradient-btn font-semibold text-sm disabled:opacity-60 flex items-center justify-center gap-2">
                  {saving ? <><span className="spinner" /> Saving…</> : editTxn ? "Update" : "Add"}
                </button>
                <button type="button" onClick={closeForm}
                        className="flex-1 py-3 rounded-xl text-sm"
                        style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="text-center py-20 flex flex-col items-center gap-3">
          <span className="spinner" />
          <span style={{ color: "rgba(255,255,255,0.3)" }}>Loading…</span>
        </div>
      ) : txns.length === 0 ? (
        <div className="text-center py-20" style={{ color: "rgba(255,255,255,0.3)" }}>
          No transactions found for this filter.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          <table className="admin-table min-w-[700px]">
            <thead>
              <tr>
                <th>Invoice</th><th>Client</th><th>Package</th>
                <th>Amount</th><th>Method</th><th>Status</th>
                <th>Date</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {txns.map(t => (
                <tr key={t.id}>
                  <td className="font-mono text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
                    {t.invoice_number}
                  </td>
                  <td>
                    <p className="font-medium text-white text-sm">{t.client_name}</p>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{t.client_email}</p>
                  </td>
                  <td className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>{t.package_name}</td>
                  <td className="font-bold text-white text-sm">₹{fmt(t.amount)}</td>
                  <td className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>{t.payment_method || "—"}</td>
                  <td><StatusBadge s={t.payment_status} /></td>
                  <td className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                    {new Date(t.created_at).toLocaleDateString("en-IN")}
                  </td>
                  <td>
                    <div className="flex gap-1.5">
                      <button onClick={() => openEdit(t)}
                              className="text-xs px-2.5 py-1 rounded-lg"
                              style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)" }}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(t.id)}
                              className="text-xs px-2.5 py-1 rounded-lg"
                              style={{ background: "rgba(239,68,68,0.1)", color: "#f87171" }}>
                        Del
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ── Brands Tab ───────────────────────────────────────────────────────────── */
function BrandsTab() {
  const [brands,    setBrands]    = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [showForm,  setShowForm]  = useState(false);
  const [editBrand, setEditBrand] = useState(null);
  const [form,      setForm]      = useState({ name:"", logo_url:"", website_url:"", display_order:0, active:true });

  const loadBrands = async () => {
    setLoading(true);
    const res  = await adminFetch("/api/admin/brands");
    const data = await res.json();
    setBrands(Array.isArray(data) ? data : []);
    setLoading(false);
  };
  useEffect(() => { loadBrands(); }, []);

  const closeForm = () => { setShowForm(false); setEditBrand(null); };

  const handleSave = async (e) => {
    e.preventDefault();
    const method = editBrand ? "PATCH" : "POST";
    const body   = editBrand ? { ...form, id: editBrand.id } : form;
    await adminFetch("/api/admin/brands", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    closeForm(); loadBrands();
  };

  const handleToggle = async brand => {
    await adminFetch("/api/admin/brands", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: brand.id, active: !brand.active }),
    });
    loadBrands();
  };

  const handleDelete = async id => {
    if (!confirm("Delete this brand?")) return;
    await adminFetch("/api/admin/brands", {
      method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }),
    });
    loadBrands();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>{brands.length} brands</p>
        <button onClick={() => { setEditBrand(null); setForm({ name:"", logo_url:"", website_url:"", display_order: brands.length, active:true }); setShowForm(true); }}
                className="px-4 py-2 rounded-xl gradient-btn font-semibold text-xs">
          + Add Brand
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
     style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}>
          <div className="w-full max-w-md rounded-2xl border p-6"
               style={{ background: "#13131f", borderColor: "rgba(255,255,255,0.1)" }}
               onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-white">{editBrand ? "Edit Brand" : "Add Brand"}</h3>
              <button type="button" onClick={closeForm} style={{ color: "rgba(255,255,255,0.4)" }}>✕</button>
            </div>
            <form onSubmit={handleSave} className="space-y-3">
              {[
                { key: "name",          label: "Brand Name *"             },
                { key: "logo_url",      label: "Logo URL *"               },
                { key: "website_url",   label: "Website URL *"            },
                { key: "display_order", label: "Display Order", type:"number" },
              ].map(({ key, label, type="text" }) => (
                <div key={key}>
                  <label className="text-xs mb-1 block" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</label>
                  <input type={type} value={form[key]} required={label.includes("*")}
                         onChange={e => setForm({ ...form, [key]: type === "number" ? Number(e.target.value) : e.target.value })}
                         className="admin-input" />
                </div>
              ))}
              {form.logo_url && (
                <div className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <p className="text-xs mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>Preview</p>
                  <img src={form.logo_url} alt="preview" className="h-10 object-contain"
                       onError={e => e.target.style.display = "none"} />
                </div>
              )}
              <div className="flex items-center gap-3">
                <label className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>Active</label>
                <button type="button" onClick={() => setForm({ ...form, active: !form.active })}
                        className="w-11 h-6 rounded-full relative transition-colors"
                        style={{ background: form.active ? "#d4af37" : "rgba(255,255,255,0.1)" }}>
                  <span className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all"
                        style={{ left: form.active ? "calc(100% - 20px)" : "4px" }} />
                </button>
              </div>
              <div className="flex gap-3 pt-1">
                <button type="submit" className="flex-1 py-3 rounded-xl gradient-btn font-semibold text-sm">Save</button>
                <button type="button" onClick={closeForm} className="flex-1 py-3 rounded-xl text-sm"
                        style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 flex flex-col items-center gap-3">
          <span className="spinner" /><span style={{ color: "rgba(255,255,255,0.3)" }}>Loading…</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {brands.map(brand => (
            <div key={brand.id} className="rounded-2xl border p-5 transition-opacity"
                 style={{ background: "rgba(255,255,255,0.025)", borderColor: "rgba(255,255,255,0.08)", opacity: brand.active ? 1 : 0.45 }}>
              <div className="flex items-start justify-between mb-3">
                <img src={brand.logo_url} alt={brand.name} className="h-12 object-contain"
                     onError={e => e.target.style.display = "none"} />
                <button onClick={() => handleToggle(brand)}
                        className="text-xs px-2 py-1 rounded-lg"
                        style={brand.active
                          ? { background: "rgba(16,185,129,0.15)", color: "#34d399" }
                          : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)" }}>
                  {brand.active ? "Live" : "Hidden"}
                </button>
              </div>
              <p className="font-semibold text-white text-sm mb-1">{brand.name}</p>
              <a href={brand.website_url} target="_blank" rel="noopener noreferrer"
                 className="text-xs truncate block mb-4" style={{ color: "rgba(255,255,255,0.35)" }}>
                {brand.website_url}
              </a>
              <div className="flex gap-2">
                <button onClick={() => { setEditBrand(brand); setForm({ name:brand.name, logo_url:brand.logo_url, website_url:brand.website_url, display_order:brand.display_order, active:brand.active }); setShowForm(true); }}
                        className="flex-1 text-xs py-1.5 rounded-lg"
                        style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)" }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(brand.id)}
                        className="text-xs px-3 py-1.5 rounded-lg"
                        style={{ background: "rgba(239,68,68,0.1)", color: "#f87171" }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Messages Tab ─────────────────────────────────────────────────────────── */
function MessagesTab() {
  const [messages, setMessages] = useState([]);
  const [loading,  setLoading]  = useState(true);

  const loadMessages = async () => {
    setLoading(true);
    const res  = await adminFetch("/api/admin/messages");
    const data = await res.json();
    setMessages(Array.isArray(data) ? data : []);
    setLoading(false);
  };
  useEffect(() => { loadMessages(); }, []);

  const markStatus = async (id, status) => {
    await adminFetch("/api/admin/messages", {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }),
    });
    loadMessages();
  };

  const unread = messages.filter(m => m.status === "unread").length;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>{messages.length} messages</p>
        {unread > 0 && (
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
                style={{ background: "rgba(212,175,55,0.25)", color: "#d4af37" }}>
            {unread} unread
          </span>
        )}
      </div>

      {loading ? (
        <div className="text-center py-20 flex flex-col items-center gap-3">
          <span className="spinner" /><span style={{ color: "rgba(255,255,255,0.3)" }}>Loading…</span>
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-20" style={{ color: "rgba(255,255,255,0.3)" }}>No messages yet</div>
      ) : (
        <div className="space-y-3">
          {messages.map(m => (
            <div key={m.id} className="rounded-2xl border p-5"
                 style={{
                   background: m.status === "unread" ? "rgba(212,175,55,0.04)" : "rgba(255,255,255,0.025)",
                   borderColor: m.status === "unread" ? "rgba(212,175,55,0.25)" : "rgba(255,255,255,0.08)",
                 }}>
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-semibold text-white text-sm">{m.name}</p>
                  <div className="flex gap-3 text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                    <a href={`mailto:${m.email}`} className="hover:text-[#d4af37] transition-colors">{m.email}</a>
                    {m.phone && <span>{m.phone}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge s={m.status === "unread" ? "pending" : m.status === "replied" ? "paid" : "partial"} />
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                    {new Date(m.created_at).toLocaleDateString("en-IN")}
                  </span>
                </div>
              </div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.6)" }}>{m.message}</p>
              <div className="flex gap-2 flex-wrap">
                <a href={`mailto:${m.email}`}
                   className="text-xs px-3 py-1.5 rounded-lg gradient-btn font-medium text-white">
                  Reply →
                </a>
                {m.status !== "read" && (
                  <button onClick={() => markStatus(m.id, "read")}
                          className="text-xs px-3 py-1.5 rounded-lg"
                          style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)" }}>
                    Mark Read
                  </button>
                )}
                {m.status !== "replied" && (
                  <button onClick={() => markStatus(m.id, "replied")}
                          className="text-xs px-3 py-1.5 rounded-lg"
                          style={{ background: "rgba(16,185,129,0.1)", color: "#34d399" }}>
                    Mark Replied
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Main Admin Panel ─────────────────────────────────────────────────────── */
export default function AdminPanel() {
  const [authed,   setAuthed]   = useState(false);
  const [checking, setChecking] = useState(true);
  const [tab,      setTab]      = useState("transactions");

  useEffect(() => {
  fetch("/api/admin/session")
    .then(async (res) => {
      const data = await res.json();

      if (data.authenticated) {
        setAuthed(true);
      }
    })
    .catch(() => {})
    .finally(() => setChecking(false));
}, []);

  const handleLogout = async () => {
    await adminFetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
  };

  if (checking) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0b0b12" }}>
      <div className="spinner" />
    </div>
  );

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  const TABS = [
    { id: "transactions", label: "💰 Transactions" },
    { id: "brands",       label: "🏷️ Brands"       },
    { id: "messages",     label: "📬 Messages"      },
    { id: "visitors",     label: "📊 Visitors"      },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#0b0b12" }}>
      {/* Top bar */}
      <div className="sticky top-0 z-40 backdrop-blur-xl border-b px-4 sm:px-5 py-3.5"
           style={{ background: "rgba(11,11,18,0.92)", borderColor: "rgba(255,255,255,0.07)" }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/dws-logo.png" alt="DWS" className="h-8 w-auto object-contain" />
            <div>
              <p className="font-semibold text-white text-sm leading-none">Admin Panel</p>
              <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>Dharma Web Services</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href="/" target="_blank" rel="noopener noreferrer"
               className="hidden sm:inline-flex text-xs px-3 py-1.5 rounded-lg border"
               style={{ borderColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}>
              View Site →
            </a>
            <button onClick={handleLogout}
                    className="text-xs px-3 py-1.5 rounded-lg"
                    style={{ background: "rgba(239,68,68,0.1)", color: "#f87171" }}>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-5 py-6 sm:py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-7 overflow-x-auto pb-1">
          {TABS.map(({ id, label }) => (
            <button key={id} onClick={() => setTab(id)}
                    className="px-4 sm:px-5 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all"
                    style={tab === id
                      ? { background: "linear-gradient(135deg,#d4af37,#a07828)", color: "#000" }
                      : { background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.07)" }}>
              {label}
            </button>
          ))}
        </div>

        {tab === "transactions" && <TransactionsTab />}
        {tab === "brands"       && <BrandsTab />}
        {tab === "messages"     && <MessagesTab />}
        {tab === "visitors"     && <VisitorsTab />}
      </div>
    </div>
  );
}