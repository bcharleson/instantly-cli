import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const dfyOrdersListCommand: CommandDefinition = {
  name: 'dfy_orders_list',
  group: 'dfy-orders',
  subcommand: 'list',
  description: 'List DFY email account orders.',
  examples: ['instantly dfy-orders list', 'instantly dfy-orders list --limit 20'],

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

  endpoint: { method: 'GET', path: '/dfy-email-account-orders' },
  fieldMappings: { limit: 'query', starting_after: 'query' },
  paginated: true,
  handler: (input, client) => executeCommand(dfyOrdersListCommand, input, client),
};
