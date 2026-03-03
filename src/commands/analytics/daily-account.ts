import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const analyticsDailyAccountCommand: CommandDefinition = {
  name: 'analytics_daily_account',
  group: 'analytics',
  subcommand: 'daily-account',
  description: 'Get daily account analytics showing emails sent per day for each email account.',
  examples: [
    'instantly analytics daily-account',
    'instantly analytics daily-account --start-date 2025-01-01',
  ],

  inputSchema: z.object({
    start_date: z.string().optional().describe('Start date (YYYY-MM-DD)'),
    end_date: z.string().optional().describe('End date (YYYY-MM-DD)'),
    emails: z.string().optional().describe('Comma-separated email accounts to filter'),
  }),

  cliMappings: {
    options: [
      { field: 'start_date', flags: '--start-date <date>', description: 'Start date' },
      { field: 'end_date', flags: '--end-date <date>', description: 'End date' },
      { field: 'emails', flags: '--emails <emails>', description: 'Comma-separated email accounts' },
    ],
  },

  endpoint: { method: 'GET', path: '/accounts/analytics/daily' },
  fieldMappings: { start_date: 'query', end_date: 'query', emails: 'query' },
  handler: (input, client) => executeCommand(analyticsDailyAccountCommand, input, client),
};
