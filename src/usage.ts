import { projects } from "./data";
export async function recordUsage(projectId: string, amount: number) {
  const project = projects.find((p) => p.id === projectId);
  if (!project) throw new Error("missing project");
  const current = project.usage;
  await new Promise((r) => setTimeout(r, 2));
  project.usage = current + amount;
  return project.usage;
}
