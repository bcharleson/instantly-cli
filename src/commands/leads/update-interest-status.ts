import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const leadsUpdateInterestStatusCommand: CommandDefinition = {
  name: 'leads_update_interest_status',
  group: 'leads',
  subcommand: 'update-interest-status',
  description: 'Update the interest status of a lead.',
  examples: [
    'instantly leads update-interest-status --lead-id <id> --interest-status "Interested"',
  ],

  inputSchema: z.object({
    lead_id: z.string().describe('ID of the lead to update'),
    interest_status: z.string().describe('New interest status to assign'),
  }),

  cliMappings: {
    options: [
      { field: 'lead_id', flags: '--lead-id <id>', description: 'Lead ID (required)' },
      { field: 'interest_status', flags: '--interest-status <status>', description: 'Interest status (required)' },
    ],
  },

  endpoint: { method: 'POST', path: '/leads/update-interest-status' },

  fieldMappings: {
    lead_id: 'body',
    interest_status: 'body',
  },

  handler: (input, client) => executeCommand(leadsUpdateInterestStatusCommand, input, client),
};
