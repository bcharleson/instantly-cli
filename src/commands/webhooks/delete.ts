import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const webhooksDeleteCommand: CommandDefinition = {
  name: 'webhooks_delete',
  group: 'webhooks',
  subcommand: 'delete',
  description: 'Delete a webhook by ID.',
  examples: ['instantly webhooks delete <webhook-id>'],

  inputSchema: z.object({ id: z.string().describe('Webhook ID to delete') }),
  cliMappings: { args: [{ field: 'id', name: 'id', required: true }] },
  endpoint: { method: 'DELETE', path: '/webhooks/{id}' },
  fieldMappings: { id: 'path' },
  handler: (input, client) => executeCommand(webhooksDeleteCommand, input, client),
};
