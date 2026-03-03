import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const emailTemplatesGetCommand: CommandDefinition = {
  name: 'email_templates_get',
  group: 'email-templates',
  subcommand: 'get',
  description: 'Get an email template by ID.',
  examples: ['instantly email-templates get <template-id>'],

  inputSchema: z.object({ id: z.string().describe('Email template ID') }),
  cliMappings: { args: [{ field: 'id', name: 'id', required: true }] },
  endpoint: { method: 'GET', path: '/email-templates/{id}' },
  fieldMappings: { id: 'path' },
  handler: (input, client) => executeCommand(emailTemplatesGetCommand, input, client),
};
