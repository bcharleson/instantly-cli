import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { loadConfig } from './config.js';
import { AuthError } from './errors.js';

/**
 * Parse a `.env` file from the given directory into a key→value map.
 * Supports:
 *   KEY=value
 *   KEY="value"
 *   KEY='value'
 *   # comment lines (ignored)
 *   blank lines (ignored)
 */
export async function loadDotEnv(cwd: string = process.cwd()): Promise<Record<string, string>> {
  const envPath = join(cwd, '.env');
  try {
    const content = await readFile(envPath, 'utf-8');
    const vars: Record<string, string> = {};
    for (const raw of content.split('\n')) {
      const line = raw.trim();
      // Skip blank lines and comments
      if (!line || line.startsWith('#')) continue;
      const eqIdx = line.indexOf('=');
      if (eqIdx < 1) continue;
      const key = line.slice(0, eqIdx).trim();
      let val = line.slice(eqIdx + 1).trim();
      // Strip surrounding quotes
      if ((val.startsWith('"') && val.endsWith('"')) ||
          (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (key) vars[key] = val;
    }
    return vars;
  } catch {
    // .env file doesn't exist or isn't readable — that's fine
    return {};
  }
}

export async function resolveApiKey(flagKey?: string): Promise<string> {
  // 1. --api-key flag takes highest priority
  if (flagKey) return flagKey;

  // 2. INSTANTLY_API_KEY already set in the process environment
  const envKey = process.env.INSTANTLY_API_KEY;
  if (envKey) return envKey;

  // 3. INSTANTLY_API_KEY from a local .env file in the current working directory
  const dotEnv = await loadDotEnv();
  const dotEnvKey = dotEnv['INSTANTLY_API_KEY'];
  if (dotEnvKey) return dotEnvKey;

  // 4. Stored config from ~/.instantly/config.json
  const config = await loadConfig();
  if (config?.api_key) return config.api_key;

  throw new AuthError(
    'No API key found. Set INSTANTLY_API_KEY, use --api-key, add it to a local .env file, or run: instantly login',
  );
}
