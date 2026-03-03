import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const accountsWarmupDisableCommand: CommandDefinition = {
  name: 'accounts_warmup_disable',
  group: 'accounts',
  subcommand: 'warmup-disable',
  description: 'Disable warmup for one or more email accounts.',
  examples: [
    'instantly accounts warmup-disable --account-ids "id1,id2"',
  ],

  inputSchema: z.object({
    account_ids: z.array(z.string()).describe('Account IDs to disable warmup for'),
  }),

  cliMappings: {
    options: [
      { field: 'account_ids', flags: '--account-ids <ids>', description: 'Comma-separated account IDs' },
    ],
  },

  endpoint: { method: 'POST', path: '/accounts/warmup/disable' },
  fieldMappings: { account_ids: 'body' },

  handler: async (input, client) => {
    let ids = input.account_ids;
    if (typeof ids === 'string') {
      ids = ids.split(',').map((id: string) => id.trim());
    }
    return executeCommand(accountsWarmupDisableCommand, { account_ids: ids }, client);
  },
};
