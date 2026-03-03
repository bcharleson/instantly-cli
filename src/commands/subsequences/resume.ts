import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const subsequencesResumeCommand: CommandDefinition = {
  name: 'subsequences_resume',
  group: 'subsequences',
  subcommand: 'resume',
  description: 'Resume a paused subsequence.',
  examples: ['instantly subsequences resume <id>'],

  inputSchema: z.object({ id: z.string().describe('Subsequence ID to resume') }),
  cliMappings: { args: [{ field: 'id', name: 'id', required: true }] },
  endpoint: { method: 'POST', path: '/subsequences/{id}/resume' },
  fieldMappings: { id: 'path' },
  handler: (input, client) => executeCommand(subsequencesResumeCommand, input, client),
};
