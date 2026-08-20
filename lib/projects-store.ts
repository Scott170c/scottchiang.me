import { promises as fs } from "node:fs";
import path from "node:path";
import type { ProjectItem } from "./types";

const LOCAL_PATH = path.join(process.cwd(), "data", "projects.json");
const REPO_PATH = "data/projects.json";
const GITHUB_API = "https://api.github.com";

function githubConfig() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return null;
  }
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  if (!owner || !repo) {
    throw new Error("GITHUB_OWNER and GITHUB_REPO must be set alongside GITHUB_TOKEN");
  }
  const branch = process.env.GITHUB_BRANCH || "main";
  return { token, owner, repo, branch };
}

function githubHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

export type ProjectsSnapshot = {
  projects: ProjectItem[];
  sha: string | null; // GitHub blob sha, null when backed by local disk only
};

export async function loadProjects(): Promise<ProjectsSnapshot> {
  const config = githubConfig();

  if (!config) {
    const raw = await fs.readFile(LOCAL_PATH, "utf8");
    return { projects: JSON.parse(raw), sha: null };
  }

  const url = `${GITHUB_API}/repos/${config.owner}/${config.repo}/contents/${REPO_PATH}?ref=${config.branch}`;
  const res = await fetch(url, { headers: githubHeaders(config.token), cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Failed to load projects from GitHub (${res.status})`);
  }

  const data = (await res.json()) as { content: string; sha: string };
  const decoded = Buffer.from(data.content, "base64").toString("utf8");
  return { projects: JSON.parse(decoded), sha: data.sha };
}

export async function saveProjects(projects: ProjectItem[]): Promise<void> {
  const config = githubConfig();
  const content = JSON.stringify(projects, null, 2) + "\n";

  if (!config) {
    await fs.writeFile(LOCAL_PATH, content, "utf8");
    return;
  }

  // Fetch a fresh sha immediately before writing to minimize the race window
  // against concurrent edits.
  const { sha } = await loadProjects();
  const url = `${GITHUB_API}/repos/${config.owner}/${config.repo}/contents/${REPO_PATH}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: { ...githubHeaders(config.token), "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "chore: update projects via admin dashboard",
      content: Buffer.from(content, "utf8").toString("base64"),
      sha,
      branch: config.branch,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to save projects to GitHub (${res.status}): ${body}`);
  }
}

const HEX_COLOR = /^#[0-9a-fA-F]{3,8}$/;
const SLUG = /^[a-z0-9-]+$/;

function assertString(value: unknown, field: string, maxLength: number, required = true): string {
  if (value === undefined || value === null || value === "") {
    if (required) {
      throw new Error(`"${field}" is required`);
    }
    return "";
  }
  if (typeof value !== "string") {
    throw new Error(`"${field}" must be a string`);
  }
  if (value.length > maxLength) {
    throw new Error(`"${field}" must be ${maxLength} characters or fewer`);
  }
  return value;
}

export function validateProjects(input: unknown): ProjectItem[] {
  if (!Array.isArray(input)) {
    throw new Error("Payload must be an array of projects");
  }
  if (input.length > 60) {
    throw new Error("Too many projects (max 60)");
  }

  const seenIds = new Set<string>();

  return input.map((raw, index) => {
    if (typeof raw !== "object" || raw === null) {
      throw new Error(`Project at index ${index} must be an object`);
    }
    const item = raw as Record<string, unknown>;

    const id = assertString(item.id, `projects[${index}].id`, 80);
    if (!SLUG.test(id)) {
      throw new Error(`projects[${index}].id must be a lowercase slug (letters, numbers, hyphens)`);
    }
    if (seenIds.has(id)) {
      throw new Error(`Duplicate project id: "${id}"`);
    }
    seenIds.add(id);

    const title = assertString(item.title, `projects[${index}].title`, 120);
    const description = assertString(item.description, `projects[${index}].description`, 600);
    const href = assertString(item.href, `projects[${index}].href`, 500);
    const status = assertString(item.status, `projects[${index}].status`, 60);
    const accent = assertString(item.accent, `projects[${index}].accent`, 20);
    if (!HEX_COLOR.test(accent)) {
      throw new Error(`projects[${index}].accent must be a hex color like #26231f`);
    }
    const imageSrc = assertString(item.imageSrc, `projects[${index}].imageSrc`, 1000, false);
    const imageAlt = assertString(item.imageAlt, `projects[${index}].imageAlt`, 200, false);

    if (!Array.isArray(item.tags) || item.tags.length > 8) {
      throw new Error(`projects[${index}].tags must be an array of at most 8 strings`);
    }
    const tags = item.tags.map((tag, tagIndex) =>
      assertString(tag, `projects[${index}].tags[${tagIndex}]`, 40),
    );

    return {
      id,
      title,
      description,
      href,
      tags,
      status,
      accent,
      ...(imageSrc ? { imageSrc } : {}),
      ...(imageAlt ? { imageAlt } : {}),
    };
  });
}
