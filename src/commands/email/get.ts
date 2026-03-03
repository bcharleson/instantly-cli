import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const emailGetCommand: CommandDefinition = {
  name: 'email_get',
  group: 'email',
  subcommand: 'get',
  description: 'Get a specific email by ID. Returns full email details including body, headers, and thread info.',
  examples: ['instantly email get <email-id>'],

  inputSchema: z.object({
    id: z.string().describe('Email ID'),
  }),

  cliMappings: {
    args: [{ field: 'id', name: 'id', required: true }],
  },

  endpoint: { method: 'GET', path: '/emails/{id}' },
  fieldMappings: { id: 'path' },
  handler: (input, client) => executeCommand(emailGetCommand, input, client),
};
