import { NextResponse } from "next/server";
import { getServiceClient } from "../../../lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const supabase = getServiceClient();
    const { page } = await req.json();

    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
    const userAgent = req.headers.get("user-agent") || "";
    const today = new Date().toISOString().split("T")[0];

    const { error: insertError } = await supabase
      .from("page_visits")
      .insert([
        {
          visitor_ip: ip,
          visit_date: today,
          page_path: page || "/",
          user_agent: userAgent,
          hit_count: 1,
        },
      ]);

    if (insertError) {
      if (insertError.code === "23505") {
        const { data: existing } = await supabase
          .from("page_visits")
          .select("id, hit_count")
          .eq("visitor_ip", ip)
          .eq("visit_date", today)
          .eq("page_path", page || "/")
          .single();

        if (existing) {
          await supabase
            .from("page_visits")
            .update({ hit_count: (existing.hit_count || 1) + 1 })
            .eq("id", existing.id);
        }
      } else {
        console.error("Visit insert error:", insertError);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Visit tracking error:", err);
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}