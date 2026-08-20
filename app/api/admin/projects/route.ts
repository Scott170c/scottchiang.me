import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, isTrustedOrigin, verifySessionToken } from "../../../../lib/admin-auth";
import { loadProjects, saveProjects, validateProjects } from "../../../../lib/projects-store";

export const runtime = "nodejs";

function isAuthenticated(request: NextRequest): boolean {
  return verifySessionToken(request.cookies.get(SESSION_COOKIE_NAME)?.value);
}

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const snapshot = await loadProjects();
    return NextResponse.json(snapshot);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load projects" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isTrustedOrigin(request.headers.get("origin"), request.headers.get("host"))) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const payload = body as { projects?: unknown };

  let validated;
  try {
    validated = validateProjects(payload.projects);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid project data" },
      { status: 400 },
    );
  }

  try {
    await saveProjects(validated);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save projects" },
      { status: 500 },
    );
  }
}
