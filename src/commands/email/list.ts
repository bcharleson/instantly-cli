import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const emailListCommand: CommandDefinition = {
  name: 'email_list',
  group: 'email',
  subcommand: 'list',
  description: 'List emails from the Unibox. Filter by campaign, email type (campaign/reply/manual), read status, and sender account.',
  examples: [
    'instantly email list',
    'instantly email list --campaign-id <id>',
    'instantly email list --email-type reply',
    'instantly email list --email-type reply --campaign-id <id>',
    'instantly email list --is-read false --limit 20',
    'instantly email list --eaccount "sender@domain.com"',
  ],

  inputSchema: z.object({
    campaign_id: z.string().optional().describe('Filter by campaign ID'),
    email_type: z.string().optional().describe('Filter by type: campaign, reply, or manual'),
    is_read: z.string().optional().describe('Filter by read status: true or false'),
    eaccount: z.string().optional().describe('Filter by sender email account'),
    limit: z.coerce.number().min(1).max(100).default(10).describe('Items per page (1-100)'),
    starting_after: z.string().optional().describe('Pagination cursor'),
  }),

  cliMappings: {
    options: [
      { field: 'campaign_id', flags: '--campaign-id <id>', description: 'Filter by campaign' },
      { field: 'email_type', flags: '--email-type <type>', description: 'Filter: campaign, reply, or manual' },
      { field: 'is_read', flags: '--is-read <bool>', description: 'Filter by read status (true/false)' },
      { field: 'eaccount', flags: '--eaccount <email>', description: 'Filter by sender account' },
      { field: 'limit', flags: '-l, --limit <number>', description: 'Items per page (1-100)' },
      { field: 'starting_after', flags: '--starting-after <cursor>', description: 'Pagination cursor' },
    ],
  },

  endpoint: { method: 'GET', path: '/emails' },
  fieldMappings: {
    campaign_id: 'query',
    email_type: 'query',
    is_read: 'query',
    eaccount: 'query',
    limit: 'query',
    starting_after: 'query',
  },
  paginated: true,
  handler: (input, client) => executeCommand(emailListCommand, input, client),
};
