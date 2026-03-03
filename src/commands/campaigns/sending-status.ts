import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const campaignsSendingStatusCommand: CommandDefinition = {
  name: 'campaigns_sending-status',
  group: 'campaigns',
  subcommand: 'sending-status',
  description: 'Get the sending status of a campaign. Returns diagnostics and a human-readable summary explaining why a campaign may not be sending.',
  examples: [
    'instantly campaigns sending-status <campaign-id>',
    'instantly campaigns sending-status <campaign-id> --with-ai-summary',
  ],

  inputSchema: z.object({
    id: z.string().describe('Campaign ID'),
    with_ai_summary: z.boolean().optional().describe('Include AI-generated summary'),
  }),

  cliMappings: {
    args: [{ field: 'id', name: 'id', required: true }],
    options: [
      { field: 'with_ai_summary', flags: '--with-ai-summary', description: 'Include AI-generated summary' },
    ],
  },

  endpoint: { method: 'GET', path: '/campaigns/{id}/sending-status' },

  fieldMappings: {
    id: 'path',
    with_ai_summary: 'query',
  },

  handler: (input, client) => executeCommand(campaignsSendingStatusCommand, input, client),
};
