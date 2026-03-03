import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const dfyOrdersPreWarmedCommand: CommandDefinition = {
  name: 'dfy_orders_pre_warmed',
  group: 'dfy-orders',
  subcommand: 'pre-warmed',
  description: 'Get a list of pre-warmed up domains available for order.',
  examples: [
    'instantly dfy-orders pre-warmed',
    'instantly dfy-orders pre-warmed --extensions "com,org" --search "acme"',
  ],

  inputSchema: z.object({
    extensions: z.string().optional().describe('Comma-separated domain extensions to filter by (e.g. "com,org,co")'),
    search: z.string().optional().describe('Search string to filter domains'),
  }),

  cliMappings: {
    options: [
      { field: 'extensions', flags: '--extensions <extensions>', description: 'Comma-separated extensions (default: com,org,co)' },
      { field: 'search', flags: '--search <query>', description: 'Search string to filter domains' },
    ],
  },

  endpoint: { method: 'POST', path: '/dfy-email-account-orders/domains/pre-warmed-up-list' },
  fieldMappings: { extensions: 'body', search: 'body' },

  handler: async (input, client) => {
    const body: Record<string, unknown> = {};
    if (input.extensions) {
      body.extensions = String(input.extensions).split(',').map((e: string) => e.trim());
    }
    if (input.search) {
      body.search = input.search;
    }
    return client.post('/dfy-email-account-orders/domains/pre-warmed-up-list', body);
  },
};
