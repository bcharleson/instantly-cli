import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mkdtemp, writeFile, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { InstantlyClient } from '../../src/core/client.js';
import { createCommandContext } from '../../src/core/command-context.js';
import { saveProfile } from '../../src/core/profiles.js';
import { WorkspaceMismatchError, ValidationError } from '../../src/core/errors.js';

const ACME_WORKSPACE = '11111111-1111-4111-8111-111111111111';
const OTHER_WORKSPACE = '99999999-9999-4999-8999-999999999999';

describe('createCommandContext', () => {
  const originalEnv = process.env;
  let getSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.INSTANTLY_API_KEY;
    delete process.env.INSTANTLY_PROFILE;
    getSpy = vi.spyOn(InstantlyClient.prototype, 'get');
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  async function withHome<T>(fn: (home: string) => Promise<T>): Promise<T> {
    const home = await mkdtemp(join(tmpdir(), 'instantly-ctx-'));
    process.env.INSTANTLY_HOME = home;
    return fn(home);
  }

  it('does not fetch workspace or require --workspace on the default single-key path', async () => {
    process.env.INSTANTLY_API_KEY = 'default-key';
    const ctx = await createCommandContext({ mutating: true });
    expect(ctx.credentials.apiKey).toBe('default-key');
    expect(ctx.credentials.profile).toBeUndefined();
    expect(getSpy).not.toHaveBeenCalled();
  });

  it('default key + --workspace of a different uuid aborts before the handler', async () => {
    process.env.INSTANTLY_API_KEY = 'default-key';
    getSpy.mockResolvedValue({ id: ACME_WORKSPACE, name: 'Default Workspace' });

    await expect(
      createCommandContext({
        workspace: OTHER_WORKSPACE,
        mutating: true,
      }),
    ).rejects.toBeInstanceOf(WorkspaceMismatchError);

    await expect(
      createCommandContext({
        workspace: OTHER_WORKSPACE,
        mutating: true,
      }),
    ).rejects.toMatchObject({
      name: 'WorkspaceMismatchError',
      code: 'WORKSPACE_MISMATCH',
      message: expect.stringMatching(
        /does not match the live workspace 11111111-1111-4111-8111-111111111111/,
      ),
    });

    const ctx = await createCommandContext({
      workspace: ACME_WORKSPACE,
      mutating: true,
    });
    expect(ctx.liveWorkspace?.id).toBe(ACME_WORKSPACE);
    expect(ctx.credentials.profile).toBeUndefined();
  });

  it('aborts a profiled command when the live workspace id does not match the bound id', async () => {
    await withHome(async () => {
      await saveProfile('acme', {
        api_key: 'acme-key',
        workspace_id: ACME_WORKSPACE,
        workspace_name: 'Acme Workspace',
      });
      getSpy.mockResolvedValue({ id: OTHER_WORKSPACE, name: 'Other Workspace' });

      await expect(
        createCommandContext({ profile: 'acme', mutating: false }),
      ).rejects.toBeInstanceOf(WorkspaceMismatchError);

      await expect(
        createCommandContext({ profile: 'acme', mutating: false }),
      ).rejects.toThrow(/bound to workspace 11111111-1111-4111-8111-111111111111/);
    });
  });

  it('aborts a write command when --workspace is missing or does not match', async () => {
    await withHome(async () => {
      await saveProfile('acme', {
        api_key: 'acme-key',
        workspace_id: ACME_WORKSPACE,
        workspace_name: 'Acme Workspace',
      });
      getSpy.mockResolvedValue({ id: ACME_WORKSPACE, name: 'Acme Workspace' });

      await expect(
        createCommandContext({ profile: 'acme', mutating: true }),
      ).rejects.toBeInstanceOf(ValidationError);
      await expect(
        createCommandContext({ profile: 'acme', mutating: true }),
      ).rejects.toThrow(/requires --workspace/);

      await expect(
        createCommandContext({
          profile: 'acme',
          workspace: OTHER_WORKSPACE,
          mutating: true,
        }),
      ).rejects.toBeInstanceOf(WorkspaceMismatchError);

      const ctx = await createCommandContext({
        profile: 'acme',
        workspace: ACME_WORKSPACE,
        mutating: true,
      });
      expect(ctx.liveWorkspace?.id).toBe(ACME_WORKSPACE);
    });
  });

  it('does not let a leftover .env INSTANTLY_API_KEY override --profile', async () => {
    await withHome(async () => {
      const cwd = await mkdtemp(join(tmpdir(), 'instantly-dotenv-'));
      await writeFile(join(cwd, '.env'), 'INSTANTLY_API_KEY=dotenv-hijack-key\n');
      await mkdir(join(cwd, 'nested'), { recursive: true });

      await saveProfile('acme', {
        api_key: 'profile-key',
        workspace_id: ACME_WORKSPACE,
        workspace_name: 'Acme Workspace',
      });
      getSpy.mockResolvedValue({ id: ACME_WORKSPACE, name: 'Acme Workspace' });

      process.env.INSTANTLY_API_KEY = 'env-hijack-key';

      const { resolveCredentials } = await import('../../src/core/auth.js');
      const creds = await resolveCredentials({ profile: 'acme', cwd });
      expect(creds.apiKey).toBe('profile-key');
      expect(creds.profile?.slug).toBe('acme');
      expect(creds.source).toBe('profile (acme)');

      process.env.INSTANTLY_PROFILE = 'acme';
      const fromEnv = await resolveCredentials({ cwd });
      expect(fromEnv.apiKey).toBe('profile-key');
      expect(fromEnv.profile?.slug).toBe('acme');
    });
  });
});
