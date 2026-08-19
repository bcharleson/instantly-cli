import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mkdtemp, readFile, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Command } from 'commander';
import { createProgram } from '../../src/program.js';

const ACME_WORKSPACE = '11111111-1111-4111-8111-111111111111';
const FAKE_KEY = 'fake-acme-key';

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

describe('login --profile persists a profile file', () => {
  const originalEnv = process.env;
  let stdout: string[];
  let stderr: string[];
  let home: string;

  beforeEach(async () => {
    process.env = { ...originalEnv };
    delete process.env.INSTANTLY_API_KEY;
    delete process.env.INSTANTLY_PROFILE;
    stdout = [];
    stderr = [];
    vi.spyOn(console, 'log').mockImplementation((message?: unknown) => {
      stdout.push(String(message ?? ''));
    });
    vi.spyOn(console, 'error').mockImplementation((message?: unknown) => {
      stderr.push(String(message ?? ''));
    });
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    home = await mkdtemp(join(tmpdir(), 'instantly-login-profile-'));
    process.env.INSTANTLY_HOME = home;

    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: string | URL, init?: RequestInit) => {
        const url = String(input);
        const headers = (init?.headers ?? {}) as Record<string, string>;
        const auth = headers.Authorization ?? headers.authorization ?? '';
        const key = auth.replace(/^Bearer\s+/i, '');
        if (key !== FAKE_KEY) {
          return jsonResponse({ error: 'unauthorized' }, 401);
        }
        if (url.includes('/workspaces/current') || /\/workspace$/.test(url)) {
          return jsonResponse({ id: ACME_WORKSPACE, name: 'Acme Workspace' });
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

  async function expectAcmeProfilePersisted(): Promise<void> {
    expect(process.exitCode ?? 0).toBe(0);
    expect(stderr.join('\n')).not.toMatch(/No API key provided/);

    const profile = JSON.parse(await readFile(join(home, 'profiles', 'acme.json'), 'utf-8'));
    expect(profile.api_key).toBe(FAKE_KEY);
    expect(profile.workspace_id).toBe(ACME_WORKSPACE);
    expect(profile.workspace_name).toBe('Acme Workspace');

    await expect(access(join(home, 'config.json'))).rejects.toThrow();
  }

  it('login without --profile stamps workspace_id and workspace_name onto config.json', async () => {
    await run(['login', '--api-key', FAKE_KEY]);
    expect(process.exitCode ?? 0).toBe(0);
    const config = JSON.parse(await readFile(join(home, 'config.json'), 'utf-8'));
    expect(config.api_key).toBe(FAKE_KEY);
    expect(config.workspace_id).toBe(ACME_WORKSPACE);
    expect(config.workspace_name).toBe('Acme Workspace');
    await expect(access(join(home, 'profiles', 'acme.json'))).rejects.toThrow();

    stdout.length = 0;
    await run(['status']);
    const status = JSON.parse(stdout.join('\n'));
    expect(status.profile).toBe('default');
    expect(status.workspace_id).toBe(ACME_WORKSPACE);
    expect(status.workspace_name).toBe('Acme Workspace');
    expect(status.source).toContain('stored config');
    expect(status).not.toHaveProperty('api_key');
    expect(JSON.stringify(status)).not.toContain(FAKE_KEY);
  });

  it('login --profile acme --api-key <fake> writes the profile and not config.json', async () => {
    await run(['login', '--profile', 'acme', '--api-key', FAKE_KEY]);
    await expectAcmeProfilePersisted();
  });

  it('global --api-key before login --profile is not stripped', async () => {
    await run(['--api-key', FAKE_KEY, 'login', '--profile', 'acme']);
    await expectAcmeProfilePersisted();
  });

  it('profile add acme --api-key <fake> writes the profile and not config.json', async () => {
    await run(['profile', 'add', 'acme', '--api-key', FAKE_KEY]);
    await expectAcmeProfilePersisted();
  });
});
