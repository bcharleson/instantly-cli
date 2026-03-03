import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const customPromptTemplatesListCommand: CommandDefinition = {
  name: 'custom_prompt_templates_list',
  group: 'custom-prompt-templates',
  subcommand: 'list',
  description: 'List custom prompt templates.',
  examples: ['instantly custom-prompt-templates list', 'instantly custom-prompt-templates list --limit 20'],

  inputSchema: z.object({
    limit: z.coerce.number().min(1).max(100).default(10).describe('Items per page'),
    starting_after: z.string().optional().describe('Pagination cursor'),
    search: z.string().optional().describe('Search by template name'),
  }),

  cliMappings: {
    options: [
      { field: 'limit', flags: '-l, --limit <number>', description: 'Items per page' },
      { field: 'starting_after', flags: '--starting-after <cursor>', description: 'Pagination cursor' },
      { field: 'search', flags: '--search <query>', description: 'Search by template name' },
    ],
  },

  endpoint: { method: 'GET', path: '/custom-prompt-templates' },
  fieldMappings: { limit: 'query', starting_after: 'query', search: 'query' },
  paginated: true,
  handler: (input, client) => executeCommand(customPromptTemplatesListCommand, input, client),
};
