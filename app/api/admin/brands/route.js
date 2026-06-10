import { NextResponse } from "next/server";
import { getAdminSession } from "../../../../lib/auth";
import { getServiceClient } from "../../../../lib/supabase";

async function auth() {
  const session = await getAdminSession();
  if (!session) return null;
  return getServiceClient();
}

export async function GET() {
  const supabase = await auth();
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .order("display_order");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req) {
  const supabase = await auth();
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { data, error } = await supabase
    .from("brands")
    .insert([body])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(req) {
  const supabase = await auth();
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, ...updates } = await req.json();
  const { data, error } = await supabase
    .from("brands")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req) {
  const supabase = await auth();
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  const { error } = await supabase.from("brands").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
