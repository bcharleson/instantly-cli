import { readFile, writeFile, mkdir, rm, chmod } from 'node:fs/promises';
import { join } from 'node:path';
import { homedir } from 'node:os';
import type { InstantlyConfig } from './types.js';

/**
 * Config directory. `INSTANTLY_HOME` replaces `~/.instantly` (used by tests
 * and optional isolated installs). Default login still writes config.json here.
 */
export function getConfigDir(): string {
  const override = process.env.INSTANTLY_HOME?.trim();
  if (override) return override;
  return join(homedir(), '.instantly');
}

export function getConfigPath(): string {
  return join(getConfigDir(), 'config.json');
}

export async function loadConfig(): Promise<InstantlyConfig | null> {
  try {
    const content = await readFile(getConfigPath(), 'utf-8');
    return JSON.parse(content) as InstantlyConfig;
  } catch {
    return null;
  }
}

export async function saveConfig(config: InstantlyConfig): Promise<void> {
  const dir = getConfigDir();
  const file = getConfigPath();
  await mkdir(dir, { recursive: true, mode: 0o700 });
  await writeFile(file, JSON.stringify(config, null, 2) + '\n', {
    mode: 0o600,
  });
  await chmod(file, 0o600);
}

export async function deleteConfig(): Promise<void> {
  try {
    await rm(getConfigPath());
  } catch {
    // File doesn't exist, that's fine
  }
}
