import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const leadsSubsequenceMoveCommand: CommandDefinition = {
  name: 'leads_subsequence_move',
  group: 'leads',
  subcommand: 'subsequence-move',
  description: 'Move leads to a subsequence within the same campaign.',
  examples: [
    'instantly leads subsequence-move --lead-ids "id1,id2" --subsequence-id <id>',
  ],

  inputSchema: z.object({
    lead_ids: z.array(z.string()).describe('Array of lead IDs to move'),
    subsequence_id: z.string().describe('Target subsequence ID'),
  }),

  cliMappings: {
    options: [
      { field: 'lead_ids', flags: '--lead-ids <ids>', description: 'Comma-separated lead IDs' },
      { field: 'subsequence_id', flags: '--subsequence-id <id>', description: 'Target subsequence ID' },
    ],
  },

  endpoint: { method: 'POST', path: '/leads/subsequence/move' },

  fieldMappings: {
    lead_ids: 'body',
    subsequence_id: 'body',
  },

  handler: async (input, client) => {
    let leadIds = input.lead_ids;
    if (typeof leadIds === 'string') {
      leadIds = leadIds.split(',').map((id: string) => id.trim());
    }
    return executeCommand(leadsSubsequenceMoveCommand, { ...input, lead_ids: leadIds }, client);
  },
};
