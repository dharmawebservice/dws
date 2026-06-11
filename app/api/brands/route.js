import { NextResponse } from "next/server";
import { getServiceClient } from "../../../lib/supabase";

// Force dynamic so Vercel never caches this route
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = getServiceClient();
    const { data, error } = await supabase
      .from("brands")
      .select("id, name, logo_url, website_url, display_order")
      .eq("active", true)
      .order("display_order");

    if (error) {
      console.error("Brands fetch error:", error.message);
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(data ?? []);
  } catch (err) {
    console.error("Brands route error:", err);
    return NextResponse.json([], { status: 200 });
  }
}