import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { resolveApiKey } from '../../src/core/auth.js';
import * as config from '../../src/core/config.js';

vi.mock('../../src/core/config.js');

describe('resolveApiKey', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.INSTANTLY_API_KEY;
    vi.mocked(config.loadConfig).mockResolvedValue(null);
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
});
