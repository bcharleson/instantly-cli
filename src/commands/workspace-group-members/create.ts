import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const workspaceGroupMembersCreateCommand: CommandDefinition = {
  name: 'workspace_group_members_create',
  group: 'workspace-group-members',
  subcommand: 'create',
  description: 'Create or invite a workspace group member.',
  examples: ['instantly workspace-group-members create --email "user@company.com"'],

  inputSchema: z.object({
    email: z.string().describe('Email address of the member to invite'),
  }),

  cliMappings: {
    options: [
      { field: 'email', flags: '--email <email>', description: 'Member email (required)' },
    ],
  },

  endpoint: { method: 'POST', path: '/workspace-group-members' },
  fieldMappings: { email: 'body' },
  handler: (input, client) => executeCommand(workspaceGroupMembersCreateCommand, input, client),
};
