import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const subsequencesUpdateCommand: CommandDefinition = {
  name: 'subsequences_update',
  group: 'subsequences',
  subcommand: 'update',
  description: 'Update a subsequence name.',
  examples: ['instantly subsequences update <id> --name "New Name"'],

  inputSchema: z.object({
    id: z.string().describe('Subsequence ID'),
    name: z.string().optional().describe('New name'),
  }),

  cliMappings: {
    args: [{ field: 'id', name: 'id', required: true }],
    options: [{ field: 'name', flags: '--name <name>', description: 'Subsequence name' }],
  },

  endpoint: { method: 'PATCH', path: '/subsequences/{id}' },
  fieldMappings: { id: 'path', name: 'body' },
  handler: (input, client) => executeCommand(subsequencesUpdateCommand, input, client),
};
