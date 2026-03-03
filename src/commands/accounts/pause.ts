import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const accountsPauseCommand: CommandDefinition = {
  name: 'accounts_pause',
  group: 'accounts',
  subcommand: 'pause',
  description: 'Pause an email account. The account will stop sending emails until resumed.',
  examples: [
    'instantly accounts pause user@example.com',
  ],

  inputSchema: z.object({
    email: z.string().describe('Email address of the account to pause'),
  }),

  cliMappings: {
    args: [{ field: 'email', name: 'email', required: true }],
  },

  endpoint: { method: 'POST', path: '/accounts/{email}/pause' },
  fieldMappings: { email: 'path' },

  handler: (input, client) => executeCommand(accountsPauseCommand, input, client),
};
