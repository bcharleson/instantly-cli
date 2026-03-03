import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const workspaceMembersGetCommand: CommandDefinition = {
  name: 'workspace_members_get',
  group: 'workspace-members',
  subcommand: 'get',
  description: 'Get details of a workspace member.',
  examples: ['instantly workspace-members get <id>'],

  inputSchema: z.object({ id: z.string().describe('Workspace member ID') }),
  cliMappings: { args: [{ field: 'id', name: 'id', required: true }] },
  endpoint: { method: 'GET', path: '/workspace-members/{id}' },
  fieldMappings: { id: 'path' },
  handler: (input, client) => executeCommand(workspaceMembersGetCommand, input, client),
};
