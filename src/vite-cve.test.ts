import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";

// GHSA-587h-7wmj-h5pm (CVE-2026-112942) — launch-editor check bypass on Windows.
// Fixed versions per advisory:
//   vite 7.x        <= 7.3.6 -> 7.3.7
//   vite 8.0.x      <= 8.1.5 -> 8.1.6
//   vite 8.2.x      <= 8.2.3 -> 8.2.4
//   vite 8.3.x      <= 8.3.2 -> 8.3.3
function isVulnerableVite(version: string): boolean {
  const m = /^(\d+)\.(\d+)\.(\d+)(?:-[0-9A-Za-z.-]+)?$/.exec(version);
  if (!m) return true; // unparseable -> treat as not-a-fixed-version
  const [maj, min, pat] = [Number(m[1]), Number(m[2]), Number(m[3])];
  if (maj === 7) return min < 3 || (min === 3 && pat <= 6);
  if (maj === 8) {
    if (min === 0 || min === 1) return pat <= 5; // <8.1.6
    if (min === 2) return pat <= 3; // <8.2.4
    if (min === 3) return pat <= 2; // <8.3.3
    return min < 3;
  }
  return false; // other majors are out of advisory scope
}

function viteVersionFromLockfile(): string {
  const lock = JSON.parse(
    readFileSync(join(process.cwd(), "package-lock.json"), "utf8"),
  ) as {
    packages?: { "node_modules/vite"?: { version?: string } };
  };
  const version = lock.packages?.["node_modules/vite"]?.version;
  if (!version) throw new Error("vite not found in package-lock.json");
  return version;
}

describe("GHSA-587h-7wmj-h5pm (vite)", () => {
  const resolved = viteVersionFromLockfile();

  test("resolved vite in the lockfile is patched", () => {
    expect(isVulnerableVite(resolved)).toBe(false);
  });

  test("advisory mapping: 7.x line is fixed by 7.3.7", () => {
    expect(isVulnerableVite("7.3.6")).toBe(true); // vulnerable
    expect(isVulnerableVite("7.3.7")).toBe(false); // patched
    expect(isVulnerableVite("7.4.0")).toBe(false);
  });

  test("advisory mapping: 8.x lines are fixed by 8.1.6/8.2.4/8.3.3", () => {
    expect(isVulnerableVite("8.1.5")).toBe(true);
    expect(isVulnerableVite("8.1.6")).toBe(false);
    expect(isVulnerableVite("8.2.3")).toBe(true);
    expect(isVulnerableVite("8.2.4")).toBe(false);
    expect(isVulnerableVite("8.3.2")).toBe(true);
    expect(isVulnerableVite("8.3.3")).toBe(false);
  });

  test("vitest still accepts the resolved vite version (dependency range consistency)", () => {
    const lock = JSON.parse(
      readFileSync(join(process.cwd(), "package-lock.json"), "utf8"),
    ) as {
      packages?: Record<string, { version?: string; dependencies?: Record<string, string>; peerDependencies?: Record<string, string> }>;
    };
    const maj = Number(resolved.split(".")[0]);
    const vitestDep = lock.packages?.["node_modules/vitest"]?.dependencies?.vite;
    expect(vitestDep).toBeDefined();
    expect(maj).toBeGreaterThanOrEqual(5);
    expect(maj).toBeLessThanOrEqual(7); // vitest 3.x declares ^5 || ^6 || ^7
  });
});
