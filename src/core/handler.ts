import type { CommandDefinition, InstantlyClient } from './types.js';

/**
 * Builds an HTTP request from a CommandDefinition and its input,
 * then executes it using the client.
 */
export async function executeCommand(
  cmdDef: CommandDefinition,
  input: Record<string, any>,
  client: InstantlyClient,
): Promise<unknown> {
  let path = cmdDef.endpoint.path;
  const query: Record<string, any> = {};
  const body: Record<string, any> = {};

  for (const [field, location] of Object.entries(cmdDef.fieldMappings)) {
    const value = input[field];
    if (value === undefined) continue;

    switch (location) {
      case 'path':
        path = path.replace(`{${field}}`, encodeURIComponent(String(value)));
        break;
      case 'query':
        query[field] = value;
        break;
      case 'body':
        body[field] = value;
        break;
    }
  }

  const hasBody = Object.keys(body).length > 0;
  const hasQuery = Object.keys(query).length > 0;

  return client.request({
    method: cmdDef.endpoint.method,
    path,
    query: hasQuery ? query : undefined,
    body: hasBody ? body : undefined,
  });
}
