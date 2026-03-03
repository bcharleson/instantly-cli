import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const workspaceMembersListCommand: CommandDefinition = {
  name: 'workspace_members_list',
  group: 'workspace-members',
  subcommand: 'list',
  description: 'List all workspace members.',
  examples: ['instantly workspace-members list'],

  inputSchema: z.object({}),
  cliMappings: {},
  endpoint: { method: 'GET', path: '/workspace-members' },
  fieldMappings: {},
  handler: (input, client) => executeCommand(workspaceMembersListCommand, input, client),
};
