import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const customTagsGetCommand: CommandDefinition = {
  name: 'custom_tags_get',
  group: 'custom-tags',
  subcommand: 'get',
  description: 'Get a custom tag by ID.',
  examples: ['instantly custom-tags get <tag-id>'],

  inputSchema: z.object({ id: z.string().describe('Custom tag ID') }),
  cliMappings: { args: [{ field: 'id', name: 'id', required: true }] },
  endpoint: { method: 'GET', path: '/custom-tags/{id}' },
  fieldMappings: { id: 'path' },
  handler: (input, client) => executeCommand(customTagsGetCommand, input, client),
};
