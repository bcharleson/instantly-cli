import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const customPromptTemplatesUpdateCommand: CommandDefinition = {
  name: 'custom_prompt_templates_update',
  group: 'custom-prompt-templates',
  subcommand: 'update',
  description: 'Update a custom prompt template.',
  examples: ['instantly custom-prompt-templates update <template-id> --name "Updated Name"'],

  inputSchema: z.object({
    id: z.string().describe('Custom prompt template ID'),
    name: z.string().optional().describe('Template name'),
    prompt: z.string().optional().describe('Prompt text with optional {{property}} placeholders'),
    category: z.coerce.number().optional().describe('Category: 1=Copywriting, 2=Cleaning, 3=Sales, 4=Marketing, 5=Other, 6=Personalization'),
    is_public: z.boolean().optional().describe('Whether the template is publicly visible'),
    description: z.string().optional().describe('Template description'),
    model_version: z.string().optional().describe('Model version (e.g. "3.5", "gpt-4o")'),
    template_type: z.string().optional().describe('Template type: "custom" or "public"'),
    from_shared: z.boolean().optional().describe('Whether cloned from a shared template'),
  }),

  cliMappings: {
    args: [{ field: 'id', name: 'id', required: true }],
    options: [
      { field: 'name', flags: '--name <name>', description: 'Template name' },
      { field: 'prompt', flags: '--prompt <text>', description: 'Prompt text' },
      { field: 'category', flags: '--category <number>', description: 'Category number' },
      { field: 'is_public', flags: '--is-public <boolean>', description: 'Whether publicly visible' },
      { field: 'description', flags: '--description <text>', description: 'Template description' },
      { field: 'model_version', flags: '--model-version <version>', description: 'Model version' },
      { field: 'template_type', flags: '--template-type <type>', description: 'Template type' },
      { field: 'from_shared', flags: '--from-shared <boolean>', description: 'Whether cloned from shared' },
    ],
  },

  endpoint: { method: 'PATCH', path: '/custom-prompt-templates/{id}' },
  fieldMappings: {
    id: 'path',
    name: 'body',
    prompt: 'body',
    category: 'body',
    is_public: 'body',
    description: 'body',
    model_version: 'body',
    template_type: 'body',
    from_shared: 'body',
  },
  handler: (input, client) => executeCommand(customPromptTemplatesUpdateCommand, input, client),
};
