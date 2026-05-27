import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';

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

  handler: async (input, client) => {
    const result = await client.get<Record<string, unknown>>(
      `/supersearch-enrichment/${input.resource_id}`,
    );
    // The API returns { exists: false } when the resource is real but has no enrichment
    // config attached. Surfacing the raw field confuses callers into thinking the resource
    // itself doesn't exist. Wrap it with an explanatory note.
    if (result && result.exists === false) {
      return {
        ...result,
        _cli_note:
          'This resource exists but has no enrichment configuration. ' +
          'Use "instantly enrichment create --resource-id <id> --type <type>" to set one up.',
      };
    }
    return result;
  },
};
