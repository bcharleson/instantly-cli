import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const subsequencesDeleteCommand: CommandDefinition = {
  name: 'subsequences_delete',
  group: 'subsequences',
  subcommand: 'delete',
  description: 'Delete a subsequence by ID.',
  examples: ['instantly subsequences delete <id>'],

  inputSchema: z.object({ id: z.string().describe('Subsequence ID to delete') }),
  cliMappings: { args: [{ field: 'id', name: 'id', required: true }] },
  endpoint: { method: 'DELETE', path: '/subsequences/{id}' },
  fieldMappings: { id: 'path' },
  handler: (input, client) => executeCommand(subsequencesDeleteCommand, input, client),
};
