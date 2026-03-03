import type { GlobalOptions } from './types.js';
import { formatError } from './errors.js';

export function output(data: unknown, options: GlobalOptions = {}): void {
  if (options.quiet) return;

  let result = data;

  // Select specific fields if --fields is set
  if (options.fields && typeof data === 'object' && data !== null) {
    const fields = options.fields.split(',').map((f) => f.trim());
    if (Array.isArray(data)) {
      result = data.map((item) => pickFields(item, fields));
    } else {
      result = pickFields(data as Record<string, unknown>, fields);
    }
  }

  if (options.output === 'pretty') {
    console.log(JSON.stringify(result, null, 2));
  } else {
    // Default: compact JSON for machine consumption
    console.log(JSON.stringify(result));
  }
}

export function outputError(error: unknown, options: GlobalOptions = {}): void {
  const formatted = formatError(error);
  if (options.quiet) {
    process.exitCode = 1;
    return;
  }

  if (options.output === 'pretty') {
    console.error(`Error: ${formatted.message}`);
  } else {
    console.error(JSON.stringify({ error: formatted.message, code: formatted.code }));
  }
  process.exitCode = 1;
}

function pickFields(
  obj: Record<string, unknown>,
  fields: string[],
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const field of fields) {
    if (field in obj) {
      result[field] = obj[field];
    }
  }
  return result;
}
