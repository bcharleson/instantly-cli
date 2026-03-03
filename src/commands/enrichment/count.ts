import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';

export const enrichmentCountCommand: CommandDefinition = {
  name: 'enrichment_count',
  group: 'enrichment',
  subcommand: 'count',
  description: 'Count leads matching SuperSearch filters without importing them.',
  examples: [
    'instantly enrichment count --search-filters \'{"job_titles":["VP Sales"],"industries":["SaaS"]}\'',
  ],

  inputSchema: z.object({
    search_filters: z.string().describe('JSON string of search filters'),
  }),

  cliMappings: {
    options: [
      { field: 'search_filters', flags: '--search-filters <json>', description: 'Search filters (JSON)' },
    ],
  },

  endpoint: { method: 'POST', path: '/supersearch-enrichment/count-leads-from-supersearch' },
  fieldMappings: { search_filters: 'body' },

  handler: async (input, client) => {
    const filters = typeof input.search_filters === 'string'
      ? JSON.parse(input.search_filters)
      : input.search_filters;
    return client.post('/supersearch-enrichment/count-leads-from-supersearch', {
      search_filters: filters,
    });
  },
};
