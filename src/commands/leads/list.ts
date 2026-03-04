import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const leadsListCommand: CommandDefinition = {
  name: 'leads_list',
  group: 'leads',
  subcommand: 'list',
  description: 'List leads in a campaign or lead list. Use --search to find a lead by email address. Returns paginated results with lead email, status, and custom variables.',
  examples: [
    'instantly leads list --campaign-id <id>',
    'instantly leads list --campaign-id <id> --limit 50',
    'instantly leads list --search "lead@example.com"',
    'instantly leads list --campaign-id <id> --search "lead@example.com"',
    'instantly leads list --list-id <id>',
  ],

  inputSchema: z.object({
    campaign_id: z.string().optional().describe('Campaign ID to list leads from'),
    list_id: z.string().optional().describe('Lead list ID to list leads from'),
    limit: z.coerce.number().min(1).max(100).default(10).describe('Items per page (1-100)'),
    starting_after: z.string().optional().describe('Pagination cursor'),
    search: z.string().optional().describe('Search leads by email'),
  }),

  cliMappings: {
    options: [
      { field: 'campaign_id', flags: '--campaign-id <id>', description: 'Campaign ID' },
      { field: 'list_id', flags: '--list-id <id>', description: 'Lead list ID' },
      { field: 'limit', flags: '-l, --limit <number>', description: 'Items per page (1-100)' },
      { field: 'starting_after', flags: '--starting-after <cursor>', description: 'Pagination cursor' },
      { field: 'search', flags: '--search <query>', description: 'Search by email' },
    ],
  },

  // Lead list is POST, not GET
  endpoint: { method: 'POST', path: '/leads/list' },

  fieldMappings: {
    campaign_id: 'body',
    list_id: 'body',
    limit: 'body',
    starting_after: 'body',
    search: 'body',
  },

  paginated: true,

  handler: (input, client) => executeCommand(leadsListCommand, input, client),
};
