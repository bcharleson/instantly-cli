/**
 * Shared enrichment type constants.
 * Imported by both enrichment/create.ts and enrichment/enrich.ts so the
 * enum values and pipe-delimited CLI flag string stay in sync.
 */
export const ENRICHMENT_TYPES = [
  'work_email_enrichment',
  'fully_enriched_profile',
  'email_verification',
  'joblisting',
  'technologies',
  'news',
  'funding',
  'ai_enrichment',
  'custom_flow',
] as const;

export type EnrichmentType = (typeof ENRICHMENT_TYPES)[number];

/** Pipe-delimited string for use in CLI flag tokens (shows up in --help) */
export const ENRICHMENT_TYPES_FLAG = ENRICHMENT_TYPES.join('|');

