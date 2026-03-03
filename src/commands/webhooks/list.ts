import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const webhooksListCommand: CommandDefinition = {
  name: 'webhooks_list',
  group: 'webhooks',
  subcommand: 'list',
  description: 'List all webhooks in the workspace. Filter by campaign or event type.',
  examples: ['instantly webhooks list', 'instantly webhooks list --campaign <id>'],

  inputSchema: z.object({
    limit: z.coerce.number().min(1).max(100).default(10).describe('Items per page'),
    starting_after: z.string().optional().describe('Pagination cursor'),
    campaign: z.string().optional().describe('Filter by campaign ID'),
    event_type: z.string().optional().describe('Filter by event type'),
  }),

  cliMappings: {
    options: [
      { field: 'limit', flags: '-l, --limit <number>', description: 'Items per page' },
      { field: 'starting_after', flags: '--starting-after <cursor>', description: 'Pagination cursor' },
      { field: 'campaign', flags: '--campaign <id>', description: 'Filter by campaign' },
      { field: 'event_type', flags: '--event-type <type>', description: 'Filter by event type' },
    ],
  },

  endpoint: { method: 'GET', path: '/webhooks' },
  fieldMappings: { limit: 'query', starting_after: 'query', campaign: 'query', event_type: 'query' },
  paginated: true,
  handler: (input, client) => executeCommand(webhooksListCommand, input, client),
};
