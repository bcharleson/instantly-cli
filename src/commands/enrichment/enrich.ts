import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const enrichmentEnrichCommand: CommandDefinition = {
  name: 'enrichment_enrich',
  group: 'enrichment',
  subcommand: 'enrich',
  description: 'Enrich leads from SuperSearch. Import and enrich leads matching your search filters.',
  examples: [
    'instantly enrichment enrich --search-filters \'{"job_titles":["CTO"]}\' --limit 100',
  ],

  inputSchema: z.object({
    search_filters: z.string().describe('JSON string of search filters'),
    limit: z.coerce.number().describe('Maximum number of leads to import'),
  }),

  cliMappings: {
    options: [
      { field: 'search_filters', flags: '--search-filters <json>', description: 'Search filters (JSON)' },
      { field: 'limit', flags: '-l, --limit <number>', description: 'Max leads to import' },
    ],
  },

  endpoint: { method: 'POST', path: '/supersearch-enrichment/enrich-leads-from-supersearch' },
  fieldMappings: { search_filters: 'body', limit: 'body' },

  handler: async (input, client) => {
    const filters = typeof input.search_filters === 'string'
      ? JSON.parse(input.search_filters)
      : input.search_filters;
    return client.post('/supersearch-enrichment/enrich-leads-from-supersearch', {
      search_filters: filters,
      limit: input.limit,
    });
  },
};
