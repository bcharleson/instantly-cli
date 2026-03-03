import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const campaignsDuplicateCommand: CommandDefinition = {
  name: 'campaigns_duplicate',
  group: 'campaigns',
  subcommand: 'duplicate',
  description: 'Duplicate a campaign. Creates a copy of the campaign with all its settings. Optionally provide a new name.',
  examples: [
    'instantly campaigns duplicate <campaign-id>',
    'instantly campaigns duplicate <campaign-id> --name "My Campaign Copy"',
  ],

  inputSchema: z.object({
    id: z.string().describe('Campaign ID to duplicate'),
    name: z.string().optional().describe('New name for the duplicated campaign'),
  }),

  cliMappings: {
    args: [{ field: 'id', name: 'id', required: true }],
    options: [
      { field: 'name', flags: '--name <name>', description: 'New campaign name' },
    ],
  },

  endpoint: { method: 'POST', path: '/campaigns/{id}/duplicate' },
  fieldMappings: { id: 'path', name: 'body' },

  handler: (input, client) => executeCommand(campaignsDuplicateCommand, input, client),
};
