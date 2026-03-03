import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const campaignsSearchByContactCommand: CommandDefinition = {
  name: 'campaigns_search-by-contact',
  group: 'campaigns',
  subcommand: 'search-by-contact',
  description: 'Search campaigns by lead email. Find all campaigns that contain a specific contact.',
  examples: [
    'instantly campaigns search-by-contact --search "lead@example.com"',
    'instantly campaigns search-by-contact --search "lead@example.com" --sort-order desc',
  ],

  inputSchema: z.object({
    search: z.string().describe('Lead email to search for'),
    sort_column: z.string().optional().describe('Column to sort by (default: timestamp_created)'),
    sort_order: z.string().optional().describe('Sort direction: asc or desc (default: asc)'),
  }),

  cliMappings: {
    options: [
      { field: 'search', flags: '--search <email>', description: 'Lead email to search for' },
      { field: 'sort_column', flags: '--sort-column <column>', description: 'Sort column' },
      { field: 'sort_order', flags: '--sort-order <order>', description: 'Sort order (asc/desc)' },
    ],
  },

  endpoint: { method: 'GET', path: '/campaigns/search-by-contact' },

  fieldMappings: {
    search: 'query',
    sort_column: 'query',
    sort_order: 'query',
  },

  handler: (input, client) => executeCommand(campaignsSearchByContactCommand, input, client),
};
