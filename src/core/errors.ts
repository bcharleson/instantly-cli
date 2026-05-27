export class InstantlyError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
  ) {
    super(message);
    this.name = 'InstantlyError';
  }
}

export class AuthError extends InstantlyError {
  constructor(message: string) {
    super(message, 'AUTH_ERROR', 401);
    this.name = 'AuthError';
  }
}

export class NotFoundError extends InstantlyError {
  constructor(message: string) {
    super(message, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends InstantlyError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 422);
    this.name = 'ValidationError';
  }
}

export class RateLimitError extends InstantlyError {
  public retryAfter?: number;

  constructor(message: string, retryAfter?: number) {
    super(message, 'RATE_LIMIT', 429);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}

export class ServerError extends InstantlyError {
  constructor(message: string, statusCode: number = 500) {
    super(message, 'SERVER_ERROR', statusCode);
    this.name = 'ServerError';
  }
}

/**
 * Translates known opaque backend error strings into actionable CLI messages.
 * Each entry is a [substring-to-match, human-readable-fix-hint] pair.
 * Matching is case-insensitive and checks whether the original message contains
 * the key as a substring.
 */
const BACKEND_ERROR_REMEDIATION: Array<[string, string]> = [
  [
    'At least one enrichment type must be enabled',
    'Enable at least one enrichment flag: --work-email, --full-profile, or --custom-flow <providers>. ' +
      'Example: instantly enrichment enrich --search-filters \'{"domains":["example.com"]}\' --work-email --limit 10',
  ],
  [
    'MISSING_REQUIRED_FIELDS_FOR_ENRICHMENT',
    'The --filters array is missing required fields. ' +
      'Run "instantly enrichment create --help" to see the expected shape. ' +
      'The array element must include a valid "search_filters" object.',
  ],
  [
    'body/filters must be array',
    '--filters must be a JSON array, not an object. ' +
      "Example: --filters '[{\"search_filters\":{\"title\":{\"include\":[\"CEO\"]}}}]'",
  ],
  [
    'Invalid API key',
    'The API key was rejected. Check that INSTANTLY_API_KEY (or --api-key) is correct, ' +
      'not expired, and belongs to the right workspace. Run "instantly auth logout" to reset.',
  ],
];

/** Enrich a backend error message with a fix hint if one is known. */
function applyRemediation(message: string): string {
  const lower = message.toLowerCase();
  for (const [pattern, hint] of BACKEND_ERROR_REMEDIATION) {
    if (lower.includes(pattern.toLowerCase())) {
      return `${message}\n\nFix: ${hint}`;
    }
  }
  return message;
}

export function formatError(error: unknown): { message: string; code: string } {
  if (error instanceof InstantlyError) {
    return { message: applyRemediation(error.message), code: error.code };
  }
  if (error instanceof Error) {
    // Detect abort/timeout errors that weren't caught as InstantlyError
    if (error.name === 'AbortError' || String(error.message).includes('aborted')) {
      return { message: 'Request timed out — the API did not respond in time', code: 'TIMEOUT' };
    }
    // Detect network errors
    if (error.message.includes('ECONNREFUSED') || error.message.includes('ENOTFOUND')) {
      return { message: `Network error: ${error.message}`, code: 'NETWORK_ERROR' };
    }
    return { message: applyRemediation(error.message), code: 'UNKNOWN_ERROR' };
  }
  return { message: String(error), code: 'UNKNOWN_ERROR' };
}
