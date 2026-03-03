import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const inboxPlacementReportsListCommand: CommandDefinition = {
  name: 'inbox_placement_reports_list',
  group: 'inbox-placement-reports',
  subcommand: 'list',
  description: 'List inbox placement blacklist and SpamAssassin reports.',
  examples: [
    'instantly inbox-placement-reports list --test-id "d290f1ee-6c54-4b01-90e6-d701748f0851"',
  ],

  inputSchema: z.object({
    test_id: z.string().describe('Inbox Placement Test ID'),
    limit: z.coerce.number().min(1).max(100).default(10).describe('Items per page'),
    starting_after: z.string().optional().describe('Pagination cursor'),
    date_from: z.string().optional().describe('Filter from date'),
    date_to: z.string().optional().describe('Filter to date'),
    skip_spam_assassin_report: z.boolean().optional().describe('Skip including SpamAssassin report JSON'),
    skip_blacklist_report: z.boolean().optional().describe('Skip including blacklist report JSON'),
  }),

  cliMappings: {
    options: [
      { field: 'test_id', flags: '--test-id <id>', description: 'Inbox Placement Test ID (required)' },
      { field: 'limit', flags: '-l, --limit <number>', description: 'Items per page' },
      { field: 'starting_after', flags: '--starting-after <cursor>', description: 'Pagination cursor' },
      { field: 'date_from', flags: '--date-from <date>', description: 'Filter from date' },
      { field: 'date_to', flags: '--date-to <date>', description: 'Filter to date' },
      { field: 'skip_spam_assassin_report', flags: '--skip-spam-assassin-report', description: 'Skip SpamAssassin report data' },
      { field: 'skip_blacklist_report', flags: '--skip-blacklist-report', description: 'Skip blacklist report data' },
    ],
  },

  endpoint: { method: 'GET', path: '/inbox-placement-reports' },
  fieldMappings: {
    test_id: 'query',
    limit: 'query',
    starting_after: 'query',
    date_from: 'query',
    date_to: 'query',
    skip_spam_assassin_report: 'query',
    skip_blacklist_report: 'query',
  },
  paginated: true,
  handler: (input, client) => executeCommand(inboxPlacementReportsListCommand, input, client),
};
