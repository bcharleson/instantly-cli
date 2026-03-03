import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const inboxPlacementAnalyticsGetCommand: CommandDefinition = {
  name: 'inbox_placement_analytics_get',
  group: 'inbox-placement-analytics',
  subcommand: 'get',
  description: 'Get a single inbox placement analytics entry by ID.',
  examples: ['instantly inbox-placement-analytics get <id>'],

  inputSchema: z.object({
    id: z.string().describe('Analytics entry ID'),
  }),

  cliMappings: {
    args: [{ field: 'id', name: 'id', required: true }],
  },

  endpoint: { method: 'GET', path: '/inbox-placement-analytics/{id}' },
  fieldMappings: { id: 'path' },
  handler: (input, client) => executeCommand(inboxPlacementAnalyticsGetCommand, input, client),
};
