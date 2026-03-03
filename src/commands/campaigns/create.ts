import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';

const DEFAULT_SCHEDULE = {
  schedules: [{
    name: 'Default schedule',
    timing: { from: '09:00', to: '17:00' },
    days: { 0: false, 1: true, 2: true, 3: true, 4: true, 5: true, 6: false },
    timezone: 'America/Detroit',
  }],
};

export const campaignsCreateCommand: CommandDefinition = {
  name: 'campaigns_create',
  group: 'campaigns',
  subcommand: 'create',
  description: 'Create a new campaign. A default Mon-Fri 9am-5pm schedule is used if none is provided.',
  examples: [
    'instantly campaigns create --name "Q1 Outreach"',
    'instantly campaigns create --name "Custom" --schedule \'{"schedules":[{"name":"Night","timing":{"from":"20:00","to":"23:00"},"days":{"1":true},"timezone":"UTC"}]}\'',
  ],

  inputSchema: z.object({
    name: z.string().describe('Campaign name'),
    campaign_schedule: z.string().optional().describe('Campaign schedule (JSON). Uses Mon-Fri 9-5 ET default if omitted.'),
  }),

  cliMappings: {
    options: [
      { field: 'name', flags: '-n, --name <name>', description: 'Campaign name (required)' },
      { field: 'campaign_schedule', flags: '--schedule <json>', description: 'Schedule JSON (optional, has default)' },
    ],
  },

  endpoint: { method: 'POST', path: '/campaigns' },
  fieldMappings: { name: 'body', campaign_schedule: 'body' },

  handler: async (input, client) => {
    const schedule = input.campaign_schedule
      ? (typeof input.campaign_schedule === 'string' ? JSON.parse(input.campaign_schedule) : input.campaign_schedule)
      : DEFAULT_SCHEDULE;
    return client.post('/campaigns', {
      name: input.name,
      campaign_schedule: schedule,
    });
  },
};
