import { NextResponse } from "next/server";
import { getAdminSession } from "../../../../lib/auth";
import { getServiceClient } from "../../../../lib/supabase";

async function auth() {
  const session = await getAdminSession();
  if (!session) return null;
  return getServiceClient();
}

// ─── GET all brands (admin sees all, including inactive) ───────────────────
export async function GET() {
  const supabase = await auth();
  if (!supabase)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .order("display_order");

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// ─── POST create brand (supports JSON body with logo_url string) ───────────
export async function POST(req) {
  const supabase = await auth();
  if (!supabase)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  // Basic validation
  if (!body.name?.trim())
    return NextResponse.json({ error: "Brand name is required" }, { status: 400 });

  const { data, error } = await supabase
    .from("brands")
    .insert([
      {
        name: body.name.trim(),
        logo_url: body.logo_url ?? null,
        website_url: body.website_url ?? null,
        active: body.active ?? true,
        display_order: body.display_order ?? 0,
      },
    ])
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// ─── PATCH update brand ────────────────────────────────────────────────────
export async function PATCH(req) {
  const supabase = await auth();
  if (!supabase)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, ...updates } = await req.json();

  if (!id)
    return NextResponse.json({ error: "id is required" }, { status: 400 });

  const { data, error } = await supabase
    .from("brands")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// ─── DELETE brand (also removes logo from storage if it's a Supabase URL) ──
export async function DELETE(req) {
  const supabase = await auth();
  if (!supabase)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  if (!id)
    return NextResponse.json({ error: "id is required" }, { status: 400 });

  // Fetch brand first so we can clean up storage
  const { data: brand } = await supabase
    .from("brands")
    .select("logo_url")
    .eq("id", id)
    .single();

  // If logo is stored in our Supabase bucket, delete the file too
  if (brand?.logo_url) {
    const supabaseStorageHost = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (brand.logo_url.includes(supabaseStorageHost)) {
      // Extract path after /brand-logos/
      const match = brand.logo_url.match(/brand-logos\/(.+)$/);
      if (match?.[1]) {
        await supabase.storage.from("brand-logos").remove([match[1]]);
      }
    }
  }

  const { error } = await supabase.from("brands").delete().eq("id", id);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}