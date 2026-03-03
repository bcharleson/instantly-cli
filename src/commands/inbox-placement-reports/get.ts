import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const inboxPlacementReportsGetCommand: CommandDefinition = {
  name: 'inbox_placement_reports_get',
  group: 'inbox-placement-reports',
  subcommand: 'get',
  description: 'Get a single inbox placement blacklist and SpamAssassin report by ID.',
  examples: ['instantly inbox-placement-reports get <id>'],

  inputSchema: z.object({
    id: z.string().describe('Report ID'),
  }),

  cliMappings: {
    args: [{ field: 'id', name: 'id', required: true }],
  },

  endpoint: { method: 'GET', path: '/inbox-placement-reports/{id}' },
  fieldMappings: { id: 'path' },
  handler: (input, client) => executeCommand(inboxPlacementReportsGetCommand, input, client),
};
