import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const webhooksEventTypesCommand: CommandDefinition = {
  name: 'webhooks_event_types',
  group: 'webhooks',
  subcommand: 'event-types',
  description: 'List all available webhook event types including custom labels.',
  examples: ['instantly webhooks event-types'],

  inputSchema: z.object({}),
  cliMappings: {},
  endpoint: { method: 'GET', path: '/webhooks/event-types' },
  fieldMappings: {},
  handler: (input, client) => executeCommand(webhooksEventTypesCommand, input, client),
};
