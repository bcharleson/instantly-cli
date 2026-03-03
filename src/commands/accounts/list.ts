import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const accountsListCommand: CommandDefinition = {
  name: 'accounts_list',
  group: 'accounts',
  subcommand: 'list',
  description: 'List all email accounts in the workspace. Returns account email, status, warmup status, and sending limits.',
  examples: [
    'instantly accounts list',
    'instantly accounts list --limit 50',
    'instantly accounts list --search "acme.com"',
  ],

  inputSchema: z.object({
    limit: z.coerce.number().min(1).max(100).default(10).describe('Items per page (1-100)'),
    starting_after: z.string().optional().describe('Pagination cursor (datetime)'),
    search: z.string().optional().describe('Search accounts by email'),
    status: z.coerce.number().optional().describe('Filter by status'),
  }),

  cliMappings: {
    options: [
      { field: 'limit', flags: '-l, --limit <number>', description: 'Items per page (1-100)' },
      { field: 'starting_after', flags: '--starting-after <cursor>', description: 'Pagination cursor' },
      { field: 'search', flags: '--search <query>', description: 'Search by email' },
      { field: 'status', flags: '-s, --status <status>', description: 'Filter by status' },
    ],
  },

  endpoint: { method: 'GET', path: '/accounts' },

  fieldMappings: {
    limit: 'query',
    starting_after: 'query',
    search: 'query',
    status: 'query',
  },

  paginated: true,

  handler: (input, client) => executeCommand(accountsListCommand, input, client),
};
