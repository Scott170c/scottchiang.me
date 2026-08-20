import { NextRequest, NextResponse } from "next/server";
import {
  SESSION_COOKIE_NAME,
  checkRateLimit,
  createSessionToken,
  getAdminPasswordHash,
  isTrustedOrigin,
  recordLoginFailure,
  recordLoginSuccess,
  sessionCookieMaxAge,
  verifyPassword,
} from "../../../../lib/admin-auth";

export const runtime = "nodejs";

function clientKey(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export async function POST(request: NextRequest) {
  if (!isTrustedOrigin(request.headers.get("origin"), request.headers.get("host"))) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }

  const key = clientKey(request);
  const rateLimit = checkRateLimit(key);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rateLimit.retryAfterMs ?? 0) / 1000)) } },
    );
  }

  let password: unknown;
  try {
    ({ password } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Constant-ish delay regardless of outcome to blunt timing-based enumeration.
  await new Promise((resolve) => setTimeout(resolve, 300));

  if (typeof password !== "string" || !verifyPassword(password, getAdminPasswordHash())) {
    recordLoginFailure(key);
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  recordLoginSuccess(key);

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: sessionCookieMaxAge,
  });
  return response;
}
