import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const webhookEventsSummaryCommand: CommandDefinition = {
  name: 'webhook_events_summary',
  group: 'webhook-events',
  subcommand: 'summary',
  description: 'Get overview aggregates for webhook events including success/failure rates.',
  examples: [
    'instantly webhook-events summary',
    'instantly webhook-events summary --from 2024-01-01 --to 2024-01-31',
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

  endpoint: { method: 'GET', path: '/webhook-events/summary' },
  fieldMappings: { from: 'query', to: 'query' },
  handler: (input, client) => executeCommand(webhookEventsSummaryCommand, input, client),
};
