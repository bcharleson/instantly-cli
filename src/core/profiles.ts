import { readFile, writeFile, mkdir, rm, readdir, chmod } from 'node:fs/promises';
import { join } from 'node:path';
import { getConfigDir, getConfigPath, loadConfig } from './config.js';
import { ValidationError } from './errors.js';
import type { InstantlyProfile } from './types.js';

const SLUG_PATTERN = /^[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$/;

export function assertProfileSlug(slug: string): string {
  if (!slug || !SLUG_PATTERN.test(slug)) {
    throw new ValidationError(
      `Invalid profile slug '${slug}'. Use a lowercase slug like acme or client-a ` +
        `(letters, numbers, hyphens; 1–64 characters).`,
    );
  }
  if (slug === 'default') {
    throw new ValidationError(
      `'default' is reserved for ~/.instantly/config.json. ` +
        'Use instantly login --profile <client> to name a workspace.',
    );
  }
  return slug;
}

export function getProfilesDir(): string {
  return join(getConfigDir(), 'profiles');
}

export function getProfilePath(slug: string): string {
  return join(getProfilesDir(), `${assertProfileSlug(slug)}.json`);
}

export async function loadProfile(slug: string): Promise<InstantlyProfile | null> {
  try {
    const content = await readFile(getProfilePath(slug), 'utf-8');
    const parsed = JSON.parse(content) as Partial<InstantlyProfile>;
    if (!parsed.api_key || !parsed.workspace_id) {
      throw new ValidationError(
        `Profile '${slug}' is incomplete. Re-run: instantly login --profile ${slug}`,
      );
    }
    return {
      api_key: parsed.api_key,
      workspace_id: parsed.workspace_id,
      workspace_name: parsed.workspace_name ?? '',
    };
  } catch (error) {
    if (error instanceof ValidationError) throw error;
    return null;
  }
}

export async function saveProfile(slug: string, profile: InstantlyProfile): Promise<string> {
  assertProfileSlug(slug);
  const dir = getProfilesDir();
  const file = getProfilePath(slug);
  await mkdir(dir, { recursive: true, mode: 0o700 });
  await chmod(dir, 0o700).catch(() => undefined);
  await writeFile(
    file,
    JSON.stringify(
      {
        api_key: profile.api_key,
        workspace_id: profile.workspace_id,
        workspace_name: profile.workspace_name,
      },
      null,
      2,
    ) + '\n',
    { mode: 0o600 },
  );
  await chmod(file, 0o600);
  return file;
}

export async function deleteProfile(slug: string): Promise<boolean> {
  try {
    await rm(getProfilePath(slug));
    return true;
  } catch {
    return false;
  }
}

export interface ProfileListItem {
  profile: string;
  slug: string;
  workspace_id: string;
  workspace_name: string;
  source: string;
}

function listItem(
  profile: string,
  workspaceId: string,
  workspaceName: string,
  source: string,
): ProfileListItem {
  return {
    profile,
    slug: profile,
    workspace_id: workspaceId,
    workspace_name: workspaceName,
    source,
  };
}

/**
 * List bound workspaces (default config + named profiles). Never returns API keys.
 * Does not call the Instantly API — one process still equals one workspace.
 */
export async function listProfiles(): Promise<ProfileListItem[]> {
  const items: ProfileListItem[] = [];
  const config = await loadConfig();
  if (config?.api_key) {
    items.push(
      listItem(
        'default',
        config.workspace_id ?? '',
        config.workspace_name ?? '',
        `stored config (${getConfigPath()})`,
      ),
    );
  }

  let names: string[];
  try {
    names = await readdir(getProfilesDir());
  } catch {
    return items;
  }

  for (const name of names) {
    if (!name.endsWith('.json')) continue;
    const slug = name.slice(0, -5);
    try {
      assertProfileSlug(slug);
    } catch {
      continue;
    }
    const profile = await loadProfile(slug);
    if (!profile) continue;
    items.push(
      listItem(slug, profile.workspace_id, profile.workspace_name, `profile (${slug})`),
    );
  }
  return items.sort((a, b) => {
    if (a.profile === 'default') return -1;
    if (b.profile === 'default') return 1;
    return a.profile.localeCompare(b.profile);
  });
}
