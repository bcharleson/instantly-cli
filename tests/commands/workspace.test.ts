import { describe, it, expect } from 'vitest';
import { workspaceGetCommand } from '../../src/commands/workspace/get.js';
import { workspaceUpdateCommand } from '../../src/commands/workspace/update.js';

describe('Workspace CommandDefinitions', () => {
  it('workspace_get has correct structure', () => {
    expect(workspaceGetCommand.name).toBe('workspace_get');
    expect(workspaceGetCommand.group).toBe('workspace');
    expect(workspaceGetCommand.endpoint.method).toBe('GET');
    expect(workspaceGetCommand.endpoint.path).toBe('/workspaces/current');
  });

  it('workspace_get requires no params', () => {
    const result = workspaceGetCommand.inputSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('workspace_update uses PATCH with body fields', () => {
    expect(workspaceUpdateCommand.endpoint.method).toBe('PATCH');
    expect(workspaceUpdateCommand.endpoint.path).toBe('/workspaces/current');
    expect(workspaceUpdateCommand.fieldMappings.name).toBe('body');
    expect(workspaceUpdateCommand.fieldMappings.org_logo_url).toBe('body');
  });

  it('all workspace commands have descriptions', () => {
    const commands = [workspaceGetCommand, workspaceUpdateCommand];
    for (const cmd of commands) {
      expect(cmd.description).toBeTruthy();
      expect(cmd.description.length).toBeGreaterThan(10);
    }
  });
});
