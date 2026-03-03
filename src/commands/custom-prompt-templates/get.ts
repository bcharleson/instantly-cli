import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const customPromptTemplatesGetCommand: CommandDefinition = {
  name: 'custom_prompt_templates_get',
  group: 'custom-prompt-templates',
  subcommand: 'get',
  description: 'Get a custom prompt template by ID.',
  examples: ['instantly custom-prompt-templates get <template-id>'],

  inputSchema: z.object({ id: z.string().describe('Custom prompt template ID') }),
  cliMappings: { args: [{ field: 'id', name: 'id', required: true }] },
  endpoint: { method: 'GET', path: '/custom-prompt-templates/{id}' },
  fieldMappings: { id: 'path' },
  handler: (input, client) => executeCommand(customPromptTemplatesGetCommand, input, client),
};
