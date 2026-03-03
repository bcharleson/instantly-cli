import { describe, it, expect } from 'vitest';
import { leadListsListCommand } from '../../src/commands/lead-lists/list.js';
import { leadListsGetCommand } from '../../src/commands/lead-lists/get.js';
import { leadListsCreateCommand } from '../../src/commands/lead-lists/create.js';
import { leadListsUpdateCommand } from '../../src/commands/lead-lists/update.js';
import { leadListsDeleteCommand } from '../../src/commands/lead-lists/delete.js';
import { leadListsVerificationStatsCommand } from '../../src/commands/lead-lists/verification-stats.js';

describe('Lead Lists CommandDefinitions', () => {
  it('lead_lists_list has correct structure', () => {
    expect(leadListsListCommand.name).toBe('lead_lists_list');
    expect(leadListsListCommand.group).toBe('lead-lists');
    expect(leadListsListCommand.endpoint.method).toBe('GET');
    expect(leadListsListCommand.endpoint.path).toBe('/lead-lists');
    expect(leadListsListCommand.paginated).toBe(true);
  });

  it('lead_lists_list validates limit', () => {
    const valid = leadListsListCommand.inputSchema.safeParse({ limit: 25 });
    expect(valid.success).toBe(true);

    const invalid = leadListsListCommand.inputSchema.safeParse({ limit: 200 });
    expect(invalid.success).toBe(false);
  });

  it('lead_lists_get requires id in path', () => {
    expect(leadListsGetCommand.endpoint.path).toBe('/lead-lists/{id}');
    expect(leadListsGetCommand.fieldMappings.id).toBe('path');
  });

  it('lead_lists_create sends name in body', () => {
    expect(leadListsCreateCommand.endpoint.method).toBe('POST');
    expect(leadListsCreateCommand.fieldMappings.name).toBe('body');
  });

  it('lead_lists_update uses PATCH', () => {
    expect(leadListsUpdateCommand.endpoint.method).toBe('PATCH');
    expect(leadListsUpdateCommand.fieldMappings.id).toBe('path');
    expect(leadListsUpdateCommand.fieldMappings.name).toBe('body');
  });

  it('lead_lists_delete uses DELETE', () => {
    expect(leadListsDeleteCommand.endpoint.method).toBe('DELETE');
  });

  it('lead_lists_verification-stats requires list id', () => {
    expect(leadListsVerificationStatsCommand.endpoint.path).toBe('/lead-lists/{id}/verification-stats');
    expect(leadListsVerificationStatsCommand.fieldMappings.id).toBe('path');
  });

  it('all lead-list commands have descriptions', () => {
    const commands = [
      leadListsListCommand, leadListsGetCommand, leadListsCreateCommand,
      leadListsUpdateCommand, leadListsDeleteCommand, leadListsVerificationStatsCommand,
    ];
    for (const cmd of commands) {
      expect(cmd.description).toBeTruthy();
      expect(cmd.description.length).toBeGreaterThan(10);
    }
  });
});
