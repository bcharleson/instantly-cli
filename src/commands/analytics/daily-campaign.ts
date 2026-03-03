import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const analyticsDailyCampaignCommand: CommandDefinition = {
  name: 'analytics_daily_campaign',
  group: 'analytics',
  subcommand: 'daily-campaign',
  description: 'Get daily campaign analytics. Returns daily breakdown of sent, contacted, opened, replied, clicked.',
  examples: [
    'instantly analytics daily-campaign',
    'instantly analytics daily-campaign --campaign-id <id> --start-date 2025-01-01',
  ],

  inputSchema: z.object({
    campaign_id: z.string().optional().describe('Campaign ID (omit for all)'),
    start_date: z.string().optional().describe('Start date (YYYY-MM-DD)'),
    end_date: z.string().optional().describe('End date (YYYY-MM-DD)'),
    campaign_status: z.coerce.number().optional().describe('Filter by campaign status'),
  }),

  cliMappings: {
    options: [
      { field: 'campaign_id', flags: '--campaign-id <id>', description: 'Campaign ID' },
      { field: 'start_date', flags: '--start-date <date>', description: 'Start date' },
      { field: 'end_date', flags: '--end-date <date>', description: 'End date' },
      { field: 'campaign_status', flags: '--campaign-status <status>', description: 'Filter by status' },
    ],
  },

  endpoint: { method: 'GET', path: '/campaigns/analytics/daily' },
  fieldMappings: { campaign_id: 'query', start_date: 'query', end_date: 'query', campaign_status: 'query' },
  handler: (input, client) => executeCommand(analyticsDailyCampaignCommand, input, client),
};
