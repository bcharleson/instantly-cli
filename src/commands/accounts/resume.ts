import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const accountsResumeCommand: CommandDefinition = {
  name: 'accounts_resume',
  group: 'accounts',
  subcommand: 'resume',
  description: 'Resume a paused email account. The account will start sending emails again.',
  examples: [
    'instantly accounts resume user@example.com',
  ],

  inputSchema: z.object({
    email: z.string().describe('Email address of the account to resume'),
  }),

  cliMappings: {
    args: [{ field: 'email', name: 'email', required: true }],
  },

  endpoint: { method: 'POST', path: '/accounts/{email}/resume' },
  fieldMappings: { email: 'path' },

  handler: (input, client) => executeCommand(accountsResumeCommand, input, client),
};
