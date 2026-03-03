import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const customPromptTemplatesDeleteCommand: CommandDefinition = {
  name: 'custom_prompt_templates_delete',
  group: 'custom-prompt-templates',
  subcommand: 'delete',
  description: 'Delete a custom prompt template by ID.',
  examples: ['instantly custom-prompt-templates delete <template-id>'],

  inputSchema: z.object({ id: z.string().describe('Custom prompt template ID to delete') }),
  cliMappings: { args: [{ field: 'id', name: 'id', required: true }] },
  endpoint: { method: 'DELETE', path: '/custom-prompt-templates/{id}' },
  fieldMappings: { id: 'path' },
  handler: (input, client) => executeCommand(customPromptTemplatesDeleteCommand, input, client),
};
