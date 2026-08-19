import { Command } from 'commander';
import { join } from 'node:path';
import { deleteConfig, getConfigPath } from '../../core/config.js';
import { loadDotEnv } from '../../core/auth.js';
import { deleteProfile, getProfilePath, loadProfile } from '../../core/profiles.js';
import { output, outputError } from '../../core/output.js';
import type { GlobalOptions } from '../../core/types.js';

export function registerLogoutCommand(program: Command): void {
  program
    .command('logout')
    .description(
      'Remove stored default config, or a single --profile file. Never deletes every profile at once.',
    )
    .option('--profile <slug>', 'Remove only ~/.instantly/profiles/<slug>.json (does not touch config.json)')
    .action(async (opts: { profile?: string }) => {
      const globalOpts = program.opts() as GlobalOptions;
      const slug = opts.profile || globalOpts.profile;

      try {
        if (slug) {
          const existed = Boolean(await loadProfile(slug));
          const removed = await deleteProfile(slug);
          output(
            {
              status: removed ? 'profile_logged_out' : 'not_found',
              profile: slug,
              existed,
              path: getProfilePath(slug),
              default_config_written: false,
            },
            globalOpts,
          );
          if (!removed) {
            process.exitCode = 1;
          }
          return;
        }

        await deleteConfig();

        const dotEnv = await loadDotEnv(process.cwd());
        const dotEnvHasKey = Boolean(dotEnv['INSTANTLY_API_KEY']);
        const dotEnvPath = join(process.cwd(), '.env');

        const result: Record<string, string> = { status: 'logged_out' };
        if (dotEnvHasKey) {
          result.warning =
            `Stored config cleared at ${getConfigPath()}, but INSTANTLY_API_KEY is still set in ${dotEnvPath}. ` +
            `Delete or unset it there to fully unauthenticate.`;
        }

        if (!globalOpts.quiet) {
          if (globalOpts.output === 'pretty' || process.stdin.isTTY) {
            console.log(`Logged out. Cleared stored config at ${getConfigPath()}.`);
            if (dotEnvHasKey) {
              console.warn(
                `\nWarning: INSTANTLY_API_KEY is still active in ${dotEnvPath}.\n` +
                `Delete that file or remove the key from it to fully unauthenticate.`,
              );
            }
          } else {
            output(result, globalOpts);
          }
        }
      } catch (error) {
        outputError(error, globalOpts);
      }
    });
}
