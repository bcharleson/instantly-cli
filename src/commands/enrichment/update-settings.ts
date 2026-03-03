import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const enrichmentUpdateSettingsCommand: CommandDefinition = {
  name: 'enrichment_update-settings',
  group: 'enrichment',
  subcommand: 'update-settings',
  description: 'Update enrichment settings for a specific resource (campaign or lead list).',
  examples: [
    'instantly enrichment update-settings <resource-id> --auto-update true',
    'instantly enrichment update-settings <resource-id> --skip-rows-without-email true',
  ],

  inputSchema: z.object({
    resource_id: z.string().describe('ID of the resource to update settings for'),
    auto_update: z.coerce.boolean().optional().describe('Whether new leads will be automatically enriched'),
    skip_rows_without_email: z.coerce.boolean().optional().describe('Whether to skip leads without emails'),
  }),

  cliMappings: {
    args: [{ field: 'resource_id', name: 'resource-id', required: true }],
    options: [
      { field: 'auto_update', flags: '--auto-update <bool>', description: 'Auto-enrich new leads' },
      { field: 'skip_rows_without_email', flags: '--skip-rows-without-email <bool>', description: 'Skip leads without email' },
    ],
  },

  endpoint: { method: 'PATCH', path: '/supersearch-enrichment/{resource_id}/settings' },
  fieldMappings: { resource_id: 'path', auto_update: 'body', skip_rows_without_email: 'body' },
  handler: (input, client) => executeCommand(enrichmentUpdateSettingsCommand, input, client),
};
