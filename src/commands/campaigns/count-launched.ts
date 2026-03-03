import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const campaignsCountLaunchedCommand: CommandDefinition = {
  name: 'campaigns_count-launched',
  group: 'campaigns',
  subcommand: 'count-launched',
  description: 'Get the count of launched campaigns in the workspace.',
  examples: [
    'instantly campaigns count-launched',
  ],

  inputSchema: z.object({}),

  cliMappings: {},

  endpoint: { method: 'GET', path: '/campaigns/count-launched' },
  fieldMappings: {},

  handler: (input, client) => executeCommand(campaignsCountLaunchedCommand, input, client),
};
