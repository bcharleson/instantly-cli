import type { InstantlyClient } from './types.js';
import { ValidationError, WorkspaceMismatchError } from './errors.js';

export interface LiveWorkspace {
  id: string;
  name: string;
  email?: unknown;
}

export function normalizeWorkspace(raw: unknown): LiveWorkspace | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;
  const nested =
    obj.workspace && typeof obj.workspace === 'object'
      ? (obj.workspace as Record<string, unknown>)
      : obj;
  const id = nested.id ?? nested.workspace_id ?? obj.id;
  const name = nested.name ?? nested.workspace_name ?? obj.name;
  if (typeof id !== 'string' || !id) return null;
  return {
    id,
    name: typeof name === 'string' ? name : '',
    email: nested.email ?? obj.email,
  };
}

/**
 * Fetch the workspace the current API key belongs to.
 * Tries the documented current-workspace path, then the login-era fallback.
 */
export async function fetchLiveWorkspace(client: InstantlyClient): Promise<LiveWorkspace> {
  const attempts = ['/workspaces/current', '/workspace'];
  let lastError: unknown;
  for (const path of attempts) {
    try {
      const raw = await client.get<unknown>(path);
      const workspace = normalizeWorkspace(raw);
      if (workspace) return workspace;
    } catch (error) {
      lastError = error;
    }
  }
  const detail = lastError instanceof Error ? lastError.message : 'no workspace payload';
  throw new ValidationError(
    `Could not resolve the live workspace for this API key (${detail}).`,
  );
}

export async function assertProfileWorkspace(
  client: InstantlyClient,
  profile: { slug: string; workspace_id: string; workspace_name: string },
): Promise<LiveWorkspace> {
  const live = await fetchLiveWorkspace(client);
  if (live.id !== profile.workspace_id) {
    throw new WorkspaceMismatchError(
      `Profile '${profile.slug}' is bound to workspace ${profile.workspace_id}` +
        `${profile.workspace_name ? ` (${profile.workspace_name})` : ''}, ` +
        `but this API key currently resolves to ${live.id}` +
        `${live.name ? ` (${live.name})` : ''}. Aborting to prevent cross-workspace access.`,
    );
  }
  return live;
}

export function assertWriteWorkspace(
  profile: { slug: string; workspace_id: string },
  workspaceFlag: string | undefined,
): void {
  if (!workspaceFlag) {
    throw new ValidationError(
      `Write command requires --workspace ${profile.workspace_id} when using profile '${profile.slug}'. ` +
        `This confirms the target workspace before any mutation.`,
    );
  }
  if (workspaceFlag !== profile.workspace_id) {
    throw new WorkspaceMismatchError(
      `--workspace ${workspaceFlag} does not match profile '${profile.slug}' ` +
        `bound workspace ${profile.workspace_id}. Aborting.`,
    );
  }
}

/**
 * When `--workspace` is passed on any path (default or profile), it must match
 * the live workspace the current API key belongs to.
 */
export function assertWorkspaceMatchesLive(
  live: LiveWorkspace,
  workspaceFlag: string,
): void {
  if (workspaceFlag !== live.id) {
    throw new WorkspaceMismatchError(
      `--workspace ${workspaceFlag} does not match the live workspace ${live.id}` +
        `${live.name ? ` (${live.name})` : ''}. Aborting.`,
    );
  }
}
