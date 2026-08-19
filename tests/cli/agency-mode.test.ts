import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mkdtemp, writeFile, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Command } from 'commander';
import { createProgram } from '../../src/program.js';
import { saveProfile } from '../../src/core/profiles.js';
import { saveConfig } from '../../src/core/config.js';

const CLIENT_A = '11111111-1111-4111-8111-111111111111';
const CLIENT_B = '22222222-2222-4222-8222-222222222222';

interface FetchCall {
  url: string;
  method: string;
  key: string;
}

function jsonResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: 'OK',
    headers: new Headers(),
    text: async () => JSON.stringify(body),
    json: async () => body,
  } as unknown as Response;
}

describe('agency CLI (real program, two profiles)', () => {
  const originalEnv = process.env;
  const fetches: FetchCall[] = [];
  let stdout: string[];
  let stderr: string[];

  beforeEach(async () => {
    process.env = { ...originalEnv };
    delete process.env.INSTANTLY_API_KEY;
    delete process.env.INSTANTLY_PROFILE;
    fetches.length = 0;
    stdout = [];
    stderr = [];
    vi.spyOn(console, 'log').mockImplementation((message?: unknown) => {
      stdout.push(String(message ?? ''));
    });
    vi.spyOn(console, 'error').mockImplementation((message?: unknown) => {
      stderr.push(String(message ?? ''));
    });
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    const home = await mkdtemp(join(tmpdir(), 'instantly-agency-cli-'));
    process.env.INSTANTLY_HOME = home;
    await saveConfig({ api_key: 'default-key', workspace: { id: CLIENT_A, name: 'Default' } });
    await saveProfile('client-a', {
      api_key: 'client-a-key',
      workspace_id: CLIENT_A,
      workspace_name: 'Client A',
    });
    await saveProfile('client-b', {
      api_key: 'client-b-key',
      workspace_id: CLIENT_B,
      workspace_name: 'Client B',
    });

    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: string | URL, init?: RequestInit) => {
        const url = String(input);
        const headers = (init?.headers ?? {}) as Record<string, string>;
        const auth = headers.Authorization ?? headers.authorization ?? '';
        const key = auth.replace(/^Bearer\s+/i, '');
        fetches.push({ url, method: init?.method ?? 'GET', key });

        const workspace =
          key === 'client-b-key'
            ? { id: CLIENT_B, name: 'Client B' }
            : key === 'client-a-key'
              ? { id: CLIENT_A, name: 'Client A' }
              : { id: CLIENT_A, name: 'Default' };

        if (url.includes('/workspaces/current') || /\/workspace$/.test(url)) {
          return jsonResponse(workspace);
        }
        if (url.includes('/accounts')) {
          return jsonResponse({ items: [{ email: 'sender@example.com', status: 1, warmup_status: 1 }] });
        }
        if (url.includes('/campaigns/analytics/overview')) {
          return jsonResponse({ bounced: 0, sent: 1 });
        }
        if (url.includes('/campaigns')) {
          return jsonResponse({ items: [{ id: 'camp-1', name: 'Outreach', status: 1 }] });
        }
        return jsonResponse({ items: [] });
      }),
    );
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    process.exitCode = 0;
  });

  function program(): Command {
    const cli = createProgram();
    cli.exitOverride();
    return cli;
  }

  async function run(args: string[]): Promise<void> {
    await program().parseAsync(args, { from: 'user' });
  }

  it('default status stays on the single-key config workspace', async () => {
    await run(['status']);
    const payload = JSON.parse(stdout.join('\n'));
    expect(payload.authenticated).toBe(true);
    expect(payload.profile).toBe('default');
    expect(payload.workspace_id).toBe(CLIENT_A);
    expect(payload.workspace_name).toBe('Default');
    expect(payload.source).toContain('stored config');
    expect(JSON.stringify(payload)).not.toContain('default-key');
    expect(fetches.every((call) => call.key !== 'client-b-key')).toBe(true);
  });

  it('profile list returns profile, workspace_id, workspace_name, source and never the raw key', async () => {
    await run(['profile', 'list']);
    const listed = JSON.parse(stdout.join('\n'));
    expect(listed.map((item: { profile: string }) => item.profile)).toEqual([
      'default',
      'client-a',
      'client-b',
    ]);
    for (const item of listed) {
      expect(item.workspace_id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
      );
      expect(item.workspace_name).toBeTruthy();
      expect(item.source).toBeTruthy();
    }
    expect(stdout.join('\n')).not.toContain('default-key');
    expect(stdout.join('\n')).not.toContain('client-a-key');
    expect(stdout.join('\n')).not.toContain('client-b-key');
  });

  it('profiled status, campaigns list, and health use only client-a', async () => {
    await run(['--profile', 'client-a', 'status']);
    const status = JSON.parse(stdout.pop()!);
    expect(status.profile).toBe('client-a');
    expect(status.workspace_id).toBe(CLIENT_A);
    expect(status.workspace_name).toBe('Client A');

    stdout.length = 0;
    fetches.length = 0;
    await run(['--profile', 'client-a', 'campaigns', 'list']);
    expect(fetches.some((call) => call.url.includes('/campaigns') && call.key === 'client-a-key')).toBe(true);
    expect(fetches.some((call) => call.key === 'client-b-key')).toBe(false);

    stdout.length = 0;
    fetches.length = 0;
    await run(['--profile', 'client-a', 'health']);
    const health = JSON.parse(stdout.join('\n'));
    expect(health.profile).toBe('client-a');
    expect(health.workspace_id).toBe(CLIENT_A);
    expect(fetches.some((call) => call.key === 'client-b-key')).toBe(false);
  });

  it('default key + --workspace of a different uuid aborts before the HTTP handler', async () => {
    fetches.length = 0;
    await run([
      '--workspace',
      CLIENT_B,
      'campaigns',
      'activate',
      '33333333-3333-4333-8333-333333333333',
    ]);
    expect(process.exitCode).toBe(1);
    expect(stderr.join('\n')).toMatch(/does not match the live workspace/);
    expect(fetches.some((call) => call.url.includes('/activate'))).toBe(false);
    expect(fetches.some((call) => call.url.includes('/campaigns/') && call.method === 'POST')).toBe(
      false,
    );
  });

  it('write with the wrong --workspace aborts before the mutation', async () => {
    await run([
      '--profile',
      'client-a',
      '--workspace',
      CLIENT_B,
      'campaigns',
      'activate',
      '33333333-3333-4333-8333-333333333333',
    ]);
    expect(process.exitCode).toBe(1);
    expect(stderr.join('\n')).toMatch(/does not match profile 'client-a'/);
    expect(fetches.some((call) => call.url.includes('/activate'))).toBe(false);
  });

  it('oauth connect is a write and requires matching --workspace under a profile', async () => {
    await run(['--profile', 'client-a', 'oauth', 'connect', 'google', '--no-open', '--no-poll']);
    expect(process.exitCode).toBe(1);
    expect(stderr.join('\n')).toMatch(/requires --workspace/);
    expect(fetches.some((call) => call.url.includes('/oauth/'))).toBe(false);
  });

  it('does not iterate client-a and client-b in one process', async () => {
    await run(['--profile', 'client-b', 'campaigns', 'list']);
    expect(fetches.every((call) => call.key === 'client-b-key')).toBe(true);
    expect(fetches.some((call) => call.key === 'client-a-key')).toBe(false);

    const home = process.env.INSTANTLY_HOME!;
    const defaultConfig = JSON.parse(await readFile(join(home, 'config.json'), 'utf-8'));
    expect(defaultConfig.api_key).toBe('default-key');
  });

  it('login --profile does not overwrite config.json', async () => {
    const home = process.env.INSTANTLY_HOME!;
    await writeFile(
      join(home, 'config.json'),
      JSON.stringify({ api_key: 'original-default-key' }, null, 2),
    );

    await run(['login', '--profile', 'client-a', '--api-key', 'client-a-key']);
    const config = JSON.parse(await readFile(join(home, 'config.json'), 'utf-8'));
    expect(config.api_key).toBe('original-default-key');
    const profile = JSON.parse(await readFile(join(home, 'profiles', 'client-a.json'), 'utf-8'));
    expect(profile.workspace_id).toBe(CLIENT_A);
    expect(profile.workspace_name).toBe('Client A');
  });
});
