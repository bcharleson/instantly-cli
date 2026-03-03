import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const campaignsGetCommand: CommandDefinition = {
  name: 'campaigns_get',
  group: 'campaigns',
  subcommand: 'get',
  description: 'Get a campaign by ID. Returns full campaign details including steps, settings, and status.',
  examples: [
    'instantly campaigns get <campaign-id>',
  ],

  inputSchema: z.object({
    id: z.string().describe('Campaign ID'),
  }),

  cliMappings: {
    args: [{ field: 'id', name: 'id', required: true }],
  },

  endpoint: { method: 'GET', path: '/campaigns/{id}' },
  fieldMappings: { id: 'path' },

  handler: (input, client) => executeCommand(campaignsGetCommand, input, client),
};
