import { Command } from 'commander';
import { InstantlyClient } from '../../core/client.js';
import { boundWorkspaceOf, displayProfileSlug, resolveCredentials } from '../../core/auth.js';
import { fetchLiveWorkspace } from '../../core/workspace.js';
import { AuthError, WorkspaceMismatchError } from '../../core/errors.js';
import { output, outputError } from '../../core/output.js';
import type { GlobalOptions } from '../../core/types.js';

export async function buildAuthStatus(opts: {
  apiKey?: string;
  profile?: string;
}): Promise<Record<string, unknown>> {
  let credentials;
  try {
    credentials = await resolveCredentials({
      apiKey: opts.apiKey,
      profile: opts.profile,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        authenticated: false,
        source: null,
        profile: opts.profile ?? process.env.INSTANTLY_PROFILE ?? 'default',
        workspace_id: null,
        workspace_name: null,
        error: error.message,
      };
    }
    throw error;
  }

  const client = new InstantlyClient({ apiKey: credentials.apiKey });

  try {
    const workspace = await fetchLiveWorkspace(client);
    const bound = boundWorkspaceOf(credentials);
    const profile = displayProfileSlug(credentials);
    if (bound && workspace.id !== bound.id) {
      return {
        authenticated: false,
        source: credentials.source,
        profile,
        workspace_id: workspace.id,
        workspace_name: workspace.name,
        bound_workspace_id: bound.id,
        bound_workspace_name: bound.name,
        error:
          `Profile '${profile}' is bound to workspace ${bound.id}` +
          `${bound.name ? ` (${bound.name})` : ''}, but the API key resolves to ${workspace.id}.`,
      };
    }

    return {
      authenticated: true,
      source: credentials.source,
      profile,
      workspace_id: workspace.id,
      workspace_name: workspace.name,
      workspace: {
        id: workspace.id,
        name: workspace.name,
        email: workspace.email,
      },
    };
  } catch (verifyErr: unknown) {
    const msg = verifyErr instanceof Error ? verifyErr.message : String(verifyErr);
    const bound = boundWorkspaceOf(credentials);
    return {
      authenticated: false,
      source: credentials.source,
      profile: displayProfileSlug(credentials),
      workspace_id: bound?.id ?? null,
      workspace_name: bound?.name ?? null,
      error: `Key found but verification failed: ${msg}`,
    };
  }
}

/**
 * Determine which credential source is providing the API key,
 * then verify it against the workspace endpoint.
 */
export function registerStatusCommand(program: Command): void {
  program
    .command('status')
    .alias('whoami')
    .description(
      'Show which credential source is active and verify the workspace it resolves to. ' +
        'Print profile slug (or default), workspace_id, workspace_name, and source. Confirm this bound pair before other commands.',
    )
    .action(async () => {
      const globalOpts = program.opts() as GlobalOptions;

      try {
        const result = await buildAuthStatus({
          apiKey: globalOpts.apiKey,
          profile: globalOpts.profile,
        });

        output(result, globalOpts);
        if (!result.authenticated) {
          process.exitCode = 1;
        }
      } catch (error) {
        if (error instanceof WorkspaceMismatchError) {
          outputError(error, globalOpts);
          return;
        }
        outputError(error, globalOpts);
      }
    });
}
