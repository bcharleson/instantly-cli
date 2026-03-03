import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const inboxPlacementAnalyticsStatsByTestCommand: CommandDefinition = {
  name: 'inbox_placement_analytics_stats_by_test',
  group: 'inbox-placement-analytics',
  subcommand: 'stats-by-test',
  description: 'Get aggregated inbox, spam, and category counts for specified test IDs.',
  examples: [
    'instantly inbox-placement-analytics stats-by-test --test-ids "id1,id2"',
  ],

  inputSchema: z.object({
    test_ids: z.string().describe('Comma-separated test IDs'),
    date_from: z.string().optional().describe('Filter from date'),
    date_to: z.string().optional().describe('Filter to date'),
    recipient_geo: z.string().optional().describe('Comma-separated recipient geo values (1=US, 2=Italy, 3=Germany, 4=France)'),
    recipient_type: z.string().optional().describe('Comma-separated recipient type values (1=Professional, 2=Personal)'),
    recipient_esp: z.string().optional().describe('Comma-separated recipient ESP values (1=Google, 2=Microsoft, 12=Web.de, 13=Libero.it)'),
    sender_email: z.string().optional().describe('Filter by sender email'),
  }),

  cliMappings: {
    options: [
      { field: 'test_ids', flags: '--test-ids <ids>', description: 'Comma-separated test IDs (required)' },
      { field: 'date_from', flags: '--date-from <date>', description: 'Filter from date' },
      { field: 'date_to', flags: '--date-to <date>', description: 'Filter to date' },
      { field: 'recipient_geo', flags: '--recipient-geo <values>', description: 'Recipient geo filter' },
      { field: 'recipient_type', flags: '--recipient-type <values>', description: 'Recipient type filter' },
      { field: 'recipient_esp', flags: '--recipient-esp <values>', description: 'Recipient ESP filter' },
      { field: 'sender_email', flags: '--sender-email <email>', description: 'Filter by sender email' },
    ],
  },

  endpoint: { method: 'POST', path: '/inbox-placement-analytics/stats-by-test-id' },
  fieldMappings: {
    test_ids: 'body',
    date_from: 'body',
    date_to: 'body',
    recipient_geo: 'body',
    recipient_type: 'body',
    recipient_esp: 'body',
    sender_email: 'body',
  },

  handler: async (input, client) => {
    const body: Record<string, unknown> = {
      test_ids: String(input.test_ids).split(',').map((id: string) => id.trim()),
    };
    if (input.date_from) body.date_from = input.date_from;
    if (input.date_to) body.date_to = input.date_to;
    if (input.recipient_geo) body.recipient_geo = String(input.recipient_geo).split(',').map(Number);
    if (input.recipient_type) body.recipient_type = String(input.recipient_type).split(',').map(Number);
    if (input.recipient_esp) body.recipient_esp = String(input.recipient_esp).split(',').map(Number);
    if (input.sender_email) body.sender_email = input.sender_email;
    return client.post('/inbox-placement-analytics/stats-by-test-id', body);
  },
};
