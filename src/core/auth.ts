import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { loadConfig, getConfigPath } from './config.js';
import { AuthError } from './errors.js';
import { loadProfile, getProfilePath } from './profiles.js';
import type { InstantlyProfile } from './types.js';

export type CredentialSource =
  | '--api-key flag'
  | 'INSTANTLY_API_KEY environment variable'
  | '.env file'
  | 'stored config'
  | 'profile';

export interface ResolvedCredentials {
  apiKey: string;
  source: string;
  profile?: InstantlyProfile & { slug: string };
}

export interface ResolveCredentialsOptions {
  apiKey?: string;
  profile?: string;
  cwd?: string;
}

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

function resolveProfileSlug(explicit?: string): string | undefined {
  const fromFlag = explicit?.trim();
  if (fromFlag) return fromFlag;
  const fromEnv = process.env.INSTANTLY_PROFILE?.trim();
  return fromEnv || undefined;
}

/**
 * Resolve which API key and (optional) workspace profile this process will use.
 *
 * Without a profile, order is unchanged:
 *   --api-key → INSTANTLY_API_KEY → cwd .env INSTANTLY_API_KEY → ~/.instantly/config.json
 *
 * When `--profile` or INSTANTLY_PROFILE is set, the named profile wins over
 * cwd `.env` and over INSTANTLY_API_KEY. `--api-key` still overrides the stored
 * profile key; live workspace verification then fail-closes if the key belongs
 * to a different workspace.
 */
export async function resolveCredentials(
  opts: ResolveCredentialsOptions = {},
): Promise<ResolvedCredentials> {
  const slug = resolveProfileSlug(opts.profile);

  if (slug) {
    const stored = await loadProfile(slug);
    if (!stored) {
      throw new AuthError(
        `Profile '${slug}' not found at ${getProfilePath(slug)}. ` +
          `Create it with: instantly login --profile ${slug}`,
      );
    }
    const profile = { ...stored, slug };
    if (opts.apiKey) {
      return { apiKey: opts.apiKey, source: '--api-key flag', profile };
    }
    return {
      apiKey: stored.api_key,
      source: `profile (${slug})`,
      profile,
    };
  }

  if (opts.apiKey) {
    return { apiKey: opts.apiKey, source: '--api-key flag' };
  }

  const envKey = process.env.INSTANTLY_API_KEY;
  if (envKey) {
    return { apiKey: envKey, source: 'INSTANTLY_API_KEY environment variable' };
  }

  const dotEnv = await loadDotEnv(opts.cwd ?? process.cwd());
  const dotEnvKey = dotEnv['INSTANTLY_API_KEY'];
  if (dotEnvKey) {
    const envPath = join(opts.cwd ?? process.cwd(), '.env');
    return { apiKey: dotEnvKey, source: `.env file (${envPath})` };
  }

  const config = await loadConfig();
  if (config?.api_key) {
    return { apiKey: config.api_key, source: `stored config (${getConfigPath()})` };
  }

  throw new AuthError(
    'No API key found. Set INSTANTLY_API_KEY, use --api-key, add it to a local .env file, ' +
      'run instantly login, or pass --profile <slug> after instantly login --profile <slug>',
  );
}

export async function resolveApiKey(flagKey?: string): Promise<string> {
  const creds = await resolveCredentials({ apiKey: flagKey });
  return creds.apiKey;
}

/**
 * Key supplied to `login` / `profile add` (not the full credential resolver).
 * Commander may attach `--api-key` to the command or strip it onto the program
 * when the same flag is declared globally — check both before env.
 *
 * Order: command `--api-key` → global `--api-key` / program.opts().apiKey → INSTANTLY_API_KEY
 */
export function resolveProvidedApiKey(
  commandApiKey?: string,
  globalApiKey?: string,
): string | undefined {
  const fromCommand = commandApiKey?.trim();
  if (fromCommand) return fromCommand;
  const fromGlobal = globalApiKey?.trim();
  if (fromGlobal) return fromGlobal;
  const fromEnv = process.env.INSTANTLY_API_KEY?.trim();
  return fromEnv || undefined;
}
