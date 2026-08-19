import { Command } from 'commander';
import { InstantlyClient } from '../../core/client.js';
import { resolveProvidedApiKey } from '../../core/auth.js';
import { output, outputError } from '../../core/output.js';
import { persistLoginSession, defaultConfigHintPath, defaultProfileHintPath } from '../../core/login-store.js';
import { fetchLiveWorkspace, normalizeWorkspace } from '../../core/workspace.js';
import type { GlobalOptions } from '../../core/types.js';
import type { LiveWorkspace } from '../../core/workspace.js';

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
    .description('Authenticate with your Instantly API key')
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

        let workspaceInfo: LiveWorkspace | null = null;
        if (profileSlug) {
          // Profile login is fail-closed: a live workspace id is required to bind the file.
          workspaceInfo = await fetchLiveWorkspace(client);
        } else {
          try {
            workspaceInfo = await fetchLiveWorkspace(client);
          } catch {
            try {
              workspaceInfo = normalizeWorkspace(await client.get('/workspace'));
            } catch {
              workspaceInfo = null;
            }
          }
        }

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
          profile: profileSlug ?? null,
          workspace: workspaceInfo?.name ?? 'unknown',
          workspace_id: workspaceInfo?.id ?? null,
          workspace_name: workspaceInfo?.name ?? null,
          config_path: profileSlug ? hintPath : defaultConfigHintPath(),
          stored_at: persisted.stored_at,
        };

        if (globalOpts.output === 'pretty' || process.stdin.isTTY) {
          console.log(`\nAuthenticated successfully!`);
          if (profileSlug) {
            console.log(`Profile: ${profileSlug}`);
          }
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
