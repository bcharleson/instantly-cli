import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';

export const leadsBulkDeleteCommand: CommandDefinition = {
  name: 'leads_bulk_delete',
  group: 'leads',
  subcommand: 'bulk-delete',
  description: 'Delete multiple leads in bulk. Requires campaign_id or list_id. Optionally filter by IDs or status.',
  examples: [
    'instantly leads bulk-delete --campaign-id <id>',
    'instantly leads bulk-delete --campaign-id <id> --ids "id1,id2,id3"',
    'instantly leads bulk-delete --list-id <id> --limit 100',
  ],

  inputSchema: z.object({
    campaign_id: z.string().optional().describe('Campaign ID to delete leads from'),
    list_id: z.string().optional().describe('Lead list ID to delete leads from'),
    ids: z.string().optional().describe('Comma-separated lead IDs to delete'),
    status: z.coerce.number().optional().describe('Only delete leads with this status'),
    limit: z.coerce.number().optional().describe('Max leads to delete'),
  }),

  cliMappings: {
    options: [
      { field: 'campaign_id', flags: '--campaign-id <id>', description: 'Campaign ID (required if no list-id)' },
      { field: 'list_id', flags: '--list-id <id>', description: 'Lead list ID (required if no campaign-id)' },
      { field: 'ids', flags: '--ids <ids>', description: 'Comma-separated lead IDs' },
      { field: 'status', flags: '--status <status>', description: 'Only delete leads with this status' },
      { field: 'limit', flags: '-l, --limit <number>', description: 'Max leads to delete' },
    ],
  },

  endpoint: { method: 'DELETE', path: '/leads' },

  fieldMappings: {
    campaign_id: 'body',
    list_id: 'body',
    ids: 'body',
    status: 'body',
    limit: 'body',
  },

  handler: async (input, client) => {
    const body: Record<string, any> = {};
    if (input.campaign_id) body.campaign_id = input.campaign_id;
    if (input.list_id) body.list_id = input.list_id;
    if (input.ids) {
      body.ids = typeof input.ids === 'string'
        ? input.ids.split(',').map((id: string) => id.trim())
        : input.ids;
    }
    if (input.status !== undefined) body.status = input.status;
    if (input.limit !== undefined) body.limit = input.limit;
    return client.request({ method: 'DELETE', path: '/leads', body });
  },
};
