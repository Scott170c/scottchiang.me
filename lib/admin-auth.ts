import { randomBytes, scryptSync, timingSafeEqual, createHmac } from "node:crypto";

export const SESSION_COOKIE_NAME = "admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 hours
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

/**
 * Hash a plaintext password into the "scrypt:<saltHex>:<hashHex>" format
 * stored in ADMIN_PASSWORD_HASH. Used by scripts/hash-password.mjs, not at runtime.
 */
export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const derived = scryptSync(password, salt, 64);
  return `scrypt:${salt.toString("hex")}:${derived.toString("hex")}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const parts = stored.split(":");
  if (parts.length !== 3 || parts[0] !== "scrypt") {
    return false;
  }
  const [, saltHex, hashHex] = parts;
  const salt = Buffer.from(saltHex, "hex");
  const expected = Buffer.from(hashHex, "hex");
  const actual = scryptSync(password, salt, expected.length);
  if (actual.length !== expected.length) {
    return false;
  }
  return timingSafeEqual(actual, expected);
}

function sign(payload: string): string {
  const secret = requireEnv("SESSION_SECRET");
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function createSessionToken(): string {
  const expiresAt = Date.now() + SESSION_TTL_SECONDS * 1000;
  const payload = Buffer.from(JSON.stringify({ expiresAt })).toString("base64url");
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) {
    return false;
  }
  const [payload, signature] = token.split(".");
  if (!payload || !signature) {
    return false;
  }

  let expectedSignature: string;
  try {
    expectedSignature = sign(payload);
  } catch {
    return false;
  }

  const a = Buffer.from(signature);
  const b = Buffer.from(expectedSignature);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return false;
  }

  try {
    const { expiresAt } = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return typeof expiresAt === "number" && Date.now() < expiresAt;
  } catch {
    return false;
  }
}

export const sessionCookieMaxAge = SESSION_TTL_SECONDS;

// Best-effort in-memory rate limiting. Resets on cold start / across serverless
// instances, so this is a speed bump against casual brute-forcing, not a hard
// guarantee — the real defenses are the scrypt cost factor and a strong password.
const loginAttempts = new Map<string, { count: number; lockUntil: number }>();

export function checkRateLimit(key: string): { allowed: boolean; retryAfterMs?: number } {
  const entry = loginAttempts.get(key);
  const now = Date.now();

  if (entry && entry.lockUntil > now) {
    return { allowed: false, retryAfterMs: entry.lockUntil - now };
  }

  return { allowed: true };
}

export function recordLoginFailure(key: string): void {
  const now = Date.now();
  const entry = loginAttempts.get(key) ?? { count: 0, lockUntil: 0 };
  entry.count += 1;
  if (entry.count >= MAX_LOGIN_ATTEMPTS) {
    entry.lockUntil = now + LOCKOUT_MS;
    entry.count = 0;
  }
  loginAttempts.set(key, entry);
}

export function recordLoginSuccess(key: string): void {
  loginAttempts.delete(key);
}

export function getAdminPasswordHash(): string {
  return requireEnv("ADMIN_PASSWORD_HASH");
}

// Same-origin check for state-changing requests. Browsers set the Origin
// header on fetch()/form POSTs; if it's present it must match the host we're
// serving from. Absence of the header is tolerated (older clients, same-tab
// navigations) since the HttpOnly + SameSite=Strict cookie is the primary guard.
export function isTrustedOrigin(originHeader: string | null, hostHeader: string | null): boolean {
  if (!originHeader) {
    return true;
  }
  if (!hostHeader) {
    return false;
  }
  try {
    return new URL(originHeader).host === hostHeader;
  } catch {
    return false;
  }
}
