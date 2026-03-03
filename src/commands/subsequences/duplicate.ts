import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const subsequencesDuplicateCommand: CommandDefinition = {
  name: 'subsequences_duplicate',
  group: 'subsequences',
  subcommand: 'duplicate',
  description: 'Duplicate a subsequence to the same or different campaign.',
  examples: ['instantly subsequences duplicate <id> --campaign-id <target-id> --name "Copy"'],

  inputSchema: z.object({
    id: z.string().describe('Subsequence ID to duplicate'),
    parent_campaign: z.string().describe('Target campaign ID'),
    name: z.string().describe('Name for the duplicate'),
  }),

  cliMappings: {
    args: [{ field: 'id', name: 'id', required: true }],
    options: [
      { field: 'parent_campaign', flags: '--campaign-id <id>', description: 'Target campaign ID' },
      { field: 'name', flags: '--name <name>', description: 'Name for duplicate' },
    ],
  },

  endpoint: { method: 'POST', path: '/subsequences/{id}/duplicate' },
  fieldMappings: { id: 'path', parent_campaign: 'body', name: 'body' },
  handler: (input, client) => executeCommand(subsequencesDuplicateCommand, input, client),
};
