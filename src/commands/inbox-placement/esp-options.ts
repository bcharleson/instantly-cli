import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const inboxPlacementEspOptionsCommand: CommandDefinition = {
  name: 'inbox_placement_esp-options',
  group: 'inbox-placement',
  subcommand: 'esp-options',
  description: 'Get available email service provider options for inbox placement tests.',
  examples: ['instantly inbox-placement esp-options'],

  inputSchema: z.object({}),
  cliMappings: {},

  endpoint: { method: 'GET', path: '/inbox-placement-tests/email-service-provider-options' },
  fieldMappings: {},
  handler: (input, client) => executeCommand(inboxPlacementEspOptionsCommand, input, client),
};
