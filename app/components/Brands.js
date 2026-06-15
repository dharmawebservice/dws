import { createClient } from "@supabase/supabase-js";
import BrandCard from "./BrandCard";

const FALLBACK_BRANDS = [
  { id: "f1", name: "Subio Foods",        logo_url: "/brands/Subio.webp",     website_url: "https://subiofoods.com" },
  { id: "f2", name: "CraveCart",          logo_url: "/brands/cravecart.webp", website_url: "https://crave-cart-82wd.onrender.com" },
  { id: "f3", name: "Diyami Productions", logo_url: "/brands/diyami.webp",    website_url: "https://diyamiproductions.com" },
  { id: "f4", name: "AC5 Construction",   logo_url: "/brands/ac5.webp",       website_url: "https://www.ac5construction.co.uk" },
];

async function getBrands() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data, error } = await supabase
      .from("brands")
      .select("id, name, logo_url, website_url, display_order")
      .eq("active", true)
      .order("display_order");

    if (error) {
      console.error("Brands fetch error:", error.message);
      return FALLBACK_BRANDS;
    }

    if (!data || data.length === 0) return FALLBACK_BRANDS;

    return data;
  } catch (err) {
    console.error("Brands fetch failed:", err);
    return FALLBACK_BRANDS;
  }
}

export default async function Brands() {
  const brands = await getBrands();

  const row1 = [...brands, ...brands, ...brands, ...brands];

  return (
    <section id="brands" className="py-20 sm:py-28 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(180deg, transparent, rgba(212,175,55,0.03) 50%, transparent)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-5">
        <div className="text-center mb-10 sm:mb-14">
          <p className="section-label mb-4 reveal">Trusted By</p>
          <h2
            className="display-lg mb-4 reveal reveal-delay-1"
            style={{ color: "var(--text-primary)" }}
          >
            Brands that <span className="gradient-text">trust us</span>
          </h2>
          <p
            className="text-base reveal reveal-delay-2"
            style={{ color: "var(--text-secondary)" }}
          >
            From food startups to international construction firms — we've built for them all.
          </p>
        </div>
      </div>

      {/* Row 1 — scrolls left */}
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
          {row1.map((brand, i) => (
            <BrandCard key={`r1-${brand.id ?? i}-${i}`} brand={brand} />
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