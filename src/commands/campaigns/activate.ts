import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const campaignsActivateCommand: CommandDefinition = {
  name: 'campaigns_activate',
  group: 'campaigns',
  subcommand: 'activate',
  description: 'Activate a campaign to start sending. The campaign must have leads and email accounts assigned.',
  examples: [
    'instantly campaigns activate <campaign-id>',
  ],

  inputSchema: z.object({
    id: z.string().describe('Campaign ID to activate'),
  }),

  cliMappings: {
    args: [{ field: 'id', name: 'id', required: true }],
  },

  endpoint: { method: 'POST', path: '/campaigns/{id}/activate' },
  fieldMappings: { id: 'path' },

  handler: (input, client) => executeCommand(campaignsActivateCommand, input, client),
};
