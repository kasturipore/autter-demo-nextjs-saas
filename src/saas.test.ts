import { describe, expect, test } from "vitest";
import { login, getUserBySession, simulateBrowserRefresh } from "./auth";
import { acceptInvite } from "./invites";
import { projects } from "./data";
import {
  getProjectForUser,
  clientValidateProjectName,
  serverValidateProjectName,
} from "./projects";
import { recordUsage } from "./usage";
describe("planted SaaS bugs", () => {
  test.fails("keeps session after refresh", () => {
    login("ada@acme.test");
    simulateBrowserRefresh();
    expect(getUserBySession("valid-session")?.email).toBe("ada@acme.test");
  });
  test.fails("blocks cross-org access", () => {
    expect(getProjectForUser({ orgId: "org_a" }, "prj_b")).toBeNull();
  });
  test.fails("rejects expired invites", () => {
    expect(() => acceptInvite("expired-token")).toThrow(/expired/);
  });
  test.fails("counts concurrent usage", async () => {
    const project = projects.find((p) => p.id === "prj_a")!;
    project.usage = 40;
    await Promise.all([recordUsage("prj_a", 1), recordUsage("prj_a", 1)]);
    expect(project.usage).toBe(42);
  });
  test("shows validation drift", () => {
    expect(clientValidateProjectName("ok")).toBe(false);
    expect(serverValidateProjectName("ok")).toBe(true);
  });
});
