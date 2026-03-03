import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const customPromptTemplatesCreateCommand: CommandDefinition = {
  name: 'custom_prompt_templates_create',
  group: 'custom-prompt-templates',
  subcommand: 'create',
  description: 'Create a new custom prompt template.',
  examples: ['instantly custom-prompt-templates create --name "My Template" --prompt "Generate text using {{property_1}}" --category 1 --is-public false'],

  inputSchema: z.object({
    name: z.string().describe('Template name'),
    prompt: z.string().describe('Prompt text with optional {{property}} placeholders'),
    category: z.coerce.number().describe('Category: 1=Copywriting, 2=Cleaning, 3=Sales, 4=Marketing, 5=Other, 6=Personalization'),
    is_public: z.boolean().describe('Whether the template is publicly visible'),
    description: z.string().optional().describe('Template description'),
    model_version: z.string().optional().describe('Model version (e.g. "3.5", "gpt-4o", "gpt-5")'),
    template_type: z.string().optional().describe('Template type: "custom" or "public"'),
    from_shared: z.boolean().optional().describe('Whether the template was cloned from a shared template'),
  }),

  cliMappings: {
    options: [
      { field: 'name', flags: '--name <name>', description: 'Template name (required)' },
      { field: 'prompt', flags: '--prompt <text>', description: 'Prompt text with optional {{property}} placeholders (required)' },
      { field: 'category', flags: '--category <number>', description: 'Category: 1=Copywriting, 2=Cleaning, 3=Sales, 4=Marketing, 5=Other, 6=Personalization (required)' },
      { field: 'is_public', flags: '--is-public <boolean>', description: 'Whether the template is publicly visible (required)' },
      { field: 'description', flags: '--description <text>', description: 'Template description' },
      { field: 'model_version', flags: '--model-version <version>', description: 'Model version (e.g. "3.5", "gpt-4o")' },
      { field: 'template_type', flags: '--template-type <type>', description: 'Template type: "custom" or "public"' },
      { field: 'from_shared', flags: '--from-shared <boolean>', description: 'Whether cloned from a shared template' },
    ],
  },

  endpoint: { method: 'POST', path: '/custom-prompt-templates' },
  fieldMappings: {
    name: 'body',
    prompt: 'body',
    category: 'body',
    is_public: 'body',
    description: 'body',
    model_version: 'body',
    template_type: 'body',
    from_shared: 'body',
  },
  handler: (input, client) => executeCommand(customPromptTemplatesCreateCommand, input, client),
};
