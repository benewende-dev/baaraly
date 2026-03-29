import fs from "node:fs";
import path from "node:path";
import { resolveDefaultConfigPath } from "./home-paths.js";

const BAARALY_CONFIG_BASENAME = "config.json";
const BAARALY_ENV_FILENAME = ".env";

function findConfigFileFromAncestors(startDir: string): string | null {
  const absoluteStartDir = path.resolve(startDir);
  let currentDir = absoluteStartDir;

  while (true) {
    const candidate = path.resolve(currentDir, ".baaraly", BAARALY_CONFIG_BASENAME);
    if (fs.existsSync(candidate)) {
      return candidate;
    }

    const nextDir = path.resolve(currentDir, "..");
    if (nextDir === currentDir) break;
    currentDir = nextDir;
  }

  return null;
}

export function resolvePaperclipConfigPath(overridePath?: string): string {
  if (overridePath) return path.resolve(overridePath);
  if (process.env.BAARALY_CONFIG) return path.resolve(process.env.BAARALY_CONFIG);
  return findConfigFileFromAncestors(process.cwd()) ?? resolveDefaultConfigPath();
}

export function resolveBaaralyEnvPath(overrideConfigPath?: string): string {
  return path.resolve(path.dirname(resolvePaperclipConfigPath(overrideConfigPath)), BAARALY_ENV_FILENAME);
}
