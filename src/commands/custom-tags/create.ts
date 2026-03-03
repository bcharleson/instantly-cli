import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const customTagsCreateCommand: CommandDefinition = {
  name: 'custom_tags_create',
  group: 'custom-tags',
  subcommand: 'create',
  description: 'Create a new custom tag for organizing accounts and campaigns.',
  examples: ['instantly custom-tags create --label "High Priority"'],

  inputSchema: z.object({
    label: z.string().describe('Display label for the tag'),
    description: z.string().optional().describe('Description of the tag purpose'),
  }),

  cliMappings: {
    options: [
      { field: 'label', flags: '--label <label>', description: 'Tag label (required)' },
      { field: 'description', flags: '--description <text>', description: 'Tag description' },
    ],
  },

  endpoint: { method: 'POST', path: '/custom-tags' },
  fieldMappings: { label: 'body', description: 'body' },
  handler: (input, client) => executeCommand(customTagsCreateCommand, input, client),
};
