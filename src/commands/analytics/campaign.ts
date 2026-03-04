import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const analyticsCampaignCommand: CommandDefinition = {
  name: 'analytics_campaign',
  group: 'analytics',
  subcommand: 'campaign',
  description: 'Get analytics for one or more campaigns. Returns leads count, contacted, opens, replies, clicks, bounces, and more.',
  examples: [
    'instantly analytics campaign',
    'instantly analytics campaign --id <campaign-id>',
    'instantly analytics campaign --start-date 2025-01-01 --end-date 2025-03-01',
  ],

  inputSchema: z.object({
    id: z.string().optional().describe('Campaign ID (omit for all campaigns)'),
    ids: z.string().optional().describe('Comma-separated campaign IDs'),
    start_date: z.string().optional().describe('Start date (YYYY-MM-DD)'),
    end_date: z.string().optional().describe('End date (YYYY-MM-DD)'),
  }),

  cliMappings: {
    options: [
      { field: 'id', flags: '--id, --campaign-id <id>', description: 'Campaign ID' },
      { field: 'ids', flags: '--ids <ids>', description: 'Comma-separated campaign IDs' },
      { field: 'start_date', flags: '--start-date <date>', description: 'Start date (YYYY-MM-DD)' },
      { field: 'end_date', flags: '--end-date <date>', description: 'End date (YYYY-MM-DD)' },
    ],
  },

  endpoint: { method: 'GET', path: '/campaigns/analytics' },
  fieldMappings: { id: 'query', ids: 'query', start_date: 'query', end_date: 'query' },
  handler: (input, client) => executeCommand(analyticsCampaignCommand, input, client),
};
