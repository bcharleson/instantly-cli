import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const enrichmentAiCommand: CommandDefinition = {
  name: 'enrichment_ai',
  group: 'enrichment',
  subcommand: 'ai',
  description: 'Create AI enrichment for a resource (campaign or lead list).',
  examples: [
    'instantly enrichment ai --resource-id <id> --output-column "AI Summary" --resource-type 1 --model-version gpt-4',
    'instantly enrichment ai --resource-id <id> --output-column "AI Score" --resource-type 1 --model-version gpt-4 --prompt "Score this lead"',
  ],

  inputSchema: z.object({
    resource_id: z.string().describe('ID of the resource (list or campaign) to enrich'),
    output_column: z.string().describe('Column name to store AI enrichment results'),
    resource_type: z.coerce.number().describe('Type of the entity to enrich'),
    model_version: z.string().describe('Version of the AI model to use for enrichment'),
    input_columns: z.string().optional().describe('Comma-separated list of column names to use as input'),
    use_instantly_account: z.coerce.boolean().optional().describe('Use Instantly account for API calls'),
    overwrite: z.coerce.boolean().optional().describe('Overwrite existing values in the output column'),
    auto_update: z.coerce.boolean().optional().describe('Auto-enrich new leads added'),
    skip_leads_without_email: z.coerce.boolean().optional().describe('Skip leads without an email'),
    limit: z.coerce.number().optional().describe('Maximum number of leads to enrich'),
    prompt: z.string().optional().describe('Custom prompt to guide the AI enrichment'),
    template_id: z.coerce.number().optional().describe('ID of a predefined AI prompt template'),
  }),

  cliMappings: {
    options: [
      { field: 'resource_id', flags: '--resource-id <id>', description: 'Resource ID (list or campaign)' },
      { field: 'output_column', flags: '--output-column <name>', description: 'Output column name' },
      { field: 'resource_type', flags: '--resource-type <type>', description: 'Entity type to enrich' },
      { field: 'model_version', flags: '--model-version <version>', description: 'AI model version' },
      { field: 'input_columns', flags: '--input-columns <cols>', description: 'Comma-separated input column names' },
      { field: 'use_instantly_account', flags: '--use-instantly-account <bool>', description: 'Use Instantly account' },
      { field: 'overwrite', flags: '--overwrite <bool>', description: 'Overwrite existing values' },
      { field: 'auto_update', flags: '--auto-update <bool>', description: 'Auto-enrich new leads' },
      { field: 'skip_leads_without_email', flags: '--skip-leads-without-email <bool>', description: 'Skip leads without email' },
      { field: 'limit', flags: '-l, --limit <number>', description: 'Max leads to enrich' },
      { field: 'prompt', flags: '--prompt <text>', description: 'Custom AI prompt' },
      { field: 'template_id', flags: '--template-id <id>', description: 'AI prompt template ID' },
    ],
  },

  endpoint: { method: 'POST', path: '/supersearch-enrichment/ai' },
  fieldMappings: {
    resource_id: 'body',
    output_column: 'body',
    resource_type: 'body',
    model_version: 'body',
    input_columns: 'body',
    use_instantly_account: 'body',
    overwrite: 'body',
    auto_update: 'body',
    skip_leads_without_email: 'body',
    limit: 'body',
    prompt: 'body',
    template_id: 'body',
  },

  handler: async (input, client) => {
    const body: Record<string, any> = {
      resource_id: input.resource_id,
      output_column: input.output_column,
      resource_type: input.resource_type,
      model_version: input.model_version,
    };
    if (input.input_columns) {
      body.input_columns = typeof input.input_columns === 'string'
        ? input.input_columns.split(',').map((c: string) => c.trim())
        : input.input_columns;
    }
    if (input.use_instantly_account !== undefined) body.use_instantly_account = input.use_instantly_account;
    if (input.overwrite !== undefined) body.overwrite = input.overwrite;
    if (input.auto_update !== undefined) body.auto_update = input.auto_update;
    if (input.skip_leads_without_email !== undefined) body.skip_leads_without_email = input.skip_leads_without_email;
    if (input.limit !== undefined) body.limit = input.limit;
    if (input.prompt) body.prompt = input.prompt;
    if (input.template_id !== undefined) body.template_id = input.template_id;
    return client.post('/supersearch-enrichment/ai', body);
  },
};
