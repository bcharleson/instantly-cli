import { Command } from 'commander';
import { join } from 'node:path';
import { deleteConfig, getConfigPath } from '../../core/config.js';
import { loadDotEnv } from '../../core/auth.js';
import { output, outputError } from '../../core/output.js';
import type { GlobalOptions } from '../../core/types.js';

export function registerLogoutCommand(program: Command): void {
  program
    .command('logout')
    .description('Remove stored API key and configuration')
    .action(async () => {
      const globalOpts = program.opts() as GlobalOptions;

      try {
        await deleteConfig();

        // Check whether a local .env file still holds INSTANTLY_API_KEY so the
        // user knows they are not fully unauthenticated after running logout.
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
