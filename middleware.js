import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req) {
  const pathname = req.nextUrl.pathname;

  // Allow these routes without authentication
  if (
    pathname === "/api/admin/login" ||
    pathname === "/api/admin/session"
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("dws_admin")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    return NextResponse.next();
  } catch {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: [
    "/api/admin/transactions/:path*",
    "/api/admin/messages/:path*",
    "/api/admin/brands/:path*",
    "/api/admin/visits/:path*",
    "/api/admin/logout/:path*",
  ],
};