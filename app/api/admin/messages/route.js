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
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(req) {
  const supabase = await auth();
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, status } = await req.json();
  const { data, error } = await supabase
    .from("messages")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
