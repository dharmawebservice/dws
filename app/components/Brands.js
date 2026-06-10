import { supabase } from "../../lib/supabase";

const FALLBACK_BRANDS = [
  { name: "Subio Foods",       logo_url: "/brands/Subio.webp",     website_url: "https://subiofoods.com" },
  { name: "CraveCart",         logo_url: "/brands/cravecart.webp", website_url: "https://crave-cart-82wd.onrender.com" },
  { name: "Diyami Productions",logo_url: "/brands/diyami.webp",    website_url: "https://diyamiproductions.com" },
  { name: "AC5 Construction",  logo_url: "/brands/ac5.webp",       website_url: "https://www.ac5construction.co.uk" },
];

async function getBrands() {
  try {
    const { data, error } = await supabase
      .from("brands").select("*").eq("active", true).order("display_order");
    if (error || !data?.length) return FALLBACK_BRANDS;
    return data;
  } catch {
    return FALLBACK_BRANDS;
  }
}

export default async function Brands() {
  const brands = await getBrands();
  // Triple-duplicate for seamless infinite scroll with no gap
  const row1 = [...brands, ...brands, ...brands, ...brands];
  const row2 = [...brands, ...brands, ...brands, ...brands].reverse();

  return (
    <section id="brands" className="py-20 sm:py-28 relative overflow-hidden">
      {/* Background accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(180deg, transparent, rgba(212,175,55,0.03) 50%, transparent)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-5">
        <div className="text-center mb-10 sm:mb-14">
          <p className="section-label mb-4 reveal">Trusted By</p>
          <h2 className="display-lg mb-4 reveal reveal-delay-1" style={{ color: "var(--text-primary)" }}>
            Brands that <span className="gradient-text">trust us</span>
          </h2>
          <p className="text-base reveal reveal-delay-2" style={{ color: "var(--text-secondary)" }}>
            From food startups to international construction firms — we've built for them all.
          </p>
        </div>
      </div>

      {/* Row 1 — left scroll */}
      <div className="marquee-outer py-3 mb-4">
        <div
          className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 z-10 pointer-events-none"
          style={{ background: "linear-gradient(90deg, var(--surface), transparent)" }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 z-10 pointer-events-none"
          style={{ background: "linear-gradient(270deg, var(--surface), transparent)" }}
        />
        <div className="marquee-track">
          {row1.map(({ name, logo_url, website_url }, i) => (
            <a
              key={i}
              href={website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="brand-card group"
            >
              <img src={logo_url} alt={name} />
              <span className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
                {name}
              </span>
            </a>
          ))}
        </div>
      </div>

      <p
        className="text-center text-xs mt-10 px-4"
        style={{ color: "var(--text-muted)" }}
      >
        Want your brand here? Build with us and join the showcase.
      </p>
    </section>
  );
}
