import { describe, it, expect } from 'vitest';
import { blocklistListCommand } from '../../src/commands/blocklist/list.js';
import { blocklistCreateCommand } from '../../src/commands/blocklist/create.js';
import { blocklistDeleteCommand } from '../../src/commands/blocklist/delete.js';

describe('Blocklist CommandDefinitions', () => {
  it('blocklist_list has correct structure', () => {
    expect(blocklistListCommand.name).toBe('blocklist_list');
    expect(blocklistListCommand.group).toBe('blocklist');
    expect(blocklistListCommand.endpoint.method).toBe('GET');
    expect(blocklistListCommand.endpoint.path).toBe('/block-lists-entries');
    expect(blocklistListCommand.paginated).toBe(true);
  });

  it('blocklist_list validates limit', () => {
    const valid = blocklistListCommand.inputSchema.safeParse({ limit: 50 });
    expect(valid.success).toBe(true);

    const invalid = blocklistListCommand.inputSchema.safeParse({ limit: 200 });
    expect(invalid.success).toBe(false);
  });

  it('blocklist_create sends value in body', () => {
    expect(blocklistCreateCommand.endpoint.method).toBe('POST');
    expect(blocklistCreateCommand.fieldMappings.bl_value).toBe('body');
  });

  it('blocklist_delete uses DELETE with id in path', () => {
    expect(blocklistDeleteCommand.endpoint.method).toBe('DELETE');
    expect(blocklistDeleteCommand.endpoint.path).toBe('/block-lists-entries/{id}');
    expect(blocklistDeleteCommand.fieldMappings.id).toBe('path');
  });

  it('all blocklist commands have descriptions', () => {
    const commands = [blocklistListCommand, blocklistCreateCommand, blocklistDeleteCommand];
    for (const cmd of commands) {
      expect(cmd.description).toBeTruthy();
      expect(cmd.description.length).toBeGreaterThan(10);
    }
  });
});
