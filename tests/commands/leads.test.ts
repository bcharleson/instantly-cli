import { describe, it, expect } from 'vitest';
import { leadsListCommand } from '../../src/commands/leads/list.js';
import { leadsCreateCommand } from '../../src/commands/leads/create.js';
import { leadsBulkAddCommand } from '../../src/commands/leads/bulk-add.js';
import { leadsMoveCommand } from '../../src/commands/leads/move.js';
import { leadsSubsequenceMoveCommand } from '../../src/commands/leads/subsequence-move.js';

describe('Lead CommandDefinitions', () => {
  it('leads_list uses POST method (API quirk)', () => {
    expect(leadsListCommand.endpoint.method).toBe('POST');
    expect(leadsListCommand.endpoint.path).toBe('/leads/list');
    expect(leadsListCommand.paginated).toBe(true);
  });

  it('leads_list sends params in body', () => {
    expect(leadsListCommand.fieldMappings.campaign_id).toBe('body');
    expect(leadsListCommand.fieldMappings.limit).toBe('body');
  });

  it('leads_create requires email in body', () => {
    expect(leadsCreateCommand.endpoint.method).toBe('POST');
    expect(leadsCreateCommand.fieldMappings.email).toBe('body');
  });

  it('leads_bulk_add sends leads array in body', () => {
    expect(leadsBulkAddCommand.endpoint.method).toBe('POST');
    expect(leadsBulkAddCommand.endpoint.path).toBe('/leads/add');
    expect(leadsBulkAddCommand.fieldMappings.leads).toBe('body');
  });

  it('leads_move sends lead_ids and target in body', () => {
    expect(leadsMoveCommand.endpoint.method).toBe('POST');
    expect(leadsMoveCommand.fieldMappings.lead_ids).toBe('body');
    expect(leadsMoveCommand.fieldMappings.to_campaign_id).toBe('body');
  });

  it('leads_subsequence_move sends lead_ids and subsequence_id in body', () => {
    expect(leadsSubsequenceMoveCommand.endpoint.method).toBe('POST');
    expect(leadsSubsequenceMoveCommand.endpoint.path).toBe('/leads/subsequence/move');
    expect(leadsSubsequenceMoveCommand.fieldMappings.lead_ids).toBe('body');
    expect(leadsSubsequenceMoveCommand.fieldMappings.subsequence_id).toBe('body');
  });
});
