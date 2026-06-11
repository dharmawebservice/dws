"use client";

export default function BrandCard({ brand }) {
  const { name, logo_url, website_url } = brand;

  return (
    <a
      href={website_url || "#"}
      target={website_url ? "_blank" : "_self"}
      rel="noopener noreferrer"
      className="brand-card group"
    >
      {logo_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logo_url}
          alt={name}
          width={80}
          height={40}
          style={{ objectFit: "contain", maxWidth: 80, maxHeight: 40 }}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = "none";
            const fallback = e.currentTarget.nextSibling;
            if (fallback?.style) fallback.style.display = "flex";
          }}
        />
      ) : null}

      {/* Fallback initials avatar shown when no logo or image fails */}
      <span
        style={{
          display: logo_url ? "none" : "flex",
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: "var(--accent, #D4AF37)",
          color: "#fff",
          fontWeight: 700,
          fontSize: 18,
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {name?.charAt(0)?.toUpperCase() ?? "?"}
      </span>

      <span
        className="text-sm font-semibold"
        style={{ color: "var(--text-secondary)" }}
      >
        {name}
      </span>
    </a>
  );
}