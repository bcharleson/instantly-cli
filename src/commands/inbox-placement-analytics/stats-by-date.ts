import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const inboxPlacementAnalyticsStatsByDateCommand: CommandDefinition = {
  name: 'inbox_placement_analytics_stats_by_date',
  group: 'inbox-placement-analytics',
  subcommand: 'stats-by-date',
  description: 'Get time series stats showing distribution of emails to inbox, spam, or category folders for scheduled tests.',
  examples: [
    'instantly inbox-placement-analytics stats-by-date --test-id "019cb102-1f0d-773d-b379-9d4d1b67b115"',
  ],

  inputSchema: z.object({
    test_id: z.string().describe('Inbox Placement Test ID'),
    date_from: z.string().optional().describe('Filter from date'),
    date_to: z.string().optional().describe('Filter to date'),
    recipient_geo: z.string().optional().describe('Comma-separated recipient geo values (1=US, 2=Italy, 3=Germany, 4=France)'),
    recipient_type: z.string().optional().describe('Comma-separated recipient type values (1=Professional, 2=Personal)'),
    recipient_esp: z.string().optional().describe('Comma-separated recipient ESP values (1=Google, 2=Microsoft, 12=Web.de, 13=Libero.it)'),
    sender_email: z.string().optional().describe('Filter by sender email'),
  }),

  cliMappings: {
    options: [
      { field: 'test_id', flags: '--test-id <id>', description: 'Inbox Placement Test ID (required)' },
      { field: 'date_from', flags: '--date-from <date>', description: 'Filter from date' },
      { field: 'date_to', flags: '--date-to <date>', description: 'Filter to date' },
      { field: 'recipient_geo', flags: '--recipient-geo <values>', description: 'Recipient geo filter' },
      { field: 'recipient_type', flags: '--recipient-type <values>', description: 'Recipient type filter' },
      { field: 'recipient_esp', flags: '--recipient-esp <values>', description: 'Recipient ESP filter' },
      { field: 'sender_email', flags: '--sender-email <email>', description: 'Filter by sender email' },
    ],
  },

  endpoint: { method: 'POST', path: '/inbox-placement-analytics/stats-by-date' },
  fieldMappings: {
    test_id: 'body',
    date_from: 'body',
    date_to: 'body',
    recipient_geo: 'body',
    recipient_type: 'body',
    recipient_esp: 'body',
    sender_email: 'body',
  },

  handler: async (input, client) => {
    const body: Record<string, unknown> = {
      test_id: input.test_id,
    };
    if (input.date_from) body.date_from = input.date_from;
    if (input.date_to) body.date_to = input.date_to;
    if (input.recipient_geo) body.recipient_geo = String(input.recipient_geo).split(',').map(Number);
    if (input.recipient_type) body.recipient_type = String(input.recipient_type).split(',').map(Number);
    if (input.recipient_esp) body.recipient_esp = String(input.recipient_esp).split(',').map(Number);
    if (input.sender_email) body.sender_email = input.sender_email;
    return client.post('/inbox-placement-analytics/stats-by-date', body);
  },
};
