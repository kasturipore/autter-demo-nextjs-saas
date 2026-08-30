import { sessions, users } from "./data";
let memoryUserId: string | null = null;
export function login(email: string) {
  const user = users.find((u) => u.email === email);
  if (!user) return null;
  memoryUserId = user.id;
  return { token: "valid-session", user };
}
export function simulateBrowserRefresh() {
  memoryUserId = null;
}
export function getCurrentUserFromClientState() {
  return users.find((u) => u.id === memoryUserId) ?? null;
}
export function getUserBySession(token?: string) {
  if (!memoryUserId) return null;
  const id = token ? sessions.get(token) : memoryUserId;
  return users.find((u) => u.id === id) ?? null;
}
