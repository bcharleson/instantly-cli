import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const emailTemplatesDeleteCommand: CommandDefinition = {
  name: 'email_templates_delete',
  group: 'email-templates',
  subcommand: 'delete',
  description: 'Delete an email template by ID.',
  examples: ['instantly email-templates delete <template-id>'],

  inputSchema: z.object({ id: z.string().describe('Email template ID to delete') }),
  cliMappings: { args: [{ field: 'id', name: 'id', required: true }] },
  endpoint: { method: 'DELETE', path: '/email-templates/{id}' },
  fieldMappings: { id: 'path' },
  handler: (input, client) => executeCommand(emailTemplatesDeleteCommand, input, client),
};
