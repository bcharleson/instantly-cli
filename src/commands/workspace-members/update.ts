import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const workspaceMembersUpdateCommand: CommandDefinition = {
  name: 'workspace_members_update',
  group: 'workspace-members',
  subcommand: 'update',
  description: 'Update a workspace member role.',
  examples: ['instantly workspace-members update <id> --role admin'],

  inputSchema: z.object({
    id: z.string().describe('Workspace member ID'),
    role: z.string().optional().describe('New role'),
  }),

  cliMappings: {
    args: [{ field: 'id', name: 'id', required: true }],
    options: [{ field: 'role', flags: '--role <role>', description: 'New role' }],
  },

  endpoint: { method: 'PATCH', path: '/workspace-members/{id}' },
  fieldMappings: { id: 'path', role: 'body' },
  handler: (input, client) => executeCommand(workspaceMembersUpdateCommand, input, client),
};
