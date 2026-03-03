import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const emailDeleteCommand: CommandDefinition = {
  name: 'email_delete',
  group: 'email',
  subcommand: 'delete',
  description: 'Delete an email by ID.',
  examples: ['instantly email delete <email-id>'],

  inputSchema: z.object({
    id: z.string().describe('Email ID to delete'),
  }),

  cliMappings: {
    args: [{ field: 'id', name: 'id', required: true }],
  },

  endpoint: { method: 'DELETE', path: '/emails/{id}' },
  fieldMappings: { id: 'path' },
  handler: (input, client) => executeCommand(emailDeleteCommand, input, client),
};
