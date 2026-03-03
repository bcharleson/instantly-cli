import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const accountsDeleteCommand: CommandDefinition = {
  name: 'accounts_delete',
  group: 'accounts',
  subcommand: 'delete',
  description: 'Delete an email account by ID. This will remove the account from all campaigns.',
  examples: [
    'instantly accounts delete <account-id>',
  ],

  inputSchema: z.object({
    id: z.string().describe('Account ID to delete'),
  }),

  cliMappings: {
    args: [{ field: 'id', name: 'id', required: true }],
  },

  endpoint: { method: 'DELETE', path: '/accounts/{id}' },
  fieldMappings: { id: 'path' },

  handler: (input, client) => executeCommand(accountsDeleteCommand, input, client),
};
