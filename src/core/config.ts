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

export function normalizeConfig(raw: unknown): InstantlyConfig | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;
  if (typeof obj.api_key !== 'string' || !obj.api_key) return null;
  const nested =
    obj.workspace && typeof obj.workspace === 'object'
      ? (obj.workspace as Record<string, unknown>)
      : undefined;
  const workspaceId =
    typeof obj.workspace_id === 'string' && obj.workspace_id
      ? obj.workspace_id
      : typeof nested?.id === 'string' && nested.id
        ? nested.id
        : undefined;
  const workspaceName =
    typeof obj.workspace_name === 'string'
      ? obj.workspace_name
      : typeof nested?.name === 'string'
        ? nested.name
        : undefined;
  return {
    api_key: obj.api_key,
    workspace_id: workspaceId,
    workspace_name: workspaceName,
    workspace: workspaceId ? { id: workspaceId, name: workspaceName ?? '' } : undefined,
  };
}

export async function loadConfig(): Promise<InstantlyConfig | null> {
  try {
    const content = await readFile(getConfigPath(), 'utf-8');
    return normalizeConfig(JSON.parse(content));
  } catch {
    return null;
  }
}

export async function saveConfig(config: InstantlyConfig): Promise<void> {
  const dir = getConfigDir();
  const file = getConfigPath();
  const normalized = normalizeConfig(config) ?? config;
  await mkdir(dir, { recursive: true, mode: 0o700 });
  await writeFile(file, JSON.stringify(normalized, null, 2) + '\n', {
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
