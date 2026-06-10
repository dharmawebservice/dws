"use client";
import { useState, useEffect, useCallback } from "react";

// ── Login Screen ──────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) onLogin();
    else setError("Incorrect password");
  };

  return (
    <div className="min-h-screen bg-[#0d0d14] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img src="/dws-logo.png" alt="DWS" className="h-16 w-auto object-contain mx-auto mb-4 drop-shadow-[0_0_16px_rgba(212,175,55,0.45)]" />
          <h1 className="text-xl font-bold text-white">Admin Access</h1>
          <p className="text-white/40 text-sm mt-1">Enter your password to continue</p>
        </div>

        <form onSubmit={handleLogin} className="glass-card p-8 space-y-4">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="admin-input"
            autoFocus
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl gradient-btn text-white font-semibold text-sm disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? <><div className="spinner" /> Verifying…</> : "Enter →"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Stat Card ─────────────────────────────────────────
function StatCard({ label, value, sub, color = "violet" }) {
  const colors = {
    violet: "border-[rgba(212,175,55,0.20)] from-[#d4af37]/8",
    green:  "border-green-500/20 from-green-600/10",
    amber:  "border-amber-500/20 from-amber-600/10",
    blue:   "border-[rgba(192,200,216,0.20)] from-[#c0c8d8]/8",
  };
  return (
    <div className={`glass-card p-5 bg-gradient-to-br ${colors[color]} to-transparent`}>
      <p className="text-xs text-white/40 mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
      {sub && <p className="text-xs text-white/30 mt-1">{sub}</p>}
    </div>
  );
}

// ── Transactions Tab ───────────────────────────────────
function TransactionsTab() {
  const [txns, setTxns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editTxn, setEditTxn] = useState(null);
  const [form, setForm] = useState({
    client_name: "", client_email: "", client_phone: "",
    service_type: "Website", package_name: "Pro",
    amount: "", payment_status: "pending",
    payment_method: "", notes: "", project_url: "", deadline: "",
  });

  const loadTxns = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/transactions?status=${filter}`);
    const data = await res.json();
    setTxns(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [filter]);

  useEffect(() => { loadTxns(); }, [loadTxns]);

  const handleSave = async (e) => {
    e.preventDefault();
    const method = editTxn ? "PATCH" : "POST";
    const body = editTxn ? { ...form, id: editTxn.id } : form;
    await fetch("/api/admin/transactions", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setShowForm(false);
    setEditTxn(null);
    setForm({ client_name: "", client_email: "", client_phone: "", service_type: "Website", package_name: "Pro", amount: "", payment_status: "pending", payment_method: "", notes: "", project_url: "", deadline: "" });
    loadTxns();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this transaction?")) return;
    await fetch("/api/admin/transactions", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    loadTxns();
  };

  const openEdit = (t) => {
    setEditTxn(t);
    setForm({
      client_name: t.client_name, client_email: t.client_email || "",
      client_phone: t.client_phone || "", service_type: t.service_type,
      package_name: t.package_name, amount: t.amount,
      payment_status: t.payment_status, payment_method: t.payment_method || "",
      notes: t.notes || "", project_url: t.project_url || "",
      deadline: t.deadline || "",
    });
    setShowForm(true);
  };

  const totalRevenue = txns.filter(t => t.payment_status === "paid").reduce((s, t) => s + Number(t.amount), 0);
  const pending = txns.filter(t => t.payment_status === "pending").reduce((s, t) => s + Number(t.amount), 0);

  const statusBadge = (s) => {
    const map = { paid: "badge-paid", pending: "badge-pending", partial: "badge-partial", cancelled: "badge-cancelled" };
    return <span className={`badge ${map[s] || "badge-pending"}`}>{s}</span>;
  };

  return (
    <div>
      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Records" value={txns.length} color="blue" />
        <StatCard label="Revenue Collected" value={`₹${totalRevenue.toLocaleString()}`} color="green" />
        <StatCard label="Pending Amount" value={`₹${pending.toLocaleString()}`} color="amber" />
        <StatCard label="Paid Projects" value={txns.filter(t => t.payment_status === "paid").length} color="violet" />
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex gap-2 flex-wrap">
          {["all","pending","partial","paid","cancelled"].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === s ? "bg-[#d4af37] text-white" : "bg-white/[0.05] text-white/50 hover:bg-white/[0.08]"
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <button
          onClick={() => { setEditTxn(null); setShowForm(true); }}
          className="ml-auto px-4 py-2 rounded-xl gradient-btn text-white text-xs font-semibold"
        >
          + Add Transaction
        </button>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-[#13131f] border border-white/10 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-white">{editTxn ? "Edit Transaction" : "New Transaction"}</h3>
              <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSave} className="space-y-3">
              {[
                { key: "client_name", label: "Client Name *", type: "text" },
                { key: "client_email", label: "Email", type: "email" },
                { key: "client_phone", label: "Phone/WhatsApp", type: "tel" },
                { key: "service_type", label: "Service Type", type: "text" },
                { key: "package_name", label: "Package", type: "text" },
                { key: "amount", label: "Amount (₹) *", type: "number" },
                { key: "payment_method", label: "Payment Method", type: "text" },
                { key: "project_url", label: "Project URL", type: "url" },
                { key: "deadline", label: "Deadline", type: "date" },
              ].map(({ key, label, type }) => (
                <div key={key}>
                  <label className="text-xs text-white/40 mb-1 block">{label}</label>
                  <input
                    type={type}
                    value={form[key]}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    required={label.includes("*")}
                    className="admin-input"
                  />
                </div>
              ))}
              <div>
                <label className="text-xs text-white/40 mb-1 block">Payment Status</label>
                <select value={form.payment_status} onChange={e => setForm({ ...form, payment_status: e.target.value })} className="admin-input">
                  <option value="pending">Pending</option>
                  <option value="partial">Partial</option>
                  <option value="paid">Paid</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1 block">Notes</label>
                <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} className="admin-input resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 py-3 rounded-xl gradient-btn text-white font-semibold text-sm">Save</button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 text-sm hover:bg-white/5">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="text-center py-20 text-white/30">Loading…</div>
      ) : txns.length === 0 ? (
        <div className="text-center py-20 text-white/30">No transactions found</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/[0.07]">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Client</th>
                <th>Package</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {txns.map(t => (
                <tr key={t.id}>
                  <td className="font-mono text-xs text-white/50">{t.invoice_number}</td>
                  <td>
                    <p className="font-medium text-white text-sm">{t.client_name}</p>
                    <p className="text-xs text-white/35">{t.client_email}</p>
                  </td>
                  <td className="text-sm text-white/60">{t.package_name}</td>
                  <td className="font-bold text-white text-sm">₹{Number(t.amount).toLocaleString()}</td>
                  <td>{statusBadge(t.payment_status)}</td>
                  <td className="text-xs text-white/40">{new Date(t.created_at).toLocaleDateString("en-IN")}</td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(t)} className="text-xs px-2.5 py-1 rounded-lg bg-white/[0.05] text-white/60 hover:bg-white/[0.1]">Edit</button>
                      <button onClick={() => handleDelete(t.id)} className="text-xs px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20">Del</button>
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

// ── Brands Tab ────────────────────────────────────────
function BrandsTab() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editBrand, setEditBrand] = useState(null);
  const [form, setForm] = useState({ name: "", logo_url: "", website_url: "", display_order: 0, active: true });

  const loadBrands = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/brands");
    const data = await res.json();
    setBrands(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { loadBrands(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const method = editBrand ? "PATCH" : "POST";
    const body = editBrand ? { ...form, id: editBrand.id } : form;
    await fetch("/api/admin/brands", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setShowForm(false);
    setEditBrand(null);
    setForm({ name: "", logo_url: "", website_url: "", display_order: 0, active: true });
    loadBrands();
  };

  const handleToggle = async (brand) => {
    await fetch("/api/admin/brands", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: brand.id, active: !brand.active }),
    });
    loadBrands();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this brand?")) return;
    await fetch("/api/admin/brands", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    loadBrands();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-white/50 text-sm">{brands.length} brands total</p>
        <button
          onClick={() => { setEditBrand(null); setForm({ name: "", logo_url: "", website_url: "", display_order: brands.length, active: true }); setShowForm(true); }}
          className="px-4 py-2 rounded-xl gradient-btn text-white text-xs font-semibold"
        >
          + Add Brand
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-[#13131f] border border-white/10 rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-white">{editBrand ? "Edit Brand" : "Add Brand"}</h3>
              <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSave} className="space-y-3">
              {[
                { key: "name", label: "Brand Name *" },
                { key: "logo_url", label: "Logo URL (or /brands/logo.webp) *" },
                { key: "website_url", label: "Website URL *" },
                { key: "display_order", label: "Display Order", type: "number" },
              ].map(({ key, label, type = "text" }) => (
                <div key={key}>
                  <label className="text-xs text-white/40 mb-1 block">{label}</label>
                  <input
                    type={type}
                    value={form[key]}
                    onChange={e => setForm({ ...form, [key]: type === "number" ? Number(e.target.value) : e.target.value })}
                    required={label.includes("*")}
                    className="admin-input"
                  />
                </div>
              ))}

              {/* Preview */}
              {form.logo_url && (
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.07]">
                  <p className="text-xs text-white/30 mb-2">Preview</p>
                  <img src={form.logo_url} alt="preview" className="h-10 object-contain" onError={e => e.target.style.display = "none"} />
                </div>
              )}

              <div className="flex items-center gap-3">
                <label className="text-sm text-white/60">Active</label>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, active: !form.active })}
                  className={`w-11 h-6 rounded-full transition-colors relative ${form.active ? "bg-[#d4af37]" : "bg-white/10"}`}
                >
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${form.active ? "left-6" : "left-1"}`} />
                </button>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 py-3 rounded-xl gradient-btn text-white font-semibold text-sm">Save</button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-white/30">Loading…</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {brands.map(brand => (
            <div key={brand.id} className={`glass-card p-5 ${!brand.active ? "opacity-50" : ""}`}>
              <div className="flex items-start justify-between mb-3">
                <img
                  src={brand.logo_url}
                  alt={brand.name}
                  className="h-12 object-contain"
                  onError={e => { e.target.style.display = "none"; }}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggle(brand)}
                    className={`text-xs px-2 py-1 rounded-lg ${brand.active ? "bg-green-500/15 text-green-400" : "bg-white/[0.05] text-white/40"}`}
                  >
                    {brand.active ? "Live" : "Hidden"}
                  </button>
                </div>
              </div>
              <p className="font-semibold text-white text-sm mb-1">{brand.name}</p>
              <a href={brand.website_url} target="_blank" rel="noopener noreferrer" className="text-xs text-white/35 hover:text-[#d4af37] transition-colors truncate block mb-4">
                {brand.website_url}
              </a>
              <div className="flex gap-2">
                <button onClick={() => { setEditBrand(brand); setForm({ name: brand.name, logo_url: brand.logo_url, website_url: brand.website_url, display_order: brand.display_order, active: brand.active }); setShowForm(true); }}
                  className="flex-1 text-xs py-1.5 rounded-lg bg-white/[0.05] text-white/60 hover:bg-white/[0.1]">
                  Edit
                </button>
                <button onClick={() => handleDelete(brand.id)} className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20">
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

// ── Messages Tab ──────────────────────────────────────
function MessagesTab() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadMessages = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/messages");
    const data = await res.json();
    setMessages(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { loadMessages(); }, []);

  const markStatus = async (id, status) => {
    await fetch("/api/admin/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    loadMessages();
  };

  const unread = messages.filter(m => m.status === "unread").length;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <p className="text-white/50 text-sm">{messages.length} messages total</p>
        {unread > 0 && <span className="px-2 py-0.5 rounded-full bg-[#d4af37]/30 text-[#d4af37] text-xs font-semibold">{unread} unread</span>}
      </div>

      {loading ? (
        <div className="text-center py-20 text-white/30">Loading…</div>
      ) : messages.length === 0 ? (
        <div className="text-center py-20 text-white/30">No messages yet</div>
      ) : (
        <div className="space-y-3">
          {messages.map(m => (
            <div key={m.id} className={`glass-card p-5 ${m.status === "unread" ? "highlight-row" : ""}`}>
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-semibold text-white text-sm">{m.name}</p>
                  <div className="flex gap-3 text-xs text-white/40 mt-0.5">
                    <a href={`mailto:${m.email}`} className="hover:text-[#d4af37]">{m.email}</a>
                    {m.phone && <span>{m.phone}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`badge ${m.status === "unread" ? "badge-pending" : m.status === "replied" ? "badge-paid" : "badge-partial"}`}>
                    {m.status}
                  </span>
                  <span className="text-xs text-white/30">{new Date(m.created_at).toLocaleDateString("en-IN")}</span>
                </div>
              </div>
              <p className="text-sm text-white/60 leading-relaxed mb-4">{m.message}</p>
              <div className="flex gap-2 flex-wrap">
                <a href={`mailto:${m.email}`} className="text-xs px-3 py-1.5 rounded-lg gradient-btn text-white font-medium">Reply →</a>
                {m.status !== "read" && <button onClick={() => markStatus(m.id, "read")} className="text-xs px-3 py-1.5 rounded-lg bg-white/[0.05] text-white/60 hover:bg-white/[0.08]">Mark Read</button>}
                {m.status !== "replied" && <button onClick={() => markStatus(m.id, "replied")} className="text-xs px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20">Mark Replied</button>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Admin Panel ──────────────────────────────────
export default function AdminPanel() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState("transactions");

  // Check if already logged in via cookie
  useEffect(() => {
    fetch("/api/admin/transactions?status=all")
      .then(r => { if (r.ok) setAuthed(true); })
      .finally(() => setChecking(false));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-[#0d0d14] flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  const TABS = [
    { id: "transactions", label: "💰 Transactions" },
    { id: "brands", label: "🏷️ Brands" },
    { id: "messages", label: "📬 Messages" },
  ];

  return (
    <div className="min-h-screen bg-[#0d0d14]">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-[#0d0d14]/90 backdrop-blur-xl border-b border-white/[0.06] px-5 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/dws-logo.png" alt="DWS" className="h-8 w-auto object-contain" />
            <div>
              <p className="font-semibold text-white text-sm leading-none">Admin Panel</p>
              <p className="text-xs text-white/30 mt-0.5">Dharma Web Services</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a href="/" target="_blank" rel="noopener noreferrer" className="text-xs px-3 py-1.5 rounded-lg border border-white/[0.08] text-white/50 hover:text-white hidden sm:block">
              View Site →
            </a>
            <button onClick={handleLogout} className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20">
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`px-5 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                tab === id
                  ? "gradient-btn text-white"
                  : "bg-white/[0.04] text-white/50 hover:bg-white/[0.07] border border-white/[0.06]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "transactions" && <TransactionsTab />}
        {tab === "brands" && <BrandsTab />}
        {tab === "messages" && <MessagesTab />}
      </div>
    </div>
  );
}
