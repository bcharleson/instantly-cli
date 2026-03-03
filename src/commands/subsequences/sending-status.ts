import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const subsequencesSendingStatusCommand: CommandDefinition = {
  name: 'subsequences_sending_status',
  group: 'subsequences',
  subcommand: 'sending-status',
  description: 'Get the sending status of a subsequence.',
  examples: ['instantly subsequences sending-status <id>', 'instantly subsequences sending-status <id> --with-ai-summary'],

  inputSchema: z.object({
    id: z.string().describe('Subsequence ID'),
    with_ai_summary: z.boolean().optional().describe('Include AI-generated summary'),
  }),

  cliMappings: {
    args: [{ field: 'id', name: 'id', required: true }],
    options: [{ field: 'with_ai_summary', flags: '--with-ai-summary', description: 'Include AI summary' }],
  },

  endpoint: { method: 'GET', path: '/subsequences/{id}/sending-status' },
  fieldMappings: { id: 'path', with_ai_summary: 'query' },
  handler: (input, client) => executeCommand(subsequencesSendingStatusCommand, input, client),
};
