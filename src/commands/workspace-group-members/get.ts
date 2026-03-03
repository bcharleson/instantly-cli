import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const workspaceGroupMembersGetCommand: CommandDefinition = {
  name: 'workspace_group_members_get',
  group: 'workspace-group-members',
  subcommand: 'get',
  description: 'Get details of a workspace group member.',
  examples: ['instantly workspace-group-members get <id>'],

  inputSchema: z.object({ id: z.string().describe('Workspace group member ID') }),
  cliMappings: { args: [{ field: 'id', name: 'id', required: true }] },
  endpoint: { method: 'GET', path: '/workspace-group-members/{id}' },
  fieldMappings: { id: 'path' },
  handler: (input, client) => executeCommand(workspaceGroupMembersGetCommand, input, client),
};
