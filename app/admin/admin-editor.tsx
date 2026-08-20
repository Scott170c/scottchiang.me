"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ProjectItem } from "../../lib/types";

type EditableProject = ProjectItem & { _key: string };

function makeKey(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function blankProject(): EditableProject {
  return {
    _key: makeKey(),
    id: "",
    title: "",
    description: "",
    href: "#",
    tags: [],
    status: "project",
    accent: "#26231f",
    imageSrc: "",
    imageAlt: "",
  };
}

const inputClass =
  "w-full rounded-md border border-[#eee8de] bg-white px-2.5 py-1.5 text-sm text-[#1d1a16] outline-none focus:border-[#a88961]";
const labelClass = "text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-[#8a6a44]";

export function AdminEditor({ initialProjects }: { initialProjects: ProjectItem[] }) {
  const router = useRouter();
  const [projects, setProjects] = useState<EditableProject[]>(() =>
    initialProjects.map((p) => ({ ...p, _key: makeKey() })),
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function updateProject(key: string, patch: Partial<EditableProject>) {
    setProjects((prev) => prev.map((p) => (p._key === key ? { ...p, ...patch } : p)));
  }

  function move(key: string, direction: -1 | 1) {
    setProjects((prev) => {
      const index = prev.findIndex((p) => p._key === key);
      const target = index + direction;
      if (index === -1 || target < 0 || target >= prev.length) {
        return prev;
      }
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function removeProject(key: string) {
    setProjects((prev) => prev.filter((p) => p._key !== key));
  }

  function addProject() {
    setProjects((prev) => [...prev, blankProject()]);
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);

    const payload = projects.map(({ _key, ...rest }) => rest);

    try {
      const res = await fetch("/api/admin/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projects: payload }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save");
      }
      setMessage({ type: "success", text: "Saved. Changes may take a minute to redeploy." });
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Failed to save" });
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#fbf8f1] px-4 py-10 text-[#1d1a16] sm:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Projects dashboard</h1>
          <button
            className="text-sm font-semibold text-[#8a6a44] underline decoration-1 underline-offset-4 hover:text-[#1d1a16]"
            onClick={handleLogout}
            type="button"
          >
            Log out
          </button>
        </div>

        {message ? (
          <p
            className={[
              "mb-6 rounded-md border px-4 py-2.5 text-sm",
              message.type === "success"
                ? "border-[#c8d8c4] bg-[#f2f7ee] text-[#3f6b3a]"
                : "border-[#e3b9ac] bg-[#fbeeea] text-[#9a3a24]",
            ].join(" ")}
          >
            {message.text}
          </p>
        ) : null}

        <div className="grid gap-5">
          {projects.map((project, index) => (
            <div
              className="rounded-lg border border-[#eee8de] bg-[#fffdfa] p-4 shadow-[0_10px_28px_rgba(29,26,22,0.03)]"
              key={project._key}
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#756c61]">
                  Project {index + 1}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    className="rounded px-2 py-1 text-xs font-semibold text-[#756c61] hover:bg-[#f2ede2] disabled:opacity-30"
                    disabled={index === 0}
                    onClick={() => move(project._key, -1)}
                    type="button"
                  >
                    ↑
                  </button>
                  <button
                    className="rounded px-2 py-1 text-xs font-semibold text-[#756c61] hover:bg-[#f2ede2] disabled:opacity-30"
                    disabled={index === projects.length - 1}
                    onClick={() => move(project._key, 1)}
                    type="button"
                  >
                    ↓
                  </button>
                  <button
                    className="rounded px-2 py-1 text-xs font-semibold text-[#9a3a24] hover:bg-[#fbeeea]"
                    onClick={() => removeProject(project._key)}
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1">
                  <span className={labelClass}>Title</span>
                  <input
                    className={inputClass}
                    onChange={(event) => {
                      const title = event.target.value;
                      updateProject(project._key, {
                        title,
                        id: project.id || slugify(title),
                      });
                    }}
                    value={project.title}
                  />
                </label>

                <label className="grid gap-1">
                  <span className={labelClass}>ID (slug, must be unique)</span>
                  <input
                    className={inputClass}
                    onChange={(event) => updateProject(project._key, { id: slugify(event.target.value) })}
                    value={project.id}
                  />
                </label>

                <label className="grid gap-1 sm:col-span-2">
                  <span className={labelClass}>Description</span>
                  <textarea
                    className={inputClass}
                    onChange={(event) => updateProject(project._key, { description: event.target.value })}
                    rows={2}
                    value={project.description}
                  />
                </label>

                <label className="grid gap-1">
                  <span className={labelClass}>Link (href)</span>
                  <input
                    className={inputClass}
                    onChange={(event) => updateProject(project._key, { href: event.target.value })}
                    value={project.href}
                  />
                </label>

                <label className="grid gap-1">
                  <span className={labelClass}>Status label</span>
                  <input
                    className={inputClass}
                    onChange={(event) => updateProject(project._key, { status: event.target.value })}
                    value={project.status}
                  />
                </label>

                <label className="grid gap-1">
                  <span className={labelClass}>Tags (comma separated)</span>
                  <input
                    className={inputClass}
                    onChange={(event) =>
                      updateProject(project._key, {
                        tags: event.target.value
                          .split(",")
                          .map((tag) => tag.trim())
                          .filter(Boolean),
                      })
                    }
                    value={project.tags.join(", ")}
                  />
                </label>

                <label className="grid gap-1">
                  <span className={labelClass}>Accent color</span>
                  <div className="flex items-center gap-2">
                    <input
                      className={inputClass}
                      onChange={(event) => updateProject(project._key, { accent: event.target.value })}
                      value={project.accent}
                    />
                    <span
                      className="h-7 w-7 shrink-0 rounded-full border border-[#eee8de]"
                      style={{ backgroundColor: project.accent }}
                    />
                  </div>
                </label>

                <label className="grid gap-1">
                  <span className={labelClass}>Image URL (optional)</span>
                  <input
                    className={inputClass}
                    onChange={(event) => updateProject(project._key, { imageSrc: event.target.value })}
                    value={project.imageSrc ?? ""}
                  />
                </label>

                <label className="grid gap-1">
                  <span className={labelClass}>Image alt text</span>
                  <input
                    className={inputClass}
                    onChange={(event) => updateProject(project._key, { imageAlt: event.target.value })}
                    value={project.imageAlt ?? ""}
                  />
                </label>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            className="rounded-md border border-[#eee8de] bg-white px-4 py-2 text-sm font-semibold text-[#1d1a16] hover:bg-[#f7f3eb]"
            onClick={addProject}
            type="button"
          >
            + Add project
          </button>
          <button
            className="rounded-md bg-[#1d1a16] px-4 py-2 text-sm font-semibold text-white hover:bg-[#332e27] disabled:opacity-50"
            disabled={saving}
            onClick={handleSave}
            type="button"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </main>
  );
}
