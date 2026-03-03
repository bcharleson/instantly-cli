import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const customTagsListCommand: CommandDefinition = {
  name: 'custom_tags_list',
  group: 'custom-tags',
  subcommand: 'list',
  description: 'List custom tags used to organize accounts and campaigns.',
  examples: ['instantly custom-tags list', 'instantly custom-tags list --search "outbound"'],

  inputSchema: z.object({
    limit: z.coerce.number().min(1).max(100).default(10).describe('Items per page'),
    starting_after: z.string().optional().describe('Pagination cursor'),
    search: z.string().optional().describe('Search by tag label'),
    resource_ids: z.string().optional().describe('Comma-separated resource IDs to filter by'),
    tag_ids: z.string().optional().describe('Comma-separated tag IDs to filter by'),
  }),

  cliMappings: {
    options: [
      { field: 'limit', flags: '-l, --limit <number>', description: 'Items per page' },
      { field: 'starting_after', flags: '--starting-after <cursor>', description: 'Pagination cursor' },
      { field: 'search', flags: '--search <query>', description: 'Search by label' },
      { field: 'resource_ids', flags: '--resource-ids <ids>', description: 'Filter by resource IDs' },
      { field: 'tag_ids', flags: '--tag-ids <ids>', description: 'Filter by tag IDs' },
    ],
  },

  endpoint: { method: 'GET', path: '/custom-tags' },
  fieldMappings: { limit: 'query', starting_after: 'query', search: 'query', resource_ids: 'query', tag_ids: 'query' },
  paginated: true,
  handler: (input, client) => executeCommand(customTagsListCommand, input, client),
};
