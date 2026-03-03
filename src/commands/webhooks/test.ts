import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const webhooksTestCommand: CommandDefinition = {
  name: 'webhooks_test',
  group: 'webhooks',
  subcommand: 'test',
  description: 'Send a test payload to a webhook to verify it is working.',
  examples: ['instantly webhooks test <webhook-id>'],

  inputSchema: z.object({ id: z.string().describe('Webhook ID to test') }),
  cliMappings: { args: [{ field: 'id', name: 'id', required: true }] },
  endpoint: { method: 'POST', path: '/webhooks/{id}/test' },
  fieldMappings: { id: 'path' },
  handler: (input, client) => executeCommand(webhooksTestCommand, input, client),
};
