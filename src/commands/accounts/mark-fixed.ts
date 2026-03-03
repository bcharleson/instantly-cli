import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const accountsMarkFixedCommand: CommandDefinition = {
  name: 'accounts_mark-fixed',
  group: 'accounts',
  subcommand: 'mark-fixed',
  description: 'Mark an email account as fixed. Use this after resolving connection or sending errors on an account.',
  examples: [
    'instantly accounts mark-fixed user@example.com',
  ],

  inputSchema: z.object({
    email: z.string().describe('Email address of the account to mark as fixed'),
  }),

  cliMappings: {
    args: [{ field: 'email', name: 'email', required: true }],
  },

  endpoint: { method: 'POST', path: '/accounts/{email}/mark-fixed' },
  fieldMappings: { email: 'path' },

  handler: (input, client) => executeCommand(accountsMarkFixedCommand, input, client),
};
