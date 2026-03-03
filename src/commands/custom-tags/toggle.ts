import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const customTagsToggleCommand: CommandDefinition = {
  name: 'custom_tags_toggle',
  group: 'custom-tags',
  subcommand: 'toggle',
  description: 'Assign or unassign tags to resources (accounts or campaigns).',
  examples: [
    'instantly custom-tags toggle --tag-ids "tag1,tag2" --resource-ids "res1" --resource-type 1 --assign',
  ],

  inputSchema: z.object({
    tag_ids: z.string().describe('Comma-separated tag IDs to assign/unassign'),
    resource_ids: z.string().describe('Comma-separated resource IDs'),
    resource_type: z.coerce.number().describe('Resource type (numeric)'),
    assign: z.boolean().describe('true to assign, false to unassign'),
  }),

  cliMappings: {
    options: [
      { field: 'tag_ids', flags: '--tag-ids <ids>', description: 'Tag IDs (comma-separated)' },
      { field: 'resource_ids', flags: '--resource-ids <ids>', description: 'Resource IDs (comma-separated)' },
      { field: 'resource_type', flags: '--resource-type <type>', description: 'Resource type (numeric)' },
      { field: 'assign', flags: '--assign', description: 'Assign tags (omit to unassign)' },
    ],
  },

  endpoint: { method: 'POST', path: '/custom-tags/toggle-resource' },
  fieldMappings: { tag_ids: 'body', resource_ids: 'body', resource_type: 'body', assign: 'body' },

  handler: async (input, client) => {
    const tagIds = typeof input.tag_ids === 'string' ? input.tag_ids.split(',').map((s: string) => s.trim()) : input.tag_ids;
    const resourceIds = typeof input.resource_ids === 'string' ? input.resource_ids.split(',').map((s: string) => s.trim()) : input.resource_ids;
    return client.post('/custom-tags/toggle-resource', {
      tag_ids: tagIds,
      resource_ids: resourceIds,
      resource_type: input.resource_type,
      assign: input.assign,
    });
  },
};
