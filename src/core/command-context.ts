import { InstantlyClient } from './client.js';
import { resolveCredentials, type ResolvedCredentials } from './auth.js';
import { assertProfileWorkspace, assertWriteWorkspace, type LiveWorkspace } from './workspace.js';

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
 */
export async function createCommandContext(
  opts: CommandContextOptions,
): Promise<CommandContext> {
  const credentials = await resolveCredentials({
    apiKey: opts.apiKey,
    profile: opts.profile,
  });
  const client = new InstantlyClient({ apiKey: credentials.apiKey });

  if (!credentials.profile) {
    return { client, credentials };
  }

  const liveWorkspace = await assertProfileWorkspace(client, credentials.profile);
  if (opts.mutating) {
    assertWriteWorkspace(credentials.profile, opts.workspace);
  }

  return { client, credentials, liveWorkspace };
}
