import { getConfigPath, saveConfig } from './config.js';
import { ValidationError } from './errors.js';
import { saveProfile } from './profiles.js';
import type { LiveWorkspace } from './workspace.js';

export interface PersistLoginResult {
  stored_at: string;
  profile?: string;
  workspace_id?: string;
  workspace_name?: string;
}

/**
 * Persist credentials after a successful key validation.
 * `--profile` writes ONLY ~/.instantly/profiles/<slug>.json.
 * Default login writes ONLY ~/.instantly/config.json.
 */
export async function persistLoginSession(options: {
  apiKey: string;
  workspace: LiveWorkspace | null;
  profileSlug?: string;
}): Promise<PersistLoginResult> {
  if (options.profileSlug) {
    if (!options.workspace?.id) {
      throw new ValidationError(
        `Cannot create profile '${options.profileSlug}' without a live workspace id. ` +
          'The API key did not return workspace details. No files were written.',
      );
    }
    const storedAt = await saveProfile(options.profileSlug, {
      api_key: options.apiKey,
      workspace_id: options.workspace.id,
      workspace_name: options.workspace.name,
    });
    return {
      stored_at: storedAt,
      profile: options.profileSlug,
      workspace_id: options.workspace.id,
      workspace_name: options.workspace.name,
    };
  }

  await saveConfig({
    api_key: options.apiKey,
    workspace: options.workspace
      ? { id: options.workspace.id, name: options.workspace.name }
      : undefined,
  });
  return {
    stored_at: getConfigPath(),
    workspace_id: options.workspace?.id,
    workspace_name: options.workspace?.name,
  };
}

export function defaultConfigHintPath(): string {
  return '~/.instantly/config.json';
}

export function defaultProfileHintPath(slug: string): string {
  return `~/.instantly/profiles/${slug}.json`;
}
