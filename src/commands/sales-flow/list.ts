import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const salesFlowListCommand: CommandDefinition = {
  name: 'sales_flow_list',
  group: 'sales-flow',
  subcommand: 'list',
  description: 'List sales flows.',
  examples: ['instantly sales-flow list', 'instantly sales-flow list --limit 20'],

  inputSchema: z.object({
    limit: z.coerce.number().min(1).max(100).default(10).describe('Items per page'),
    starting_after: z.string().optional().describe('Pagination cursor'),
    search: z.string().optional().describe('Search by sales flow name'),
  }),

  cliMappings: {
    options: [
      { field: 'limit', flags: '-l, --limit <number>', description: 'Items per page' },
      { field: 'starting_after', flags: '--starting-after <cursor>', description: 'Pagination cursor' },
      { field: 'search', flags: '--search <query>', description: 'Search by name' },
    ],
  },

  endpoint: { method: 'GET', path: '/sales-flow' },
  fieldMappings: { limit: 'query', starting_after: 'query', search: 'query' },
  paginated: true,
  handler: (input, client) => executeCommand(salesFlowListCommand, input, client),
};
