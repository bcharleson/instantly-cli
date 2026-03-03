import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const enrichmentGetCommand: CommandDefinition = {
  name: 'enrichment_get',
  group: 'enrichment',
  subcommand: 'get',
  description: 'Get enrichment settings for a resource (campaign or lead list).',
  examples: ['instantly enrichment get <resource-id>'],

  inputSchema: z.object({
    resource_id: z.string().describe('Campaign or lead list ID'),
  }),

  cliMappings: {
    args: [{ field: 'resource_id', name: 'resource-id', required: true }],
  },

  endpoint: { method: 'GET', path: '/supersearch-enrichment/{resource_id}' },
  fieldMappings: { resource_id: 'path' },
  handler: (input, client) => executeCommand(enrichmentGetCommand, input, client),
};
