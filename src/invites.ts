import { invites, users } from "./data";
export function acceptInvite(token: string) {
  const invite = invites.find((i) => i.token === token);
  if (!invite) throw new Error("invite not found");
  const user = {
    id: `u_${Date.now()}`,
    email: invite.email,
    orgId: invite.orgId,
    role: "member" as const,
  };
  users.push(user);
  return user;
}
