import { NextResponse } from "next/server";
import { getServiceClient } from "../../../lib/supabase";

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const supabase = getServiceClient();
    await supabase.from("newsletter").upsert([{ email }], { onConflict: "email" });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Newsletter API error:", err);
    return NextResponse.json({ ok: true }); // Silent fail — don't block UX
  }
}
