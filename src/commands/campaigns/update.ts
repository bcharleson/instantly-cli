import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';

export const campaignsUpdateCommand: CommandDefinition = {
  name: 'campaigns_update',
  group: 'campaigns',
  subcommand: 'update',
  description: 'Update an existing campaign. Pass any fields you want to change — name, tracking, sequences, schedule, senders, daily limits, etc.',
  examples: [
    'instantly campaigns update <id> --name "Updated Name"',
    'instantly campaigns update <id> --text-only --no-open-tracking --no-link-tracking',
    'instantly campaigns update <id> --daily-limit 25 --email-gap 10 --stop-on-reply',
    'instantly campaigns update <id> --email-list \'["s1@domain.com","s2@domain.com"]\'',
    'instantly campaigns update <id> --sequences \'[{"steps":[{"type":"email","delay":0,"variants":[{"subject":"Hi","body":"<div>Hello</div>"}]}]}]\'',
  ],

  inputSchema: z.object({
    id: z.string().describe('Campaign ID'),
    name: z.string().optional().describe('Campaign name'),
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
    ).describe('Campaign schedule (JSON object)'),
  }),

  cliMappings: {
    args: [{ field: 'id', name: 'id', required: true }],
    options: [
      { field: 'name', flags: '-n, --name <name>', description: 'Campaign name' },
      { field: 'open_tracking', flags: '--open-tracking', description: 'Enable/disable open tracking (use --no-open-tracking to disable)' },
      { field: 'link_tracking', flags: '--link-tracking', description: 'Enable/disable link tracking (use --no-link-tracking to disable)' },
      { field: 'text_only', flags: '--text-only', description: 'Plain text only, no tracking pixels (use --no-text-only for HTML)' },
      { field: 'stop_on_reply', flags: '--stop-on-reply', description: 'Stop sequence on reply (use --no-stop-on-reply to continue)' },
      { field: 'stop_on_auto_reply', flags: '--stop-on-auto-reply', description: 'Stop on auto-reply (use --no-stop-on-auto-reply to ignore)' },
      { field: 'daily_limit', flags: '--daily-limit <number>', description: 'Max emails/day per account' },
      { field: 'email_gap', flags: '--email-gap <minutes>', description: 'Minutes between emails' },
      { field: 'email_list', flags: '--email-list <json>', description: 'Sender emails (JSON array)' },
      { field: 'sequences', flags: '--sequences <json>', description: 'Email sequences (JSON array)' },
      { field: 'campaign_schedule', flags: '--schedule <json>', description: 'Schedule (JSON object)' },
    ],
  },

  endpoint: { method: 'PATCH', path: '/campaigns/{id}' },
  fieldMappings: {
    id: 'path',
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
    const { id, ...fields } = input;
    // Only send fields that were explicitly provided
    const body: Record<string, any> = {};
    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) {
        body[key] = value;
      }
    }
    return client.patch(`/campaigns/${encodeURIComponent(id)}`, body);
  },
};
