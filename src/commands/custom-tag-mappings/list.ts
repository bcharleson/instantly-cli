import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const customTagMappingsListCommand: CommandDefinition = {
  name: 'custom_tag_mappings_list',
  group: 'custom-tag-mappings',
  subcommand: 'list',
  description: 'List custom tag mappings. Shows which tags are assigned to which campaigns or email accounts.',
  examples: [
    'instantly custom-tag-mappings list',
    'instantly custom-tag-mappings list --resource-ids "id1,id2,id3"',
  ],

  inputSchema: z.object({
    limit: z.coerce.number().min(1).max(100).default(10).describe('Items per page (1-100)'),
    starting_after: z.string().optional().describe('Pagination cursor'),
    resource_ids: z.string().optional().describe('Comma-separated list of resource IDs to filter by'),
  }),

  cliMappings: {
    options: [
      { field: 'limit', flags: '-l, --limit <number>', description: 'Items per page (1-100)' },
      { field: 'starting_after', flags: '--starting-after <cursor>', description: 'Pagination cursor' },
      { field: 'resource_ids', flags: '--resource-ids <ids>', description: 'Comma-separated resource IDs' },
    ],
  },

  endpoint: { method: 'GET', path: '/custom-tag-mappings' },
  fieldMappings: { limit: 'query', starting_after: 'query', resource_ids: 'query' },
  paginated: true,
  handler: (input, client) => executeCommand(customTagMappingsListCommand, input, client),
};
