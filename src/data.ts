export type User = {
  id: string;
  email: string;
  orgId: string;
  role: "member" | "admin";
};
export type Project = {
  id: string;
  orgId: string;
  name: string;
  usage: number;
};
export type Invite = {
  token: string;
  orgId: string;
  email: string;
  expiresAt: number;
};
export const users: User[] = [
  { id: "u1", email: "ada@acme.test", orgId: "org_a", role: "admin" },
  { id: "u2", email: "grace@beta.test", orgId: "org_b", role: "member" },
];
export const projects: Project[] = [
  { id: "prj_a", orgId: "org_a", name: "Launch telemetry", usage: 40 },
  { id: "prj_b", orgId: "org_b", name: "Billing import", usage: 12 },
];
export const invites: Invite[] = [
  {
    token: "expired-token",
    orgId: "org_a",
    email: "new@acme.test",
    expiresAt: Date.now() - 86400000,
  },
  {
    token: "fresh-token",
    orgId: "org_b",
    email: "new@beta.test",
    expiresAt: Date.now() + 86400000,
  },
];
export const sessions = new Map<string, string>([["valid-session", "u1"]]);
