import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';

export const enrichmentPreviewCommand: CommandDefinition = {
  name: 'enrichment_preview',
  group: 'enrichment',
  subcommand: 'preview',
  description: 'Preview leads matching SuperSearch filters without importing them.',
  examples: [
    'instantly enrichment preview --search-filters \'{"job_titles":["VP Sales"],"industries":["SaaS"]}\'',
  ],

  inputSchema: z.object({
    search_filters: z.string().describe('JSON string of search filters'),
  }),

  cliMappings: {
    options: [
      { field: 'search_filters', flags: '--search-filters <json>', description: 'Search filters (JSON)' },
    ],
  },

  endpoint: { method: 'POST', path: '/supersearch-enrichment/preview-leads-from-supersearch' },
  fieldMappings: { search_filters: 'body' },

  handler: async (input, client) => {
    const filters = typeof input.search_filters === 'string'
      ? JSON.parse(input.search_filters)
      : input.search_filters;
    return client.post('/supersearch-enrichment/preview-leads-from-supersearch', {
      search_filters: filters,
    });
  },
};
