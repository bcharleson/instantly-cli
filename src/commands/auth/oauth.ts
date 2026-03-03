import { Command } from 'commander';
import { select } from '@inquirer/prompts';
import { InstantlyClient } from '../../core/client.js';
import { resolveApiKey } from '../../core/auth.js';
import { output, outputError } from '../../core/output.js';
import type { GlobalOptions } from '../../core/types.js';

const POLL_INTERVAL_MS = 3000;
const MAX_POLL_MS = 10 * 60 * 1000; // 10 minutes (session TTL)

async function openUrl(url: string): Promise<void> {
  const { exec } = await import('child_process');
  const { promisify } = await import('util');
  const execAsync = promisify(exec);

  const platform = process.platform;
  const cmd =
    platform === 'darwin' ? 'open' :
    platform === 'win32' ? 'start' :
    'xdg-open';

  await execAsync(`${cmd} "${url}"`).catch(() => {
    // If open fails, user will copy the URL manually
  });
}

async function pollStatus(
  client: InstantlyClient,
  sessionId: string,
  isTTY: boolean,
): Promise<{ status: string; email?: string; name?: string; error?: string; error_description?: string }> {
  const start = Date.now();
  while (Date.now() - start < MAX_POLL_MS) {
    const result = await client.get(`/oauth/session/status/${sessionId}`) as any;

    if (result.status === 'success') return result;
    if (result.status === 'error') return result;
    if (result.status === 'expired') return result;

    if (isTTY) {
      const elapsed = Math.round((Date.now() - start) / 1000);
      process.stderr.write(`\rWaiting for authorization... (${elapsed}s)`);
    }

    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
  }

  return { status: 'expired' };
}

export function registerOAuthCommand(program: Command): void {
  const oauth = program
    .command('oauth')
    .description('Connect email accounts via OAuth (Google or Microsoft)');

  oauth
    .command('connect')
    .description('Connect an email account via OAuth')
    .argument('[provider]', 'OAuth provider: google or microsoft')
    .option('--no-open', 'Do not auto-open the browser')
    .option('--no-poll', 'Return session info without polling for completion')
    .action(async (providerArg, opts) => {
      const globalOpts = program.opts() as GlobalOptions;

      try {
        const apiKey = await resolveApiKey(globalOpts.apiKey);
        const client = new InstantlyClient({ apiKey });
        const isTTY = !!process.stdin.isTTY;

        let provider = providerArg;
        if (!provider && isTTY) {
          provider = await select({
            message: 'Select OAuth provider:',
            choices: [
              { name: 'Google (Workspace/GSuite)', value: 'google' },
              { name: 'Microsoft (Outlook/Office 365)', value: 'microsoft' },
            ],
          });
        }

        if (!provider || !['google', 'microsoft'].includes(provider)) {
          outputError(
            new Error('Provider must be "google" or "microsoft"'),
            globalOpts,
          );
          return;
        }

        if (isTTY) {
          console.log(`\nInitializing ${provider === 'google' ? 'Google' : 'Microsoft'} OAuth...`);
        }

        const initResult = await client.post(`/oauth/${provider}/init`, {}) as {
          session_id: string;
          auth_url: string;
          expires_at: string;
        };

        if (!initResult.session_id || !initResult.auth_url) {
          outputError(new Error('Failed to initialize OAuth session'), globalOpts);
          return;
        }

        // Open browser
        if (opts.open !== false) {
          await openUrl(initResult.auth_url);
          if (isTTY) {
            console.log('\nOpened browser for authorization.');
            console.log('If it didn\'t open, visit this URL:\n');
            console.log(`  ${initResult.auth_url}\n`);
          }
        } else if (isTTY) {
          console.log('\nOpen this URL in your browser to authorize:\n');
          console.log(`  ${initResult.auth_url}\n`);
        }

        // If --no-poll, just return session info
        if (opts.poll === false) {
          output({
            session_id: initResult.session_id,
            auth_url: initResult.auth_url,
            expires_at: initResult.expires_at,
          }, globalOpts);
          return;
        }

        // Poll for completion
        const result = await pollStatus(client, initResult.session_id, isTTY);

        if (isTTY) {
          process.stderr.write('\r' + ' '.repeat(60) + '\r'); // clear progress line
        }

        if (result.status === 'success') {
          if (isTTY) {
            console.log(`Account connected successfully!`);
            console.log(`  Email: ${result.email}`);
            if (result.name) console.log(`  Name: ${result.name}`);
          }
          output({
            status: 'success',
            email: result.email,
            name: result.name,
          }, globalOpts);
        } else if (result.status === 'error') {
          outputError(
            new Error(`OAuth failed: ${result.error_description || result.error}`),
            globalOpts,
          );
        } else {
          outputError(new Error('OAuth session expired. Please try again.'), globalOpts);
        }
      } catch (error) {
        outputError(error, globalOpts);
      }
    });

  oauth
    .command('status')
    .description('Check the status of an OAuth session')
    .argument('<session-id>', 'OAuth session ID')
    .action(async (sessionId) => {
      const globalOpts = program.opts() as GlobalOptions;

      try {
        const apiKey = await resolveApiKey(globalOpts.apiKey);
        const client = new InstantlyClient({ apiKey });

        const result = await client.get(`/oauth/session/status/${sessionId}`);
        output(result, globalOpts);
      } catch (error) {
        outputError(error, globalOpts);
      }
    });
}
