import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const workspaceGetCommand: CommandDefinition = {
  name: 'workspace_get',
  group: 'workspace',
  subcommand: 'get',
  description: 'Get current workspace details based on your API key.',
  examples: ['instantly workspace get'],

  inputSchema: z.object({}),
  cliMappings: {},
  endpoint: { method: 'GET', path: '/workspaces/current' },
  fieldMappings: {},
  handler: (input, client) => executeCommand(workspaceGetCommand, input, client),
};
