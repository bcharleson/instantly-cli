import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const enrichmentAiProgressCommand: CommandDefinition = {
  name: 'enrichment_ai-progress',
  group: 'enrichment',
  subcommand: 'ai-progress',
  description: 'Get AI enrichment progress for a specific resource if it is in progress.',
  examples: ['instantly enrichment ai-progress <resource-id>'],

  inputSchema: z.object({
    resource_id: z.string().describe('ID of the resource to check AI enrichment progress'),
  }),

  cliMappings: {
    args: [{ field: 'resource_id', name: 'resource-id', required: true }],
  },

  endpoint: { method: 'GET', path: '/supersearch-enrichment/ai/{resource_id}/in-progress' },
  fieldMappings: { resource_id: 'path' },
  handler: (input, client) => executeCommand(enrichmentAiProgressCommand, input, client),
};
