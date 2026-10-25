import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";

// GHSA-mrhx-c7xc-m3w5 — zod advisory, fixed in 4.6.6.
// Versions below 4.6.6 (including all 3.x lines) are affected.
function isVulnerableZod(version: string): boolean {
  const m = /^(\d+)\.(\d+)\.(\d+)(?:-[0-9A-Za-z.-]+)?$/.exec(version);
  if (!m) return true; // unparseable -> treat as not-a-fixed-version
  const [maj, min, pat] = [Number(m[1]), Number(m[2]), Number(m[3])];
  if (maj < 4) return true; // every 3.x release is affected
  if (maj === 4) return min < 6 || (min === 6 && pat < 6);
  return false; // 5.x+ is out of advisory scope
}

function zodVersionFromLockfile(): string {
  const lockPath = fileURLToPath(new URL("../package-lock.json", import.meta.url));
  const lock = JSON.parse(readFileSync(lockPath, "utf8")) as {
    packages?: { "node_modules/zod"?: { version?: string } };
  };
  const version = lock.packages?.["node_modules/zod"]?.version;
  if (!version) throw new Error("zod not found in package-lock.json");
  return version;
}

describe("GHSA-mrhx-c7xc-m3w5 (zod)", () => {
  const resolved = zodVersionFromLockfile();

  test("resolved zod in the lockfile is patched", () => {
    expect(isVulnerableZod(resolved)).toBe(false);
  });

  test("advisory mapping: 3.x is vulnerable, 4.6.6 is patched", () => {
    expect(isVulnerableZod("3.25.76")).toBe(true); // vulnerable
    expect(isVulnerableZod("4.6.5")).toBe(true); // still vulnerable
    expect(isVulnerableZod("4.6.6")).toBe(false); // patched
  });
});
