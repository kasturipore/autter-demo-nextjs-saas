import { projects } from "./data";
export async function getUsage(projectId: string) {
  await new Promise((r) => setTimeout(r, 1));
  return projects.find((p) => p.id === projectId)?.usage ?? 0;
}
export async function getDashboard(orgId: string) {
  const owned = projects.filter((p) => p.orgId === orgId);
  return {
    projects: await Promise.all(
      owned.map(async (p) => ({ ...p, usage: await getUsage(p.id) })),
    ),
  };
}
