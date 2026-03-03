import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const dfyOrdersCancelCommand: CommandDefinition = {
  name: 'dfy_orders_cancel',
  group: 'dfy-orders',
  subcommand: 'cancel',
  description: 'Cancel DFY email accounts by providing their email addresses.',
  examples: [
    'instantly dfy-orders cancel --accounts "user1@example.com,user2@example.com"',
  ],

  inputSchema: z.object({
    accounts: z.string().describe('Comma-separated list of email addresses to cancel'),
  }),

  cliMappings: {
    options: [
      { field: 'accounts', flags: '--accounts <emails>', description: 'Comma-separated emails to cancel' },
    ],
  },

  endpoint: { method: 'POST', path: '/dfy-email-account-orders/accounts/cancel' },
  fieldMappings: { accounts: 'body' },

  handler: async (input, client) => {
    const accountList = typeof input.accounts === 'string' ? input.accounts.split(',').map((a: string) => a.trim()) : input.accounts;
    return client.post('/dfy-email-account-orders/accounts/cancel', {
      accounts: accountList,
    });
  },
};
