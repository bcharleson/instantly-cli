import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const leadListsListCommand: CommandDefinition = {
  name: 'lead_lists_list',
  group: 'lead-lists',
  subcommand: 'list',
  description: 'List all lead lists in the workspace.',
  examples: ['instantly lead-lists list', 'instantly lead-lists list --search "prospects"'],

  inputSchema: z.object({
    limit: z.coerce.number().min(1).max(100).default(10).describe('Items per page'),
    starting_after: z.string().optional().describe('Pagination cursor'),
    search: z.string().optional().describe('Search by list name'),
  }),

  cliMappings: {
    options: [
      { field: 'limit', flags: '-l, --limit <number>', description: 'Items per page' },
      { field: 'starting_after', flags: '--starting-after <cursor>', description: 'Pagination cursor' },
      { field: 'search', flags: '--search <query>', description: 'Search by name' },
    ],
  },

  endpoint: { method: 'GET', path: '/lead-lists' },
  fieldMappings: { limit: 'query', starting_after: 'query', search: 'query' },
  paginated: true,
  handler: (input, client) => executeCommand(leadListsListCommand, input, client),
};
