import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const subsequencesPauseCommand: CommandDefinition = {
  name: 'subsequences_pause',
  group: 'subsequences',
  subcommand: 'pause',
  description: 'Pause a subsequence.',
  examples: ['instantly subsequences pause <id>'],

  inputSchema: z.object({ id: z.string().describe('Subsequence ID to pause') }),
  cliMappings: { args: [{ field: 'id', name: 'id', required: true }] },
  endpoint: { method: 'POST', path: '/subsequences/{id}/pause' },
  fieldMappings: { id: 'path' },
  handler: (input, client) => executeCommand(subsequencesPauseCommand, input, client),
};
