import { describe, it, expect } from 'vitest';
import { workspaceMembersListCommand } from '../../src/commands/workspace-members/list.js';
import { workspaceMembersGetCommand } from '../../src/commands/workspace-members/get.js';
import { workspaceMembersCreateCommand } from '../../src/commands/workspace-members/create.js';
import { workspaceMembersUpdateCommand } from '../../src/commands/workspace-members/update.js';
import { workspaceMembersDeleteCommand } from '../../src/commands/workspace-members/delete.js';

describe('Workspace Members CommandDefinitions', () => {
  it('workspace_members_list has correct structure', () => {
    expect(workspaceMembersListCommand.name).toBe('workspace_members_list');
    expect(workspaceMembersListCommand.group).toBe('workspace-members');
    expect(workspaceMembersListCommand.endpoint.method).toBe('GET');
    expect(workspaceMembersListCommand.endpoint.path).toBe('/workspace-members');
  });

  it('workspace_members_get uses id in path', () => {
    expect(workspaceMembersGetCommand.endpoint.method).toBe('GET');
    expect(workspaceMembersGetCommand.endpoint.path).toBe('/workspace-members/{id}');
    expect(workspaceMembersGetCommand.fieldMappings.id).toBe('path');
    expect(workspaceMembersGetCommand.cliMappings.args?.[0].required).toBe(true);
  });

  it('workspace_members_create sends POST with body', () => {
    expect(workspaceMembersCreateCommand.endpoint.method).toBe('POST');
    expect(workspaceMembersCreateCommand.fieldMappings.email).toBe('body');
    expect(workspaceMembersCreateCommand.fieldMappings.role).toBe('body');
  });

  it('workspace_members_update uses PATCH', () => {
    expect(workspaceMembersUpdateCommand.endpoint.method).toBe('PATCH');
    expect(workspaceMembersUpdateCommand.endpoint.path).toBe('/workspace-members/{id}');
    expect(workspaceMembersUpdateCommand.fieldMappings.id).toBe('path');
    expect(workspaceMembersUpdateCommand.fieldMappings.role).toBe('body');
  });

  it('workspace_members_delete uses DELETE', () => {
    expect(workspaceMembersDeleteCommand.endpoint.method).toBe('DELETE');
    expect(workspaceMembersDeleteCommand.endpoint.path).toBe('/workspace-members/{id}');
    expect(workspaceMembersDeleteCommand.fieldMappings.id).toBe('path');
  });

  it('all commands have descriptions', () => {
    const commands = [
      workspaceMembersListCommand,
      workspaceMembersGetCommand,
      workspaceMembersCreateCommand,
      workspaceMembersUpdateCommand,
      workspaceMembersDeleteCommand,
    ];
    for (const cmd of commands) {
      expect(cmd.description).toBeTruthy();
      expect(cmd.description.length).toBeGreaterThan(10);
    }
  });

  it('create inputSchema validates correctly', () => {
    const result = workspaceMembersCreateCommand.inputSchema.safeParse({ email: 'user@co.com', role: 'admin' });
    expect(result.success).toBe(true);
  });
});
