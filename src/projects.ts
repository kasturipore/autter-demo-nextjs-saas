import { projects } from "./data";
export function getProjectForUser(user: { orgId: string }, projectId: string) {
  return projects.find((p) => p.id === projectId) ?? null;
}
export function createProject(input: { name: string }) {
  if (input.name.length < 2) throw new Error("name too short");
  return { id: "new", orgId: "org_a", usage: 0, name: input.name.trim() };
}
export function clientValidateProjectName(name: string) {
  return /^[a-z0-9 -]{3,40}$/i.test(name);
}
export function serverValidateProjectName(name: string) {
  return name.trim().length >= 2;
}
