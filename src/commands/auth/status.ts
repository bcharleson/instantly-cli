import { Command } from 'commander';
import { loadConfig, getConfigPath } from '../../core/config.js';
import { loadDotEnv } from '../../core/auth.js';
import { InstantlyClient } from '../../core/client.js';
import { output, outputError } from '../../core/output.js';
import type { GlobalOptions } from '../../core/types.js';
import { join } from 'node:path';

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
        'Checks --api-key flag, INSTANTLY_API_KEY env var, .env file, and ~/.instantly/config.json in order.',
    )
    .action(async () => {
      const globalOpts = program.opts() as GlobalOptions;

      try {
        let apiKey: string | undefined;
        let source: string | undefined;

        // 1. --api-key flag
        if (globalOpts.apiKey) {
          apiKey = globalOpts.apiKey;
          source = '--api-key flag';
        }

        // 2. INSTANTLY_API_KEY in process.env (set before process started)
        if (!apiKey && process.env.INSTANTLY_API_KEY) {
          apiKey = process.env.INSTANTLY_API_KEY;
          source = 'INSTANTLY_API_KEY environment variable';
        }

        // 3. .env file in cwd
        if (!apiKey) {
          const dotEnv = await loadDotEnv(process.cwd());
          if (dotEnv['INSTANTLY_API_KEY']) {
            apiKey = dotEnv['INSTANTLY_API_KEY'];
            source = `.env file (${join(process.cwd(), '.env')})`;
          }
        }

        // 4. ~/.instantly/config.json
        if (!apiKey) {
          const config = await loadConfig();
          if (config?.api_key) {
            apiKey = config.api_key;
            source = `stored config (${getConfigPath()})`;
          }
        }

        if (!apiKey || !source) {
          output(
            {
              authenticated: false,
              source: null,
              error:
                'No API key found. Set INSTANTLY_API_KEY, use --api-key, add it to .env, or run: instantly login',
            },
            globalOpts,
          );
          process.exitCode = 1;
          return;
        }

        // Mask the key for display: show first 8 and last 4 chars
        const masked =
          apiKey.length > 16
            ? `${apiKey.slice(0, 8)}…${apiKey.slice(-4)}`
            : '***';

        // Verify by calling workspace endpoint
        const client = new InstantlyClient({ apiKey });
        try {
          const workspace = await client.get<Record<string, unknown>>(
            '/workspaces/current',
          );
          output(
            {
              authenticated: true,
              source,
              api_key: masked,
              workspace: {
                id: workspace.id,
                name: workspace.name,
                email: workspace.email,
              },
            },
            globalOpts,
          );
        } catch (verifyErr: unknown) {
          const msg =
            verifyErr instanceof Error ? verifyErr.message : String(verifyErr);
          output(
            {
              authenticated: false,
              source,
              api_key: masked,
              error: `Key found but verification failed: ${msg}`,
            },
            globalOpts,
          );
          process.exitCode = 1;
        }
      } catch (error) {
        outputError(error, globalOpts);
      }
    });
}

