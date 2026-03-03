import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const accountsCtdStatusCommand: CommandDefinition = {
  name: 'accounts_ctd-status',
  group: 'accounts',
  subcommand: 'ctd-status',
  description: 'Get custom tracking domain (CTD) status. Check if SSL and CNAME are properly configured for a tracking domain.',
  examples: [
    'instantly accounts ctd-status --host track.example.com',
  ],

  inputSchema: z.object({
    host: z.string().describe('Custom tracking domain host'),
  }),

  cliMappings: {
    options: [
      { field: 'host', flags: '--host <domain>', description: 'Custom tracking domain host' },
    ],
  },

  endpoint: { method: 'GET', path: '/accounts/ctd/status' },
  fieldMappings: { host: 'query' },

  handler: (input, client) => executeCommand(accountsCtdStatusCommand, input, client),
};
