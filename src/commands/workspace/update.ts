import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const workspaceUpdateCommand: CommandDefinition = {
  name: 'workspace_update',
  group: 'workspace',
  subcommand: 'update',
  description: 'Update current workspace name or logo.',
  examples: ['instantly workspace update --name "My Workspace"'],

  inputSchema: z.object({
    name: z.string().describe('Workspace name'),
    org_logo_url: z.string().optional().describe('URL to workspace logo'),
  }),

  cliMappings: {
    options: [
      { field: 'name', flags: '--name <name>', description: 'Workspace name' },
      { field: 'org_logo_url', flags: '--logo-url <url>', description: 'Logo URL' },
    ],
  },

  endpoint: { method: 'PATCH', path: '/workspaces/current' },
  fieldMappings: { name: 'body', org_logo_url: 'body' },
  handler: (input, client) => executeCommand(workspaceUpdateCommand, input, client),
};
