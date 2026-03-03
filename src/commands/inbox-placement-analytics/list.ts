import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const inboxPlacementAnalyticsListCommand: CommandDefinition = {
  name: 'inbox_placement_analytics_list',
  group: 'inbox-placement-analytics',
  subcommand: 'list',
  description: 'List inbox placement analytics entries for a test.',
  examples: [
    'instantly inbox-placement-analytics list --test-id "019cb102-1f0a-7139-841b-167b4be5cbaf"',
  ],

  inputSchema: z.object({
    test_id: z.string().describe('Inbox Placement Test ID'),
    limit: z.coerce.number().min(1).max(100).default(10).describe('Items per page'),
    starting_after: z.string().optional().describe('Pagination cursor'),
    date_from: z.string().optional().describe('Filter from date'),
    date_to: z.string().optional().describe('Filter to date'),
    recipient_geo: z.string().optional().describe('Comma-separated recipient geo values'),
    recipient_type: z.string().optional().describe('Comma-separated recipient type values'),
    recipient_esp: z.string().optional().describe('Comma-separated recipient ESP values'),
  }),

  cliMappings: {
    options: [
      { field: 'test_id', flags: '--test-id <id>', description: 'Inbox Placement Test ID (required)' },
      { field: 'limit', flags: '-l, --limit <number>', description: 'Items per page' },
      { field: 'starting_after', flags: '--starting-after <cursor>', description: 'Pagination cursor' },
      { field: 'date_from', flags: '--date-from <date>', description: 'Filter from date' },
      { field: 'date_to', flags: '--date-to <date>', description: 'Filter to date' },
      { field: 'recipient_geo', flags: '--recipient-geo <values>', description: 'Recipient geo filter (comma-separated)' },
      { field: 'recipient_type', flags: '--recipient-type <values>', description: 'Recipient type filter (comma-separated)' },
      { field: 'recipient_esp', flags: '--recipient-esp <values>', description: 'Recipient ESP filter (comma-separated)' },
    ],
  },

  endpoint: { method: 'GET', path: '/inbox-placement-analytics' },
  fieldMappings: {
    test_id: 'query',
    limit: 'query',
    starting_after: 'query',
    date_from: 'query',
    date_to: 'query',
    recipient_geo: 'query',
    recipient_type: 'query',
    recipient_esp: 'query',
  },
  paginated: true,
  handler: (input, client) => executeCommand(inboxPlacementAnalyticsListCommand, input, client),
};
