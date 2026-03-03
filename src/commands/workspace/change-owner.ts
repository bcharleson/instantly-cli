import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const workspaceChangeOwnerCommand: CommandDefinition = {
  name: 'workspace_change-owner',
  group: 'workspace',
  subcommand: 'change-owner',
  description: 'Change the owner of the current workspace.',
  examples: ['instantly workspace change-owner --email newowner@example.com --sec <token>'],

  inputSchema: z.object({
    email: z.string().describe('Email of the new owner'),
    sec: z.string().describe('Secret token for authentication'),
  }),

  cliMappings: {
    options: [
      { field: 'email', flags: '--email <email>', description: 'Email of the new owner' },
      { field: 'sec', flags: '--sec <token>', description: 'Secret token for authentication' },
    ],
  },

  endpoint: { method: 'POST', path: '/workspaces/current/change-owner' },
  fieldMappings: { email: 'body', sec: 'body' },
  handler: (input, client) => executeCommand(workspaceChangeOwnerCommand, input, client),
};
