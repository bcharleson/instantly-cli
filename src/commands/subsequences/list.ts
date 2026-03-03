import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const subsequencesListCommand: CommandDefinition = {
  name: 'subsequences_list',
  group: 'subsequences',
  subcommand: 'list',
  description: 'List all subsequences for a campaign.',
  examples: ['instantly subsequences list --campaign-id <id>'],

  inputSchema: z.object({
    parent_campaign: z.string().describe('Parent campaign ID (required)'),
    limit: z.coerce.number().min(1).max(100).default(10).describe('Items per page'),
    starting_after: z.string().optional().describe('Pagination cursor'),
    search: z.string().optional().describe('Search by name'),
  }),

  cliMappings: {
    options: [
      { field: 'parent_campaign', flags: '--campaign-id <id>', description: 'Parent campaign ID (required)' },
      { field: 'limit', flags: '-l, --limit <number>', description: 'Items per page' },
      { field: 'starting_after', flags: '--starting-after <cursor>', description: 'Pagination cursor' },
      { field: 'search', flags: '--search <query>', description: 'Search by name' },
    ],
  },

  endpoint: { method: 'GET', path: '/subsequences' },
  fieldMappings: { parent_campaign: 'query', limit: 'query', starting_after: 'query', search: 'query' },
  paginated: true,
  handler: (input, client) => executeCommand(subsequencesListCommand, input, client),
};
