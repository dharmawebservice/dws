import { NextResponse } from "next/server";
import { getServiceClient } from "../../../lib/supabase";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, phone, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const supabase = getServiceClient();
    const { error } = await supabase.from("messages").insert([
      { name, email, phone: phone || null, message }
    ]);

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
