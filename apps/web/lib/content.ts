import {
  getProjectBySlug as getFallbackProject,
  projects as fallbackProjects,
} from "@lakefront/content-model";
import { publicProjectListSchema, publicProjectSchema, type PublicProject } from "@lakefront/contracts";

const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

async function fetchProjectList(): Promise<PublicProject[] | undefined> {
  if (!apiBase) {
    return undefined;
  }

  try {
    const response = await fetch(`${apiBase}/api/v1/public/projects`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) {
      return undefined;
    }
    const parsed = publicProjectListSchema.safeParse(await response.json());
    return parsed.success ? parsed.data.data : undefined;
  } catch {
    return undefined;
  }
}

async function fetchProject(slug: string): Promise<PublicProject | undefined> {
  if (!apiBase) {
    return undefined;
  }

  try {
    const response = await fetch(`${apiBase}/api/v1/public/projects/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) {
      return undefined;
    }
    const body = await response.json();
    const parsed = publicProjectSchema.safeParse(body.data);
    return parsed.success ? parsed.data : undefined;
  } catch {
    return undefined;
  }
}

export async function getProjects(): Promise<PublicProject[]> {
  return (await fetchProjectList()) ?? fallbackProjects;
}

export async function getProject(slug: string): Promise<PublicProject | undefined> {
  return (await fetchProject(slug)) ?? getFallbackProject(slug);
}
