import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const leadsMergeCommand: CommandDefinition = {
  name: 'leads_merge',
  group: 'leads',
  subcommand: 'merge',
  description: 'Merge two leads into one. The source lead is merged into the destination lead.',
  examples: [
    'instantly leads merge --lead-id <source-id> --destination-lead-id <dest-id>',
  ],

  inputSchema: z.object({
    lead_id: z.string().describe('ID of the source lead to merge'),
    destination_lead_id: z.string().describe('ID of the destination lead to merge into'),
  }),

  cliMappings: {
    options: [
      { field: 'lead_id', flags: '--lead-id <id>', description: 'Source lead ID (required)' },
      { field: 'destination_lead_id', flags: '--destination-lead-id <id>', description: 'Destination lead ID (required)' },
    ],
  },

  endpoint: { method: 'POST', path: '/leads/merge' },

  fieldMappings: {
    lead_id: 'body',
    destination_lead_id: 'body',
  },

  handler: (input, client) => executeCommand(leadsMergeCommand, input, client),
};
