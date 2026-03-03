import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const webhooksResumeCommand: CommandDefinition = {
  name: 'webhooks_resume',
  group: 'webhooks',
  subcommand: 'resume',
  description: 'Resume a webhook that was disabled due to repeated delivery failures.',
  examples: ['instantly webhooks resume <webhook-id>'],

  inputSchema: z.object({ id: z.string().describe('Webhook ID to resume') }),
  cliMappings: { args: [{ field: 'id', name: 'id', required: true }] },
  endpoint: { method: 'POST', path: '/webhooks/{id}/resume' },
  fieldMappings: { id: 'path' },
  handler: (input, client) => executeCommand(webhooksResumeCommand, input, client),
};
