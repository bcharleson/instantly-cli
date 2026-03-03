import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const leadsGetCommand: CommandDefinition = {
  name: 'leads_get',
  group: 'leads',
  subcommand: 'get',
  description: 'Get a lead by ID. Returns full lead details including email, custom variables, and campaign associations.',
  examples: [
    'instantly leads get <lead-id>',
  ],

  inputSchema: z.object({
    id: z.string().describe('Lead ID'),
  }),

  cliMappings: {
    args: [{ field: 'id', name: 'id', required: true }],
  },

  endpoint: { method: 'GET', path: '/leads/{id}' },
  fieldMappings: { id: 'path' },

  handler: (input, client) => executeCommand(leadsGetCommand, input, client),
};
