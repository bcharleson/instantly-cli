import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const webhookEventsSummaryByDateCommand: CommandDefinition = {
  name: 'webhook_events_summary-by-date',
  group: 'webhook-events',
  subcommand: 'summary-by-date',
  description: 'Get overview aggregates for webhook events grouped by date.',
  examples: [
    'instantly webhook-events summary-by-date',
    'instantly webhook-events summary-by-date --from 2024-01-01 --to 2024-01-31',
  ],

  inputSchema: z.object({
    from: z.string().optional().describe('Inclusive start date (YYYY-MM-DD)'),
    to: z.string().optional().describe('Inclusive end date (YYYY-MM-DD)'),
  }),

  cliMappings: {
    options: [
      { field: 'from', flags: '--from <date>', description: 'Start date (YYYY-MM-DD)' },
      { field: 'to', flags: '--to <date>', description: 'End date (YYYY-MM-DD)' },
    ],
  },

  endpoint: { method: 'GET', path: '/webhook-events/summary-by-date' },
  fieldMappings: { from: 'query', to: 'query' },
  handler: (input, client) => executeCommand(webhookEventsSummaryByDateCommand, input, client),
};
