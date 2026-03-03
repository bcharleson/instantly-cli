import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const enrichmentCreateCommand: CommandDefinition = {
  name: 'enrichment_create',
  group: 'enrichment',
  subcommand: 'create',
  description: 'Create an enrichment for a specific resource (campaign or lead list).',
  examples: [
    'instantly enrichment create --resource-id <id> --type email',
    'instantly enrichment create --resource-id <id> --type linkedin --limit 500',
  ],

  inputSchema: z.object({
    resource_id: z.string().describe('Unique identifier for the resource (list or campaign)'),
    type: z.string().describe('Enrichment type to add to the resource'),
    limit: z.coerce.number().optional().describe('Maximum number of leads to enrich'),
    filters: z.string().optional().describe('JSON string of filters to apply to the enrichment'),
    custom_flow: z.string().optional().describe('JSON string of custom flow to apply to the enrichment'),
  }),

  cliMappings: {
    options: [
      { field: 'resource_id', flags: '--resource-id <id>', description: 'Resource ID (list or campaign)' },
      { field: 'type', flags: '--type <type>', description: 'Enrichment type' },
      { field: 'limit', flags: '-l, --limit <number>', description: 'Max leads to enrich' },
      { field: 'filters', flags: '--filters <json>', description: 'Filters (JSON)' },
      { field: 'custom_flow', flags: '--custom-flow <json>', description: 'Custom flow (JSON)' },
    ],
  },

  endpoint: { method: 'POST', path: '/supersearch-enrichment' },
  fieldMappings: { resource_id: 'body', type: 'body', limit: 'body', filters: 'body', custom_flow: 'body' },

  handler: async (input, client) => {
    const body: Record<string, any> = {
      resource_id: input.resource_id,
      type: input.type,
    };
    if (input.limit !== undefined) body.limit = input.limit;
    if (input.filters) {
      body.filters = typeof input.filters === 'string'
        ? JSON.parse(input.filters)
        : input.filters;
    }
    if (input.custom_flow) {
      body.custom_flow = typeof input.custom_flow === 'string'
        ? JSON.parse(input.custom_flow)
        : input.custom_flow;
    }
    return client.post('/supersearch-enrichment', body);
  },
};
