import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const enrichmentRunCommand: CommandDefinition = {
  name: 'enrichment_run',
  group: 'enrichment',
  subcommand: 'run',
  description: 'Run enrichment for a campaign or lead list. Optionally specify specific lead IDs.',
  examples: [
    'instantly enrichment run --resource-id <id>',
    'instantly enrichment run --resource-id <id> --lead-ids "id1,id2"',
  ],

  inputSchema: z.object({
    resource_id: z.string().describe('Campaign or lead list ID to enrich'),
    lead_ids: z.string().optional().describe('Comma-separated lead IDs to enrich'),
  }),

  cliMappings: {
    options: [
      { field: 'resource_id', flags: '--resource-id <id>', description: 'Resource ID' },
      { field: 'lead_ids', flags: '--lead-ids <ids>', description: 'Comma-separated lead IDs' },
    ],
  },

  endpoint: { method: 'POST', path: '/supersearch-enrichment/run' },
  fieldMappings: { resource_id: 'body', lead_ids: 'body' },

  handler: async (input, client) => {
    const body: Record<string, any> = { resource_id: input.resource_id };
    if (input.lead_ids) {
      body.lead_ids = typeof input.lead_ids === 'string'
        ? input.lead_ids.split(',').map((id: string) => id.trim())
        : input.lead_ids;
    }
    return client.post('/supersearch-enrichment/run', body);
  },
};
