import { z } from 'zod';

/**
 * Structured Zod schema for SuperSearch filter objects.
 * Accepted by all enrichment commands that take --search-filters.
 *
 * When called from the CLI, pass a JSON string: --search-filters '{"title":{"include":["CEO"]}}'
 * When called via MCP, pass the object directly.
 *
 * Valid filter shape:
 *   {
 *     "title":        { "include": ["CEO", "Founder"], "exclude": ["Intern"] },
 *     "domains":      ["example.com"],
 *     "employee_count": ["25 - 100", "100 - 250"],
 *     "revenue":      ["$1 - 10M"],
 *     "department":   ["Sales", "Engineering"],
 *     "company_name": { "include": ["Acme Corp"] },
 *     "locations":    { "include": [{ "country": "United States", "state": "California" }] },
 *     "funding_type": ["series_a", "seed"],
 *     "look_alike":   "competitor.com"
 *   }
 */

const includeExcludeSchema = z.object({
  include: z.array(z.string()).optional(),
  exclude: z.array(z.string()).optional(),
});

const locationItemSchema = z.object({
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  label: z.string().optional(),
  placeId: z.string().optional(),
});

const locationsSchema = z.object({
  include: z.array(locationItemSchema).optional(),
  exclude: z.array(locationItemSchema).optional(),
});

export const searchFiltersObjectSchema = z
  .object({
    title: includeExcludeSchema.optional().describe(
      'Job title filter. E.g. {"include":["CEO","CTO"],"exclude":["Intern"]}',
    ),
    domains: z.array(z.string()).optional().describe(
      'Specific company domains. E.g. ["example.com","another.com"]',
    ),
    employee_count: z.array(z.string()).optional().describe(
      'Company size ranges. E.g. ["25 - 100","100 - 250"]',
    ),
    revenue: z.array(z.string()).optional().describe(
      'Revenue ranges. E.g. ["$1 - 10M","$10 - 50M"]',
    ),
    department: z.array(z.string()).optional().describe(
      'Departments. E.g. ["Sales","Engineering"]',
    ),
    company_name: includeExcludeSchema.optional().describe(
      'Company names filter. E.g. {"include":["Acme Corp"]}',
    ),
    locations: locationsSchema.optional().describe(
      'Location filter. E.g. {"include":[{"country":"United States","state":"California"}]}',
    ),
    funding_type: z.array(z.string()).optional().describe(
      'Funding stages. E.g. ["series_a","seed","pre_seed"]',
    ),
    look_alike: z.string().optional().describe(
      'Find companies similar to this domain. E.g. "competitor.com"',
    ),
    news: z.array(z.string()).optional().describe(
      'Company news triggers. E.g. ["receives_financing","hires"]',
    ),
  })
  .passthrough();

/**
 * Accepts either:
 *  - A JSON string (CLI usage: --search-filters '{"title":{"include":["CEO"]}}')
 *  - A structured object (MCP usage: pass the object directly)
 */
export const searchFiltersSchema = z
  .union([
    z.string().describe(
      'JSON string of search filters. E.g. \'{"title":{"include":["CEO","Founder"]},"domains":["example.com"]}\'',
    ),
    searchFiltersObjectSchema,
  ])
  .describe(
    'SuperSearch filter criteria. Use nested objects — top-level fields like "job_titles" or "industries" are not supported. ' +
      'Valid keys: title, domains, employee_count, revenue, department, company_name, locations, funding_type, look_alike.',
  );

