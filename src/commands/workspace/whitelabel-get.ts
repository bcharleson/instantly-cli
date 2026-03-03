import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const workspaceWhitelabelGetCommand: CommandDefinition = {
  name: 'workspace_whitelabel-get',
  group: 'workspace',
  subcommand: 'whitelabel-get',
  description: 'Get organization verified agency domain (whitelabel) information.',
  examples: ['instantly workspace whitelabel-get'],

  inputSchema: z.object({}),
  cliMappings: {},

  endpoint: { method: 'GET', path: '/workspaces/current/whitelabel-domain' },
  fieldMappings: {},
  handler: (input, client) => executeCommand(workspaceWhitelabelGetCommand, input, client),
};
