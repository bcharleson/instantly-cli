import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const webhookEventsListCommand: CommandDefinition = {
  name: 'webhook_events_list',
  group: 'webhook-events',
  subcommand: 'list',
  description: 'List webhook events.',
  examples: [
    'instantly webhook-events list',
    'instantly webhook-events list --from 2024-01-01 --to 2024-01-31',
    'instantly webhook-events list --success true',
  ],

  inputSchema: z.object({
    limit: z.coerce.number().min(1).max(100).default(10).describe('Items per page (1-100)'),
    starting_after: z.string().optional().describe('Pagination cursor'),
    success: z.coerce.boolean().optional().describe('Filter by success status'),
    from: z.string().optional().describe('Inclusive start date (YYYY-MM-DD)'),
    to: z.string().optional().describe('Inclusive end date (YYYY-MM-DD)'),
    search: z.string().optional().describe('Search by exact webhook URL or lead email'),
  }),

  cliMappings: {
    options: [
      { field: 'limit', flags: '-l, --limit <number>', description: 'Items per page (1-100)' },
      { field: 'starting_after', flags: '--starting-after <cursor>', description: 'Pagination cursor' },
      { field: 'success', flags: '--success <boolean>', description: 'Filter by success status' },
      { field: 'from', flags: '--from <date>', description: 'Start date (YYYY-MM-DD)' },
      { field: 'to', flags: '--to <date>', description: 'End date (YYYY-MM-DD)' },
      { field: 'search', flags: '--search <query>', description: 'Search by webhook URL or lead email' },
    ],
  },

  endpoint: { method: 'GET', path: '/webhook-events' },
  fieldMappings: { limit: 'query', starting_after: 'query', success: 'query', from: 'query', to: 'query', search: 'query' },
  paginated: true,
  handler: (input, client) => executeCommand(webhookEventsListCommand, input, client),
};
