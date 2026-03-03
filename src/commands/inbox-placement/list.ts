import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const inboxPlacementListCommand: CommandDefinition = {
  name: 'inbox_placement_list',
  group: 'inbox-placement',
  subcommand: 'list',
  description: 'List inbox placement tests.',
  examples: ['instantly inbox-placement list'],

  inputSchema: z.object({
    limit: z.coerce.number().min(1).max(100).default(10).describe('Items per page'),
    starting_after: z.string().optional().describe('Pagination cursor'),
    search: z.string().optional().describe('Filter search'),
    status: z.coerce.number().optional().describe('Filter by status'),
    sort_order: z.string().optional().describe('Sort order'),
  }),

  cliMappings: {
    options: [
      { field: 'limit', flags: '-l, --limit <number>', description: 'Items per page' },
      { field: 'starting_after', flags: '--starting-after <cursor>', description: 'Pagination cursor' },
      { field: 'search', flags: '--search <query>', description: 'Search filter' },
      { field: 'status', flags: '--status <status>', description: 'Status filter' },
      { field: 'sort_order', flags: '--sort-order <order>', description: 'Sort order' },
    ],
  },

  endpoint: { method: 'GET', path: '/inbox-placement-tests' },
  fieldMappings: { limit: 'query', starting_after: 'query', search: 'query', status: 'query', sort_order: 'query' },
  paginated: true,
  handler: (input, client) => executeCommand(inboxPlacementListCommand, input, client),
};
