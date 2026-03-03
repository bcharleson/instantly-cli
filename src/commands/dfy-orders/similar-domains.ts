import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const dfyOrdersSimilarDomainsCommand: CommandDefinition = {
  name: 'dfy_orders_similar_domains',
  group: 'dfy-orders',
  subcommand: 'similar-domains',
  description: 'Generate similar available domain suggestions based on a provided domain.',
  examples: [
    'instantly dfy-orders similar-domains --domain "example.com"',
    'instantly dfy-orders similar-domains --domain "example.com" --tlds "com,org"',
  ],

  inputSchema: z.object({
    domain: z.string().describe('Domain to base suggestions on'),
    tlds: z.string().optional().describe('Comma-separated TLDs to use (e.g. "com,org")'),
  }),

  cliMappings: {
    options: [
      { field: 'domain', flags: '--domain <domain>', description: 'Domain to base suggestions on' },
      { field: 'tlds', flags: '--tlds <tlds>', description: 'Comma-separated TLDs (default: com,org)' },
    ],
  },

  endpoint: { method: 'POST', path: '/dfy-email-account-orders/domains/similar' },
  fieldMappings: { domain: 'body', tlds: 'body' },

  handler: async (input, client) => {
    const body: Record<string, unknown> = { domain: input.domain };
    if (input.tlds) {
      body.tlds = String(input.tlds).split(',').map((t: string) => t.trim());
    }
    return client.post('/dfy-email-account-orders/domains/similar', body);
  },
};
