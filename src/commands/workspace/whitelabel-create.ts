import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const workspaceWhitelabelCreateCommand: CommandDefinition = {
  name: 'workspace_whitelabel-create',
  group: 'workspace',
  subcommand: 'whitelabel-create',
  description: 'Set the agency domain (whitelabel) for the current workspace.',
  examples: ['instantly workspace whitelabel-create --domain agency.example.com'],

  inputSchema: z.object({
    domain: z.string().describe('The agency domain to set for the workspace'),
  }),

  cliMappings: {
    options: [
      { field: 'domain', flags: '--domain <domain>', description: 'Agency domain to set' },
    ],
  },

  endpoint: { method: 'POST', path: '/workspaces/current/whitelabel-domain' },
  fieldMappings: { domain: 'body' },
  handler: (input, client) => executeCommand(workspaceWhitelabelCreateCommand, input, client),
};
