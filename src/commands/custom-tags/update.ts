import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const customTagsUpdateCommand: CommandDefinition = {
  name: 'custom_tags_update',
  group: 'custom-tags',
  subcommand: 'update',
  description: 'Update a custom tag label or description.',
  examples: ['instantly custom-tags update <tag-id> --label "Updated Label"'],

  inputSchema: z.object({
    id: z.string().describe('Custom tag ID'),
    label: z.string().optional().describe('New display label'),
    description: z.string().optional().describe('New description'),
  }),

  cliMappings: {
    args: [{ field: 'id', name: 'id', required: true }],
    options: [
      { field: 'label', flags: '--label <label>', description: 'Tag label' },
      { field: 'description', flags: '--description <text>', description: 'Tag description' },
    ],
  },

  endpoint: { method: 'PATCH', path: '/custom-tags/{id}' },
  fieldMappings: { id: 'path', label: 'body', description: 'body' },
  handler: (input, client) => executeCommand(customTagsUpdateCommand, input, client),
};
