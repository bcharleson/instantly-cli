import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const workspaceMembersDeleteCommand: CommandDefinition = {
  name: 'workspace_members_delete',
  group: 'workspace-members',
  subcommand: 'delete',
  description: 'Remove a member from the workspace.',
  examples: ['instantly workspace-members delete <id>'],

  inputSchema: z.object({ id: z.string().describe('Workspace member ID') }),
  cliMappings: { args: [{ field: 'id', name: 'id', required: true }] },
  endpoint: { method: 'DELETE', path: '/workspace-members/{id}' },
  fieldMappings: { id: 'path' },
  handler: (input, client) => executeCommand(workspaceMembersDeleteCommand, input, client),
};
