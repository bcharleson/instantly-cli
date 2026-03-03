import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const leadsBulkAssignCommand: CommandDefinition = {
  name: 'leads_bulk_assign',
  group: 'leads',
  subcommand: 'bulk-assign',
  description: 'Bulk assign leads to organization users. Filter leads by campaign, list, search query, or specific IDs.',
  examples: [
    'instantly leads bulk-assign --user-ids "user1,user2" --campaign <campaign-id>',
    'instantly leads bulk-assign --user-ids "user1" --list-id <list-id>',
    'instantly leads bulk-assign --user-ids "user1" --ids "lead1,lead2,lead3"',
  ],

  inputSchema: z.object({
    organization_user_ids: z.array(z.string()).describe('Array of user IDs to assign leads to'),
    campaign: z.string().optional().describe('Campaign ID to filter leads'),
    list_id: z.string().optional().describe('List ID to filter leads'),
    search: z.string().optional().describe('Search query to filter leads'),
    ids: z.string().optional().describe('Comma-separated lead IDs to assign'),
    in_campaign: z.boolean().optional().describe('Whether leads are in the campaign'),
    in_list: z.boolean().optional().describe('Whether leads are in the list'),
    smart_view_id: z.string().optional().describe('Smart view ID to filter leads'),
    limit: z.coerce.number().optional().describe('Max number of leads to assign'),
  }),

  cliMappings: {
    options: [
      { field: 'organization_user_ids', flags: '--user-ids <ids>', description: 'Comma-separated user IDs (required)' },
      { field: 'campaign', flags: '--campaign <id>', description: 'Campaign ID filter' },
      { field: 'list_id', flags: '--list-id <id>', description: 'List ID filter' },
      { field: 'search', flags: '--search <query>', description: 'Search query' },
      { field: 'ids', flags: '--ids <ids>', description: 'Comma-separated lead IDs' },
      { field: 'in_campaign', flags: '--in-campaign', description: 'Filter leads in campaign' },
      { field: 'in_list', flags: '--in-list', description: 'Filter leads in list' },
      { field: 'smart_view_id', flags: '--smart-view-id <id>', description: 'Smart view ID' },
      { field: 'limit', flags: '-l, --limit <number>', description: 'Max leads to assign' },
    ],
  },

  endpoint: { method: 'POST', path: '/leads/bulk-assign' },

  fieldMappings: {
    organization_user_ids: 'body',
    campaign: 'body',
    list_id: 'body',
    search: 'body',
    ids: 'body',
    in_campaign: 'body',
    in_list: 'body',
    smart_view_id: 'body',
    limit: 'body',
  },

  handler: async (input, client) => {
    let userIds = input.organization_user_ids;
    if (typeof userIds === 'string') {
      userIds = userIds.split(',').map((id: string) => id.trim());
    }
    const body: Record<string, any> = { ...input, organization_user_ids: userIds };
    if (body.ids && typeof body.ids === 'string') {
      body.ids = body.ids.split(',').map((id: string) => id.trim());
    }
    return executeCommand(leadsBulkAssignCommand, body, client);
  },
};
