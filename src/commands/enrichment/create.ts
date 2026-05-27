import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { ValidationError } from '../../core/errors.js';
import { ENRICHMENT_TYPES, ENRICHMENT_TYPES_FLAG } from './enrichment-types.js';

export const enrichmentCreateCommand: CommandDefinition = {
  name: 'enrichment_create',
  group: 'enrichment',
  subcommand: 'create',
  description:
    'Configure RECURRING enrichment on an EXISTING campaign or lead list that already contains leads. ' +
    'This sets up an enrichment job that runs against resources already in your workspace — ' +
    'it does NOT import new leads from Supersearch. ' +
    'To import NEW leads from Supersearch, use "enrichment enrich" instead.',
  examples: [
    // Minimal working invocations — --filters shape is backend-defined and may vary
    'instantly enrichment create --resource-id <list-or-campaign-id> --type work_email_enrichment',
    'instantly enrichment create --resource-id <id> --type email_verification --limit 500',
    // --filters must be a JSON ARRAY (not an object). The required element shape is backend-specific.
    `instantly enrichment create --resource-id <id> --type work_email_enrichment --filters '[{"key":"value"}]'`,
  ],

  inputSchema: z.object({
    resource_id: z.string().describe('Campaign or lead list ID to configure enrichment on'),
    type: z.enum(ENRICHMENT_TYPES).describe(
      `Enrichment type. Allowed values: ${ENRICHMENT_TYPES.join(', ')}`,
    ),
    limit: z.coerce.number().optional().describe('Maximum number of leads to enrich'),
    // The backend requires this to be an array. Accept a JSON string (CLI) or array (MCP).
    filters: z
      .union([z.string(), z.array(z.record(z.unknown()))])
      .optional()
      .describe(
        'Filters as a JSON ARRAY (not an object). ' +
          'Example: \'[{"search_filters":{"title":{"include":["CEO"]}}}]\'. ' +
          'Must be passed as a JSON array — the backend rejects plain objects.',
      ),
    custom_flow: z.string().optional().describe('Custom flow config (JSON string or object)'),
  }),

  cliMappings: {
    options: [
      { field: 'resource_id', flags: '--resource-id <id>', description: 'Campaign or lead list ID' },
      { field: 'type', flags: `--type <${ENRICHMENT_TYPES_FLAG}>`, description: 'Enrichment type' },
      { field: 'limit', flags: '-l, --limit <number>', description: 'Max leads to enrich' },
      {
        field: 'filters',
        flags: '--filters <json-array>',
        description: 'Filter array (JSON array, NOT an object). Example: \'[{"key":"value"}]\'',
      },
      { field: 'custom_flow', flags: '--custom-flow <json>', description: 'Custom flow (JSON)' },
    ],
  },

  endpoint: { method: 'POST', path: '/supersearch-enrichment' },
  fieldMappings: { resource_id: 'body', type: 'body', limit: 'body', filters: 'body', custom_flow: 'body' },

  handler: async (input, client) => {
    const body: Record<string, unknown> = {
      resource_id: input.resource_id,
      type: input.type,
    };
    if (input.limit !== undefined) body.limit = input.limit;

    if (input.filters !== undefined) {
      const parsed =
        typeof input.filters === 'string' ? JSON.parse(input.filters) : input.filters;
      // Enforce array shape client-side so the user gets a clear error immediately
      if (!Array.isArray(parsed)) {
        throw new ValidationError(
          '--filters must be a JSON array, not an object. ' +
            "Example: --filters '[{\"search_filters\":{\"title\":{\"include\":[\"CEO\"]}}}]' " +
            '(no request was sent to the server)',
        );
      }
      body.filters = parsed;
    }

    if (input.custom_flow) {
      body.custom_flow =
        typeof input.custom_flow === 'string'
          ? JSON.parse(input.custom_flow)
          : input.custom_flow;
    }

    return client.post('/supersearch-enrichment', body);
  },
};
