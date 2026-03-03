import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const workspaceWhitelabelDeleteCommand: CommandDefinition = {
  name: 'workspace_whitelabel-delete',
  group: 'workspace',
  subcommand: 'whitelabel-delete',
  description: 'Delete the organization agency domain (whitelabel).',
  examples: ['instantly workspace whitelabel-delete'],

  inputSchema: z.object({}),
  cliMappings: {},

  endpoint: { method: 'DELETE', path: '/workspaces/current/whitelabel-domain' },
  fieldMappings: {},
  handler: (input, client) => executeCommand(workspaceWhitelabelDeleteCommand, input, client),
};
