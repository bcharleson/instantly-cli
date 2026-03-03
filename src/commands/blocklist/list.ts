import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const blocklistListCommand: CommandDefinition = {
  name: 'blocklist_list',
  group: 'blocklist',
  subcommand: 'list',
  description: 'List all blocklist entries (blocked emails and domains).',
  examples: ['instantly blocklist list', 'instantly blocklist list --domains-only'],

  inputSchema: z.object({
    limit: z.coerce.number().min(1).max(100).default(10).describe('Items per page'),
    starting_after: z.string().optional().describe('Pagination cursor'),
    domains_only: z.boolean().optional().describe('Only show domain entries'),
    search: z.string().optional().describe('Search by email/domain'),
  }),

  cliMappings: {
    options: [
      { field: 'limit', flags: '-l, --limit <number>', description: 'Items per page' },
      { field: 'starting_after', flags: '--starting-after <cursor>', description: 'Pagination cursor' },
      { field: 'domains_only', flags: '--domains-only', description: 'Only show domains' },
      { field: 'search', flags: '--search <query>', description: 'Search' },
    ],
  },

  endpoint: { method: 'GET', path: '/block-lists-entries' },
  fieldMappings: { limit: 'query', starting_after: 'query', domains_only: 'query', search: 'query' },
  paginated: true,
  handler: (input, client) => executeCommand(blocklistListCommand, input, client),
};
