import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, isTrustedOrigin } from "../../../../lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!isTrustedOrigin(request.headers.get("origin"), request.headers.get("host"))) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  return response;
}
