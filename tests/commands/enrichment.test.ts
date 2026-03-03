import { describe, it, expect } from 'vitest';
import { enrichmentEnrichCommand } from '../../src/commands/enrichment/enrich.js';
import { enrichmentCountCommand } from '../../src/commands/enrichment/count.js';
import { enrichmentGetCommand } from '../../src/commands/enrichment/get.js';
import { enrichmentRunCommand } from '../../src/commands/enrichment/run.js';

describe('Enrichment CommandDefinitions', () => {
  it('enrichment_enrich uses POST with body params', () => {
    expect(enrichmentEnrichCommand.name).toBe('enrichment_enrich');
    expect(enrichmentEnrichCommand.group).toBe('enrichment');
    expect(enrichmentEnrichCommand.endpoint.method).toBe('POST');
    expect(enrichmentEnrichCommand.fieldMappings.search_filters).toBe('body');
    expect(enrichmentEnrichCommand.fieldMappings.limit).toBe('body');
  });

  it('enrichment_count uses POST with search filters', () => {
    expect(enrichmentCountCommand.endpoint.method).toBe('POST');
    expect(enrichmentCountCommand.endpoint.path).toBe('/supersearch-enrichment/count-leads-from-supersearch');
    expect(enrichmentCountCommand.fieldMappings.search_filters).toBe('body');
  });

  it('enrichment_get retrieves results by resource_id', () => {
    expect(enrichmentGetCommand.endpoint.path).toBe('/supersearch-enrichment/{resource_id}');
    expect(enrichmentGetCommand.fieldMappings.resource_id).toBe('path');
  });

  it('enrichment_run uses POST', () => {
    expect(enrichmentRunCommand.endpoint.method).toBe('POST');
    expect(enrichmentRunCommand.endpoint.path).toBe('/supersearch-enrichment/run');
  });

  it('all enrichment commands have descriptions', () => {
    const commands = [
      enrichmentEnrichCommand, enrichmentCountCommand,
      enrichmentGetCommand, enrichmentRunCommand,
    ];
    for (const cmd of commands) {
      expect(cmd.description).toBeTruthy();
      expect(cmd.description.length).toBeGreaterThan(10);
    }
  });
});
