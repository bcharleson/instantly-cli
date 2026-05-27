import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { searchFiltersSchema } from './search-filters.js';

export const enrichmentEnrichCommand: CommandDefinition = {
  name: 'enrichment_enrich',
  group: 'enrichment',
  subcommand: 'enrich',
  description:
    'Search SuperSearch and import NEW matching leads into your workspace, enriching them in the process. ' +
    'Enable at least one enrichment type: --work-email and/or --full-profile. ' +
    'A new list is auto-created unless --resource-id points to an existing one. ' +
    'To configure recurring enrichment on an EXISTING resource, use "enrichment create" instead.',
  examples: [
    `instantly enrichment enrich --search-filters '{"title":{"include":["CTO"]},"employeeCount":["25 - 100"]}' --work-email --limit 100`,
    `instantly enrichment enrich --search-filters '{"domains":["example.com"],"title":{"include":["CEO","Founder"]}}' --work-email --full-profile --limit 50`,
    `instantly enrichment enrich --search-filters '{"domains":["hubspot.com"]}' --work-email --list-name "HubSpot CEOs" --limit 10`,
    `instantly enrichment enrich --search-filters '{"title":{"include":["VP Sales"]}}' --work-email --custom-flow instantly,findymail --limit 25`,
  ],

  inputSchema: z.object({
    search_filters: searchFiltersSchema,
    limit: z.coerce.number().optional().describe('Maximum number of leads to import (1–1,000,000)'),
    work_email_enrichment: z.boolean().optional().describe('Enable work email enrichment'),
    fully_enriched_profile: z.boolean().optional().describe('Enable LinkedIn profile enrichment'),
    custom_flow: z
      .union([
        z.string().describe('Comma-separated provider names for waterfall enrichment'),
        z.array(z.string()).describe('Array of provider names (MCP)'),
      ])
      .optional()
      .describe(
        'Ordered list of enrichment providers for waterfall enrichment. ' +
          'Known providers: instantly, findymail, leadmagic, icypeas, prospeo, wiza, contactout',
      ),
    resource_id: z.string().optional().describe('Existing list UUID to add leads to (auto-creates if omitted)'),
    list_name: z.string().optional().describe('Name for the auto-created list (ignored when --resource-id is set)'),
    search_name: z.string().optional().describe('Name for this search (for tracking in the UI)'),
    auto_update: z.boolean().optional().describe('Automatically enrich new leads added to this resource'),
    skip_rows_without_email: z.boolean().optional().describe('Skip leads that have no email after enrichment'),
  }),

  cliMappings: {
    options: [
      { field: 'search_filters', flags: '--search-filters <json>', description: 'Search filters (JSON object)' },
      { field: 'limit', flags: '-l, --limit <number>', description: 'Max leads to import (1–1,000,000)' },
      { field: 'work_email_enrichment', flags: '--work-email', description: 'Enable work email enrichment' },
      { field: 'fully_enriched_profile', flags: '--full-profile', description: 'Enable LinkedIn profile enrichment' },
      {
        field: 'custom_flow',
        flags: '--custom-flow <providers>',
        description: 'Comma-separated waterfall provider order (e.g. instantly,findymail,leadmagic)',
      },
      { field: 'resource_id', flags: '--resource-id <uuid>', description: 'Add leads to an existing list' },
      { field: 'list_name', flags: '--list-name <name>', description: 'Name for auto-created list' },
      { field: 'search_name', flags: '--search-name <name>', description: 'Label for this search' },
      { field: 'auto_update', flags: '--auto-update', description: 'Auto-enrich new leads added later' },
      { field: 'skip_rows_without_email', flags: '--skip-no-email', description: 'Skip leads without email' },
    ],
  },

  endpoint: { method: 'POST', path: '/supersearch-enrichment/enrich-leads-from-supersearch' },
  fieldMappings: {
    search_filters: 'body',
    limit: 'body',
    work_email_enrichment: 'body',
    fully_enriched_profile: 'body',
    custom_flow: 'body',
    resource_id: 'body',
    list_name: 'body',
    search_name: 'body',
    auto_update: 'body',
    skip_rows_without_email: 'body',
  },

  handler: async (input, client) => {
    const filters =
      typeof input.search_filters === 'string'
        ? JSON.parse(input.search_filters)
        : input.search_filters;

    // Build body matching the real API spec — enrichment types are
    // top-level boolean fields, NOT an enrichment_types array.
    const body: Record<string, unknown> = {
      search_filters: filters,
    };

    if (input.limit !== undefined) body.limit = input.limit;
    if (input.work_email_enrichment) body.work_email_enrichment = true;
    if (input.fully_enriched_profile) body.fully_enriched_profile = true;
    if (input.resource_id) body.resource_id = input.resource_id;
    if (input.list_name) body.list_name = input.list_name;
    if (input.search_name) body.search_name = input.search_name;
    if (input.auto_update) body.auto_update = true;
    if (input.skip_rows_without_email) body.skip_rows_without_email = true;

    // custom_flow: normalise CSV string → string[] for the API
    if (input.custom_flow) {
      body.custom_flow =
        typeof input.custom_flow === 'string'
          ? input.custom_flow
              .split(',')
              .map((s: string) => s.trim())
              .filter(Boolean)
          : input.custom_flow;
    }

    // Safety check: at least one enrichment flag must be set
    if (!body.work_email_enrichment && !body.fully_enriched_profile && !body.custom_flow) {
      throw new Error(
        'At least one enrichment type must be enabled. ' +
          'Use --work-email, --full-profile, and/or --custom-flow <providers>.',
      );
    }

    return client.post('/supersearch-enrichment/enrich-leads-from-supersearch', body);
  },
};
