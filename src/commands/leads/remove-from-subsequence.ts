import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const leadsRemoveFromSubsequenceCommand: CommandDefinition = {
  name: 'leads_remove_from_subsequence',
  group: 'leads',
  subcommand: 'remove-from-subsequence',
  description: 'Remove a lead from a subsequence.',
  examples: [
    'instantly leads remove-from-subsequence <lead-id>',
  ],

  inputSchema: z.object({
    id: z.string().describe('Lead ID to remove from the subsequence'),
  }),

  cliMappings: {
    args: [{ field: 'id', name: 'id', required: true }],
  },

  endpoint: { method: 'POST', path: '/leads/subsequence/remove' },

  fieldMappings: {
    id: 'body',
  },

  handler: (input, client) => executeCommand(leadsRemoveFromSubsequenceCommand, input, client),
};
