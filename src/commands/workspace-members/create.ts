import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const workspaceMembersCreateCommand: CommandDefinition = {
  name: 'workspace_members_create',
  group: 'workspace-members',
  subcommand: 'create',
  description: 'Invite a new member to the workspace.',
  examples: ['instantly workspace-members create --email "user@company.com" --role admin'],

  inputSchema: z.object({
    email: z.string().describe('Email address of the member'),
    role: z.string().describe('Role (e.g., admin, member)'),
  }),

  cliMappings: {
    options: [
      { field: 'email', flags: '--email <email>', description: 'Member email (required)' },
      { field: 'role', flags: '--role <role>', description: 'Role (required)' },
    ],
  },

  endpoint: { method: 'POST', path: '/workspace-members' },
  fieldMappings: { email: 'body', role: 'body' },
  handler: (input, client) => executeCommand(workspaceMembersCreateCommand, input, client),
};
