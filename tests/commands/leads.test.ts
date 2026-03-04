import { describe, it, expect, vi } from 'vitest';
import { leadsListCommand } from '../../src/commands/leads/list.js';
import { leadsCreateCommand } from '../../src/commands/leads/create.js';
import { leadsBulkAddCommand } from '../../src/commands/leads/bulk-add.js';
import { leadsMoveCommand } from '../../src/commands/leads/move.js';
import { leadsSubsequenceMoveCommand } from '../../src/commands/leads/subsequence-move.js';
import { leadsUpdateInterestStatusCommand } from '../../src/commands/leads/update-interest-status.js';

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

  it('leads_update_interest_status maps friendly names to numeric values', async () => {
    const mockClient = {
      get: vi.fn(),
      post: vi.fn().mockResolvedValue({}),
      patch: vi.fn(),
      delete: vi.fn(),
      request: vi.fn(),
    };

    await leadsUpdateInterestStatusCommand.handler(
      { lead_id: 'test-id', interest_status: 'interested' },
      mockClient as any,
    );
    expect(mockClient.post).toHaveBeenCalledWith('/leads/update-interest-status', {
      lead_id: 'test-id',
      lt_interest_status: 1,
    });

    mockClient.post.mockClear();

    await leadsUpdateInterestStatusCommand.handler(
      { lead_id: 'test-id', interest_status: 'not_interested' },
      mockClient as any,
    );
    expect(mockClient.post).toHaveBeenCalledWith('/leads/update-interest-status', {
      lead_id: 'test-id',
      lt_interest_status: -1,
    });
  });

  it('leads_update_interest_status accepts numeric values', async () => {
    const mockClient = {
      get: vi.fn(),
      post: vi.fn().mockResolvedValue({}),
      patch: vi.fn(),
      delete: vi.fn(),
      request: vi.fn(),
    };

    await leadsUpdateInterestStatusCommand.handler(
      { lead_id: 'test-id', interest_status: '2' },
      mockClient as any,
    );
    expect(mockClient.post).toHaveBeenCalledWith('/leads/update-interest-status', {
      lead_id: 'test-id',
      lt_interest_status: 2,
    });
  });

  it('leads_update_interest_status rejects invalid values', async () => {
    const mockClient = {
      get: vi.fn(),
      post: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
      request: vi.fn(),
    };

    await expect(
      leadsUpdateInterestStatusCommand.handler(
        { lead_id: 'test-id', interest_status: 'bogus' },
        mockClient as any,
      ),
    ).rejects.toThrow('Invalid interest status');
  });
});
