import { NextResponse } from "next/server";
import { createToken } from "../../../../lib/auth";

export async function POST(req) {
  try {
    const { password } = await req.json();
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "dws-admin-2024";

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const token = await createToken();

    const res = NextResponse.json({ ok: true });
    res.cookies.set("dws_admin", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 12, // 12 hours
      path: "/",
    });

    return res;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
