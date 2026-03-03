import { loadConfig } from './config.js';
import { AuthError } from './errors.js';

export async function resolveApiKey(flagKey?: string): Promise<string> {
  // 1. --api-key flag takes highest priority
  if (flagKey) return flagKey;

  // 2. INSTANTLY_API_KEY environment variable
  const envKey = process.env.INSTANTLY_API_KEY;
  if (envKey) return envKey;

  // 3. Stored config from ~/.instantly/config.json
  const config = await loadConfig();
  if (config?.api_key) return config.api_key;

  throw new AuthError(
    'No API key found. Set INSTANTLY_API_KEY, use --api-key, or run: instantly login',
  );
}
