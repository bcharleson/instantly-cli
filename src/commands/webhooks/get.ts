import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const webhooksGetCommand: CommandDefinition = {
  name: 'webhooks_get',
  group: 'webhooks',
  subcommand: 'get',
  description: 'Get a webhook by ID.',
  examples: ['instantly webhooks get <webhook-id>'],

  inputSchema: z.object({ id: z.string().describe('Webhook ID') }),
  cliMappings: { args: [{ field: 'id', name: 'id', required: true }] },
  endpoint: { method: 'GET', path: '/webhooks/{id}' },
  fieldMappings: { id: 'path' },
  handler: (input, client) => executeCommand(webhooksGetCommand, input, client),
};
