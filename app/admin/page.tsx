import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE_NAME, verifySessionToken } from "../../lib/admin-auth";
import { loadProjects } from "../../lib/projects-store";
import { AdminEditor } from "./admin-editor";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!verifySessionToken(token)) {
    redirect("/admin/login");
  }

  const { projects } = await loadProjects();

  return <AdminEditor initialProjects={projects} />;
}
