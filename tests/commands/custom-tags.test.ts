import { describe, it, expect } from 'vitest';
import { customTagsListCommand } from '../../src/commands/custom-tags/list.js';
import { customTagsGetCommand } from '../../src/commands/custom-tags/get.js';
import { customTagsCreateCommand } from '../../src/commands/custom-tags/create.js';
import { customTagsUpdateCommand } from '../../src/commands/custom-tags/update.js';
import { customTagsDeleteCommand } from '../../src/commands/custom-tags/delete.js';
import { customTagsToggleCommand } from '../../src/commands/custom-tags/toggle.js';

describe('Custom Tags CommandDefinitions', () => {
  it('custom_tags_list has correct structure', () => {
    expect(customTagsListCommand.name).toBe('custom_tags_list');
    expect(customTagsListCommand.group).toBe('custom-tags');
    expect(customTagsListCommand.endpoint.method).toBe('GET');
    expect(customTagsListCommand.endpoint.path).toBe('/custom-tags');
    expect(customTagsListCommand.paginated).toBe(true);
  });

  it('custom_tags_get requires id in path', () => {
    expect(customTagsGetCommand.endpoint.path).toBe('/custom-tags/{id}');
    expect(customTagsGetCommand.fieldMappings.id).toBe('path');
  });

  it('custom_tags_create sends label in body', () => {
    expect(customTagsCreateCommand.endpoint.method).toBe('POST');
    expect(customTagsCreateCommand.fieldMappings.label).toBe('body');
  });

  it('custom_tags_update uses PATCH', () => {
    expect(customTagsUpdateCommand.endpoint.method).toBe('PATCH');
    expect(customTagsUpdateCommand.fieldMappings.id).toBe('path');
  });

  it('custom_tags_delete uses DELETE', () => {
    expect(customTagsDeleteCommand.endpoint.method).toBe('DELETE');
  });

  it('custom_tags_toggle posts to toggle-resource', () => {
    expect(customTagsToggleCommand.endpoint.method).toBe('POST');
    expect(customTagsToggleCommand.endpoint.path).toBe('/custom-tags/toggle-resource');
    expect(customTagsToggleCommand.fieldMappings.tag_ids).toBe('body');
    expect(customTagsToggleCommand.fieldMappings.assign).toBe('body');
  });

  it('all custom-tag commands have descriptions', () => {
    const commands = [
      customTagsListCommand, customTagsGetCommand, customTagsCreateCommand,
      customTagsUpdateCommand, customTagsDeleteCommand, customTagsToggleCommand,
    ];
    for (const cmd of commands) {
      expect(cmd.description).toBeTruthy();
      expect(cmd.description.length).toBeGreaterThan(10);
    }
  });
});
