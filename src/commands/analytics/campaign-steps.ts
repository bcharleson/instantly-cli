import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const analyticsCampaignStepsCommand: CommandDefinition = {
  name: 'analytics_campaign_steps',
  group: 'analytics',
  subcommand: 'campaign-steps',
  description: 'Get campaign analytics broken down by step and variant. Shows per-step sent, opened, replied, clicked.',
  examples: [
    'instantly analytics campaign-steps --campaign-id <id>',
  ],

  inputSchema: z.object({
    campaign_id: z.string().optional().describe('Campaign ID'),
    start_date: z.string().optional().describe('Start date (YYYY-MM-DD)'),
    end_date: z.string().optional().describe('End date (YYYY-MM-DD)'),
  }),

  cliMappings: {
    options: [
      { field: 'campaign_id', flags: '--campaign-id <id>', description: 'Campaign ID' },
      { field: 'start_date', flags: '--start-date <date>', description: 'Start date' },
      { field: 'end_date', flags: '--end-date <date>', description: 'End date' },
    ],
  },

  endpoint: { method: 'GET', path: '/campaigns/analytics/steps' },
  fieldMappings: { campaign_id: 'query', start_date: 'query', end_date: 'query' },
  handler: (input, client) => executeCommand(analyticsCampaignStepsCommand, input, client),
};
