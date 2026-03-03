import { describe, it, expect } from 'vitest';
import { inboxPlacementListCommand } from '../../src/commands/inbox-placement/list.js';
import { inboxPlacementGetCommand } from '../../src/commands/inbox-placement/get.js';
import { inboxPlacementCreateCommand } from '../../src/commands/inbox-placement/create.js';
import { inboxPlacementUpdateCommand } from '../../src/commands/inbox-placement/update.js';
import { inboxPlacementDeleteCommand } from '../../src/commands/inbox-placement/delete.js';

describe('Inbox Placement CommandDefinitions', () => {
  it('inbox_placement_list has correct structure', () => {
    expect(inboxPlacementListCommand.name).toBe('inbox_placement_list');
    expect(inboxPlacementListCommand.group).toBe('inbox-placement');
    expect(inboxPlacementListCommand.endpoint.method).toBe('GET');
    expect(inboxPlacementListCommand.endpoint.path).toBe('/inbox-placement-tests');
    expect(inboxPlacementListCommand.paginated).toBe(true);
  });

  it('inbox_placement_get uses id in path', () => {
    expect(inboxPlacementGetCommand.endpoint.method).toBe('GET');
    expect(inboxPlacementGetCommand.endpoint.path).toBe('/inbox-placement-tests/{id}');
    expect(inboxPlacementGetCommand.fieldMappings.id).toBe('path');
    expect(inboxPlacementGetCommand.cliMappings.args?.[0].required).toBe(true);
  });

  it('inbox_placement_create sends POST with body fields', () => {
    expect(inboxPlacementCreateCommand.endpoint.method).toBe('POST');
    expect(inboxPlacementCreateCommand.endpoint.path).toBe('/inbox-placement-tests');
    expect(inboxPlacementCreateCommand.fieldMappings.name).toBe('body');
    expect(inboxPlacementCreateCommand.fieldMappings.email_subject).toBe('body');
  });

  it('inbox_placement_update uses PATCH', () => {
    expect(inboxPlacementUpdateCommand.endpoint.method).toBe('PATCH');
    expect(inboxPlacementUpdateCommand.endpoint.path).toBe('/inbox-placement-tests/{id}');
    expect(inboxPlacementUpdateCommand.fieldMappings.id).toBe('path');
    expect(inboxPlacementUpdateCommand.fieldMappings.name).toBe('body');
  });

  it('inbox_placement_delete uses DELETE', () => {
    expect(inboxPlacementDeleteCommand.endpoint.method).toBe('DELETE');
    expect(inboxPlacementDeleteCommand.endpoint.path).toBe('/inbox-placement-tests/{id}');
    expect(inboxPlacementDeleteCommand.fieldMappings.id).toBe('path');
  });

  it('all commands have descriptions', () => {
    const commands = [
      inboxPlacementListCommand,
      inboxPlacementGetCommand,
      inboxPlacementCreateCommand,
      inboxPlacementUpdateCommand,
      inboxPlacementDeleteCommand,
    ];
    for (const cmd of commands) {
      expect(cmd.description).toBeTruthy();
      expect(cmd.description.length).toBeGreaterThan(10);
    }
  });

  it('list inputSchema validates correctly', () => {
    const result = inboxPlacementListCommand.inputSchema.safeParse({ limit: 10 });
    expect(result.success).toBe(true);
  });
});
