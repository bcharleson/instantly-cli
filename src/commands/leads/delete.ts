import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const leadsDeleteCommand: CommandDefinition = {
  name: 'leads_delete',
  group: 'leads',
  subcommand: 'delete',
  description: 'Delete a single lead by ID. This action cannot be undone.',
  examples: [
    'instantly leads delete <lead-id>',
  ],

  inputSchema: z.object({
    id: z.string().describe('Lead ID to delete'),
  }),

  cliMappings: {
    args: [{ field: 'id', name: 'id', required: true }],
  },

  endpoint: { method: 'DELETE', path: '/leads/{id}' },
  fieldMappings: { id: 'path' },

  handler: (input, client) => executeCommand(leadsDeleteCommand, input, client),
};
