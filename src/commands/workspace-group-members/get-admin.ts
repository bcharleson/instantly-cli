import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const workspaceGroupMembersGetAdminCommand: CommandDefinition = {
  name: 'workspace_group_members_get-admin',
  group: 'workspace-group-members',
  subcommand: 'get-admin',
  description: 'Get admin workspace group members.',
  examples: ['instantly workspace-group-members get-admin'],

  inputSchema: z.object({}),
  cliMappings: {},
  endpoint: { method: 'GET', path: '/workspace-group-members/admin' },
  fieldMappings: {},
  handler: (input, client) => executeCommand(workspaceGroupMembersGetAdminCommand, input, client),
};
