import { Command } from 'commander';
import { InstantlyClient } from '../../core/client.js';
import { resolveCredentials } from '../../core/auth.js';
import { fetchLiveWorkspace } from '../../core/workspace.js';
import { AuthError, WorkspaceMismatchError } from '../../core/errors.js';
import { output, outputError } from '../../core/output.js';
import type { GlobalOptions } from '../../core/types.js';

function maskApiKey(apiKey: string): string {
  return apiKey.length > 16
    ? `${apiKey.slice(0, 8)}…${apiKey.slice(-4)}`
    : '***';
}

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
        profile: opts.profile ?? process.env.INSTANTLY_PROFILE ?? null,
        workspace_id: null,
        workspace_name: null,
        error: error.message,
      };
    }
    throw error;
  }

  const masked = maskApiKey(credentials.apiKey);
  const client = new InstantlyClient({ apiKey: credentials.apiKey });

  try {
    const workspace = await fetchLiveWorkspace(client);
    if (credentials.profile && workspace.id !== credentials.profile.workspace_id) {
      return {
        authenticated: false,
        source: credentials.source,
        profile: credentials.profile.slug,
        api_key: masked,
        workspace_id: workspace.id,
        workspace_name: workspace.name,
        bound_workspace_id: credentials.profile.workspace_id,
        bound_workspace_name: credentials.profile.workspace_name,
        error:
          `Profile '${credentials.profile.slug}' is bound to workspace ` +
          `${credentials.profile.workspace_id}, but the API key resolves to ${workspace.id}.`,
      };
    }

    return {
      authenticated: true,
      source: credentials.source,
      profile: credentials.profile?.slug ?? null,
      api_key: masked,
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
    return {
      authenticated: false,
      source: credentials.source,
      profile: credentials.profile?.slug ?? null,
      api_key: masked,
      workspace_id: credentials.profile?.workspace_id ?? null,
      workspace_name: credentials.profile?.workspace_name ?? null,
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
        'Checks --api-key, --profile / INSTANTLY_PROFILE, INSTANTLY_API_KEY, .env, and ~/.instantly/config.json.',
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
