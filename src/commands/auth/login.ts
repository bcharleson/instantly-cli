import { Command } from 'commander';
import { InstantlyClient } from '../../core/client.js';
import { resolveProvidedApiKey } from '../../core/auth.js';
import { output, outputError } from '../../core/output.js';
import { persistLoginSession, defaultConfigHintPath, defaultProfileHintPath } from '../../core/login-store.js';
import { fetchLiveWorkspace } from '../../core/workspace.js';
import type { GlobalOptions } from '../../core/types.js';

async function promptForApiKey(): Promise<string | undefined> {
  const [major] = process.versions.node.split('.').map(Number);
  if (major < 20) {
    throw new Error('Interactive login requires Node.js 20+. Use --api-key or set INSTANTLY_API_KEY instead.');
  }
  const { password } = await import('@inquirer/prompts');
  return password({
    message: 'Enter your API key:',
    mask: '*',
  });
}

export function registerLoginCommand(program: Command): void {
  program
    .command('login')
    .description(
      'Authenticate and bind this API key to the live workspace id and name. ' +
        'Default writes ~/.instantly/config.json. --profile <slug> writes only ~/.instantly/profiles/<slug>.json.',
    )
    .option('--api-key <key>', 'API key (skips interactive prompt)')
    .option(
      '--profile <slug>',
      'Save as a named workspace profile under ~/.instantly/profiles/<slug>.json (does not write config.json)',
    )
    .action(async (opts) => {
      const globalOpts = program.opts() as GlobalOptions;
      const profileSlug = (opts.profile || globalOpts.profile) as string | undefined;

      try {
        let apiKey = resolveProvidedApiKey(opts.apiKey, globalOpts.apiKey);

        if (!apiKey) {
          if (!process.stdin.isTTY) {
            outputError(
              new Error('No API key provided. Use --api-key or set INSTANTLY_API_KEY'),
              globalOpts,
            );
            return;
          }

          console.log('Get your API key from: https://app.instantly.ai/app/settings/integrations\n');
          apiKey = await promptForApiKey();
        }

        if (!apiKey) {
          outputError(new Error('No API key provided'), globalOpts);
          return;
        }

        const client = new InstantlyClient({ apiKey });

        if (globalOpts.output === 'pretty' || process.stdin.isTTY) {
          console.log('Validating API key...');
        }

        // Bind the live workspace to this key (default config or named profile).
        const workspaceInfo = await fetchLiveWorkspace(client);

        const persisted = await persistLoginSession({
          apiKey,
          workspace: workspaceInfo,
          profileSlug,
        });

        const hintPath = profileSlug
          ? defaultProfileHintPath(profileSlug)
          : defaultConfigHintPath();

        const result = {
          status: 'authenticated',
          profile: profileSlug ?? 'default',
          workspace: workspaceInfo?.name ?? 'unknown',
          workspace_id: workspaceInfo?.id ?? null,
          workspace_name: workspaceInfo?.name ?? null,
          config_path: profileSlug ? hintPath : defaultConfigHintPath(),
          stored_at: persisted.stored_at,
        };

        if (globalOpts.output === 'pretty' || process.stdin.isTTY) {
          console.log(`\nAuthenticated successfully!`);
          console.log(`Profile: ${profileSlug ?? 'default'}`);
          if (workspaceInfo?.name) {
            console.log(`Workspace: ${workspaceInfo.name}`);
          }
          if (workspaceInfo?.id) {
            console.log(`Workspace ID: ${workspaceInfo.id}`);
          }
          console.log(`Config saved to ${hintPath}`);
          if (profileSlug) {
            console.log('Default ~/.instantly/config.json was not modified.');
          }
        } else {
          output(result, globalOpts);
        }
      } catch (error) {
        outputError(error, globalOpts);
      }
    });
}
