import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const enrichmentHistoryCommand: CommandDefinition = {
  name: 'enrichment_history',
  group: 'enrichment',
  subcommand: 'history',
  description: 'Retrieve enrichment history for a specific resource (campaign or lead list).',
  examples: ['instantly enrichment history <resource-id>'],

  inputSchema: z.object({
    resource_id: z.string().describe('ID of the resource to retrieve enrichment history for'),
  }),

  cliMappings: {
    args: [{ field: 'resource_id', name: 'resource-id', required: true }],
  },

  endpoint: { method: 'GET', path: '/supersearch-enrichment/history/{resource_id}' },
  fieldMappings: { resource_id: 'path' },
  handler: (input, client) => executeCommand(enrichmentHistoryCommand, input, client),
};
