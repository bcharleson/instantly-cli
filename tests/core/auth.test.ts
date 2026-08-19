import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { resolveApiKey, resolveCredentials } from '../../src/core/auth.js';
import * as config from '../../src/core/config.js';

vi.mock('../../src/core/config.js');

describe('resolveApiKey', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.INSTANTLY_API_KEY;
    delete process.env.INSTANTLY_PROFILE;
    vi.mocked(config.loadConfig).mockResolvedValue(null);
    vi.mocked(config.getConfigPath).mockReturnValue('/tmp/fake-instantly/config.json');
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it('should prefer --api-key flag over everything', async () => {
    process.env.INSTANTLY_API_KEY = 'env-key';
    vi.mocked(config.loadConfig).mockResolvedValue({ api_key: 'config-key' });

    const key = await resolveApiKey('flag-key');
    expect(key).toBe('flag-key');
  });

  it('should use INSTANTLY_API_KEY env var when no flag', async () => {
    process.env.INSTANTLY_API_KEY = 'env-key';
    vi.mocked(config.loadConfig).mockResolvedValue({ api_key: 'config-key' });

    const key = await resolveApiKey();
    expect(key).toBe('env-key');
  });

  it('should use stored config when no flag or env var', async () => {
    vi.mocked(config.loadConfig).mockResolvedValue({ api_key: 'config-key' });

    const key = await resolveApiKey();
    expect(key).toBe('config-key');
  });

  it('should throw AuthError when no key is available', async () => {
    await expect(resolveApiKey()).rejects.toThrow('No API key found');
  });

  it('should use cwd .env INSTANTLY_API_KEY when no flag or process env', async () => {
    const cwd = await mkdtemp(join(tmpdir(), 'instantly-auth-env-'));
    await writeFile(join(cwd, '.env'), 'INSTANTLY_API_KEY=dotenv-key\n');

    const creds = await resolveCredentials({ cwd });
    expect(creds.apiKey).toBe('dotenv-key');
    expect(creds.source).toContain('.env file');
    expect(creds.profile).toBeUndefined();
  });
});
