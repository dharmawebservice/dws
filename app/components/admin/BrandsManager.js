"use client";

import { useEffect, useRef, useState } from "react";

const EMPTY_FORM = {
  name: "",
  logo_url: "",
  website_url: "",
  active: true,
  display_order: 0,
};

export default function BrandsManager() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null); // null = create mode
  const [showForm, setShowForm] = useState(false);

  // Image input mode: "url" | "upload"
  const [imgMode, setImgMode] = useState("url");
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadPreview, setUploadPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // ── Fetch all brands ───────────────────────────────────────────────────────
  async function fetchBrands() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/brands");
      if (!res.ok) throw new Error("Failed to load brands");
      setBrands(await res.json());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchBrands(); }, []);

  // ── Flash helpers ──────────────────────────────────────────────────────────
  function flash(msg, type = "success") {
    if (type === "success") { setSuccess(msg); setTimeout(() => setSuccess(""), 3000); }
    else { setError(msg); setTimeout(() => setError(""), 4000); }
  }

  // ── Open form for create or edit ───────────────────────────────────────────
  function openCreate() {
    setForm(EMPTY_FORM);
    setEditId(null);
    setImgMode("url");
    setUploadFile(null);
    setUploadPreview("");
    setShowForm(true);
  }

  function openEdit(brand) {
    setForm({
      name: brand.name ?? "",
      logo_url: brand.logo_url ?? "",
      website_url: brand.website_url ?? "",
      active: brand.active ?? true,
      display_order: brand.display_order ?? 0,
    });
    setEditId(brand.id);
    setImgMode("url");
    setUploadFile(null);
    setUploadPreview("");
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setForm(EMPTY_FORM);
    setEditId(null);
    setUploadFile(null);
    setUploadPreview("");
  }

  // ── File picker handler ────────────────────────────────────────────────────
  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadFile(file);
    setUploadPreview(URL.createObjectURL(file));
    // Clear manual URL when file is chosen
    setForm((f) => ({ ...f, logo_url: "" }));
  }

  // ── Upload image to Supabase Storage ──────────────────────────────────────
  async function uploadImage() {
    if (!uploadFile) return null;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", uploadFile);
      const res = await fetch("/api/admin/brands/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Upload failed");
      return json.url; // Public Supabase Storage URL
    } catch (e) {
      flash(e.message, "error");
      return null;
    } finally {
      setUploading(false);
    }
  }

  // ── Save (create or update) ────────────────────────────────────────────────
  async function handleSave() {
    if (!form.name.trim()) { flash("Brand name is required", "error"); return; }
    setSaving(true);
    setError("");

    try {
      let logoUrl = form.logo_url.trim();

      // If user chose file upload mode and picked a file, upload it first
      if (imgMode === "upload" && uploadFile) {
        const uploaded = await uploadImage();
        if (!uploaded) { setSaving(false); return; }
        logoUrl = uploaded;
      }

      const payload = {
        name: form.name.trim(),
        logo_url: logoUrl || null,
        website_url: form.website_url.trim() || null,
        active: form.active,
        display_order: Number(form.display_order) || 0,
      };

      const isEdit = editId !== null;
      const res = await fetch("/api/admin/brands", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isEdit ? { id: editId, ...payload } : payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Save failed");

      flash(isEdit ? "Brand updated!" : "Brand added!");
      closeForm();
      fetchBrands();
    } catch (e) {
      flash(e.message, "error");
    } finally {
      setSaving(false);
    }
  }

  // ── Toggle active ─────────────────────────────────────────────────────────
  async function toggleActive(brand) {
    try {
      const res = await fetch("/api/admin/brands", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: brand.id, active: !brand.active }),
      });
      if (!res.ok) throw new Error("Failed to update");
      fetchBrands();
    } catch (e) {
      flash(e.message, "error");
    }
  }

  // ── Delete brand ──────────────────────────────────────────────────────────
  async function handleDelete(id) {
    if (!confirm("Delete this brand? This cannot be undone.")) return;
    try {
      const res = await fetch("/api/admin/brands", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Delete failed");
      flash("Brand deleted");
      fetchBrands();
    } catch (e) {
      flash(e.message, "error");
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "inherit" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Brands</h2>
        <button onClick={openCreate} style={btnStyle("primary")}>+ Add Brand</button>
      </div>

      {/* Alerts */}
      {error   && <div style={alertStyle("error")}>{error}</div>}
      {success && <div style={alertStyle("success")}>{success}</div>}

      {/* ── Brand Form Modal ─────────────────────────────────────────────── */}
      {showForm && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
                {editId ? "Edit Brand" : "Add New Brand"}
              </h3>
              <button onClick={closeForm} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#666" }}>×</button>
            </div>

            {/* Name */}
            <Field label="Brand Name *">
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Acme Corp"
                style={inputStyle}
              />
            </Field>

            {/* Website URL */}
            <Field label="Website URL">
              <input
                value={form.website_url}
                onChange={(e) => setForm((f) => ({ ...f, website_url: e.target.value }))}
                placeholder="https://example.com"
                style={inputStyle}
              />
            </Field>

            {/* Logo — toggle URL / Upload */}
            <Field label="Brand Logo">
              {/* Toggle */}
              <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                <button
                  onClick={() => { setImgMode("url"); setUploadFile(null); setUploadPreview(""); }}
                  style={tabBtn(imgMode === "url")}
                >
                  🔗 Paste URL
                </button>
                <button
                  onClick={() => { setImgMode("upload"); setForm((f) => ({ ...f, logo_url: "" })); }}
                  style={tabBtn(imgMode === "upload")}
                >
                  📁 Upload File
                </button>
              </div>

              {imgMode === "url" ? (
                <input
                  value={form.logo_url}
                  onChange={(e) => setForm((f) => ({ ...f, logo_url: e.target.value }))}
                  placeholder="https://cdn.example.com/logo.png"
                  style={inputStyle}
                />
              ) : (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    style={{ ...inputStyle, cursor: "pointer", textAlign: "left", background: "#f9f9f9" }}
                  >
                    {uploadFile ? uploadFile.name : "Choose image (JPG, PNG, WebP, SVG — max 2MB)"}
                  </button>
                </div>
              )}

              {/* Preview */}
              {(uploadPreview || form.logo_url) && (
                <div style={{ marginTop: 10, padding: 10, background: "#f5f5f5", borderRadius: 8, display: "inline-block" }}>
                  <img
                    src={uploadPreview || form.logo_url}
                    alt="Preview"
                    style={{ maxHeight: 60, maxWidth: 160, objectFit: "contain", display: "block" }}
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                  <p style={{ margin: "4px 0 0", fontSize: 11, color: "#888" }}>Preview</p>
                </div>
              )}
            </Field>

            {/* Display order + Active */}
            <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
              <Field label="Display Order" style={{ flex: 1 }}>
                <input
                  type="number"
                  value={form.display_order}
                  onChange={(e) => setForm((f) => ({ ...f, display_order: e.target.value }))}
                  style={{ ...inputStyle, width: 80 }}
                  min={0}
                />
              </Field>
              <Field label="Visible on site" style={{ flex: 1 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginTop: 4 }}>
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                    style={{ width: 18, height: 18, accentColor: "#D4AF37" }}
                  />
                  <span style={{ fontSize: 14, color: "#444" }}>{form.active ? "Active" : "Hidden"}</span>
                </label>
              </Field>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
              <button onClick={closeForm} style={btnStyle("ghost")}>Cancel</button>
              <button onClick={handleSave} disabled={saving || uploading} style={btnStyle("primary")}>
                {uploading ? "Uploading…" : saving ? "Saving…" : editId ? "Save Changes" : "Add Brand"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Brands Table ─────────────────────────────────────────────────── */}
      {loading ? (
        <p style={{ color: "#888", textAlign: "center", padding: 40 }}>Loading brands…</p>
      ) : brands.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: "#aaa" }}>
          <p style={{ fontSize: 32, margin: 0 }}>🏷️</p>
          <p style={{ marginTop: 8 }}>No brands yet. Add your first one!</p>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #eee", textAlign: "left" }}>
                <Th>Logo</Th>
                <Th>Name</Th>
                <Th>Website</Th>
                <Th>Order</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {brands.map((brand) => (
                <tr key={brand.id} style={{ borderBottom: "1px solid #f0f0f0", verticalAlign: "middle" }}>
                  <td style={tdStyle}>
                    {brand.logo_url ? (
                      <img
                        src={brand.logo_url}
                        alt={brand.name}
                        style={{ width: 56, height: 36, objectFit: "contain", borderRadius: 4, background: "#fafafa", border: "1px solid #eee", padding: 2 }}
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                      />
                    ) : (
                      <div style={{ width: 56, height: 36, background: "#f0f0f0", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", color: "#bbb", fontSize: 11 }}>
                        No img
                      </div>
                    )}
                  </td>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>{brand.name}</td>
                  <td style={tdStyle}>
                    {brand.website_url ? (
                      <a href={brand.website_url} target="_blank" rel="noopener noreferrer"
                        style={{ color: "#D4AF37", textDecoration: "none", fontSize: 12 }}>
                        {brand.website_url.replace(/^https?:\/\//, "").slice(0, 30)}
                      </a>
                    ) : <span style={{ color: "#ccc" }}>—</span>}
                  </td>
                  <td style={tdStyle}>{brand.display_order ?? 0}</td>
                  <td style={tdStyle}>
                    <button
                      onClick={() => toggleActive(brand)}
                      style={{
                        padding: "3px 10px", borderRadius: 12, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600,
                        background: brand.active ? "#dcfce7" : "#fee2e2",
                        color: brand.active ? "#16a34a" : "#dc2626",
                      }}
                    >
                      {brand.active ? "Active" : "Hidden"}
                    </button>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => openEdit(brand)} style={btnStyle("ghost", true)}>Edit</button>
                      <button onClick={() => handleDelete(brand.id)} style={btnStyle("danger", true)}>Delete</button>
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

// ── Small helpers ──────────────────────────────────────────────────────────
function Field({ label, children, style }) {
  return (
    <div style={{ marginBottom: 14, ...style }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#555", marginBottom: 5 }}>{label}</label>
      {children}
    </div>
  );
}
function Th({ children }) {
  return <th style={{ padding: "10px 12px", fontWeight: 700, color: "#666", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>{children}</th>;
}
const tdStyle = { padding: "10px 12px" };
const inputStyle = {
  width: "100%", padding: "9px 12px", border: "1px solid #ddd", borderRadius: 8,
  fontSize: 14, outline: "none", boxSizing: "border-box", background: "#fff",
};
const overlayStyle = {
  position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000,
  display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
};
const modalStyle = {
  background: "#fff", borderRadius: 14, padding: 28, width: "100%",
  maxWidth: 520, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
};
function btnStyle(variant, small = false) {
  const base = {
    padding: small ? "5px 12px" : "9px 20px",
    borderRadius: 8, fontWeight: 600, fontSize: small ? 13 : 14,
    cursor: "pointer", border: "none", transition: "opacity 0.15s",
  };
  if (variant === "primary") return { ...base, background: "#D4AF37", color: "#fff" };
  if (variant === "ghost")   return { ...base, background: "#f3f4f6", color: "#374151" };
  if (variant === "danger")  return { ...base, background: "#fee2e2", color: "#dc2626" };
  return base;
}
function tabBtn(active) {
  return {
    padding: "6px 14px", borderRadius: 6, border: `1.5px solid ${active ? "#D4AF37" : "#ddd"}`,
    background: active ? "#fffbeb" : "#fff", color: active ? "#92710a" : "#666",
    fontWeight: active ? 700 : 500, fontSize: 13, cursor: "pointer",
  };
}
function alertStyle(type) {
  return {
    padding: "10px 14px", borderRadius: 8, marginBottom: 14, fontSize: 14, fontWeight: 500,
    background: type === "success" ? "#dcfce7" : "#fee2e2",
    color: type === "success" ? "#166534" : "#991b1b",
    border: `1px solid ${type === "success" ? "#86efac" : "#fca5a5"}`,
  };
}