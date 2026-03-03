import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const analyticsCampaignOverviewCommand: CommandDefinition = {
  name: 'analytics_campaign_overview',
  group: 'analytics',
  subcommand: 'campaign-overview',
  description: 'Get aggregated analytics overview across campaigns. Returns totals for opens, replies, clicks, bounces, and more.',
  examples: [
    'instantly analytics campaign-overview',
    'instantly analytics campaign-overview --campaign-status 1',
  ],

  inputSchema: z.object({
    id: z.string().optional().describe('Campaign ID (omit for all)'),
    ids: z.string().optional().describe('Comma-separated campaign IDs'),
    start_date: z.string().optional().describe('Start date (YYYY-MM-DD)'),
    end_date: z.string().optional().describe('End date (YYYY-MM-DD)'),
    campaign_status: z.coerce.number().optional().describe('Filter: 0=Draft, 1=Active, 2=Paused, 3=Completed'),
  }),

  cliMappings: {
    options: [
      { field: 'id', flags: '--id <id>', description: 'Campaign ID' },
      { field: 'ids', flags: '--ids <ids>', description: 'Comma-separated campaign IDs' },
      { field: 'start_date', flags: '--start-date <date>', description: 'Start date' },
      { field: 'end_date', flags: '--end-date <date>', description: 'End date' },
      { field: 'campaign_status', flags: '--campaign-status <status>', description: '0=Draft, 1=Active, 2=Paused, 3=Completed' },
    ],
  },

  endpoint: { method: 'GET', path: '/campaigns/analytics/overview' },
  fieldMappings: { id: 'query', ids: 'query', start_date: 'query', end_date: 'query', campaign_status: 'query' },
  handler: (input, client) => executeCommand(analyticsCampaignOverviewCommand, input, client),
};
