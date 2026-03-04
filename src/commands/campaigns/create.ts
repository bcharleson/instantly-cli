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
  description: 'Create a new campaign with full configuration. A default Mon-Fri 9am-5pm ET schedule is used if none is provided.',
  examples: [
    'instantly campaigns create --name "Q1 Outreach"',
    'instantly campaigns create --name "Cold Email" --text-only --no-open-tracking --no-link-tracking --stop-on-reply',
    'instantly campaigns create --name "Full Config" --email-list \'["s1@d.com","s2@d.com"]\' --daily-limit 25 --email-gap 10',
    'instantly campaigns create --name "With Sequences" --sequences \'[{"steps":[{"type":"email","delay":0,"variants":[{"subject":"Hi {{first_name}}","body":"<div>Hello</div>"}]}]}]\'',
  ],

  inputSchema: z.object({
    name: z.string().describe('Campaign name'),
    // Tracking & sending behavior
    open_tracking: z.boolean().optional().describe('Enable open tracking'),
    link_tracking: z.boolean().optional().describe('Enable link click tracking'),
    text_only: z.boolean().optional().describe('Send plain text only (no HTML tracking pixels)'),
    stop_on_reply: z.boolean().optional().describe('Stop sending to a lead after they reply'),
    stop_on_auto_reply: z.boolean().optional().describe('Stop sending on auto-replies'),
    // Rate limiting
    daily_limit: z.coerce.number().optional().describe('Max emails per day per sending account'),
    email_gap: z.coerce.number().optional().describe('Minutes between individual emails'),
    // Senders
    email_list: z.preprocess(
      (v) => (typeof v === 'string' ? JSON.parse(v) : v),
      z.array(z.string()).optional(),
    ).describe('JSON array of sender email addresses'),
    // Sequences (email steps)
    sequences: z.preprocess(
      (v) => (typeof v === 'string' ? JSON.parse(v) : v),
      z.array(z.any()).optional(),
    ).describe('JSON array of sequence objects with steps'),
    // Schedule
    campaign_schedule: z.preprocess(
      (v) => (typeof v === 'string' ? JSON.parse(v) : v),
      z.any().optional(),
    ).describe('Campaign schedule (JSON). Uses Mon-Fri 9-5 ET default if omitted.'),
  }),

  cliMappings: {
    options: [
      { field: 'name', flags: '-n, --name <name>', description: 'Campaign name (required)' },
      { field: 'open_tracking', flags: '--open-tracking', description: 'Enable/disable open tracking (use --no-open-tracking to disable)' },
      { field: 'link_tracking', flags: '--link-tracking', description: 'Enable/disable link tracking (use --no-link-tracking to disable)' },
      { field: 'text_only', flags: '--text-only', description: 'Plain text only, no tracking pixels (use --no-text-only for HTML)' },
      { field: 'stop_on_reply', flags: '--stop-on-reply', description: 'Stop sequence on reply (use --no-stop-on-reply to continue)' },
      { field: 'stop_on_auto_reply', flags: '--stop-on-auto-reply', description: 'Stop on auto-reply' },
      { field: 'daily_limit', flags: '--daily-limit <number>', description: 'Max emails/day per account' },
      { field: 'email_gap', flags: '--email-gap <minutes>', description: 'Minutes between emails' },
      { field: 'email_list', flags: '--email-list <json>', description: 'Sender emails (JSON array)' },
      { field: 'sequences', flags: '--sequences <json>', description: 'Email sequences (JSON array)' },
      { field: 'campaign_schedule', flags: '--schedule <json>', description: 'Schedule (JSON object, has default)' },
    ],
  },

  endpoint: { method: 'POST', path: '/campaigns' },
  fieldMappings: {
    name: 'body',
    open_tracking: 'body',
    link_tracking: 'body',
    text_only: 'body',
    stop_on_reply: 'body',
    stop_on_auto_reply: 'body',
    daily_limit: 'body',
    email_gap: 'body',
    email_list: 'body',
    sequences: 'body',
    campaign_schedule: 'body',
  },

  handler: async (input, client) => {
    const body: Record<string, any> = { name: input.name };

    // Apply default schedule if none provided
    body.campaign_schedule = input.campaign_schedule ?? DEFAULT_SCHEDULE;

    // Include all other explicitly provided fields
    const optionalFields = [
      'open_tracking', 'link_tracking', 'text_only', 'stop_on_reply', 'stop_on_auto_reply',
      'daily_limit', 'email_gap', 'email_list', 'sequences',
    ] as const;

    for (const field of optionalFields) {
      if (input[field] !== undefined) {
        body[field] = input[field];
      }
    }

    return client.post('/campaigns', body);
  },
};
