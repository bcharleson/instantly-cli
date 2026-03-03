import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const dfyOrdersCheckDomainsCommand: CommandDefinition = {
  name: 'dfy_orders_check_domains',
  group: 'dfy-orders',
  subcommand: 'check-domains',
  description: 'Check domain availability for DFY email account orders. Supports .com and .org extensions.',
  examples: [
    'instantly dfy-orders check-domains --domains "example.com,acme.org"',
  ],

  inputSchema: z.object({
    domains: z.string().describe('Comma-separated list of domains to check (max 50)'),
  }),

  cliMappings: {
    options: [
      { field: 'domains', flags: '--domains <domains>', description: 'Comma-separated domains to check' },
    ],
  },

  endpoint: { method: 'POST', path: '/dfy-email-account-orders/domains/check' },
  fieldMappings: { domains: 'body' },

  handler: async (input, client) => {
    const domainList = typeof input.domains === 'string' ? input.domains.split(',').map((d: string) => d.trim()) : input.domains;
    return client.post('/dfy-email-account-orders/domains/check', {
      domains: domainList,
    });
  },
};
