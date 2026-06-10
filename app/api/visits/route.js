import { NextResponse } from "next/server";
import { getServiceClient } from "../../../lib/supabase";

export async function POST(req) {
  try {
    const supabase = getServiceClient();

    const body = await req.json();

    const page = body.page || "/";

    const forwarded =
      req.headers.get("x-forwarded-for");

    const ip =
      forwarded?.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const userAgent =
      req.headers.get("user-agent") || "";

    const today =
      new Date().toISOString().split("T")[0];

    const { data } = await supabase
      .from("page_visits")
      .select("*")
      .eq("visitor_ip", ip)
      .eq("visit_date", today)
      .eq("page_path", page)
      .maybeSingle();

    if (data) {
      await supabase
        .from("page_visits")
        .update({
          hit_count: data.hit_count + 1,
        })
        .eq("id", data.id);
    } else {
      await supabase
        .from("page_visits")
        .insert([
          {
            visitor_ip: ip,
            page_path: page,
            user_agent: userAgent,
          },
        ]);
    }

    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { ok: true }
    );
  }
}