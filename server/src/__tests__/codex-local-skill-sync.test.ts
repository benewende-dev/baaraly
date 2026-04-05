import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  listCodexSkills,
  syncCodexSkills,
} from "@paperclipai/adapter-codex-local/server";

async function makeTempDir(prefix: string): Promise<string> {
  return fs.mkdtemp(path.join(os.tmpdir(), prefix));
}

describe("codex local skill sync", () => {
  const baaraliKey = "baaraliai/baarali/baarali";
  const cleanupDirs = new Set<string>();

  afterEach(async () => {
    await Promise.all(Array.from(cleanupDirs).map((dir) => fs.rm(dir, { recursive: true, force: true })));
    cleanupDirs.clear();
  });

  it("reports configured Baarali skills for workspace injection on the next run", async () => {
    const codexHome = await makeTempDir("baarali-codex-skill-sync-");
    cleanupDirs.add(codexHome);

    const ctx = {
      agentId: "agent-1",
      companyId: "company-1",
      adapterType: "codex_local",
      config: {
        env: {
          CODEX_HOME: codexHome,
        },
        baaraliSkillSync: {
          desiredSkills: [baaraliKey],
        },
      },
    } as const;

    const before = await listCodexSkills(ctx);
    expect(before.mode).toBe("ephemeral");
    expect(before.desiredSkills).toContain(baaraliKey);
    expect(before.entries.find((entry) => entry.key === baaraliKey)?.required).toBe(true);
    expect(before.entries.find((entry) => entry.key === baaraliKey)?.state).toBe("configured");
    expect(before.entries.find((entry) => entry.key === baaraliKey)?.detail).toContain("CODEX_HOME/skills/");
  });

  it("does not persist Baarali skills into CODEX_HOME during sync", async () => {
    const codexHome = await makeTempDir("baarali-codex-skill-prune-");
    cleanupDirs.add(codexHome);

    const configuredCtx = {
      agentId: "agent-2",
      companyId: "company-1",
      adapterType: "codex_local",
      config: {
        env: {
          CODEX_HOME: codexHome,
        },
        baaraliSkillSync: {
          desiredSkills: [baaraliKey],
        },
      },
    } as const;

    const after = await syncCodexSkills(configuredCtx, [baaraliKey]);
    expect(after.mode).toBe("ephemeral");
    expect(after.entries.find((entry) => entry.key === baaraliKey)?.state).toBe("configured");
    await expect(fs.lstat(path.join(codexHome, "skills", "paperclip"))).rejects.toMatchObject({
      code: "ENOENT",
    });
  });

  it("keeps required bundled Baarali skills configured even when the desired set is emptied", async () => {
    const codexHome = await makeTempDir("baarali-codex-skill-required-");
    cleanupDirs.add(codexHome);

    const configuredCtx = {
      agentId: "agent-2",
      companyId: "company-1",
      adapterType: "codex_local",
      config: {
        env: {
          CODEX_HOME: codexHome,
        },
        baaraliSkillSync: {
          desiredSkills: [],
        },
      },
    } as const;

    const after = await syncCodexSkills(configuredCtx, []);
    expect(after.desiredSkills).toContain(baaraliKey);
    expect(after.entries.find((entry) => entry.key === baaraliKey)?.state).toBe("configured");
  });

  it("normalizes legacy flat Baarali skill refs before reporting configured state", async () => {
    const codexHome = await makeTempDir("baarali-codex-legacy-skill-sync-");
    cleanupDirs.add(codexHome);

    const snapshot = await listCodexSkills({
      agentId: "agent-3",
      companyId: "company-1",
      adapterType: "codex_local",
      config: {
        env: {
          CODEX_HOME: codexHome,
        },
        baaraliSkillSync: {
          desiredSkills: ["paperclip"],
        },
      },
    });

    expect(snapshot.warnings).toEqual([]);
    expect(snapshot.desiredSkills).toContain(baaraliKey);
    expect(snapshot.desiredSkills).not.toContain("paperclip");
    expect(snapshot.entries.find((entry) => entry.key === baaraliKey)?.state).toBe("configured");
    expect(snapshot.entries.find((entry) => entry.key === "paperclip")).toBeUndefined();
  });
});
