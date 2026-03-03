import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const dfyOrdersListAccountsCommand: CommandDefinition = {
  name: 'dfy_orders_list_accounts',
  group: 'dfy-orders',
  subcommand: 'list-accounts',
  description: 'List DFY ordered email accounts.',
  examples: [
    'instantly dfy-orders list-accounts',
    'instantly dfy-orders list-accounts --with-passwords',
  ],

  inputSchema: z.object({
    limit: z.coerce.number().min(1).max(100).default(10).describe('Items per page'),
    starting_after: z.string().optional().describe('Pagination cursor'),
    with_passwords: z.boolean().optional().describe('Include passwords in response'),
  }),

  cliMappings: {
    options: [
      { field: 'limit', flags: '-l, --limit <number>', description: 'Items per page' },
      { field: 'starting_after', flags: '--starting-after <cursor>', description: 'Pagination cursor' },
      { field: 'with_passwords', flags: '--with-passwords', description: 'Include passwords in response' },
    ],
  },

  endpoint: { method: 'GET', path: '/dfy-email-account-orders/accounts' },
  fieldMappings: { limit: 'query', starting_after: 'query', with_passwords: 'query' },
  paginated: true,
  handler: (input, client) => executeCommand(dfyOrdersListAccountsCommand, input, client),
};
