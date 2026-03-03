import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const accountsGetCommand: CommandDefinition = {
  name: 'accounts_get',
  group: 'accounts',
  subcommand: 'get',
  description: 'Get an email account by ID. Returns full account details including warmup status, sending limits, and vitals.',
  examples: [
    'instantly accounts get <account-id>',
  ],

  inputSchema: z.object({
    id: z.string().describe('Account ID'),
  }),

  cliMappings: {
    args: [{ field: 'id', name: 'id', required: true }],
  },

  endpoint: { method: 'GET', path: '/accounts/{id}' },
  fieldMappings: { id: 'path' },

  handler: (input, client) => executeCommand(accountsGetCommand, input, client),
};
