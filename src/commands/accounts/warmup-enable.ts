import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const accountsWarmupEnableCommand: CommandDefinition = {
  name: 'accounts_warmup_enable',
  group: 'accounts',
  subcommand: 'warmup-enable',
  description: 'Enable warmup for one or more email accounts. Gradually increases sending volume to build reputation.',
  examples: [
    'instantly accounts warmup-enable --account-ids "id1,id2"',
  ],

  inputSchema: z.object({
    account_ids: z.array(z.string()).describe('Account IDs to enable warmup for'),
  }),

  cliMappings: {
    options: [
      { field: 'account_ids', flags: '--account-ids <ids>', description: 'Comma-separated account IDs' },
    ],
  },

  endpoint: { method: 'POST', path: '/accounts/warmup/enable' },
  fieldMappings: { account_ids: 'body' },

  handler: async (input, client) => {
    let ids = input.account_ids;
    if (typeof ids === 'string') {
      ids = ids.split(',').map((id: string) => id.trim());
    }
    return executeCommand(accountsWarmupEnableCommand, { account_ids: ids }, client);
  },
};
