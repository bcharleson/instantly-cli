import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const workspaceGroupMembersListCommand: CommandDefinition = {
  name: 'workspace_group_members_list',
  group: 'workspace-group-members',
  subcommand: 'list',
  description: 'List workspace group members.',
  examples: ['instantly workspace-group-members list'],

  inputSchema: z.object({
    limit: z.coerce.number().min(1).max(100).default(10).describe('Items per page (1-100)'),
    starting_after: z.string().optional().describe('Pagination cursor'),
  }),

  cliMappings: {
    options: [
      { field: 'limit', flags: '-l, --limit <number>', description: 'Items per page (1-100)' },
      { field: 'starting_after', flags: '--starting-after <cursor>', description: 'Pagination cursor' },
    ],
  },

  endpoint: { method: 'GET', path: '/workspace-group-members' },
  fieldMappings: { limit: 'query', starting_after: 'query' },
  paginated: true,
  handler: (input, client) => executeCommand(workspaceGroupMembersListCommand, input, client),
};
