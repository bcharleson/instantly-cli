import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const campaignsListCommand: CommandDefinition = {
  name: 'campaigns_list',
  group: 'campaigns',
  subcommand: 'list',
  description: 'List all campaigns in the workspace. Returns paginated results with campaign name, status, and metadata.',
  examples: [
    'instantly campaigns list',
    'instantly campaigns list --limit 50',
    'instantly campaigns list --status 1',
  ],

  inputSchema: z.object({
    limit: z.coerce.number().min(1).max(100).default(10)
      .describe('Number of campaigns to return per page (1-100)'),
    starting_after: z.string().optional()
      .describe('Cursor for pagination'),
    status: z.coerce.number().optional()
      .describe('Filter by status: 0=Draft, 1=Active, 2=Paused, 3=Completed'),
    search: z.string().optional()
      .describe('Search campaigns by name'),
  }),

  cliMappings: {
    options: [
      { field: 'limit', flags: '-l, --limit <number>', description: 'Items per page (1-100)' },
      { field: 'starting_after', flags: '--starting-after <cursor>', description: 'Pagination cursor' },
      { field: 'status', flags: '-s, --status <status>', description: '0=Draft, 1=Active, 2=Paused, 3=Completed' },
      { field: 'search', flags: '--search <query>', description: 'Search by name' },
    ],
  },

  endpoint: { method: 'GET', path: '/campaigns' },

  fieldMappings: {
    limit: 'query',
    starting_after: 'query',
    status: 'query',
    search: 'query',
  },

  paginated: true,

  handler: (input, client) => executeCommand(campaignsListCommand, input, client),
};
