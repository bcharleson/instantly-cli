import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtemp, readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { persistLoginSession } from '../../src/core/login-store.js';
import {
  assertProfileSlug,
  listProfiles,
  loadProfile,
  saveProfile,
} from '../../src/core/profiles.js';
import { loadConfig, saveConfig } from '../../src/core/config.js';

const ACME_WORKSPACE = '11111111-1111-4111-8111-111111111111';
const CLIENT_A_WORKSPACE = '22222222-2222-4222-8222-222222222222';

async function withHome<T>(fn: (home: string) => Promise<T>): Promise<T> {
  const home = await mkdtemp(join(tmpdir(), 'instantly-profiles-'));
  const prev = process.env.INSTANTLY_HOME;
  process.env.INSTANTLY_HOME = home;
  try {
    return await fn(home);
  } finally {
    if (prev === undefined) delete process.env.INSTANTLY_HOME;
    else process.env.INSTANTLY_HOME = prev;
  }
}

describe('profile slugs', () => {
  it('accepts generic lowercase slugs', () => {
    expect(assertProfileSlug('acme')).toBe('acme');
    expect(assertProfileSlug('client-a')).toBe('client-a');
  });

  it('rejects path traversal and mixed-case names', () => {
    expect(() => assertProfileSlug('../config')).toThrow('Invalid profile slug');
    expect(() => assertProfileSlug('Acme')).toThrow('Invalid profile slug');
    expect(() => assertProfileSlug('client/a')).toThrow('Invalid profile slug');
  });

  it('reserves default for config.json', () => {
    expect(() => assertProfileSlug('default')).toThrow(/reserved/);
  });
});

describe('profile store', () => {
  it('writes mode 0600 files beside default config, never inside it', async () => {
    await withHome(async (home) => {
      await saveProfile('acme', {
        api_key: 'profile-key',
        workspace_id: ACME_WORKSPACE,
        workspace_name: 'Acme Workspace',
      });

      const file = join(home, 'profiles', 'acme.json');
      const parsed = JSON.parse(await readFile(file, 'utf-8'));
      expect(parsed).toEqual({
        api_key: 'profile-key',
        workspace_id: ACME_WORKSPACE,
        workspace_name: 'Acme Workspace',
      });
      expect((await stat(file)).mode & 0o777).toBe(0o600);
      expect(await loadConfig()).toBeNull();
    });
  });

  it('lists metadata without API keys', async () => {
    await withHome(async () => {
      await saveProfile('acme', {
        api_key: 'secret-a',
        workspace_id: ACME_WORKSPACE,
        workspace_name: 'Acme Workspace',
      });
      await saveProfile('client-a', {
        api_key: 'secret-b',
        workspace_id: CLIENT_A_WORKSPACE,
        workspace_name: 'Client A',
      });

      const listed = await listProfiles();
      expect(listed).toEqual([
        {
          profile: 'acme',
          slug: 'acme',
          workspace_id: ACME_WORKSPACE,
          workspace_name: 'Acme Workspace',
          source: 'profile (acme)',
        },
        {
          profile: 'client-a',
          slug: 'client-a',
          workspace_id: CLIENT_A_WORKSPACE,
          workspace_name: 'Client A',
          source: 'profile (client-a)',
        },
      ]);
      expect(JSON.stringify(listed)).not.toContain('secret');
    });
  });

  it('includes default from config.json with the same list shape', async () => {
    await withHome(async () => {
      await saveConfig({
        api_key: 'default-key',
        workspace_id: ACME_WORKSPACE,
        workspace_name: 'Acme Workspace',
      });
      await saveProfile('client-a', {
        api_key: 'secret-b',
        workspace_id: CLIENT_A_WORKSPACE,
        workspace_name: 'Client A',
      });

      const listed = await listProfiles();
      expect(listed[0]).toMatchObject({
        profile: 'default',
        slug: 'default',
        workspace_id: ACME_WORKSPACE,
        workspace_name: 'Acme Workspace',
      });
      expect(listed[0].source).toContain('stored config');
      expect(listed.map((item) => item.profile)).toEqual(['default', 'client-a']);
      expect(JSON.stringify(listed)).not.toContain('default-key');
      expect(JSON.stringify(listed)).not.toContain('secret');
    });
  });
});

describe('persistLoginSession', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('default login writes config.json and does not create a profile file', async () => {
    await withHome(async (home) => {
      await persistLoginSession({
        apiKey: 'default-key',
        workspace: { id: ACME_WORKSPACE, name: 'Default Workspace' },
      });

      const config = JSON.parse(await readFile(join(home, 'config.json'), 'utf-8'));
      expect(config.api_key).toBe('default-key');
      expect(config.workspace_id).toBe(ACME_WORKSPACE);
      expect(config.workspace_name).toBe('Default Workspace');
      expect(config.workspace).toEqual({ id: ACME_WORKSPACE, name: 'Default Workspace' });
      expect((await stat(join(home, 'config.json'))).mode & 0o777).toBe(0o600);
      expect(await loadProfile('acme')).toBeNull();
    });
  });

  it('login --profile writes the profile file and does not touch config.json', async () => {
    await withHome(async (home) => {
      await mkdir(home, { recursive: true });
      await writeFile(
        join(home, 'config.json'),
        JSON.stringify({ api_key: 'original-default-key' }, null, 2),
        { mode: 0o600 },
      );

      await persistLoginSession({
        apiKey: 'acme-key',
        workspace: { id: ACME_WORKSPACE, name: 'Acme Workspace' },
        profileSlug: 'acme',
      });

      const config = JSON.parse(await readFile(join(home, 'config.json'), 'utf-8'));
      expect(config.api_key).toBe('original-default-key');

      const profile = JSON.parse(await readFile(join(home, 'profiles', 'acme.json'), 'utf-8'));
      expect(profile.api_key).toBe('acme-key');
      expect(profile.workspace_id).toBe(ACME_WORKSPACE);
      expect(profile.workspace_name).toBe('Acme Workspace');
    });
  });

  it('refuses to write default login without a live workspace id', async () => {
    await withHome(async (home) => {
      await expect(
        persistLoginSession({
          apiKey: 'default-key',
          workspace: null,
        }),
      ).rejects.toThrow('Cannot save default login');
      expect(await loadConfig()).toBeNull();
      await expect(readFile(join(home, 'config.json'), 'utf-8')).rejects.toThrow();
    });
  });

  it('refuses to write a profile without a live workspace id', async () => {
    await withHome(async (home) => {
      await expect(
        persistLoginSession({
          apiKey: 'acme-key',
          workspace: null,
          profileSlug: 'acme',
        }),
      ).rejects.toThrow('Cannot create profile');
      expect(await loadConfig()).toBeNull();
      expect(await loadProfile('acme')).toBeNull();
      await expect(readFile(join(home, 'config.json'), 'utf-8')).rejects.toThrow();
    });
  });
});
