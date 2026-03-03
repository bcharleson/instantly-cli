import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const apiKeysListCommand: CommandDefinition = {
  name: 'api_keys_list',
  group: 'api-keys',
  subcommand: 'list',
  description: 'List all API keys in the workspace.',
  examples: ['instantly api-keys list', 'instantly api-keys list --limit 50'],

  inputSchema: z.object({
    limit: z.coerce.number().min(1).max(100).default(10).describe('Items per page'),
    starting_after: z.string().optional().describe('Pagination cursor'),
  }),

  cliMappings: {
    options: [
      { field: 'limit', flags: '-l, --limit <number>', description: 'Items per page' },
      { field: 'starting_after', flags: '--starting-after <cursor>', description: 'Pagination cursor' },
    ],
  },

  endpoint: { method: 'GET', path: '/api-keys' },
  fieldMappings: { limit: 'query', starting_after: 'query' },
  paginated: true,
  handler: (input, client) => executeCommand(apiKeysListCommand, input, client),
};
