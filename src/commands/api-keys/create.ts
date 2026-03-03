import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';

export const apiKeysCreateCommand: CommandDefinition = {
  name: 'api_keys_create',
  group: 'api-keys',
  subcommand: 'create',
  description: 'Create a new API key with specified scopes.',
  examples: ['instantly api-keys create --name "CI/CD Key" --scopes "campaigns:read,leads:read"'],

  inputSchema: z.object({
    name: z.string().describe('API key name'),
    scopes: z.string().describe('Comma-separated scopes'),
  }),

  cliMappings: {
    options: [
      { field: 'name', flags: '--name <name>', description: 'Key name (required)' },
      { field: 'scopes', flags: '--scopes <scopes>', description: 'Scopes (comma-separated, required)' },
    ],
  },

  endpoint: { method: 'POST', path: '/api-keys' },
  fieldMappings: { name: 'body', scopes: 'body' },

  handler: async (input, client) => {
    const scopes = typeof input.scopes === 'string' ? input.scopes.split(',').map((s: string) => s.trim()) : input.scopes;
    return client.post('/api-keys', { name: input.name, scopes });
  },
};
