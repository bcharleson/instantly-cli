import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const inboxPlacementAnalyticsInsightsCommand: CommandDefinition = {
  name: 'inbox_placement_analytics_insights',
  group: 'inbox-placement-analytics',
  subcommand: 'insights',
  description: 'Retrieve deliverability insights for a specific inbox placement test.',
  examples: [
    'instantly inbox-placement-analytics insights --test-id "019cb102-1f0d-773d-b379-9d4bd738050d"',
  ],

  inputSchema: z.object({
    test_id: z.string().describe('Inbox Placement Test ID'),
    date_from: z.string().optional().describe('Filter from date'),
    date_to: z.string().optional().describe('Filter to date'),
    previous_date_from: z.string().optional().describe('Previous period start date for comparison'),
    previous_date_to: z.string().optional().describe('Previous period end date for comparison'),
    show_previous: z.boolean().optional().describe('Show previous period comparison'),
    recipient_geo: z.string().optional().describe('Comma-separated recipient geo values (1=US, 2=Italy, 3=Germany, 4=France)'),
    recipient_type: z.string().optional().describe('Comma-separated recipient type values (1=Professional, 2=Personal)'),
    recipient_esp: z.string().optional().describe('Comma-separated recipient ESP values (1=Google, 2=Microsoft, 12=Web.de, 13=Libero.it)'),
  }),

  cliMappings: {
    options: [
      { field: 'test_id', flags: '--test-id <id>', description: 'Inbox Placement Test ID (required)' },
      { field: 'date_from', flags: '--date-from <date>', description: 'Filter from date' },
      { field: 'date_to', flags: '--date-to <date>', description: 'Filter to date' },
      { field: 'previous_date_from', flags: '--previous-date-from <date>', description: 'Previous period start date' },
      { field: 'previous_date_to', flags: '--previous-date-to <date>', description: 'Previous period end date' },
      { field: 'show_previous', flags: '--show-previous', description: 'Show previous period comparison' },
      { field: 'recipient_geo', flags: '--recipient-geo <values>', description: 'Recipient geo filter' },
      { field: 'recipient_type', flags: '--recipient-type <values>', description: 'Recipient type filter' },
      { field: 'recipient_esp', flags: '--recipient-esp <values>', description: 'Recipient ESP filter' },
    ],
  },

  endpoint: { method: 'POST', path: '/inbox-placement-analytics/deliverability-insights' },
  fieldMappings: {
    test_id: 'body',
    date_from: 'body',
    date_to: 'body',
    previous_date_from: 'body',
    previous_date_to: 'body',
    show_previous: 'body',
    recipient_geo: 'body',
    recipient_type: 'body',
    recipient_esp: 'body',
  },

  handler: async (input, client) => {
    const body: Record<string, unknown> = {
      test_id: input.test_id,
    };
    if (input.date_from) body.date_from = input.date_from;
    if (input.date_to) body.date_to = input.date_to;
    if (input.previous_date_from) body.previous_date_from = input.previous_date_from;
    if (input.previous_date_to) body.previous_date_to = input.previous_date_to;
    if (input.show_previous !== undefined) body.show_previous = input.show_previous;
    if (input.recipient_geo) body.recipient_geo = String(input.recipient_geo).split(',').map(Number);
    if (input.recipient_type) body.recipient_type = String(input.recipient_type).split(',').map(Number);
    if (input.recipient_esp) body.recipient_esp = String(input.recipient_esp).split(',').map(Number);
    return client.post('/inbox-placement-analytics/deliverability-insights', body);
  },
};
