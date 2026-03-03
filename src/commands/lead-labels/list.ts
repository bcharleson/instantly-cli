import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const leadLabelsListCommand: CommandDefinition = {
  name: 'lead_labels_list',
  group: 'lead-labels',
  subcommand: 'list',
  description: 'List all lead labels for categorizing and managing leads.',
  examples: ['instantly lead-labels list', 'instantly lead-labels list --search "interested"'],

  inputSchema: z.object({
    limit: z.coerce.number().min(1).max(100).default(10).describe('Items per page'),
    starting_after: z.string().optional().describe('Pagination cursor'),
    search: z.string().optional().describe('Search by label name'),
  }),

  cliMappings: {
    options: [
      { field: 'limit', flags: '-l, --limit <number>', description: 'Items per page' },
      { field: 'starting_after', flags: '--starting-after <cursor>', description: 'Pagination cursor' },
      { field: 'search', flags: '--search <query>', description: 'Search by label' },
    ],
  },

  endpoint: { method: 'GET', path: '/lead-labels' },
  fieldMappings: { limit: 'query', starting_after: 'query', search: 'query' },
  paginated: true,
  handler: (input, client) => executeCommand(leadLabelsListCommand, input, client),
};
