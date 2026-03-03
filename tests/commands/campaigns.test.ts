import { describe, it, expect } from 'vitest';
import { campaignsListCommand } from '../../src/commands/campaigns/list.js';
import { campaignsGetCommand } from '../../src/commands/campaigns/get.js';
import { campaignsCreateCommand } from '../../src/commands/campaigns/create.js';
import { campaignsActivateCommand } from '../../src/commands/campaigns/activate.js';
import { campaignsPauseCommand } from '../../src/commands/campaigns/pause.js';
import { campaignsDeleteCommand } from '../../src/commands/campaigns/delete.js';
import { campaignsUpdateCommand } from '../../src/commands/campaigns/update.js';

describe('Campaign CommandDefinitions', () => {
  it('campaigns_list has correct structure', () => {
    expect(campaignsListCommand.name).toBe('campaigns_list');
    expect(campaignsListCommand.group).toBe('campaigns');
    expect(campaignsListCommand.subcommand).toBe('list');
    expect(campaignsListCommand.endpoint.method).toBe('GET');
    expect(campaignsListCommand.endpoint.path).toBe('/campaigns');
    expect(campaignsListCommand.paginated).toBe(true);
  });

  it('campaigns_get requires an id', () => {
    expect(campaignsGetCommand.endpoint.path).toBe('/campaigns/{id}');
    expect(campaignsGetCommand.fieldMappings.id).toBe('path');
    expect(campaignsGetCommand.cliMappings.args?.[0].required).toBe(true);
  });

  it('campaigns_create sends name in body', () => {
    expect(campaignsCreateCommand.endpoint.method).toBe('POST');
    expect(campaignsCreateCommand.fieldMappings.name).toBe('body');
  });

  it('campaigns_activate sends POST with id in path', () => {
    expect(campaignsActivateCommand.endpoint.method).toBe('POST');
    expect(campaignsActivateCommand.endpoint.path).toBe('/campaigns/{id}/activate');
  });

  it('campaigns_pause sends POST with id in path', () => {
    expect(campaignsPauseCommand.endpoint.method).toBe('POST');
    expect(campaignsPauseCommand.endpoint.path).toBe('/campaigns/{id}/pause');
  });

  it('campaigns_delete uses DELETE method', () => {
    expect(campaignsDeleteCommand.endpoint.method).toBe('DELETE');
  });

  it('campaigns_update uses PATCH method with body fields', () => {
    expect(campaignsUpdateCommand.endpoint.method).toBe('PATCH');
    expect(campaignsUpdateCommand.fieldMappings.id).toBe('path');
    expect(campaignsUpdateCommand.fieldMappings.name).toBe('body');
  });

  it('all campaign commands have descriptions', () => {
    const commands = [
      campaignsListCommand,
      campaignsGetCommand,
      campaignsCreateCommand,
      campaignsActivateCommand,
      campaignsPauseCommand,
      campaignsDeleteCommand,
      campaignsUpdateCommand,
    ];

    for (const cmd of commands) {
      expect(cmd.description).toBeTruthy();
      expect(cmd.description.length).toBeGreaterThan(10);
    }
  });

  it('list command inputSchema validates correctly', () => {
    const result = campaignsListCommand.inputSchema.safeParse({ limit: 50 });
    expect(result.success).toBe(true);
  });

  it('list command inputSchema rejects invalid limit', () => {
    const result = campaignsListCommand.inputSchema.safeParse({ limit: 200 });
    expect(result.success).toBe(false);
  });
});
