import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const webhooksCreateCommand: CommandDefinition = {
  name: 'webhooks_create',
  group: 'webhooks',
  subcommand: 'create',
  description: 'Create a new webhook subscription. Specify target URL and event type.',
  examples: [
    'instantly webhooks create --url "https://example.com/hook" --event-type lead_interested',
    'instantly webhooks create --url "https://example.com/hook" --event-type all_events --name "All Events"',
  ],

  inputSchema: z.object({
    target_hook_url: z.string().describe('Target URL for webhook payloads'),
    event_type: z.string().optional().describe('Event type (e.g., email_sent, lead_interested, all_events)'),
    campaign: z.string().optional().describe('Campaign ID to filter events (omit for all)'),
    name: z.string().optional().describe('Display name for the webhook'),
  }),

  cliMappings: {
    options: [
      { field: 'target_hook_url', flags: '--url <url>', description: 'Target URL (required)' },
      { field: 'event_type', flags: '--event-type <type>', description: 'Event type' },
      { field: 'campaign', flags: '--campaign <id>', description: 'Campaign ID filter' },
      { field: 'name', flags: '-n, --name <name>', description: 'Webhook name' },
    ],
  },

  endpoint: { method: 'POST', path: '/webhooks' },
  fieldMappings: { target_hook_url: 'body', event_type: 'body', campaign: 'body', name: 'body' },
  handler: (input, client) => executeCommand(webhooksCreateCommand, input, client),
};
