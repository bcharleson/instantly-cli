import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const leadListsVerificationStatsCommand: CommandDefinition = {
  name: 'lead_lists_verification_stats',
  group: 'lead-lists',
  subcommand: 'verification-stats',
  description: 'Get email verification statistics for a lead list.',
  examples: ['instantly lead-lists verification-stats <list-id>'],

  inputSchema: z.object({ id: z.string().describe('Lead list ID') }),
  cliMappings: { args: [{ field: 'id', name: 'id', required: true }] },
  endpoint: { method: 'GET', path: '/lead-lists/{id}/verification-stats' },
  fieldMappings: { id: 'path' },
  handler: (input, client) => executeCommand(leadListsVerificationStatsCommand, input, client),
};
