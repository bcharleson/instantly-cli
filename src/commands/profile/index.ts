import { Command } from 'commander';
import { InstantlyClient } from '../../core/client.js';
import { persistLoginSession, defaultProfileHintPath } from '../../core/login-store.js';
import { deleteProfile, listProfiles, loadProfile } from '../../core/profiles.js';
import { fetchLiveWorkspace } from '../../core/workspace.js';
import { output, outputError } from '../../core/output.js';
import { buildAuthStatus } from '../auth/status.js';
import type { GlobalOptions } from '../../core/types.js';

export function registerProfileCommands(program: Command): void {
  const profileCmd = program
    .command('profile')
    .description('Manage opt-in named workspace profiles (one API key, one workspace each)');

  profileCmd
    .command('add')
    .description('Validate an API key and bind it to ~/.instantly/profiles/<slug>.json (does not write config.json)')
    .argument('<slug>', 'Profile slug (e.g. acme, client-a)')
    .option('--api-key <key>', 'API key (defaults to INSTANTLY_API_KEY)')
    .action(async (slug: string, opts: { apiKey?: string }) => {
      const globalOpts = program.opts() as GlobalOptions;
      try {
        const apiKey = opts.apiKey || process.env.INSTANTLY_API_KEY;
        if (!apiKey) {
          throw new Error('No API key provided. Use --api-key or set INSTANTLY_API_KEY');
        }
        const client = new InstantlyClient({ apiKey });
        const workspace = await fetchLiveWorkspace(client);
        const persisted = await persistLoginSession({
          apiKey,
          workspace,
          profileSlug: slug,
        });
        output(
          {
            status: 'profile_saved',
            profile: slug,
            workspace_id: workspace.id,
            workspace_name: workspace.name,
            stored_at: persisted.stored_at,
            path: defaultProfileHintPath(slug),
            default_config_written: false,
          },
          globalOpts,
        );
      } catch (error) {
        outputError(error, globalOpts);
      }
    });

  profileCmd
    .command('list')
    .description('List saved profile slugs and their bound workspace ids (never prints API keys)')
    .action(async () => {
      const globalOpts = program.opts() as GlobalOptions;
      try {
        output(await listProfiles(), globalOpts);
      } catch (error) {
        outputError(error, globalOpts);
      }
    });

  profileCmd
    .command('remove')
    .alias('rm')
    .description('Delete a named profile file. Does not touch ~/.instantly/config.json')
    .argument('<slug>', 'Profile slug to remove')
    .action(async (slug: string) => {
      const globalOpts = program.opts() as GlobalOptions;
      try {
        const existed = await loadProfile(slug);
        const removed = await deleteProfile(slug);
        output(
          {
            status: removed ? 'removed' : 'not_found',
            profile: slug,
            existed: Boolean(existed),
            default_config_written: false,
          },
          globalOpts,
        );
        if (!removed) {
          process.exitCode = 1;
        }
      } catch (error) {
        outputError(error, globalOpts);
      }
    });

  profileCmd
    .command('whoami')
    .description('Show the active credential source, profile slug, and live workspace')
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
        outputError(error, globalOpts);
      }
    });

  profileCmd.on('command:*', (operands: string[]) => {
    console.error(`error: unknown command '${operands[0]}' for 'profile'`);
    console.error('Available commands: add, list, remove, whoami');
    process.exitCode = 1;
  });
}
