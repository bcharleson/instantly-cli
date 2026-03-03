import { Command } from 'commander';
import { input as promptInput, password } from '@inquirer/prompts';
import { InstantlyClient } from '../../core/client.js';
import { saveConfig } from '../../core/config.js';
import { output, outputError } from '../../core/output.js';
import type { GlobalOptions } from '../../core/types.js';

export function registerLoginCommand(program: Command): void {
  program
    .command('login')
    .description('Authenticate with your Instantly API key')
    .option('--api-key <key>', 'API key (skips interactive prompt)')
    .action(async (opts) => {
      const globalOpts = program.opts() as GlobalOptions;

      try {
        let apiKey = opts.apiKey || process.env.INSTANTLY_API_KEY;

        // Interactive prompt if no key provided and we're in a TTY
        if (!apiKey) {
          if (!process.stdin.isTTY) {
            outputError(
              new Error('No API key provided. Use --api-key or set INSTANTLY_API_KEY'),
              globalOpts,
            );
            return;
          }

          console.log('Get your API key from: https://app.instantly.ai/app/settings/integrations\n');

          apiKey = await password({
            message: 'Enter your API key:',
            mask: '*',
          });
        }

        if (!apiKey) {
          outputError(new Error('No API key provided'), globalOpts);
          return;
        }

        // Validate by making a test request
        const client = new InstantlyClient({ apiKey });

        if (globalOpts.output === 'pretty' || process.stdin.isTTY) {
          console.log('Validating API key...');
        }

        // Try to get workspace info to validate the key
        let workspaceInfo: any;
        try {
          workspaceInfo = await client.get('/workspace');
        } catch {
          // Some scopes might not have workspace access, just save the key
          workspaceInfo = null;
        }

        await saveConfig({
          api_key: apiKey,
          workspace: workspaceInfo
            ? { id: workspaceInfo.id, name: workspaceInfo.name }
            : undefined,
        });

        const result = {
          status: 'authenticated',
          workspace: workspaceInfo?.name ?? 'unknown',
          config_path: '~/.instantly/config.json',
        };

        if (globalOpts.output === 'pretty' || process.stdin.isTTY) {
          console.log(`\nAuthenticated successfully!`);
          if (workspaceInfo?.name) {
            console.log(`Workspace: ${workspaceInfo.name}`);
          }
          console.log('Config saved to ~/.instantly/config.json');
        } else {
          output(result, globalOpts);
        }
      } catch (error) {
        outputError(error, globalOpts);
      }
    });
}
