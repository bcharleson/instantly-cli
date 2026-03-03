import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const workspaceGroupMembersDeleteCommand: CommandDefinition = {
  name: 'workspace_group_members_delete',
  group: 'workspace-group-members',
  subcommand: 'delete',
  description: 'Delete a workspace group member.',
  examples: ['instantly workspace-group-members delete <id>'],

  inputSchema: z.object({ id: z.string().describe('Workspace group member ID') }),
  cliMappings: { args: [{ field: 'id', name: 'id', required: true }] },
  endpoint: { method: 'DELETE', path: '/workspace-group-members/{id}' },
  fieldMappings: { id: 'path' },
  handler: (input, client) => executeCommand(workspaceGroupMembersDeleteCommand, input, client),
};
