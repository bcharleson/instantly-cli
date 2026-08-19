import { InstantlyClient } from './client.js';
import { resolveCredentials, type ResolvedCredentials } from './auth.js';
import {
  assertProfileWorkspace,
  assertWorkspaceMatchesLive,
  assertWriteWorkspace,
  fetchLiveWorkspace,
  type LiveWorkspace,
} from './workspace.js';

export interface CommandContextOptions {
  apiKey?: string;
  profile?: string;
  workspace?: string;
  mutating: boolean;
}

export interface CommandContext {
  client: InstantlyClient;
  credentials: ResolvedCredentials;
  liveWorkspace?: LiveWorkspace;
}

/**
 * Build the HTTP client for a single command invocation.
 * One process, one workspace: a selected profile is verified against the live
 * workspace, and writes also require an explicit matching --workspace UUID.
 * When `--workspace` is passed on any path, live id must match that flag.
 */
export async function createCommandContext(
  opts: CommandContextOptions,
): Promise<CommandContext> {
  const credentials = await resolveCredentials({
    apiKey: opts.apiKey,
    profile: opts.profile,
  });
  const client = new InstantlyClient({ apiKey: credentials.apiKey });
  const workspaceFlag = opts.workspace?.trim() || undefined;

  if (credentials.profile) {
    const liveWorkspace = await assertProfileWorkspace(client, credentials.profile);
    if (opts.mutating) {
      assertWriteWorkspace(credentials.profile, workspaceFlag);
    }
    if (workspaceFlag) {
      assertWorkspaceMatchesLive(liveWorkspace, workspaceFlag);
    }
    return { client, credentials, liveWorkspace };
  }

  // Default single-key path: --workspace is optional. Omitted = today's behavior.
  if (!workspaceFlag) {
    return { client, credentials };
  }

  const liveWorkspace = await fetchLiveWorkspace(client);
  assertWorkspaceMatchesLive(liveWorkspace, workspaceFlag);
  return { client, credentials, liveWorkspace };
}
