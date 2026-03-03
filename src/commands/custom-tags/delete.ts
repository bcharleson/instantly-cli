import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const customTagsDeleteCommand: CommandDefinition = {
  name: 'custom_tags_delete',
  group: 'custom-tags',
  subcommand: 'delete',
  description: 'Delete a custom tag by ID.',
  examples: ['instantly custom-tags delete <tag-id>'],

  inputSchema: z.object({ id: z.string().describe('Custom tag ID to delete') }),
  cliMappings: { args: [{ field: 'id', name: 'id', required: true }] },
  endpoint: { method: 'DELETE', path: '/custom-tags/{id}' },
  fieldMappings: { id: 'path' },
  handler: (input, client) => executeCommand(customTagsDeleteCommand, input, client),
};
