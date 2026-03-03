import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const accountMappingsGetCommand: CommandDefinition = {
  name: 'account_mappings_get',
  group: 'account-mappings',
  subcommand: 'get',
  description: 'Get campaigns associated with an email account.',
  examples: ['instantly account-mappings get <email>'],

  inputSchema: z.object({
    email: z.string().describe('Email address of the account'),
    limit: z.coerce.number().min(1).max(100).default(10).describe('Items per page'),
    starting_after: z.string().optional().describe('Pagination cursor'),
  }),

  cliMappings: {
    args: [{ field: 'email', name: 'email', required: true }],
    options: [
      { field: 'limit', flags: '-l, --limit <number>', description: 'Items per page' },
      { field: 'starting_after', flags: '--starting-after <cursor>', description: 'Pagination cursor' },
    ],
  },

  endpoint: { method: 'GET', path: '/account-campaign-mappings/{email}' },
  fieldMappings: { email: 'path', limit: 'query', starting_after: 'query' },
  paginated: true,
  handler: (input, client) => executeCommand(accountMappingsGetCommand, input, client),
};
