import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const webhooksUpdateCommand: CommandDefinition = {
  name: 'webhooks_update',
  group: 'webhooks',
  subcommand: 'update',
  description: 'Update a webhook by ID. Modify the target URL, event type, name, campaign filter, or custom interest value.',
  examples: [
    'instantly webhooks update <webhook-id> --url "https://example.com/new-hook"',
    'instantly webhooks update <webhook-id> --event-type lead_interested --name "Interest Hook"',
  ],

  inputSchema: z.object({
    id: z.string().describe('Webhook ID to update'),
    target_hook_url: z.string().optional().describe('Target URL for webhook payloads'),
    event_type: z.string().optional().describe('Event type (e.g., email_sent, lead_interested, all_events)'),
    campaign: z.string().optional().describe('Campaign ID to filter events (omit for all)'),
    name: z.string().optional().describe('Display name for the webhook'),
    custom_interest_value: z.coerce.number().optional().describe('Custom interest value for custom label events'),
  }),

  cliMappings: {
    args: [{ field: 'id', name: 'id', required: true }],
    options: [
      { field: 'target_hook_url', flags: '--url <url>', description: 'Target URL' },
      { field: 'event_type', flags: '--event-type <type>', description: 'Event type' },
      { field: 'campaign', flags: '--campaign <id>', description: 'Campaign ID filter' },
      { field: 'name', flags: '-n, --name <name>', description: 'Webhook name' },
      { field: 'custom_interest_value', flags: '--custom-interest-value <value>', description: 'Custom interest value' },
    ],
  },

  endpoint: { method: 'PATCH', path: '/webhooks/{id}' },

  fieldMappings: {
    id: 'path',
    target_hook_url: 'body',
    event_type: 'body',
    campaign: 'body',
    name: 'body',
    custom_interest_value: 'body',
  },

  handler: (input, client) => executeCommand(webhooksUpdateCommand, input, client),
};
