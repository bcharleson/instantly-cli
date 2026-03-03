import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const webhookEventsGetCommand: CommandDefinition = {
  name: 'webhook_events_get',
  group: 'webhook-events',
  subcommand: 'get',
  description: 'Get a webhook event by ID.',
  examples: ['instantly webhook-events get <id>'],

  inputSchema: z.object({ id: z.string().describe('Webhook event ID (UUID)') }),
  cliMappings: { args: [{ field: 'id', name: 'id', required: true }] },
  endpoint: { method: 'GET', path: '/webhook-events/{id}' },
  fieldMappings: { id: 'path' },
  handler: (input, client) => executeCommand(webhookEventsGetCommand, input, client),
};
